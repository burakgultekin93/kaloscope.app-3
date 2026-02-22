import { useState, useEffect } from 'react';
import { Search, Loader2, Plus, Sparkles } from 'lucide-react';
import { analyzeFoodText } from '@/lib/analyzeFood';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
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
    const [aiLoading, setAiLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        const search = async () => {
            setLoading(true);
            try {
                if (query.length < 2) {
                    // Fetch recent items as suggestions
                    const { data, error } = await supabase
                        .from('food_items')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(10);

                    if (error) throw error;
                    setResults(data || []);
                } else {
                    // Fuzzy search using ILIKE for quick lookup
                    const { data, error } = await supabase
                        .from('food_items')
                        .select('*')
                        .ilike('name_tr', `%${query}%`)
                        .limit(10);

                    if (error) throw error;
                    setResults(data || []);
                }
            } catch (error) {
                console.error('Arama hatası:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(search, 300);
        return () => clearTimeout(timeoutId);
    }, [query, open]);

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
            fiber_total: (Number(item.fiber_per_100g || 0) * (item.common_portion_grams || 100)) / 100,
        };

        onAdd(newFood);
        setOpen(false);
        setQuery('');
    };

    const handleAISearch = async () => {
        if (!query || query.length < 2) return;
        setAiLoading(true);
        try {
            const result = await analyzeFoodText(query);
            if (result.foods && result.foods.length > 0) {
                // For now, we take the first item from AI
                const aiItem = result.foods[0];
                const newFood: DetectedFood = {
                    id: 'ai-' + Date.now(),
                    name_tr: aiItem.name_tr,
                    name_en: aiItem.name_en || aiItem.name_tr,
                    estimated_grams: aiItem.estimated_grams,
                    confidence: aiItem.confidence,
                    calories_per_100g: aiItem.calories_per_100g,
                    protein_per_100g: aiItem.protein_per_100g,
                    carbs_per_100g: aiItem.carbs_per_100g,
                    fat_per_100g: aiItem.fat_per_100g,
                    fiber_per_100g: aiItem.fiber_per_100g || 0,
                    calories_total: Math.round((aiItem.calories_per_100g * aiItem.estimated_grams) / 100),
                    protein_total: Number(((aiItem.protein_per_100g * aiItem.estimated_grams) / 100).toFixed(1)),
                    carbs_total: Number(((aiItem.carbs_per_100g * aiItem.estimated_grams) / 100).toFixed(1)),
                    fat_total: Number(((aiItem.fat_per_100g * aiItem.estimated_grams) / 100).toFixed(1)),
                    fiber_total: (aiItem.fiber_per_100g * aiItem.estimated_grams) / 100,
                };
                onAdd(newFood);
                setOpen(false);
                setQuery('');
            } else {
                toast.error('AI yiyeceği tanımlayamadı.');
            }
        } catch (error) {
            console.error('AI Search Error:', error);
            toast.error('AI analizi sırasında bir hata oluştu.');
        } finally {
            setAiLoading(false);
        }
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

                    {!loading && query.length < 2 && results.length > 0 && (
                        <div className="text-xs font-bold text-zinc-500 mb-2 mt-4 uppercase tracking-wider px-2">Önerilenler & Kalori Listesi</div>
                    )}

                    {!loading && query.length >= 2 && results.length === 0 && (
                        <div className="text-center py-8 space-y-4">
                            <div className="text-zinc-500">Sonuç bulunamadı. Lütfen "Kendi Yemeğini Ekle" butonunu kullanın veya AI ile detaylı bilgi alın.</div>
                            <Button
                                onClick={handleAISearch}
                                disabled={aiLoading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl h-12 shadow-md"
                            >
                                {aiLoading ? (
                                    <Loader2 className="mr-2 size-5 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 size-5" />
                                )}
                                AI ile Detaylı Ara: "{query}"
                            </Button>
                        </div>
                    )}

                    {!loading && query.length >= 2 && results.length > 0 && (
                        <div className="px-2 mb-2">
                            <Button
                                onClick={handleAISearch}
                                disabled={aiLoading}
                                variant="outline"
                                className="w-full border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl h-12 border-dashed"
                            >
                                {aiLoading ? (
                                    <Loader2 className="mr-2 size-5 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 size-5" />
                                )}
                                Listenizde bulamadınız mı? AI ile Bul
                            </Button>
                        </div>
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
