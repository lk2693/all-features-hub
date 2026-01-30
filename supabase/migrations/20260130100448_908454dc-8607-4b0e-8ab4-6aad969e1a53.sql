-- Create best_practices table for guides/tips
CREATE TABLE public.best_practices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'allgemein',
  cover_image_url TEXT,
  author_name TEXT NOT NULL,
  author_id UUID,
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.best_practices ENABLE ROW LEVEL SECURITY;

-- Public can view published best practices
CREATE POLICY "Anyone can view published best practices"
ON public.best_practices
FOR SELECT
USING (is_published = true);

-- Admins can view all
CREATE POLICY "Admins can view all best practices"
ON public.best_practices
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert
CREATE POLICY "Admins can create best practices"
ON public.best_practices
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "Admins can update best practices"
ON public.best_practices
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins can delete best practices"
ON public.best_practices
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_best_practices_updated_at
BEFORE UPDATE ON public.best_practices
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes
CREATE INDEX idx_best_practices_slug ON public.best_practices(slug);
CREATE INDEX idx_best_practices_category ON public.best_practices(category);
CREATE INDEX idx_best_practices_published ON public.best_practices(is_published, sort_order);