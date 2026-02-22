import { supabase } from './supabase';

export interface Achievement {
    id: string;
    slug: string;
    name_tr: string;
    description_tr: string;
    xp_reward: number;
    icon: string;
}

/**
 * Checks and awards achievements for a user
 */
export async function checkAchievements(userId: string, type: 'meal' | 'water' | 'streak' | 'macro') {
    // 1. Get user's earned achievements to avoid duplicates
    const { data: earned } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

    const earnedIds = new Set(earned?.map((e: { achievement_id: string }) => e.achievement_id) || []);

    // 2. Fetch all available achievements
    const { data: allAchievements } = await supabase
        .from('achievements')
        .select('*');

    if (!allAchievements) return [];

    const newAchievements: Achievement[] = [];

    // 3. Logic based on type
    if (type === 'meal') {
        const firstMeal = allAchievements.find((a: Achievement) => a.slug === 'first_meal');
        if (firstMeal && !earnedIds.has(firstMeal.id)) {
            const { count } = await supabase
                .from('meals')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if (count && count >= 1) {
                await awardAchievement(userId, firstMeal);
                newAchievements.push(firstMeal);
            }
        }
    }

    if (type === 'water') {
        const { data: waterToday } = await supabase
            .from('water_logs')
            .select('amount_ml')
            .eq('user_id', userId)
            .eq('logged_date', new Date().toISOString().split('T')[0]);

        const totalWater = waterToday?.reduce((sum: number, log: { amount_ml: number }) => sum + log.amount_ml, 0) || 0;

        const water2l = allAchievements.find((a: Achievement) => a.slug === 'water_2l');
        if (water2l && !earnedIds.has(water2l.id) && totalWater >= 2000) {
            await awardAchievement(userId, water2l);
            newAchievements.push(water2l);
        }

        const water3l = allAchievements.find((a: Achievement) => a.slug === 'water_3l');
        if (water3l && !earnedIds.has(water3l.id) && totalWater >= 3000) {
            await awardAchievement(userId, water3l);
            newAchievements.push(water3l);
        }
    }

    // Streak and Macro logic would follow similar patterns
    // This function will be called from hooks/pages when relevant actions occur

    return newAchievements;
}

async function awardAchievement(userId: string, achievement: Achievement) {
    // Insert into user_achievements
    await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: achievement.id
    });

    // Update user XP in profiles
    const { data: profile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', userId)
        .single();

    if (profile) {
        await supabase
            .from('profiles')
            .update({ xp: (profile.xp || 0) + achievement.xp_reward })
            .eq('id', userId);
    }
}
