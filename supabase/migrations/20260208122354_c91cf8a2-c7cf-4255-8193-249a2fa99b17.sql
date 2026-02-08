
CREATE TABLE IF NOT EXISTS public.vorstand_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bereich TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.vorstand_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active vorstand members"
  ON public.vorstand_members
  FOR SELECT
  USING (
    is_active = true
    OR has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admins can manage vorstand members"
  ON public.vorstand_members
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_vorstand_members_updated_at
  BEFORE UPDATE ON public.vorstand_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
