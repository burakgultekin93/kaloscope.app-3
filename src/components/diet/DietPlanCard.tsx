import { motion } from 'framer-motion';
import { Leaf, Info } from 'lucide-react';

export interface DietPlan {
    id: string;
    slug: string;
    name_tr: string;
    description_tr: string;
    icon: string;
    color: string;
    difficulty: 'easy' | 'moderate' | 'hard';
    is_medical: boolean;
    protein_pct: number;
    carb_pct: number;
    fat_pct: number;
}

interface DietPlanCardProps {
    plan: DietPlan;
    isSelected?: boolean;
    onClick?: () => void;
}

export const DietPlanCard = ({ plan, isSelected, onClick }: DietPlanCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                relative p-5 rounded-[2rem] border-2 cursor-pointer transition-all overflow-hidden bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md
                ${isSelected
                    ? 'border-emerald-500 shadow-emerald-500/10'
                    : 'border-zinc-200 dark:border-zinc-800'}
            `}
        >
            {/* Arkaplan Rengi (hafif) */}
            <div
                className="absolute -top-12 -right-12 size-32 rounded-full blur-3xl opacity-20 transition-colors"
                style={{ backgroundColor: plan.color }}
            />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="size-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                            style={{ backgroundColor: `${plan.color}20`, color: plan.color }}
                        >
                            {plan.icon}
                        </div>
                        <div>
                            <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{plan.name_tr}</h3>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider mt-1">
                                <span className={`
                                    px-2 py-0.5 rounded-full
                                    ${plan.difficulty === 'easy' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                                        plan.difficulty === 'moderate' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' :
                                            'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'}
                                `}>
                                    {plan.difficulty === 'easy' ? 'Kolay' : plan.difficulty === 'moderate' ? 'Orta' : 'Zor'}
                                </span>
                                {plan.is_medical && (
                                    <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Info className="size-3" /> Medikal
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 line-clamp-2">
                    {plan.description_tr}
                </p>

                {/* Makro Dağılımı Çubuğu */}
                <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                        <span className="text-zinc-700 dark:text-zinc-300">P: %{plan.protein_pct}</span>
                        <span className="text-blue-600 dark:text-blue-400">K: %{plan.carb_pct}</span>
                        <span className="text-rose-500 dark:text-rose-400">Y: %{plan.fat_pct}</span>
                    </div>
                    <div className="flex w-full h-2 rounded-full overflow-hidden">
                        <div style={{ width: `${plan.protein_pct}%` }} className="bg-zinc-700 dark:bg-zinc-300" />
                        <div style={{ width: `${plan.carb_pct}%` }} className="bg-blue-500" />
                        <div style={{ width: `${plan.fat_pct}%` }} className="bg-rose-500" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
