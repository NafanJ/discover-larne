-- Fix infinite recursion in user_roles RLS policies
-- Drop the problematic policies that cause circular references

DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow role creation for new users" ON public.user_roles;

-- Create simple, non-recursive policies using auth.uid() directly
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- For admin operations, we'll rely on the existing security definer function
-- and the "Admins can manage all roles" policy which uses has_role() function