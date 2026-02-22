import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export interface StreakCounterProps {
    days: number;
    isActiveToday: boolean;
}

export const StreakCounter = ({ days, isActiveToday }: StreakCounterProps) => {

    // Ateş rengi dinamikleştirilebilir (örneğin 30 günde mavi ateş)
    const getFlameColor = () => {
        if (!isActiveToday) return 'text-zinc-400 dark:text-zinc-600 bg-zinc-100 dark:bg-zinc-800';
        if (days >= 30) return 'text-blue-500 bg-blue-500/10';
        if (days >= 7) return 'text-purple-500 bg-purple-500/10';
        return 'text-orange-500 bg-orange-500/10';
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border ${isActiveToday
                    ? 'border-orange-200 dark:border-orange-900 bg-white dark:bg-zinc-900 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50'
                }`}
        >
            <div className={`p-1.5 rounded-full ${getFlameColor()}`}>
                <Flame className={`size-4 ${isActiveToday ? 'animate-pulse' : ''}`} />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-sm leading-none dark:text-white">
                    {days} Gün
                </span>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Seri
                </span>
            </div>
        </motion.div>
    );
};
