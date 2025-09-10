-- Fix admin user role and RLS policies for user_roles table

-- Update the discoverlarne user to have admin role
UPDATE user_roles 
SET role = 'admin' 
WHERE user_id = '4509e10f-bd80-4955-b66f-8b7c3370ee2b';

-- Create RLS policy to allow admins to view all user roles
CREATE POLICY "Admins can view all user roles" 
ON public.user_roles 
FOR SELECT 
USING (
  auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ) OR 
  auth.uid() = user_id
);

-- Create RLS policy to allow admins to update user roles
CREATE POLICY "Admins can update user roles" 
ON public.user_roles 
FOR UPDATE 
USING (
  auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
);

-- Create RLS policy to allow role creation for new users
CREATE POLICY "Allow role creation for new users" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR
  auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  )
);