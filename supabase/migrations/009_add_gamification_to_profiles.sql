-- Migration 009: Add XP and Level to Profiles for Gamification

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Optional: Add index for leaderboard functionality later
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp DESC);
