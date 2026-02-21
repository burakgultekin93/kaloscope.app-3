-- supabase/migrations/001_initial_schema.sql

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male','female','other')),
  activity_level TEXT DEFAULT 'moderate'
    CHECK (activity_level IN ('sedentary','light','moderate','active','very_active')),
  goal_type TEXT DEFAULT 'maintain'
    CHECK (goal_type IN ('lose','maintain','gain')),
  weekly_goal_kg NUMERIC DEFAULT 0.5,
  daily_calorie_goal INTEGER DEFAULT 2000,
  daily_protein_goal INTEGER DEFAULT 120,
  daily_carb_goal INTEGER DEFAULT 250,
  daily_fat_goal INTEGER DEFAULT 65,
  daily_water_goal INTEGER DEFAULT 2500,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_profile_select" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own_profile_update" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "own_profile_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Meals
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  food_name_en TEXT,
  portion_grams NUMERIC DEFAULT 200,
  calories NUMERIC DEFAULT 0,
  protein NUMERIC DEFAULT 0,
  carbs NUMERIC DEFAULT 0,
  fat NUMERIC DEFAULT 0,
  fiber NUMERIC DEFAULT 0,
  meal_type TEXT DEFAULT 'lunch'
    CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  ai_confidence NUMERIC DEFAULT 0.5,
  is_manual BOOLEAN DEFAULT false,
  image_url TEXT,
  logged_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_meals" ON meals FOR ALL USING (auth.uid() = user_id);
CREATE INDEX idx_meals_user_date ON meals(user_id, logged_date DESC);

-- Water Logs
CREATE TABLE public.water_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  logged_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_water" ON water_logs FOR ALL USING (auth.uid() = user_id);

-- Food Items (Yemek Veritabanı — arama için)
CREATE TABLE public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_tr TEXT NOT NULL,
  name_en TEXT,
  category TEXT DEFAULT 'other',
  calories_per_100g NUMERIC NOT NULL,
  protein_per_100g NUMERIC DEFAULT 0,
  carbs_per_100g NUMERIC DEFAULT 0,
  fat_per_100g NUMERIC DEFAULT 0,
  fiber_per_100g NUMERIC DEFAULT 0,
  common_portion_grams INTEGER DEFAULT 200,
  common_portion_label TEXT DEFAULT '1 porsiyon',
  is_turkish BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone_read_foods" ON food_items FOR SELECT USING (true);
CREATE POLICY "authenticated_insert_foods" ON food_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Subscriptions
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free','monthly','yearly')),
  status TEXT DEFAULT 'free'
    CHECK (status IN ('free','trial','active','past_due','cancelled','expired')),
  current_period_end TIMESTAMPTZ,
  daily_scan_count INTEGER DEFAULT 0,
  daily_scan_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_sub" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Fuzzy search extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- Migration 002: Add Diet Preference to Profiles

-- Add diet_preference column with default 'standard'
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS diet_preference text DEFAULT 'standard'::text;

-- Optional: Add a check constraint to ensure only valid diets are used
ALTER TABLE public.profiles
ADD CONSTRAINT valid_diet_preference 
CHECK (diet_preference IN ('standard', 'ketogenic', 'vegan', 'vegetarian', 'diabetic', 'high_protein', 'mediterranean'));
-- Migration: Add streak and gamification fields to profiles table
-- Up
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS current_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login_date timestamp with time zone;

-- Optional: Create an index on last_login_date if we need to query active users frequently
-- CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON profiles(last_login_date);
