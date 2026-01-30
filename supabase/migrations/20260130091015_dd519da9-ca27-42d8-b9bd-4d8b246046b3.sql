-- Create news_posts table for blog/news articles
CREATE TABLE public.news_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image_url TEXT,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cms_content table for configurable content blocks
CREATE TABLE public.cms_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_key TEXT NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    cta_text TEXT,
    cta_link TEXT,
    metadata JSONB DEFAULT '{}',
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- RLS policies for news_posts
CREATE POLICY "Anyone can view published news"
ON public.news_posts FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can view all news"
ON public.news_posts FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create news"
ON public.news_posts FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update news"
ON public.news_posts FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete news"
ON public.news_posts FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for cms_content
CREATE POLICY "Anyone can view cms content"
ON public.cms_content FOR SELECT
USING (true);

CREATE POLICY "Admins can update cms content"
ON public.cms_content FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert cms content"
ON public.cms_content FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_news_posts_updated_at
BEFORE UPDATE ON public.news_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cms_content_updated_at
BEFORE UPDATE ON public.cms_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default hero content
INSERT INTO public.cms_content (block_key, title, subtitle, cta_text, cta_link)
VALUES (
    'hero',
    'Gemeinsam für Kultur in Braunschweig',
    'Der Kulturrat Braunschweig vernetzt Kulturschaffende, fördert den Austausch und stärkt die kulturelle Vielfalt unserer Stadt.',
    'Mehr erfahren',
    '/ueber-uns'
);