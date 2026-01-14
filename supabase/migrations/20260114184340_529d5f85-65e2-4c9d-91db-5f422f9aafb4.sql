-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "Users can insert leads" ON public.leads;

-- Create a more permissive insert policy that allows anyone to insert leads
-- The user_id will be the owner of the page (creator), not the visitor
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- This allows visitors to submit leads to any page owner
-- The page owner's user_id is passed from the frontend