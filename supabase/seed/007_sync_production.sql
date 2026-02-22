-- ==============================================================================
-- 007_sync_production.sql
-- Run this in the Supabase SQL Editor to safely catch up the production database
-- with all local development schema changes.
-- ==============================================================================

DO $$
BEGIN
  -- 1. Safely add missing columns to profiles
  -- diet_preference
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS diet_preference TEXT DEFAULT 'standard';
  
  -- streaks
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_login_date TIMESTAMPTZ;
  
  -- subscriptions & PRO access
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free';
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMPTZ;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS payment_gateway TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false;
  
  -- usage limitations
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS daily_scans_count INTEGER DEFAULT 0;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS monthly_diet_generations INTEGER DEFAULT 0;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_scan_date DATE;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_generation_date DATE;

EXCEPTION
  WHEN duplicate_column THEN RAISE NOTICE 'Sütunlar zaten mevcut.';
END $$;

-- 2. Create the health_logs table if it's missing entirely
CREATE TABLE IF NOT EXISTS public.health_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    blood_sugar NUMERIC,
    ketone_level NUMERIC,
    symptoms TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure RLS is enabled for health_logs
ALTER TABLE public.health_logs ENABLE ROW LEVEL SECURITY;

-- Re-create health_logs policies safely
DROP POLICY IF EXISTS "own_health_logs" ON public.health_logs;
CREATE POLICY "own_health_logs" ON public.health_logs FOR ALL USING (auth.uid() = user_id);

-- Check constraints for arrays (optional, but good practice)
-- N/A for this snippet.

-- Ensure UUID extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Now retry adding the admin user and assigning the Pro status
DO $$
BEGIN
  -- Re-insert or update Admin Auth
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@kaloscope.app') THEN
    INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@kaloscope.app', crypt('123456', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Live Admin"}', now(), now());
  END IF;

  -- Re-insert or update Admin Profile natively
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE email = 'admin@kaloscope.app') THEN
    INSERT INTO public.profiles (id, email, full_name, is_pro, subscription_tier, daily_calorie_goal, onboarding_completed, daily_scans_count)
    VALUES ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'admin@kaloscope.app', 'Live Admin', true, 'pro', 2000, true, 0);
  ELSE
    UPDATE public.profiles
    SET 
        is_pro = true,
        subscription_tier = 'pro',
        daily_scans_count = 0,
        onboarding_completed = true
    WHERE email = 'admin@kaloscope.app';
  END IF;
END $$;
