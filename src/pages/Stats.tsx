import { useState, useMemo } from 'react';
import { TrendingDown, TrendingUp, Target, CalendarDays, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useStats, type TimeRange } from '@/hooks/useStats';
import { useProfile } from '@/hooks/useProfile';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function Stats() {
    const { profile } = useProfile();
    const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
    const { meals, loading } = useStats(timeRange);

    const targetCalories = profile?.daily_calorie_goal || 2000;

    // Process data for charts
    const chartData = useMemo(() => {
        // Group by date
        const grouped = meals.reduce((acc, meal) => {
            const date = meal.logged_date;
            if (!acc[date]) {
                acc[date] = { date, calories: 0, protein: 0, carbs: 0, fat: 0 };
            }
            acc[date].calories += (meal.calories || 0);
            acc[date].protein += (meal.protein || 0);
            acc[date].carbs += (meal.carbs || 0);
            acc[date].fat += (meal.fat || 0);
            return acc;
        }, {} as Record<string, { date: string, calories: number, protein: number, carbs: number, fat: number }>);

        const sorted = Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));

        // Format dates for display based on range
        return sorted.map(d => ({
            ...d,
            displayDate: timeRange === 'monthly' || timeRange === 'six_months'
                ? format(parseISO(d.date), 'd MMM', { locale: tr })
                : format(parseISO(d.date), 'EEEE', { locale: tr }).substring(0, 3)
        }));
    }, [meals, timeRange]);

    const averageCalories = useMemo(() => {
        if (chartData.length === 0) return 0;
        const total = chartData.reduce((sum, d) => sum + d.calories, 0);
        return Math.round(total / chartData.length);
    }, [chartData]);

    const adherenceRate = useMemo(() => {
        if (chartData.length === 0) return 0;
        const compliantDays = chartData.filter(d => d.calories <= targetCalories + 200).length; // allowing 200 kcal buffer
        return Math.round((compliantDays / chartData.length) * 100);
    }, [chartData, targetCalories]);

    const isDeficit = averageCalories < targetCalories;

    const ranges: { id: TimeRange, label: string }[] = [
        { id: 'daily', label: 'Bugün' },
        { id: 'weekly', label: '7 Gün' },
        { id: 'monthly', label: '1 Ay' },
        { id: 'six_months', label: '6 Ay' },
    ];

    return (
        <div className="flex flex-col min-h-screen px-4 pt-12 pb-24 dark:bg-zinc-950">
            <header className="mb-6">
                <h1 className="text-2xl font-bold dark:text-white">Analizler</h1>
                <p className="text-zinc-500 mt-1 text-sm">Beslenme alışkanlıklarınızı inceleyin</p>
            </header>

            {/* Range Selector */}
            <div className="flex gap-2 mb-6 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl overflow-x-auto hide-scrollbar">
                {ranges.map(r => (
                    <button
                        key={r.id}
                        onClick={() => setTimeRange(r.id)}
                        className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${timeRange === r.id ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="size-8 animate-spin text-emerald-500" />
                </div>
            ) : chartData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 border-dashed text-zinc-500">
                    <CalendarDays className="size-12 mb-4 opacity-50" />
                    <p className="font-medium text-sm">Bu dönem için veri bulunamadı.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Highlight Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`text-white rounded-3xl p-5 shadow-sm ${isDeficit ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                            {isDeficit ? <TrendingDown className="size-6 mb-3 opacity-80" /> : <TrendingUp className="size-6 mb-3 opacity-80" />}
                            <div className="font-bold text-2xl">{averageCalories} <span className="text-sm font-normal">kcal</span></div>
                            <p className="text-xs font-medium opacity-80 mt-1">Ortalama Alınan</p>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm text-zinc-900 dark:text-white">
                            <Target className="size-6 mb-3 text-amber-500" />
                            <div className="font-bold text-2xl">{adherenceRate}%</div>
                            <p className="text-xs font-medium text-zinc-500 mt-1">Hedefe uyum oranı</p>
                        </div>
                    </div>

                    {/* Calorie Trend Chart */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-sm">Kalori Trendi</h3>
                            <span className="text-xs text-zinc-500 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">Hedef: {targetCalories}</span>
                        </div>
                        <div className="h-48 w-full -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" strokeOpacity={0.5} />
                                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                        labelStyle={{ color: '#a1a1aa', fontWeight: 'normal', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="calories" name="Kalori" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCalories)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Macro Distribution Chart */}
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-sm">
                        <h3 className="font-bold text-sm mb-6">Makro Dağılımı</h3>
                        <div className="h-48 w-full -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" strokeOpacity={0.5} />
                                    <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#a1a1aa' }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="protein" name="Protein" stackId="a" fill="#60a5fa" radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="carbs" name="Karbonhidrat" stackId="a" fill="#fbbf24" />
                                    <Bar dataKey="fat" name="Yağ" stackId="a" fill="#fb7185" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-4 text-[10px] font-medium text-zinc-500">
                            <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-blue-400"></div>Protein</div>
                            <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-amber-400"></div>Karb</div>
                            <div className="flex items-center gap-1"><div className="size-2 rounded-full bg-rose-400"></div>Yağ</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
