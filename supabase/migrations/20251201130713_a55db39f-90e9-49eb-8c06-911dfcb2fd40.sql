-- Allow public inserts for compliance_household_members when linked to an application
CREATE POLICY "Allow public insert for application compliance members"
ON public.compliance_household_members
FOR INSERT
WITH CHECK (
  application_id IS NOT NULL
);

-- Allow public inserts for compliance_assistants when linked to an application
CREATE POLICY "Allow public insert for application compliance assistants"
ON public.compliance_assistants
FOR INSERT
WITH CHECK (
  application_id IS NOT NULL
);