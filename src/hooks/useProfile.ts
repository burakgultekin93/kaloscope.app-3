import { useProfileContext } from '@/providers/ProfileProvider';

export const useProfile = () => {
    return useProfileContext();
};
