CREATE TYPE public.request_status AS ENUM ('pending', 'accepted', 'declined', 'completed', 'cancelled');

CREATE TABLE public.resource_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  requester_id UUID NOT NULL,
  requester_name TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  requester_phone TEXT,
  message TEXT NOT NULL,
  desired_period TEXT,
  status public.request_status NOT NULL DEFAULT 'pending',
  provider_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.resource_requests ENABLE ROW LEVEL SECURITY;

-- Requester sees own requests
CREATE POLICY "Requesters can view own requests"
ON public.resource_requests FOR SELECT
TO authenticated
USING (requester_id = auth.uid());

-- Provider (resource owner) sees requests for their resources
CREATE POLICY "Providers can view requests for own resources"
ON public.resource_requests FOR SELECT
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.resources r
  WHERE r.id = resource_requests.resource_id AND r.submitted_by = auth.uid()
));

-- Admins see all
CREATE POLICY "Admins can view all requests"
ON public.resource_requests FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users create requests for themselves
CREATE POLICY "Authenticated users can create requests"
ON public.resource_requests FOR INSERT
TO authenticated
WITH CHECK (requester_id = auth.uid());

-- Requester can cancel own pending request
CREATE POLICY "Requesters can update own pending requests"
ON public.resource_requests FOR UPDATE
TO authenticated
USING (requester_id = auth.uid() AND status = 'pending')
WITH CHECK (requester_id = auth.uid());

-- Provider can respond to requests on own resources
CREATE POLICY "Providers can update requests on own resources"
ON public.resource_requests FOR UPDATE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.resources r
  WHERE r.id = resource_requests.resource_id AND r.submitted_by = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.resources r
  WHERE r.id = resource_requests.resource_id AND r.submitted_by = auth.uid()
));

-- Admins manage all
CREATE POLICY "Admins can update all requests"
ON public.resource_requests FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete requests"
ON public.resource_requests FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_resource_requests_updated_at
BEFORE UPDATE ON public.resource_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_resource_requests_resource ON public.resource_requests(resource_id);
CREATE INDEX idx_resource_requests_requester ON public.resource_requests(requester_id);
CREATE INDEX idx_resource_requests_status ON public.resource_requests(status);