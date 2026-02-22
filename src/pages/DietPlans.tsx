import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { DietPlan, DietPlanCard } from '@/components/diet/DietPlanCard';
import { ArrowLeft, Loader2, Search } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function DietPlans() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [plans, setPlans] = useState<DietPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const { data, error } = await supabase
                    .from('diet_plans')
                    .select('*')
                    .eq('is_active', true)
                    .order('difficulty', { ascending: true }); // Kolaydan zora

                if (error) throw error;
                if (data) setPlans(data as DietPlan[]);
            } catch (error) {
                console.error('Error fetching diet plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const filteredPlans = plans.filter(plan =>
        plan.name_tr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description_tr.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-32">
            <header className="p-6 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-20 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <ArrowLeft className="size-6" />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">Diyet Planları</h1>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
                    <input
                        type="text"
                        placeholder="Diyet ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border-none text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="size-8 animate-spin text-emerald-500" />
                    </div>
                ) : filteredPlans.length > 0 ? (
                    filteredPlans.map(plan => (
                        <DietPlanCard
                            key={plan.id}
                            plan={plan}
                            onClick={() => navigate(`/app/diet-plans/${plan.slug}`, { state: { plan } })}
                        />
                    ))
                ) : (
                    <div className="text-center py-20 text-zinc-500 font-medium">
                        Arama kriterlerine uygun diyet bulunamadı.
                    </div>
                )}
            </main>
        </div>
    );
}
