import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface DietComplianceBannerProps {
    dietName: string;
    dayCount: number;
    weeklyCompliancePct: number;
    icon: string;
    color: string;
}

export const DietComplianceBanner = ({ dietName, dayCount, weeklyCompliancePct, icon, color }: DietComplianceBannerProps) => {
    const navigate = useNavigate();

    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/app/diet-plans')}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer relative overflow-hidden"
        >
            <div
                className="absolute left-0 top-0 bottom-0 w-1.5"
                style={{ backgroundColor: color }}
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 pl-2">
                    <div className="text-2xl">{icon}</div>
                    <div>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            {dietName} <span className="text-[10px] font-medium text-zinc-400">— {dayCount}. Gün</span>
                        </h3>

                        <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Bu hafta:</span>
                            <div className="w-24 h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${weeklyCompliancePct}%`,
                                        backgroundColor: color
                                    }}
                                />
                            </div>
                            <span className="text-[10px] font-bold" style={{ color }}>
                                %{weeklyCompliancePct}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="text-zinc-400 dark:text-zinc-600">
                    <ChevronRight className="size-5" />
                </div>
            </div>
        </motion.div>
    );
};
