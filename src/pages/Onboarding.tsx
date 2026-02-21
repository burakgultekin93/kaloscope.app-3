import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import type { UserProfileParams } from '@/utils/calories';
import { Logo, IconPlate, IconStats, IconStreak } from '@/components/brand';

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const { completeOnboarding, loading } = useProfile();
    const navigate = useNavigate();
    const location = useLocation();
    const selectedPlan = location.state?.plan;

    const [formData, setFormData] = useState<UserProfileParams>({
        gender: 'male',
        age: 25,
        height_cm: 175,
        weight_kg: 70,
        activity_level: 'moderate',
        goal_type: 'maintain',
        weekly_goal_kg: 0.5,
    });

    const [calculatedGoals, setCalculatedGoals] = useState<{ calories: number } | null>(null);

    const nextStep = () => setStep((s) => Math.min(s + 1, 5));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const handleComplete = async () => {
        try {
            const goals = await completeOnboarding(formData);
            if (goals) {
                setCalculatedGoals(goals);
            }
            setTimeout(() => {
                if (selectedPlan === 'pro') {
                    navigate('/app/paywall', { state: { fromOnboarding: true } });
                } else {
                    navigate('/app');
                }
            }, 3000); // Wait 3s on result screen
        } catch (err: unknown) {
            console.error(err);
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0
        })
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 w-full max-w-sm mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold">Cinsiyetiniz</h2>
                            <p className="text-zinc-500 text-sm mt-2">Kalori hesaplaması için gerekli</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {['male', 'female'].map(g => (
                                <Card
                                    key={g}
                                    className={`p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all border-2 rounded-2xl ${formData.gender === g ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-zinc-200 dark:border-zinc-800'}`}
                                    onClick={() => setFormData({ ...formData, gender: g as 'male' | 'female' })}
                                >
                                    <Logo size={32} variant={formData.gender === g ? 'light' : 'dark'} className={formData.gender === g ? '' : 'opacity-40'} />
                                    <span className="font-bold capitalize text-lg">{g === 'male' ? 'Erkek' : 'Kadın'}</span>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 w-full max-w-sm mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold">Vücut Bilgileriniz</h2>
                            <p className="text-zinc-500 text-sm mt-2">Metabolizma hızınızı hesaplayacağız</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Yaş ({formData.age})</Label>
                                <Slider min={15} max={100} step={1} value={[formData.age]} onValueChange={(v: number[]) => setFormData({ ...formData, age: v[0] })} />
                            </div>
                            <div className="space-y-2 pt-4">
                                <Label>Boy ({formData.height_cm} cm)</Label>
                                <Slider min={120} max={220} step={1} value={[formData.height_cm]} onValueChange={(v: number[]) => setFormData({ ...formData, height_cm: v[0] })} />
                            </div>
                            <div className="space-y-2 pt-4">
                                <Label>Kilo ({formData.weight_kg} kg)</Label>
                                <Slider min={40} max={200} step={1} value={[formData.weight_kg]} onValueChange={(v: number[]) => setFormData({ ...formData, weight_kg: v[0] })} />
                            </div>
                        </div>
                    </div>
                );

            case 3: {
                const activities = [
                    { id: 'sedentary', label: 'Masa Başı', desc: 'Çok az egzersiz veya yok', icon: <Logo size={20} variant="light" /> },
                    { id: 'light', label: 'Hafif Aktif', desc: 'Haftada 1-3 gün spor', icon: <IconStats size={20} /> },
                    { id: 'moderate', label: 'Orta Aktif', desc: 'Haftada 3-5 gün spor', icon: <IconStreak size={20} /> },
                    { id: 'active', label: 'Çok Aktif', desc: 'Haftada 6-7 gün spor', icon: <IconPlate size={20} /> }
                ];

                return (
                    <div className="space-y-4 w-full max-w-md mx-auto">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold uppercase tracking-tight">Aktivite Seviyeniz</h2>
                            <p className="text-zinc-500 text-sm mt-2 font-medium">Günlük harcadığınız enerjiyi bulalım</p>
                        </div>
                        <div className="grid gap-3 flex-col">
                            {activities.map(act => (
                                <Card
                                    key={act.id}
                                    className={`p-5 flex items-center gap-5 cursor-pointer transition-all border-2 rounded-[1.5rem] ${formData.activity_level === act.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-zinc-200 dark:border-zinc-800'}`}
                                    onClick={() => setFormData({ ...formData, activity_level: act.id as 'sedentary' | 'light' | 'moderate' | 'active' })}
                                >
                                    <div className={`p-3 rounded-xl ${formData.activity_level === act.id ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                                        {act.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg leading-tight">{act.label}</h4>
                                        <p className="text-xs text-zinc-500 font-medium">{act.desc}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            }

            case 4:
                return (
                    <div className="space-y-6 w-full max-w-sm mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold">Hedefiniz Nedir?</h2>
                            <p className="text-zinc-500 text-sm mt-2">Buna göre makrolarını ayarlayacağız</p>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { id: 'lose', label: 'Kilo Ver' },
                                { id: 'maintain', label: 'Kilomu Koru' },
                                { id: 'gain', label: 'Kilo Al' }
                            ].map(goal => (
                                <Card
                                    key={goal.id}
                                    className={`p-4 flex items-center justify-center cursor-pointer transition-all border-2 ${formData.goal_type === goal.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300' : 'border-zinc-200 dark:border-zinc-800'}`}
                                    onClick={() => setFormData({ ...formData, goal_type: goal.id as 'lose' | 'maintain' | 'gain' })}
                                >
                                    <span className="font-semibold">{goal.label}</span>
                                </Card>
                            ))}
                        </div>

                        {formData.goal_type !== 'maintain' && (
                            <div className="space-y-2 pt-6">
                                <Label>Haftalık Hedef ({formData.weekly_goal_kg} kg / hafta)</Label>
                                <Slider min={0.1} max={1.0} step={0.1} value={[formData.weekly_goal_kg || 0.5]} onValueChange={(v: number[]) => setFormData({ ...formData, weekly_goal_kg: v[0] })} />
                                <p className="text-xs text-zinc-400 text-center">Sağlıklı limit: 0.5 - 1 kg / hafta</p>
                            </div>
                        )}
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-8 w-full max-w-sm mx-auto flex flex-col items-center justify-center py-10">
                        {calculatedGoals ? (
                            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-6">
                                <CheckCircle2 className="size-20 text-emerald-500 mx-auto" />
                                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Planınız Hazır!</h2>
                                <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
                                    <div className="text-5xl font-mono font-bold text-zinc-900 dark:text-white mb-2">
                                        {calculatedGoals.calories}
                                        <span className="text-xl text-zinc-500 font-sans font-bold"> kcal</span>
                                    </div>
                                    <p className="text-zinc-500 font-medium">Günlük Hedefiniz</p>
                                </div>
                                <p className="text-sm text-zinc-500">Hazırlanıyor...</p>
                            </motion.div>
                        ) : (
                            <div className="text-center space-y-4">
                                <h2 className="text-2xl font-bold">Analiz Ediliyor</h2>
                                <p className="text-zinc-500">Verileriniz işleniyor...</p>
                                <Button onClick={handleComplete} disabled={loading} size="lg" className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-lg font-bold shadow-xl shadow-emerald-500/25">
                                    {loading ? 'Hesaplanıyor...' : 'Sonuçları Gör 🚀'}
                                </Button>
                            </div>
                        )}
                    </div>
                );
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
            {/* Progress */}
            <div className="pt-12 pb-4 px-6 fixed top-0 w-full z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-md mx-auto flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`h-2 flex-1 rounded-full transition-all ${step >= i ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800'}`} />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center items-center px-4 mt-20 mb-24 overflow-x-hidden">
                <AnimatePresence mode="wait" custom={1}>
                    <motion.div
                        key={step}
                        custom={1}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-full pt-8"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Nav */}
            {step < 5 && (
                <div className="fixed bottom-0 w-full p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex justify-between max-w-3xl left-1/2 -translate-x-1/2">
                    <Button variant="ghost" onClick={prevStep} disabled={step === 1} className="rounded-xl">
                        <ArrowLeft className="mr-2 size-4" /> Geri
                    </Button>
                    <Button onClick={nextStep} className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-xl px-8">
                        İleri <ArrowRight className="ml-2 size-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}
