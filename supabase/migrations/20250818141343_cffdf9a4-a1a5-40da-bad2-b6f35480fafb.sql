-- Create business-images storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-images', 'business-images', true);

-- Create business_images table for image metadata
CREATE TABLE public.business_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('tile', 'profile', 'cover', 'gallery')),
  storage_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add owner_id to businesses table if not exists
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Enable RLS on business_images
ALTER TABLE public.business_images ENABLE ROW LEVEL SECURITY;

-- RLS policies for business_images table
CREATE POLICY "Anyone can view business images" 
ON public.business_images 
FOR SELECT 
USING (true);

CREATE POLICY "Business owners can manage their images" 
ON public.business_images 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE businesses.id = business_images.business_id 
    AND businesses.owner_id = auth.uid()
  )
);

-- Storage policies for business-images bucket
CREATE POLICY "Anyone can view business images in storage" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'business-images');

CREATE POLICY "Business owners can upload images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'business-images' 
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can update their images" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'business-images' 
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Business owners can delete their images" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'business-images' 
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.businesses WHERE owner_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX idx_business_images_business_id ON public.business_images(business_id);
CREATE INDEX idx_business_images_type ON public.business_images(business_id, type);
CREATE INDEX idx_business_images_sort_order ON public.business_images(business_id, type, sort_order);