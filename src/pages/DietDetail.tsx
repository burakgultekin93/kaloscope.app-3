import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, AlertTriangle, Play, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import type { DietPlan } from '@/components/diet/DietPlanCard';
import { AchievementBadge, type AchievementBadgeProps } from '@/components/gamification/AchievementBadge';
import { toast } from 'sonner';

export default function DietDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { profile, updateProfile } = useProfile();
    const [plan, setPlan] = useState<DietPlan | null>(location.state?.plan || null);
    const [loading, setLoading] = useState(!plan);
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        if (!plan && slug) {
            const fetchPlan = async () => {
                const { data } = await supabase
                    .from('diet_plans')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (data) setPlan(data as DietPlan);
                setLoading(false);
            };
            fetchPlan();
        }
    }, [slug, plan]);

    const handleStartDiet = async () => {
        if (!plan || !profile) return;
        setStarting(true);
        try {
            // Profil tablosunda diet_preference'ı güncelle
            await updateProfile({ diet_preference: plan.slug as any });

            // Ayrıca user_diet_goals tablosuna bir kayıt atabiliriz ileride
            // Şimdilik ana akış için profil güncellemesi yeterli

            toast.success(`${plan.name_tr} planına geçiş yapıldı!`);
            navigate('/app/dashboard');
        } catch (error) {
            console.error('Error starting diet:', error);
            toast.error('Bir hata oluştu.');
        } finally {
            setStarting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Loader2 className="size-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!plan) return <div className="p-10 text-center font-bold">Plan bulunamadı.</div>;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-32">
            {/* Header / Hero */}
            <div className="relative h-64 overflow-hidden">
                <div
                    className="absolute inset-0 transition-colors"
                    style={{ backgroundColor: plan.color }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 to-transparent" />

                <header className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-colors"
                    >
                        <ArrowLeft className="size-6" />
                    </button>
                    {plan.is_medical && (
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                            <Info className="size-3" /> Medikal Plan
                        </div>
                    )}
                </header>

                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                        <div className="text-4xl mb-2">{plan.icon}</div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                            {plan.name_tr}
                        </h1>
                        <p className="text-zinc-600 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mt-1">
                            {plan.difficulty === 'easy' ? 'Kolay' : plan.difficulty === 'moderate' ? 'Orta' : 'Zor'} Seviye
                        </p>
                    </div>
                </div>
            </div>

            <main className="p-6 space-y-8 max-w-2xl mx-auto">
                {/* Description */}
                <section>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                        {plan.description_tr}
                    </p>
                </section>

                {/* Macro Target Summary */}
                <section className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-zinc-200 dark:border-zinc-800">
                    <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-500 mb-4">Makro Hedefi (Kalori Yüzdesi)</h3>
                    <div className="flex gap-4">
                        <div className="flex-1 text-center">
                            <div className="text-2xl font-black text-zinc-800 dark:text-zinc-100">%{plan.protein_pct}</div>
                            <div className="text-[10px] font-bold text-zinc-400 uppercase">Protein</div>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="text-2xl font-black text-blue-500">%{plan.carb_pct}</div>
                            <div className="text-[10px] font-bold text-zinc-400 uppercase">Karb</div>
                        </div>
                        <div className="flex-1 text-center">
                            <div className="text-2xl font-black text-rose-500">%{plan.fat_pct}</div>
                            <div className="text-[10px] font-bold text-zinc-400 uppercase">Yağ</div>
                        </div>
                    </div>
                    <div className="flex w-full h-3 rounded-full overflow-hidden mt-6">
                        <div style={{ width: `${plan.protein_pct}%` }} className="bg-zinc-800 dark:bg-zinc-200" />
                        <div style={{ width: `${plan.carb_pct}%` }} className="bg-blue-500" />
                        <div style={{ width: `${plan.fat_pct}%` }} className="bg-rose-500" />
                    </div>
                </section>

                {/* Benefits */}
                {(plan as any).benefits_tr?.length > 0 && (
                    <section className="space-y-3">
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <CheckCircle2 className="size-5 text-emerald-500" /> Faydaları
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {(plan as any).benefits_tr.map((benefit: string, i: number) => (
                                <div key={i} className="bg-emerald-500/5 dark:bg-emerald-500/10 p-3 rounded-2xl flex items-center gap-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                    <div className="size-1.5 rounded-full bg-emerald-500" />
                                    {benefit}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recommended Foods */}
                {(plan as any).recommended_foods_tr?.length > 0 && (
                    <section className="space-y-3">
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Önerilen Gıdalar</h3>
                        <div className="flex flex-wrap gap-2">
                            {(plan as any).recommended_foods_tr.map((food: string, i: number) => (
                                <span key={i} className="bg-zinc-100 dark:bg-zinc-800 px-4 py-2 rounded-xl text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                    {food}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Foods to Avoid */}
                {(plan as any).avoid_foods_tr?.length > 0 && (
                    <section className="space-y-3">
                        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">Kaçınılması Gerekenler</h3>
                        <div className="flex flex-wrap gap-2">
                            {(plan as any).avoid_foods_tr.map((food: string, i: number) => (
                                <span key={i} className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-900/50 px-4 py-2 rounded-xl text-sm font-bold text-rose-600 dark:text-rose-400">
                                    {food}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {/* Warnings */}
                {(plan as any).warnings_tr?.length > 0 && (
                    <section className="bg-amber-500/10 border-2 border-amber-200 dark:border-amber-900/30 p-6 rounded-[2rem] space-y-3">
                        <h3 className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                            <AlertTriangle className="size-5" /> Önemli Uyarılar
                        </h3>
                        <ul className="space-y-2">
                            {(plan as any).warnings_tr.map((warning: string, i: number) => (
                                <li key={i} className="text-sm font-semibold text-amber-800 dark:text-amber-500 flex items-start gap-2">
                                    <span>•</span> {warning}
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </main>

            {/* Bottom Action Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-zinc-50/90 dark:via-zinc-950/90 to-transparent">
                <Button
                    onClick={handleStartDiet}
                    disabled={starting || profile?.diet_preference === plan.slug}
                    className="w-full h-16 rounded-[2rem] bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl shadow-emerald-500/20"
                >
                    {starting ? <Loader2 className="size-6 animate-spin" /> : (
                        profile?.diet_preference === plan.slug ? 'Şu Anki Planınız' : (
                            <><Play className="size-5 mr-2 fill-current" /> Bu Plana Başla</>
                        )
                    )}
                </Button>
            </div>
        </div>
    );
}
