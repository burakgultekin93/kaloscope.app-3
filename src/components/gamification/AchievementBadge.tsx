import { motion } from 'framer-motion';

export interface AchievementBadgeProps {
    slug: string;
    name: string;
    icon: string;
    isLocked?: boolean;
    earnedDate?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const AchievementBadge = ({ name, icon, isLocked = false, earnedDate, size = 'md' }: AchievementBadgeProps) => {

    const sizeClasses = {
        sm: 'w-12 h-12 text-lg',
        md: 'w-16 h-16 text-2xl',
        lg: 'w-24 h-24 text-4xl'
    };

    return (
        <div className="flex flex-col items-center gap-2 group relative">
            <motion.div
                whileHover={!isLocked ? { scale: 1.05 } : {}}
                className={`
                    flex items-center justify-center rounded-3xl shadow-sm border-2 transition-all
                    ${sizeClasses[size]}
                    ${isLocked
                        ? 'bg-zinc-100 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 opacity-60'
                        : 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-200 dark:from-amber-900/40 dark:to-orange-900/40 dark:border-amber-700'}
                `}
            >
                <div className={isLocked ? 'grayscale opacity-50' : 'drop-shadow-sm'}>
                    {icon}
                </div>
            </motion.div>

            <div className="text-center">
                <div className={`font-bold text-xs max-w-[80px] leading-tight ${isLocked ? 'text-zinc-400' : 'text-zinc-800 dark:text-zinc-200'}`}>
                    {name}
                </div>
                {!isLocked && earnedDate && (
                    <div className="text-[9px] text-zinc-500 mt-0.5">
                        {new Date(earnedDate).toLocaleDateString('tr-TR')}
                    </div>
                )}
            </div>
        </div>
    );
};
