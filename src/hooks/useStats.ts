import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { MealRecord } from './useMeals';

export type TimeRange = 'daily' | 'weekly' | 'monthly' | 'six_months';

export const useStats = (timeRange: TimeRange) => {
    const { user } = useAuth();
    const [meals, setMeals] = useState<MealRecord[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;
            setLoading(true);

            try {
                const endDate = new Date();
                const startDate = new Date();

                if (timeRange === 'weekly') {
                    startDate.setDate(endDate.getDate() - 7);
                } else if (timeRange === 'monthly') {
                    startDate.setMonth(endDate.getMonth() - 1);
                } else if (timeRange === 'six_months') {
                    startDate.setMonth(endDate.getMonth() - 6);
                } else {
                    // Daily - just today
                    startDate.setHours(0, 0, 0, 0);
                }

                const { data, error } = await supabase
                    .from('meals')
                    .select('*')
                    .eq('user_id', user.id)
                    .gte('logged_date', startDate.toISOString().split('T')[0])
                    .lte('logged_date', endDate.toISOString().split('T')[0])
                    .order('logged_date', { ascending: true });

                if (error) throw error;
                setMeals(data || []);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [user, timeRange]);

    return { meals, loading };
};
