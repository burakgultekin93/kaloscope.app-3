import { useProfile } from './useProfile';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useTranslation } from './useTranslation';

export const useUsageLimit = () => {
    const { profile, refreshProfile } = useProfile();
    const { user } = useAuth();
    const { t } = useTranslation();

    const isAdmin = user?.email === 'admin@kaloscope.app';

    const checkLimit = () => {
        if (!profile && !isAdmin) return false;

        const limit = (profile?.is_pro || isAdmin) ? 25 : 3;
        const current = profile?.daily_scans_count || 0;

        if (current >= limit) {
            toast.error(
                (profile?.is_pro || isAdmin)
                    ? t('limit_reached_pro') || 'Günlük 25 tarama limitine ulaştınız.'
                    : t('limit_reached_free') || 'Günlük 3 tarama limitine ulaştınız. Devam etmek için Pro\'ya geçin.'
            );
            return false;
        }

        return true;
    };

    const incrementUsage = async () => {
        if (!profile) {
            if (isAdmin) {
                // Cannot update DB for admin without profile, but allow pass.
                return;
            }
            return;
        }

        try {
            const { error } = await supabase.rpc('increment_scan_count', {
                user_id_param: profile.id
            });

            if (error) throw error;
            await refreshProfile();
        } catch (error) {
            console.error('Error incrementing usage:', error);
        }
    };

    const limit = (profile?.is_pro || isAdmin) ? 25 : 3;
    const current = profile?.daily_scans_count || 0;
    const remaining = limit - current;

    return {
        checkLimit,
        incrementUsage,
        remaining,
        limit,
        current
    };
};
