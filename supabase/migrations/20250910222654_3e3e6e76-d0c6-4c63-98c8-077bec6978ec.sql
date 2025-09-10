-- Create business_contacts table to store sensitive contact information
CREATE TABLE public.business_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  phone TEXT,
  full_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.business_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for business_contacts
CREATE POLICY "Admins can manage all business contacts" 
ON public.business_contacts 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Business owners can view own business contacts" 
ON public.business_contacts 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM businesses 
  WHERE businesses.id = business_contacts.business_id 
  AND businesses.owner_id = auth.uid()
));

CREATE POLICY "Business owners can update own business contacts" 
ON public.business_contacts 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM businesses 
  WHERE businesses.id = business_contacts.business_id 
  AND businesses.owner_id = auth.uid()
));

CREATE POLICY "Business owners can insert own business contacts" 
ON public.business_contacts 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM businesses 
  WHERE businesses.id = business_contacts.business_id 
  AND businesses.owner_id = auth.uid()
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_business_contacts_updated_at
BEFORE UPDATE ON public.business_contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing contact data from businesses table
INSERT INTO public.business_contacts (business_id, phone, full_address)
SELECT id, phone, full_address 
FROM public.businesses 
WHERE phone IS NOT NULL OR full_address IS NOT NULL;

-- Remove sensitive contact data from businesses table (keep for backward compatibility but clear values)
UPDATE public.businesses 
SET phone = NULL, full_address = NULL 
WHERE phone IS NOT NULL OR full_address IS NOT NULL;