-- Create events/calendar table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  is_all_day BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL DEFAULT 'veranstaltung',
  organizer TEXT,
  website_url TEXT,
  cover_image_url TEXT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Anyone can view published events
CREATE POLICY "Anyone can view published events"
ON public.events
FOR SELECT
USING (is_published = true);

-- Admins can view all events
CREATE POLICY "Admins can view all events"
ON public.events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can create events
CREATE POLICY "Admins can create events"
ON public.events
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update events
CREATE POLICY "Admins can update events"
ON public.events
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete events
CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_published ON public.events(is_published, start_date);