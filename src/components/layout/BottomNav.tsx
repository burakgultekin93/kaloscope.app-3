import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Logo, IconPlate, IconScan, IconStats, IconProfile } from '@/components/brand';

export const BottomNav = () => {
    const navigate = useNavigate();

    const navItems = [
        { label: 'Ana Sayfa', icon: Logo, path: '/app' },
        { label: 'Günlük', icon: IconPlate, path: '/app/diary' },
        { label: 'Scan', icon: IconScan, path: '/app/scan', isFab: true },
        { label: 'İstatistik', icon: IconStats, path: '/app/stats' },
        { label: 'Profil', icon: IconProfile, path: '/app/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 h-20 border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl z-50 flex items-center justify-around px-2 pb-safe">
            {navItems.map((item, idx) => {
                if (item.isFab) {
                    return (
                        <div key={idx} className="relative -top-6 flex justify-center">
                            <button
                                onClick={() => navigate(item.path)}
                                className="size-16 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 border-4 border-white dark:border-zinc-950"
                            >
                                <IconScan size={32} color="white" />
                            </button>
                        </div>
                    );
                }

                return (
                    <NavLink
                        key={idx}
                        to={item.path}
                        end={item.path === '/app'}
                        className={({ isActive }) =>
                            cn(
                                "flex flex-col items-center justify-center w-16 h-full transition-colors",
                                isActive ? "text-emerald-500" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            )
                        }
                    >
                        <item.icon
                            size={24}
                            className="mb-1"
                            {...(item.label === 'Ana Sayfa' ? { variant: 'mono' } : {})}
                        />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </NavLink>
                );
            })}
        </div>
    );
};

