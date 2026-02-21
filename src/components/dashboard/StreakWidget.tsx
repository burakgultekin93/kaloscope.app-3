import { useStreak } from '@/hooks/useStreak';
import Confetti from 'react-confetti';
import { useEffect, useState } from 'react';
import { IconStreak } from '@/components/brand';

export const StreakWidget = () => {
    const { current_streak, showConfetti, setShowConfetti, loading } = useStreak();
    const [windowDimension, setDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

    const detectSize = () => {
        setDimension({ width: window.innerWidth, height: window.innerHeight });
    }

    useEffect(() => {
        window.addEventListener('resize', detectSize);
        return () => window.removeEventListener('resize', detectSize);
    }, []);

    // Stop confetti after a few seconds
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti, setShowConfetti]);

    if (loading) {
        return (
            <div className="w-20 h-8 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-full"></div>
        );
    }

    return (
        <>
            {showConfetti && (
                <div className="fixed inset-0 z-[100] pointer-events-none">
                    <Confetti
                        width={windowDimension.width}
                        height={windowDimension.height}
                        recycle={false}
                        numberOfPieces={300}
                        gravity={0.15}
                    />
                </div>
            )}
            <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-full font-bold text-sm border border-orange-200/50 dark:border-orange-900/50 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-default">
                <IconStreak size={20} className={current_streak > 0 ? 'animate-pulse' : 'opacity-50'} />
                {current_streak} Gün
            </div>
        </>
    );
};

