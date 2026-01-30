-- Add category column to news_posts table
ALTER TABLE public.news_posts 
ADD COLUMN category text NOT NULL DEFAULT 'news';

-- Add a check constraint for valid categories
ALTER TABLE public.news_posts 
ADD CONSTRAINT news_posts_category_check 
CHECK (category IN ('news', 'foerderung'));