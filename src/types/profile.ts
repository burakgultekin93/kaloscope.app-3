import type { UserProfileParams } from '@/utils/calories';

export interface UserProfile extends UserProfileParams {
    id: string;
    onboarding_completed: boolean;
    daily_calorie_goal: number;
    daily_protein_goal: number;
    daily_carb_goal: number;
    daily_fat_goal: number;
    daily_water_goal: number;
    updated_at: string;

    // Subscription fields
    is_pro: boolean;
    subscription_tier: 'free' | 'pro';
    subscription_end_date: string | null;
    payment_gateway: 'paddle' | null;
    external_customer_id: string | null;

    // Usage tracking
    daily_scans_count: number;
    last_scan_date: string;

    // Gamification
    xp: number;
    level: number;
}
