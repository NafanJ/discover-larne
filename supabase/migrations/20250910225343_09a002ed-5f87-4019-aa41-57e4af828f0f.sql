-- Add RLS policy to allow public viewing of business contacts
-- This is needed for business directory functionality
CREATE POLICY "Anyone can view business contact information" 
ON public.business_contacts 
FOR SELECT 
USING (true);

-- Update businesses table to have public contact info
-- Move basic contact info back to businesses table for public access
UPDATE businesses 
SET 
  full_address = bc.full_address,
  phone = bc.phone
FROM business_contacts bc 
WHERE businesses.id = bc.business_id 
  AND businesses.full_address IS NULL;

-- Create a comment to document this decision
COMMENT ON POLICY "Anyone can view business contact information" ON business_contacts IS 
'Public access to business contact information is necessary for the business directory functionality';