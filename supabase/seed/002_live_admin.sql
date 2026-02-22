-- This script inserts the admin user directly into the active Supabase production database.
-- Run this in the Supabase SQL Editor to manually initialize the admin account.

DO $$
BEGIN
  -- 1. Create the admin user in the authentication system
  -- Password for this account is set to: 123456
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
  VALUES ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@kaloscope.app', crypt('123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Live Admin"}', now(), now());

  -- 2. Create the corresponding profile and grant full PRO access
  INSERT INTO public.profiles (id, email, full_name, is_pro, subscription_tier, daily_calorie_goal, onboarding_completed, daily_scans_count)
  VALUES ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'admin@kaloscope.app', 'Live Admin', true, 'pro', 2000, true, 0);
END $$;
