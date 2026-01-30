-- Drop the overly permissive INSERT policy
DROP POLICY "Authenticated users can submit resources" ON public.resources;

-- Create a more specific INSERT policy that ensures submitted_by is set correctly
CREATE POLICY "Authenticated users can submit resources"
ON public.resources
FOR INSERT
TO authenticated
WITH CHECK (submitted_by = auth.uid());