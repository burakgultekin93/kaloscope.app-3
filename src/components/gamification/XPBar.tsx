import { motion } from 'framer-motion';
import { getUserLevel, getNextLevel, getXPProgress } from '@/utils/levels';

interface XPBarProps {
    xp: number;
}

export const XPBar = ({ xp }: XPBarProps) => {
    const current = getUserLevel(xp);
    const next = getNextLevel(xp);
    const progress = getXPProgress(xp);

    return (
        <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{current.icon}</span>
                    <span className="font-bold text-sm dark:text-zinc-100">Seviye {current.level}: {current.title}</span>
                </div>
                {next ? (
                    <span className="text-xs font-medium text-zinc-500">{xp} / {next.minXP} XP</span>
                ) : (
                    <span className="text-xs font-medium text-emerald-500">Maksimum Seviye</span>
                )}
            </div>

            <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                />
            </div>

            {next && (
                <div className="mt-2 text-[10px] text-zinc-400 text-right">
                    Sonraki: {next.icon} {next.title}
                </div>
            )}
        </div>
    );
};
