DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Signed-in members can view profiles" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Users can check their subscription status" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    is_confirmed = false
    AND unsubscribed_at IS NULL
    AND length(email) <= 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

DROP POLICY IF EXISTS "Anyone can view CMS images" ON storage.objects;
CREATE POLICY "Admins can list CMS images" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'cms-images' AND public.has_role(auth.uid(), 'admin'));