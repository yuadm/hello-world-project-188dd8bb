-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Allow public application submissions" ON public.childminder_applications;

-- Create a new PERMISSIVE INSERT policy that allows anonymous and authenticated users to submit
CREATE POLICY "Allow public application submissions" 
ON public.childminder_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (true);