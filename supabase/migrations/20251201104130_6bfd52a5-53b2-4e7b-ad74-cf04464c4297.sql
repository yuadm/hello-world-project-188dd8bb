-- Create reference_requests table for tracking reference requests
CREATE TABLE IF NOT EXISTS public.reference_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.childminder_applications(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  reference_number INTEGER NOT NULL CHECK (reference_number IN (1, 2)),
  
  -- Referee details from application
  referee_name TEXT NOT NULL,
  referee_relationship TEXT,
  referee_contact TEXT NOT NULL,
  referee_email TEXT,
  is_childcare_reference BOOLEAN DEFAULT false,
  
  -- Request tracking
  form_token TEXT UNIQUE,
  request_status TEXT DEFAULT 'not_sent' CHECK (request_status IN ('not_sent', 'sent', 'completed', 'expired')),
  request_sent_date TIMESTAMPTZ,
  reminder_count INTEGER DEFAULT 0,
  last_reminder_date TIMESTAMPTZ,
  
  -- Response data
  response_received_date TIMESTAMPTZ,
  response_data JSONB,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  CONSTRAINT unique_application_reference UNIQUE (application_id, reference_number),
  CONSTRAINT unique_employee_reference UNIQUE (employee_id, reference_number)
);

-- Enable RLS
ALTER TABLE public.reference_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all reference requests"
  ON public.reference_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert reference requests"
  ON public.reference_requests FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update reference requests"
  ON public.reference_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view reference requests via token"
  ON public.reference_requests FOR SELECT
  TO anon
  USING (form_token IS NOT NULL);

CREATE POLICY "Public can update reference requests via token"
  ON public.reference_requests FOR UPDATE
  TO anon
  USING (form_token IS NOT NULL);

-- Trigger for updated_at
CREATE TRIGGER update_reference_requests_updated_at
  BEFORE UPDATE ON public.reference_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster token lookups
CREATE INDEX idx_reference_requests_token ON public.reference_requests(form_token);
CREATE INDEX idx_reference_requests_application ON public.reference_requests(application_id);
CREATE INDEX idx_reference_requests_employee ON public.reference_requests(employee_id);