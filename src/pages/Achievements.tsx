import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { AchievementBadge, AchievementBadgeProps } from '@/components/gamification/AchievementBadge';
import { XPBar } from '@/components/gamification/XPBar';
import { ArrowLeft, Loader2, Trophy, Info } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';

interface Achievement {
    id: string;
    slug: string;
    name_tr: string;
    icon: string;
    category: string;
    earned_at?: string;
}

export default function Achievements() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { profile } = useProfile();
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            if (!user) return;
            try {
                // Tüm rozetleri çek
                const { data: allAchievements, error: allErr } = await supabase
                    .from('achievements')
                    .select('id, slug, name_tr, icon, category, sort_order')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });

                if (allErr) throw allErr;

                // Kazanılan rozetleri çek
                const { data: earnedAchievements, error: earnedErr } = await supabase
                    .from('user_achievements')
                    .select('achievement_id, earned_at')
                    .eq('user_id', user.id);

                if (earnedErr) throw earnedErr;

                // Birleştir
                const mapped = allAchievements.map(a => {
                    const earned = earnedAchievements?.find(e => e.achievement_id === a.id);
                    return {
                        ...a,
                        earned_at: earned?.earned_at
                    };
                });

                setAchievements(mapped);
            } catch (error) {
                console.error('Error fetching achievements:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAchievements();
    }, [user]);

    const categories = [
        { id: 'streak', name: 'Alışkanlık', icon: '🔥' },
        { id: 'scan', name: 'Tarama', icon: '📸' },
        { id: 'weight', name: 'Hedef', icon: '⚖️' },
        { id: 'diet', name: 'Uyum', icon: '🥗' },
        { id: 'water', name: 'Su', icon: '💧' },
        { id: 'special', name: 'Özel', icon: '✨' },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-32">
            <header className="p-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-20">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <ArrowLeft className="size-6" />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">Başarılar & Rozetler</h1>
                </div>

                {/* XP Progress Card */}
                {profile && (
                    <XPBar xp={(profile as any).xp || 0} />
                )}
            </header>

            <main className="p-6 space-y-10 max-w-2xl mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="size-8 animate-spin text-emerald-500" />
                    </div>
                ) : (
                    categories.map(category => (
                        <section key={category.id} className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <span>{category.icon}</span> {category.name}
                                </h2>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                    {achievements.filter(a => a.category === category.id && a.earned_at).length} / {achievements.filter(a => a.category === category.id).length}
                                </span>
                            </div>

                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-6">
                                {achievements
                                    .filter(a => a.category === category.id)
                                    .map(a => (
                                        <AchievementBadge
                                            key={a.id}
                                            slug={a.slug}
                                            name={a.name_tr}
                                            icon={a.icon}
                                            isLocked={!a.earned_at}
                                            earnedDate={a.earned_at}
                                            size="sm"
                                        />
                                    ))
                                }
                            </div>
                        </section>
                    ))
                )}

                {/* Achievement Info */}
                <div className="bg-blue-500/5 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-900/50 p-6 rounded-[2rem] flex gap-4">
                    <div className="p-3 bg-blue-500 text-white rounded-2xl h-fit">
                        <Trophy className="size-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-1 leading-tight">Nasıl Rozet Kazanırım?</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-500 font-medium">
                            Uygulamayı kullandıkça, yemeklerini tarattıkça ve diyetine sadık kaldıkça otomatik olarak rozet kazanırsın. Her rozet sana ekstra XP kazandırır!
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
