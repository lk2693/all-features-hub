-- Fix RLS Policy to allow admins to see all members (including inactive)
DROP POLICY IF EXISTS "Anyone can read active vorstand members" ON public.vorstand_members;

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
