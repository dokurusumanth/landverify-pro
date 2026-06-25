
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_team_member(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

ALTER TABLE public.inquiries
  ADD CONSTRAINT inquiries_full_name_len CHECK (char_length(full_name) BETWEEN 1 AND 120),
  ADD CONSTRAINT inquiries_email_len CHECK (char_length(email) BETWEEN 3 AND 254),
  ADD CONSTRAINT inquiries_phone_len CHECK (char_length(phone) BETWEEN 4 AND 32),
  ADD CONSTRAINT inquiries_country_len CHECK (char_length(country) BETWEEN 2 AND 80),
  ADD CONSTRAINT inquiries_state_len CHECK (char_length(property_state) BETWEEN 2 AND 120),
  ADD CONSTRAINT inquiries_details_len CHECK (char_length(property_details) BETWEEN 5 AND 2000),
  ADD CONSTRAINT inquiries_service_vals CHECK (service IN ('photo','location','title','all')),
  ADD CONSTRAINT inquiries_status_vals CHECK (status IN ('new','in_progress','completed','archived'));
