-- ═══════════════════════════════
-- DİYET PLANLARI
-- ═══════════════════════════════
CREATE TABLE IF NOT EXISTS public.diet_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_tr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_tr TEXT,
  description_en TEXT,
  icon TEXT DEFAULT '🥗',
  color TEXT DEFAULT '#10b981',
  difficulty TEXT DEFAULT 'moderate' CHECK (difficulty IN ('easy','moderate','hard')),
  is_medical BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,

  protein_pct INTEGER NOT NULL,
  carb_pct INTEGER NOT NULL,
  fat_pct INTEGER NOT NULL,

  max_carbs_grams INTEGER,
  min_protein_grams INTEGER,
  max_fat_grams INTEGER,
  max_sugar_grams INTEGER,
  min_fiber_grams INTEGER,
  max_sodium_mg INTEGER,

  benefits_tr TEXT[],
  avoid_foods_tr TEXT[],
  recommended_foods_tr TEXT[],
  warnings_tr TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone_read_diets" ON public.diet_plans FOR SELECT USING (true);

-- ═══════════════════════════════
-- KULLANICI DİYET SEÇİMİ & HEDEFLERİ
-- ═══════════════════════════════
CREATE TABLE IF NOT EXISTS public.user_diet_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  diet_plan_id UUID REFERENCES public.diet_plans(id),

  target_weight_kg NUMERIC,
  start_weight_kg NUMERIC,
  current_weight_kg NUMERIC,

  daily_calorie_target INTEGER NOT NULL DEFAULT 2000,
  daily_protein_g INTEGER DEFAULT 120,
  daily_carb_g INTEGER DEFAULT 250,
  daily_fat_g INTEGER DEFAULT 65,
  daily_fiber_g INTEGER DEFAULT 25,
  daily_water_ml INTEGER DEFAULT 2500,
  daily_sugar_max_g INTEGER,

  start_date DATE DEFAULT CURRENT_DATE,
  target_date DATE,
  duration_weeks INTEGER DEFAULT 12,

  has_diabetes BOOLEAN DEFAULT false,
  diabetes_type TEXT CHECK (diabetes_type IN ('type1','type2','prediabetes','gestational')),
  has_insulin_resistance BOOLEAN DEFAULT false,
  has_hypertension BOOLEAN DEFAULT false,
  has_celiac BOOLEAN DEFAULT false,
  food_allergies TEXT[],
  medications TEXT[],

  is_active BOOLEAN DEFAULT true,
  paused_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_diet_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_diet_goals" ON public.user_diet_goals FOR ALL USING (auth.uid() = user_id);

-- ═══════════════════════════════
-- GÜNLÜK İLERLEME KAYDI
-- ═══════════════════════════════
CREATE TABLE IF NOT EXISTS public.daily_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,

  total_calories INTEGER DEFAULT 0,
  total_protein_g NUMERIC DEFAULT 0,
  total_carb_g NUMERIC DEFAULT 0,
  total_fat_g NUMERIC DEFAULT 0,
  total_fiber_g NUMERIC DEFAULT 0,
  total_sugar_g NUMERIC DEFAULT 0,
  total_water_ml INTEGER DEFAULT 0,

  calorie_target INTEGER,
  protein_target_g INTEGER,
  carb_target_g INTEGER,
  fat_target_g INTEGER,

  compliance_score INTEGER DEFAULT 0,
  macro_balance_score INTEGER DEFAULT 0,
  overall_score INTEGER DEFAULT 0,

  ai_feedback_tr TEXT,
  ai_suggestions_tr TEXT[],
  ai_mood TEXT DEFAULT 'neutral' CHECK (ai_mood IN ('excellent','good','neutral','warning','alert')),

  weight_kg NUMERIC,

  UNIQUE(user_id, logged_date),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_progress" ON public.daily_progress FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_date ON public.daily_progress(user_id, logged_date DESC);

-- ═══════════════════════════════
-- BAŞARILAR & ROZETLER
-- ═══════════════════════════════
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_tr TEXT NOT NULL,
  description_tr TEXT,
  icon TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('streak','milestone','diet','scan','water','weight','special')),
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone_read_achievements" ON public.achievements FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- ═══════════════════════════════
-- MOTİVASYON MESAJLARI
-- ═══════════════════════════════
CREATE TABLE IF NOT EXISTS public.motivation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_type TEXT NOT NULL,
  mood TEXT NOT NULL,
  message_tr TEXT NOT NULL,
  emoji TEXT DEFAULT '💪',
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE public.motivation_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone_read_msgs" ON public.motivation_messages FOR SELECT USING (true);
