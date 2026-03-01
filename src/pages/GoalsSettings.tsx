import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Loader2, Sparkles, User, Activity, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { useTranslation } from '@/hooks/useTranslation';
import { calculateDailyGoals } from '@/utils/calories';
import type { UserProfileParams } from '@/utils/calories';
import { toast } from 'sonner';

export default function GoalsSettings() {
    const { profile, updateProfile, loading: profileLoading } = useProfile();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState<UserProfileParams>({
        gender: 'male',
        age: 25,
        height_cm: 175,
        weight_kg: 70,
        activity_level: 'moderate',
        goal_type: 'maintain',
        weekly_goal_kg: 0.5,
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                gender: profile.gender || 'male',
                age: profile.age || 25,
                height_cm: profile.height_cm || 175,
                weight_kg: profile.weight_kg || 70,
                activity_level: profile.activity_level || 'moderate',
                goal_type: profile.goal_type || 'maintain',
                weekly_goal_kg: profile.weekly_goal_kg || 0.5,
                diet_preference: profile.diet_preference || 'standard',
            });
        }
    }, [profile]);

    const liveGoals = useMemo(() => {
        return calculateDailyGoals(formData);
    }, [formData]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateProfile(formData);
            toast.success(t('goals_success_toast'));
            setTimeout(() => navigate('/app/profile'), 1500);
        } catch (error) {
            console.error(error);
            toast.error('Bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    };

    if (profileLoading && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <Loader2 className="size-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-32">
            <header className="p-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-20 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <ArrowLeft className="size-6" />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">{t('profile_targets_body')}</h1>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving || profileLoading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 h-11 font-bold shadow-lg shadow-emerald-500/20"
                >
                    {saving ? <Loader2 className="size-4 animate-spin mr-2" /> : <Save className="size-4 mr-2" />}
                    {saving ? t('goals_updating') : t('goals_save_button')}
                </Button>
            </header>

            <main className="max-w-2xl mx-auto p-6 space-y-8">
                {/* Result Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Sparkles className="size-24" />
                    </div>
                    <div className="relative z-10 text-center">
                        <span className="text-emerald-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">
                            {t('goals_calc_result')}
                        </span>
                        <div className="text-6xl font-black tracking-tight mb-2">
                            {liveGoals.calories}
                            <span className="text-xl text-zinc-500 ml-2">kcal</span>
                        </div>
                        <div className="flex gap-4 justify-center text-xs font-bold text-zinc-400 mt-4">
                            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">P: {liveGoals.protein}g</span>
                            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">C: {liveGoals.carbs}g</span>
                            <span className="bg-white/5 px-3 py-1 rounded-full border border-white/10">F: {liveGoals.fat}g</span>
                        </div>
                    </div>
                </motion.div>

                {/* Section: Body Specs */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg">
                            <User className="size-4" />
                        </div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">Vücut Ölçülerim</h3>
                    </div>

                    <Card className="p-6 rounded-[1.5rem] space-y-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <Label>{t('goals_weight_label')}</Label>
                                <span className="text-emerald-500 text-lg">{formData.weight_kg}<span className="text-xs ml-1 font-medium text-zinc-500">kg</span></span>
                            </div>
                            <Slider
                                min={40} max={200} step={1}
                                value={[formData.weight_kg]}
                                onValueChange={(v: number[]) => setFormData({ ...formData, weight_kg: v[0] })}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <Label>{t('goals_height_label')}</Label>
                                <span className="text-blue-500 text-lg">{formData.height_cm}<span className="text-xs ml-1 font-medium text-zinc-500">cm</span></span>
                            </div>
                            <Slider
                                min={120} max={220} step={1}
                                value={[formData.height_cm]}
                                onValueChange={(v: number[]) => setFormData({ ...formData, height_cm: v[0] })}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <Label>{t('goals_age_label')}</Label>
                                <span className="text-amber-500 text-lg">{formData.age}</span>
                            </div>
                            <Slider
                                min={15} max={100} step={1}
                                value={[formData.age]}
                                onValueChange={(v: number[]) => setFormData({ ...formData, age: v[0] })}
                            />
                        </div>
                    </Card>
                </div>

                {/* Section: Activity */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                            <Activity className="size-4" />
                        </div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">{t('goals_activity_label')}</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {(['sedentary', 'light', 'moderate', 'active', 'very_active'] as const).map((level) => (
                            <div
                                key={level}
                                onClick={() => setFormData({ ...formData, activity_level: level })}
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${formData.activity_level === level ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}
                            >
                                <span className={`font-bold ${formData.activity_level === level ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                    {t(`activity_${level}_label`)}
                                </span>
                                {formData.activity_level === level && <div className="size-2 rounded-full bg-emerald-500" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section: Goal */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg">
                            <Target className="size-4" />
                        </div>
                        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-xs">{t('goals_primary_goal')}</h3>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {(['lose', 'maintain', 'gain'] as const).map((type) => (
                            <div
                                key={type}
                                onClick={() => setFormData({ ...formData, goal_type: type })}
                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center ${formData.goal_type === type ? 'border-rose-500 bg-rose-500/5' : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}
                            >
                                <span className={`font-bold text-xs uppercase tracking-tight ${formData.goal_type === type ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-500'}`}>
                                    {t(`goal_type_${type}`)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {formData.goal_type !== 'maintain' && (
                        <div className="mt-6 p-6 rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 space-y-4">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <Label>{t('goals_weekly_target')}</Label>
                                <span className="text-zinc-900 dark:text-white">{formData.weekly_goal_kg} kg</span>
                            </div>
                            <Slider
                                min={0.1} max={1.5} step={0.1}
                                value={[formData.weekly_goal_kg || 0.5]}
                                onValueChange={(v: number[]) => setFormData({ ...formData, weekly_goal_kg: v[0] })}
                            />
                            <p className="text-[10px] text-zinc-400 text-center font-medium">Sağlıklı limitiniz: 0.5 - 1.0 kg / hafta</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
