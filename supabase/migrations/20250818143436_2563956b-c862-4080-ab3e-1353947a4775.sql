-- Update RLS policies to allow anyone to manage business images
DROP POLICY IF EXISTS "Business owners can manage their images" ON public.business_images;
DROP POLICY IF EXISTS "Business owners can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Business owners can update their images" ON storage.objects;
DROP POLICY IF EXISTS "Business owners can delete their images" ON storage.objects;

-- Create new policies allowing anyone to manage images
CREATE POLICY "Anyone can manage business images" 
ON public.business_images 
FOR ALL 
USING (true);

CREATE POLICY "Anyone can upload business images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'business-images');

CREATE POLICY "Anyone can update business images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'business-images');

CREATE POLICY "Anyone can delete business images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'business-images');