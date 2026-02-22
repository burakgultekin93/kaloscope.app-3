import { LogOut, ChevronRight, Crown, Moon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import type { DietPreference } from '@/utils/calories';
import { useTheme } from '@/app/providers';
import { useTranslation } from '@/hooks/useTranslation';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo, IconProfile, IconPlate, IconBadge } from '@/components/brand';

export default function Profile() {
    const { user, signOut } = useAuth();
    const { profile, updateProfile, loading } = useProfile();
    const { theme, setTheme } = useTheme();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="flex flex-col min-h-screen pb-24 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">

            {/* Header Profile Info */}
            <div className="pt-12 pb-8 px-6 bg-emerald-500 text-white rounded-b-[2rem] shadow-sm">
                <h1 className="text-2xl font-bold mb-6">{t('profile_title')}</h1>
                <div className="flex items-center gap-4">
                    <div className="size-20 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 shadow-inner">
                        <Logo size={50} variant="white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold">{user?.user_metadata?.full_name || t('profile_user')}</h2>
                            {user?.email === 'admin@kaloscope.app' && (
                                <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                            )}
                            {profile?.is_pro && user?.email !== 'admin@kaloscope.app' && (
                                <Crown className="size-4 text-amber-300" />
                            )}
                        </div>
                        <p className="text-emerald-100/80 text-sm font-medium">{user?.email}</p>
                        {profile?.is_pro && (
                            <p className="text-emerald-200/60 text-xs font-bold mt-1">
                                {profile.subscription_tier === 'pro' ? 'PRO Uye' : 'Ucretsiz'}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="px-4 py-6 space-y-6">

                {/* Pro Banner - Hidden for Pro users and Admin */}
                {!profile?.is_pro && (
                    <div
                        onClick={() => navigate('/app/paywall')}
                        className="bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 p-5 rounded-3xl flex items-center justify-between text-white cursor-pointer hover:shadow-lg transition-all border border-zinc-700 shadow-xl shadow-zinc-900/10"
                    >
                        <div className="flex items-center gap-4">
                            <div className="size-10 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center">
                                <Crown className="size-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">{t('profile_pro_cta')}</h3>
                                <p className="text-zinc-400 text-xs">{t('profile_pro_desc')}</p>
                            </div>
                        </div>
                        <ChevronRight className="text-zinc-500" />
                    </div>
                )}

                {/* Settings List */}
                <section className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">

                    <div
                        onClick={() => navigate('/app/profile/goals')}
                        className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><IconProfile size={18} /></div>
                            <span className="font-medium text-sm">{t('profile_targets_body')}</span>
                        </div>
                        <ChevronRight className="size-4 text-zinc-400" />
                    </div>

                    {/* Diet Preference Selector */}
                    <div className="relative flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl"><IconPlate size={18} /></div>
                            <div className="flex flex-col">
                                <span className="font-medium text-sm">{t('profile_diet_pref')}</span>
                                <span className="text-xs text-zinc-500 capitalize">{t(`diet_label_${profile?.diet_preference || 'standard'}`)}</span>
                            </div>
                        </div>
                        <select
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            value={profile?.diet_preference || 'standard'}
                            onChange={(e) => updateProfile({ diet_preference: e.target.value as DietPreference })}
                            disabled={loading}
                        >
                            <option value="standard">{t('diet_label_standard')}</option>
                            <option value="ketogenic">{t('diet_label_ketogenic')}</option>
                            <option value="diabetic">{t('diet_label_diabetic')}</option>
                            <option value="high_protein">{t('diet_label_high_protein')}</option>
                            <option value="vegan">{t('diet_label_vegan')}</option>
                            <option value="vegetarian">{t('diet_label_vegetarian')}</option>
                            <option value="mediterranean">{t('diet_label_mediterranean')}</option>
                        </select>
                        <ChevronRight className="size-4 text-zinc-400" />
                    </div>

                    <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl"><IconBadge size={18} /></div>
                            <span className="font-medium text-sm">{t('profile_privacy')}</span>
                        </div>
                        <ChevronRight className="size-4 text-zinc-400" />
                    </div>


                    <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl"><Moon className="size-4" /></div>
                            <span className="font-medium text-sm">{t('profile_dark_mode')}</span>
                        </div>
                        <div className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors ${theme === 'dark' ? 'bg-emerald-500 justify-end' : 'bg-zinc-200 justify-start'}`}>
                            <div className="bg-white size-4 rounded-full shadow-sm" />
                        </div>
                    </div>

                </section>

                <Button onClick={handleSignOut} variant="outline" className="w-full h-14 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 dark:border-red-900 dark:hover:bg-red-950/20 font-semibold border-2 bg-white dark:bg-zinc-900">
                    <LogOut className="mr-2 size-5" /> {t('profile_logout')}
                </Button>

            </div>
        </div>
    );
}
