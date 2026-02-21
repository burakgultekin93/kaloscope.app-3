import { motion } from 'framer-motion';
import { IconFlame } from '@/components/brand';

interface CalorieRingsProps {
    current: number;
    target: number;
}

export const CalorieRings = ({ current, target }: CalorieRingsProps) => {
    const percentage = Math.min((current / target) * 100 || 0, 100);
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center p-6">
            {/* Background Rings */}
            <svg className="w-56 h-56 transform -rotate-90">
                <circle
                    cx="112"
                    cy="112"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="transparent"
                    className="text-zinc-200 dark:text-zinc-800"
                />
                <motion.circle
                    cx="112"
                    cy="112"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="16"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="text-emerald-500 shadow-emerald-500/50"
                />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <IconFlame size={32} className="mb-2" />
                <div className="text-3xl font-bold font-mono text-zinc-900 dark:text-white leading-none">
                    {current}
                </div>
                <div className="text-zinc-500 dark:text-zinc-400 font-medium text-sm flex items-center gap-1 mt-1">
                    <span className="text-emerald-500">/</span> {target} kcal
                </div>

                <div className="mt-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Kalan: {Math.max(0, target - current)}
                </div>
            </div>
        </div>
    );
};
