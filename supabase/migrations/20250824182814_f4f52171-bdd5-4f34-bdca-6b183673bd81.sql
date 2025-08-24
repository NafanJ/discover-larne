-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('visitor', 'business_owner', 'admin');

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table for role assignments
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'visitor',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on new tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT role 
  FROM public.user_roles 
  WHERE user_id = auth.uid()
  ORDER BY 
    CASE role 
      WHEN 'admin' THEN 1
      WHEN 'business_owner' THEN 2
      WHEN 'visitor' THEN 3
    END
  LIMIT 1
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  
  -- Assign default visitor role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'visitor');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles table
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles table
CREATE POLICY "Users can view own roles" 
  ON public.user_roles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

-- Update businesses table RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.businesses;

CREATE POLICY "Anyone can view businesses" 
  ON public.businesses FOR SELECT 
  USING (true);

CREATE POLICY "Business owners can update own businesses" 
  ON public.businesses FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all businesses" 
  ON public.businesses FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Business owners can create businesses" 
  ON public.businesses FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

-- Update business_images table RLS policies
DROP POLICY IF EXISTS "Anyone can manage business images" ON public.business_images;
DROP POLICY IF EXISTS "Anyone can view business images" ON public.business_images;

CREATE POLICY "Anyone can view business images" 
  ON public.business_images FOR SELECT 
  USING (true);

CREATE POLICY "Business owners can manage own business images" 
  ON public.business_images FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses 
      WHERE id = business_id 
      AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all business images" 
  ON public.business_images FOR ALL 
  USING (public.has_role(auth.uid(), 'admin'));