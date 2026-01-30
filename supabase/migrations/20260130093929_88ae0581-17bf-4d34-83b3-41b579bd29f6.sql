-- Drop the old constraint and add a new one with blog
ALTER TABLE public.news_posts 
DROP CONSTRAINT news_posts_category_check;

ALTER TABLE public.news_posts 
ADD CONSTRAINT news_posts_category_check 
CHECK (category IN ('news', 'foerderung', 'blog'));