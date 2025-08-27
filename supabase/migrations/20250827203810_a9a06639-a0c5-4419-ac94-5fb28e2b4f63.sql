-- Create analytics_events table for tracking site usage
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  business_id UUID,
  event_data JSONB,
  session_id TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics events
CREATE POLICY "Anyone can insert analytics events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all analytics events" 
ON public.analytics_events 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for better performance
CREATE INDEX idx_analytics_events_date ON public.analytics_events(date);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_business_id ON public.analytics_events(business_id);
CREATE INDEX idx_analytics_events_session_date ON public.analytics_events(session_id, date);

-- Add foreign key reference to businesses table
ALTER TABLE public.analytics_events 
ADD CONSTRAINT fk_analytics_events_business_id 
FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;