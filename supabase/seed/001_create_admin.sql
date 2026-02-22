-- Create Admin User
-- This seed file creates the admin@kaloscope.app user with full PRO access

-- Insert admin user into auth.users (if using local Supabase)
-- NOTE: In production, you should create this user via Supabase Dashboard > Authentication
-- Password: 123456 (hashed by Supabase)

-- Create admin profile with PRO access
DO $$
BEGIN
  -- Check if admin profile exists, if not we'll handle it via the trigger
  -- The admin user should be created via Supabase Dashboard first
  -- This script ensures the profile has admin privileges

  -- If you're using the mock system, this is handled in src/lib/supabase.ts
  RAISE NOTICE 'Admin user should be created via Supabase Dashboard';
  RAISE NOTICE 'Email: admin@kaloscope.app';
  RAISE NOTICE 'Password: 123456';
  RAISE NOTICE 'After creation, the profile will automatically get PRO access';
END $$;

-- Function to grant admin privileges
CREATE OR REPLACE FUNCTION grant_admin_privileges()
RETURNS TRIGGER AS $$
BEGIN
  -- If the user is admin@kaloscope.app, grant full PRO access
  IF NEW.email = 'admin@kaloscope.app' THEN
    UPDATE public.profiles
    SET
      is_pro = true,
      subscription_tier = 'pro',
      subscription_end_date = NOW() + INTERVAL '100 years',
      payment_gateway = 'admin',
      daily_scans_count = 0,
      onboarding_completed = true,
      daily_calorie_goal = 2500,
      daily_protein_goal = 150,
      daily_carb_goal = 300,
      daily_fat_goal = 80
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-grant admin privileges
DROP TRIGGER IF EXISTS grant_admin_on_signup ON public.profiles;
CREATE TRIGGER grant_admin_on_signup
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.email = 'admin@kaloscope.app')
  EXECUTE FUNCTION grant_admin_privileges();
