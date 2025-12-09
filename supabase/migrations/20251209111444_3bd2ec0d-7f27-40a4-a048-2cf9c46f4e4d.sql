-- Fix the get_children_turning_16_soon function to use compliance_household_members
-- This function was incorrectly referencing employee_household_members which doesn't exist

DROP FUNCTION IF EXISTS public.get_children_turning_16_soon(integer);

CREATE OR REPLACE FUNCTION public.get_children_turning_16_soon(days_ahead integer DEFAULT 90)
RETURNS TABLE(
  id uuid,
  application_id uuid,
  employee_id uuid,
  full_name text,
  date_of_birth date,
  current_age integer,
  days_until_16 integer,
  turns_16_on date,
  email text,
  relationship text,
  dbs_status text,
  turning_16_notification_sent boolean,
  source_type text
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    chm.id,
    chm.application_id,
    chm.employee_id,
    chm.full_name,
    chm.date_of_birth,
    public.calculate_age(chm.date_of_birth) AS current_age,
    public.days_until_16th_birthday(chm.date_of_birth) AS days_until_16,
    date(chm.date_of_birth + INTERVAL '16 years') AS turns_16_on,
    chm.email,
    chm.relationship,
    chm.dbs_status::text as dbs_status,
    chm.turning_16_notification_sent,
    CASE 
      WHEN chm.employee_id IS NOT NULL THEN 'employee'
      ELSE 'applicant'
    END as source_type
  FROM public.compliance_household_members chm
  WHERE chm.member_type = 'child'
    AND public.days_until_16th_birthday(chm.date_of_birth) BETWEEN 0 AND days_ahead
  ORDER BY public.days_until_16th_birthday(chm.date_of_birth) ASC;
$$;

-- Fix the get_applicant_children_turning_16_soon function
DROP FUNCTION IF EXISTS public.get_applicant_children_turning_16_soon(integer);

CREATE OR REPLACE FUNCTION public.get_applicant_children_turning_16_soon(days_ahead integer DEFAULT 90)
RETURNS TABLE(
  id uuid,
  application_id uuid,
  full_name text,
  date_of_birth date,
  current_age integer,
  days_until_16 integer,
  turns_16_on date,
  email text,
  relationship text,
  dbs_status text,
  turning_16_notification_sent boolean
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    chm.id,
    chm.application_id,
    chm.full_name,
    chm.date_of_birth,
    public.calculate_age(chm.date_of_birth) AS current_age,
    public.days_until_16th_birthday(chm.date_of_birth) AS days_until_16,
    date(chm.date_of_birth + INTERVAL '16 years') AS turns_16_on,
    chm.email,
    chm.relationship,
    chm.dbs_status::text as dbs_status,
    chm.turning_16_notification_sent
  FROM public.compliance_household_members chm
  WHERE chm.member_type = 'child'
    AND chm.application_id IS NOT NULL
    AND public.days_until_16th_birthday(chm.date_of_birth) BETWEEN 0 AND days_ahead
  ORDER BY public.days_until_16th_birthday(chm.date_of_birth) ASC;
$$;

-- Create trigger function to auto-update member_type when child turns 16
CREATE OR REPLACE FUNCTION public.auto_update_member_type_on_birthday()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_age integer;
BEGIN
  -- Calculate current age
  current_age := public.calculate_age(NEW.date_of_birth);
  
  -- If age is 16 or older and member_type is 'child', update to 'adult'
  IF current_age >= 16 AND NEW.member_type = 'child' THEN
    NEW.member_type := 'adult';
    NEW.age_group_changed_at := now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on compliance_household_members for INSERT and UPDATE
DROP TRIGGER IF EXISTS auto_update_member_type_trigger ON public.compliance_household_members;

CREATE TRIGGER auto_update_member_type_trigger
  BEFORE INSERT OR UPDATE ON public.compliance_household_members
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_update_member_type_on_birthday();

-- Create a function to batch update all children who have already turned 16
CREATE OR REPLACE FUNCTION public.update_all_children_now_adults()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  updated_count integer;
BEGIN
  UPDATE public.compliance_household_members
  SET 
    member_type = 'adult',
    age_group_changed_at = now()
  WHERE member_type = 'child'
    AND public.calculate_age(date_of_birth) >= 16;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;

-- Run the batch update to fix existing data
SELECT public.update_all_children_now_adults();