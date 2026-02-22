import { CalorieRings } from '@/components/dashboard/CalorieRings';
import { MacroCards } from '@/components/dashboard/MacroCards';
import { MealTimeline } from '@/components/dashboard/MealTimeline';
import { WaterTracker } from '@/components/dashboard/WaterTracker';
import { StreakWidget } from '@/components/dashboard/StreakWidget';
import { useProfile } from '@/hooks/useProfile';
import { useMeals } from '@/hooks/useMeals';
import { Logo, IconScan } from '@/components/brand';
import { DietAIWidget } from '@/components/dashboard/DietAIWidget';
import { HealthLogger } from '@/components/dashboard/HealthLogger';
import { useTranslation } from '@/hooks/useTranslation';
import { useHealthLogs } from '@/hooks/useHealthLogs';
import { Badge } from '../components/ui/badge';
import { Sparkles, ChefHat } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
    const { profile } = useProfile();
    const { dailyTotals } = useMeals();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const dietKey = `diet_status_${profile?.diet_preference || 'standard'}`;
    const formattedDate = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }).format(new Date());

    const macros = {
        protein: { current: Math.round(dailyTotals.protein), target: profile?.daily_protein_goal || 120 },
        carbs: { current: Math.round(dailyTotals.carbs), target: profile?.daily_carb_goal || 250 },
        fat: { current: Math.round(dailyTotals.fat), target: profile?.daily_fat_goal || 65 },
    };

    const currentCalories = Math.round(dailyTotals.calories);
    const targetCalories = profile?.daily_calorie_goal || 2000;

    const { logs: healthLogs } = useHealthLogs();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="px-4 pt-6 pb-2 flex justify-between items-center sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-xl z-10 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                    <Logo size={40} variant="light" className="dark:hidden" />
                    <Logo size={40} variant="dark" className="hidden dark:block" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black tracking-tight">{t('dashboard_title')}</h1>
                            {profile?.diet_preference && profile.diet_preference !== 'standard' && (
                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none rounded-full px-2 py-0 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <Sparkles className="size-2.5" />
                                    {t(dietKey)}
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">{formattedDate}</p>
                    </div>
                </div>
                <StreakWidget />
            </header>


            <div className="px-4 py-4 space-y-6 overflow-x-hidden">
                {/* Rings */}
                <section className="flex flex-col items-center bg-white dark:bg-zinc-900 rounded-[2.5rem] pt-2 pb-6 px-4 shadow-sm border border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
                    <CalorieRings current={currentCalories} target={targetCalories} />
                </section>

                {/* Diet Plan Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <Card
                        onClick={() => navigate('/app/scan')}
                        className="p-6 bg-zinc-900 border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-zinc-800 transition-all border-2 border-transparent hover:border-emerald-500/50 group"
                    >
                        <div className="size-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <IconScan size={32} />
                        </div>
                        <span className="font-bold text-sm text-zinc-300">Hızlı Tarama</span>
                    </Card>

                    <Card
                        onClick={() => navigate('/app/diet-list')}
                        className="p-6 bg-zinc-900 border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-zinc-800 transition-all border-2 border-transparent hover:border-blue-500/50 group"
                    >
                        <div className="size-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <ChefHat className="size-8" />
                        </div>
                        <span className="font-bold text-sm text-zinc-300">{t('diet_list_title')}</span>
                    </Card>
                </div>

                {/* AI Advisor */}
                {profile && (
                    <DietAIWidget
                        profile={profile}
                        dailyTotals={dailyTotals}
                        healthLogs={healthLogs}
                    />
                )}

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

                {/* Timeline */}
                <section className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8">
                    <MealTimeline />
                </section>

                {/* Pro Promo for non-pro users */}
                {!profile?.is_pro && (
                    <Card
                        onClick={() => navigate('/app/paywall')}
                        className="bg-zinc-900 border-emerald-500/30 rounded-[2rem] p-6 text-white relative overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                            <Sparkles className="size-20" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-black mb-1">KaloScope PRO'ya Geçin</h3>
                            <p className="text-zinc-400 text-xs font-medium mb-4">Sınırsız AI analizi ve size özel diyet listelerine sahip olun.</p>
                            <Button className="h-10 bg-emerald-500 hover:bg-emerald-600 font-bold rounded-xl px-6">
                                Şimdi Yükselt
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div >
    );
}
