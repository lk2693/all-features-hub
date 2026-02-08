-- Create vorstand_members table
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

-- Enable Row Level Security
ALTER TABLE public.vorstand_members ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read active vorstand members
CREATE POLICY "Anyone can read active vorstand members"
  ON public.vorstand_members
  FOR SELECT
  USING (
    is_active = true
    OR
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage vorstand members"
  ON public.vorstand_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_vorstand_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vorstand_members_updated_at
  BEFORE UPDATE ON public.vorstand_members
  FOR EACH ROW
  EXECUTE FUNCTION update_vorstand_members_updated_at();

-- Insert default vorstand members
INSERT INTO public.vorstand_members (name, role, bereich, sort_order) VALUES
  ('Dr. Maria Schmidt', '1. Vorsitzende', 'Bildende Kunst', 1),
  ('Thomas Müller', '2. Vorsitzender', 'Musik', 2),
  ('Julia Weber', 'Schatzmeisterin', 'Theater', 3),
  ('Michael Braun', 'Schriftführer', 'Literatur', 4);
