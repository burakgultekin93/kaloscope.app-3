import { useState, useEffect } from 'react';
import { CalorieRings } from '@/components/dashboard/CalorieRings';
import { MacroCards } from '@/components/dashboard/MacroCards';
import { MealTimeline } from '@/components/dashboard/MealTimeline';
import { WaterTracker } from '@/components/dashboard/WaterTracker';
import { useProfile } from '@/hooks/useProfile';
import { useMeals } from '@/hooks/useMeals';
import { useStreak } from '@/hooks/useStreak';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/brand';
import { HealthLogger } from '@/components/dashboard/HealthLogger';
import { useTranslation } from '@/hooks/useTranslation';
import { useHealthLogs } from '@/hooks/useHealthLogs';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ChefHat, Trophy, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { XPBar } from '@/components/gamification/XPBar';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { DietComplianceBanner } from '@/components/diet/DietComplianceBanner';
import { AICoachCard } from '@/components/diet/AICoachCard';
import { openai } from '@/lib/openai';
import { getDailyAIFeedback } from '@/lib/aiCoach';
import type { DailyData, AICoachData } from '@/lib/aiCoach';

export default function Dashboard() {
    const { profile } = useProfile();
    const { dailyTotals, meals } = useMeals();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { current_streak } = useStreak();

    const [aiCoachData, setAiCoachData] = useState<AICoachData | null>(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [activeDiet, setActiveDiet] = useState<any>(null);

    const formattedDate = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }).format(new Date());

    const macros = {
        protein: { current: Math.round(dailyTotals.protein), target: profile?.daily_protein_goal || 120 },
        carbs: { current: Math.round(dailyTotals.carbs), target: profile?.daily_carb_goal || 250 },
        fat: { current: Math.round(dailyTotals.fat), target: profile?.daily_fat_goal || 65 },
    };

    const currentCalories = Math.round(dailyTotals.calories);
    const targetCalories = profile?.daily_calorie_goal || 2000;

    // const { logs: healthLogs } = useHealthLogs();

    // AI Coach Analizi
    useEffect(() => {
        const fetchAI = async () => {
            if (!profile?.is_pro || meals.length === 0) return;
            setLoadingAI(true);
            try {
                const data: DailyData = {
                    date: new Date().toISOString().split('T')[0],
                    consumed: {
                        calories: Math.round(dailyTotals.calories),
                        protein: Math.round(dailyTotals.protein),
                        carbs: Math.round(dailyTotals.carbs),
                        fat: Math.round(dailyTotals.fat),
                        fiber: 0, // Health logs'dan gelebilir ama şimdilik basitleştirelim
                        sugar: 0,
                        water_ml: 1500 // Mock data for now
                    },
                    targets: {
                        calories: targetCalories,
                        protein: profile?.daily_protein_goal || 120,
                        carbs: profile?.daily_carb_goal || 250,
                        fat: profile?.daily_fat_goal || 65,
                        fiber: 25,
                        sugar_max: 30,
                        water_ml: profile?.daily_water_goal || 2500
                    },
                    diet_plan: profile?.diet_preference || 'standard',
                    has_diabetes: (profile as any).has_diabetes || false,
                    meals: meals.map((m: any) => ({ name: m.food_name, calories: m.calories, meal_type: m.meal_type })),
                    streak_days: current_streak,
                    weight_trend: 'stable'
                };
                const feedback = await getDailyAIFeedback(data);
                if (feedback) setAiCoachData(feedback);
            } catch (err) {
                console.error("AI analysis failed:", err);
            } finally {
                setLoadingAI(false);
            }
        };

        fetchAI();
    }, [meals, profile?.is_pro, profile?.id]);

    // Diyet detaylarını çek
    useEffect(() => {
        if (profile?.diet_preference && profile.diet_preference !== 'standard') {
            const fetchDiet = async () => {
                const { data } = await supabase
                    .from('diet_plans')
                    .select('*')
                    .eq('slug', profile.diet_preference)
                    .single();
                if (data) setActiveDiet(data);
            };
            fetchDiet();
        }
    }, [profile?.diet_preference]);

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Header */}
            <header className="px-4 pt-6 pb-2 flex justify-between items-center sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl z-20 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <Logo size={40} variant="light" className="dark:hidden" />
                    <Logo size={40} variant="dark" className="hidden dark:block" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black tracking-tight">{t('dashboard_title')}</h1>
                            {profile?.is_pro && (
                                <Badge className="bg-amber-500 text-white border-none rounded-full px-2 py-0 text-[10px] font-black uppercase tracking-widest">
                                    PRO
                                </Badge>
                            )}
                        </div>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{formattedDate}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <StreakCounter days={current_streak} isActiveToday={true} />
                </div>
            </header>

            <div className="px-4 py-4 space-y-6 overflow-x-hidden pb-32">
                {/* Gamification Level Bar */}
                <section>
                    <XPBar xp={(profile as any)?.xp || 0} />
                </section>

                {/* Rings Section */}
                <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] pt-2 pb-6 px-4 shadow-sm border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
                    <CalorieRings current={currentCalories} target={targetCalories} />
                </section>

                {/* AI Coach (Pro Only) */}
                {profile?.is_pro && (
                    <section>
                        <AICoachCard
                            data={aiCoachData || {
                                mood: 'neutral',
                                feedback_tr: 'Bugün henüz öğün loglamadınız. Yeni bir öğün ekleyerek AI analizinizi alabilirsiniz.',
                                suggestions_tr: [],
                                compliance_score: 0,
                                macro_balance_score: 0
                            }}
                            isLoading={loadingAI}
                        />
                    </section>
                )}

                {/* Active Diet Banner (Pro Only) */}
                {profile?.is_pro && activeDiet && (
                    <section>
                        <DietComplianceBanner
                            dietName={activeDiet.name_tr}
                            dayCount={1} // Gelecekte hesaplanacak
                            weeklyCompliancePct={85} // Gelecekte hesaplanacak
                            icon={activeDiet.icon}
                            color={activeDiet.color}
                        />
                    </section>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <Card
                        onClick={() => navigate('/app/scan')}
                        className="p-5 bg-zinc-900 border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-zinc-800 transition-all border-2 border-transparent hover:border-emerald-500/50 group"
                    >
                        <div className="size-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform font-black">
                            SCAN
                        </div>
                        <span className="font-bold text-xs text-zinc-300 uppercase tracking-tighter">Hızlı Tarama</span>
                    </Card>

                    <Card
                        onClick={() => navigate('/app/diet-list')}
                        className="p-5 bg-zinc-900 border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-zinc-800 transition-all border-2 border-transparent hover:border-blue-500/50 group"
                    >
                        <div className="size-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <ChefHat className="size-7" />
                        </div>
                        <span className="font-bold text-xs text-zinc-300 uppercase tracking-tighter">{t('diet_list_title')}</span>
                    </Card>
                </div>

                {/* Health Tracking (For Diabetic/Keto) */}
                {(profile?.diet_preference === 'diabetic' || profile?.diet_preference === 'ketogenic') && (
                    <section>
                        <HealthLogger dietPreference={profile.diet_preference} />
                    </section>
                )}

                {/* Macros */}
                <section>
                    <MacroCards macros={macros} />
                </section>

                {/* Water */}
                <section>
                    <WaterTracker />
                </section>

                {/* Achievement Shortcuts */}
                <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Trophy className="size-4 text-amber-500" />
                            <h3 className="font-bold text-sm dark:text-zinc-100">Başarılar</h3>
                        </div>
                        <button onClick={() => navigate('/app/achievements')} className="text-[10px] font-black uppercase text-zinc-400 flex items-center gap-1">
                            Tümünü Gör <ChevronRight className="size-3" />
                        </button>
                    </div>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
                        {/* Mock Achievements for now */}
                        <div className="opacity-40 grayscale flex flex-col items-center gap-1 min-w-[60px]">
                            <div className="size-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-lg">📸</div>
                        </div>
                        <div className="opacity-40 grayscale flex flex-col items-center gap-1 min-w-[60px]">
                            <div className="size-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-lg">🔥</div>
                        </div>
                        <div className="opacity-40 grayscale flex flex-col items-center gap-1 min-w-[60px]">
                            <div className="size-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-lg">💧</div>
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <MealTimeline />
                </section>

                {/* Pro Promo */}
                {!profile?.is_pro && (
                    <Card
                        onClick={() => navigate('/app/paywall')}
                        className="bg-zinc-900 border-emerald-500/30 rounded-[2rem] p-6 text-white relative overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                            <Sparkles className="size-20" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-black mb-1">PRO'ya Geçin</h3>
                            <p className="text-zinc-400 text-xs font-medium mb-4">AI Koç analizi ve özel diyet planlarını kullanın.</p>
                            <Button className="h-10 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl px-6">
                                Hemen Yükselt
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div >
    );
}
