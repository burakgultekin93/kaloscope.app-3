import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { IconWater } from '@/components/brand';

export const WaterTracker = () => {
    const { user } = useAuth();
    const { profile, refreshProfile } = useProfile();
    const [water, setWater] = useState(0);
    const [loading, setLoading] = useState(false);

    const target = profile?.daily_water_goal || 2500;
    const percentage = Math.min((water / target) * 100, 100);

    // Fetch today's water
    useEffect(() => {
        if (!user) return;

        const fetchWater = async () => {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const { data } = await supabase
                .from('water_logs')
                .select('amount_ml')
                .eq('user_id', user.id)
                .gte('created_at', startOfDay.toISOString())
                .lte('created_at', endOfDay.toISOString());

            if (data) {
                const total = data.reduce((acc: number, curr: { amount_ml: number }) => acc + curr.amount_ml, 0);
                setWater(total);
            }
        };
        fetchWater();
    }, [user]);

    const addWater = async (amount: number) => {
        if (!user || loading) return;
        setLoading(true);
        // Optimistic UI update
        const previousWater = water;
        setWater(w => Math.min(w + amount, 10000));

        try {
            import { checkAchievements } from '@/lib/achievements';

            export const WaterTracker = () => {
                // ...
                await supabase.from('water_logs').insert([{
                    user_id: user.id,
                    amount_ml: amount
                }]);

                // Check for water achievements
                await checkAchievements(user.id, 'water');

                // Refresh global profile state
                await refreshProfile();
            } catch (error) {
                console.error('Error adding water:', error);
                setWater(previousWater);
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="bg-cyan-50 dark:bg-cyan-950/20 rounded-2xl p-4 border border-cyan-100 dark:border-cyan-900 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <IconWater size={20} className="text-cyan-500" />
                        <h3 className="font-bold text-cyan-900 dark:text-cyan-100">Su Takibi</h3>
                    </div>

                    <div className="text-sm font-semibold text-cyan-700 dark:text-cyan-400">
                        <span className="text-lg">{water}</span> / {target} ml
                    </div>
                </div>

                {/* Progress */}
                <div className="w-full h-2 bg-cyan-100 dark:bg-cyan-950 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-cyan-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" onClick={() => addWater(200)} className="bg-white dark:bg-zinc-900 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors h-9 rounded-xl text-xs font-semibold">
                        + 200 ml
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addWater(330)} className="bg-white dark:bg-zinc-900 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors h-9 rounded-xl text-xs font-semibold">
                        + 330 ml
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => addWater(500)} className="bg-white dark:bg-zinc-900 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors h-9 rounded-xl text-xs font-semibold">
                        + 500 ml
                    </Button>
                </div>
            </div>
        );
    };
