import { useState, useEffect } from 'react';
import { Search, Loader2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import type { DetectedFood } from '@/types/food';

interface FoodSearchModalProps {
    onAdd: (food: DetectedFood) => void;
    children: React.ReactNode;
}

export interface FoodItem {
    id: string;
    name_tr: string;
    name_en?: string;
    calories_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
    fiber_per_100g?: number;
    common_portion_grams?: number;
}

export const FoodSearchModal = ({ onAdd, children }: FoodSearchModalProps) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const search = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                // Fuzzy search using ILIKE for quick lookup
                const { data, error } = await supabase
                    .from('food_items')
                    .select('*')
                    .ilike('name_tr', `%${query}%`)
                    .limit(10);

                if (error) throw error;
                setResults(data || []);
            } catch (error) {
                console.error('Arama hatası:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(search, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSelect = (item: FoodItem) => {
        const newFood: DetectedFood = {
            id: 'manual-' + Date.now(),
            name_tr: item.name_tr,
            name_en: item.name_en || item.name_tr,
            estimated_grams: item.common_portion_grams || 100,
            confidence: 1, // Manual entries are 100% confident
            calories_per_100g: Number(item.calories_per_100g),
            protein_per_100g: Number(item.protein_per_100g),
            carbs_per_100g: Number(item.carbs_per_100g),
            fat_per_100g: Number(item.fat_per_100g),
            fiber_per_100g: Number(item.fiber_per_100g || 0),
            calories_total: Math.round((Number(item.calories_per_100g) * (item.common_portion_grams || 100)) / 100),
            protein_total: Number(((Number(item.protein_per_100g) * (item.common_portion_grams || 100)) / 100).toFixed(1)),
            carbs_total: Number(((Number(item.carbs_per_100g) * (item.common_portion_grams || 100)) / 100).toFixed(1)),
            fat_total: Number(((Number(item.fat_per_100g) * (item.common_portion_grams || 100)) / 100).toFixed(1)),
        };

        onAdd(newFood);
        setOpen(false);
        setQuery('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Yemek Ara</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-2 mt-4">
                    <Search className="size-5 text-zinc-500" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Yemek, meyve, atıştırmalık..."
                        className="flex-1 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl"
                        autoFocus
                    />
                </div>

                <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2">
                    {loading && <div className="flex justify-center py-4"><Loader2 className="animate-spin text-zinc-500" /></div>}

                    {!loading && query.length >= 2 && results.length === 0 && (
                        <div className="text-center py-8 text-zinc-500">Sonuç bulunamadı</div>
                    )}

                    {!loading && results.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500 cursor-pointer transition-colors" onClick={() => handleSelect(item)}>
                            <div>
                                <h4 className="font-bold">{item.name_tr}</h4>
                                <p className="text-xs text-zinc-500">{item.calories_per_100g} kcal / 100g</p>
                            </div>
                            <Button size="icon" variant="ghost" className="rounded-full text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                                <Plus className="size-5" />
                            </Button>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};
