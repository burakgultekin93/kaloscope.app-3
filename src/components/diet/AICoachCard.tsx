import { motion } from 'framer-motion';
import { Bot, CheckCircle2, AlertCircle, TriangleAlert, Star, Sparkles } from 'lucide-react';

export interface AICoachData {
    mood: 'excellent' | 'good' | 'neutral' | 'warning' | 'alert';
    feedback_tr: string;
    suggestions_tr: string[];
    compliance_score: number;
}

interface AICoachCardProps {
    data: AICoachData | null;
    isLoading?: boolean;
}

export const AICoachCard = ({ data, isLoading }: AICoachCardProps) => {
    if (isLoading) {
        return (
            <div className="bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] p-6 animate-pulse">
                <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
                <div className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded mb-4"></div>
                <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            </div>
        );
    }

    if (!data) return null;

    const moodConfig = {
        excellent: { icon: Star, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-900' },
        good: { icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-200 dark:border-blue-900' },
        neutral: { icon: Bot, color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-200 dark:border-zinc-800' },
        warning: { icon: TriangleAlert, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-200 dark:border-amber-900' },
        alert: { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-200 dark:border-rose-900' }
    };

    const config = moodConfig[data.mood];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-[2rem] border-2 bg-white dark:bg-zinc-950 shadow-sm ${config.border}`}
        >
            <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-2xl ${config.bg} ${config.color}`}>
                    <Icon className="size-6" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="size-4 text-emerald-500" />
                        <h3 className="font-bold text-sm uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                            AI Koç Analizi
                        </h3>
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                        {data.feedback_tr}
                    </p>
                </div>
            </div>

            {data.suggestions_tr?.length > 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 mt-4">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Öneriler</h4>
                    <ul className="space-y-2">
                        {data.suggestions_tr.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                                <span className="text-emerald-500 mt-1">•</span>
                                <span>{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
};
