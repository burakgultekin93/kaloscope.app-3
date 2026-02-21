import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trash2, RefreshCcw, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { DetectedFood } from '@/types/food';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { FoodSearchModal } from '@/components/scan/FoodSearchModal';
import { ManualFoodAddModal } from '@/components/scan/ManualFoodAddModal';
import { toast } from 'sonner';
import { IconPlate, IconScan, IconLeaf, IconFlame, IconSlider } from '@/components/brand';

export default function ScanResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const [mealType, setMealType] = useState('ogle');
    const [isSaving, setIsSaving] = useState(false);

    const initialFoods = location.state?.result?.foods || [];
    const isManualMode = location.state?.isManual === true;
    const [foods, setFoods] = useState<DetectedFood[]>(initialFoods.length > 0 ? initialFoods : []);

    // If suddenly navigating here without data AND not explicitly requesting manual mode
    useMemo(() => {
        if (!location.state?.result && !isManualMode && foods.length === 0) {
            navigate('/app/scan');
        }
    }, [location.state, navigate, foods.length, isManualMode]);

    const removeFood = (id: string) => {
        setFoods(foods.filter(f => f.id !== id));
    };

    const handleAddFood = (food: DetectedFood) => {
        setFoods([...foods, food]);
        toast.success(`${food.name_tr} listeye eklendi`);
    };

    const updateGrams = (id: string, grams: number) => {
        if (navigator.vibrate && grams % 50 === 0) navigator.vibrate(10);

        setFoods(foods.map(f => {
            if (f.id === id) {
                const multiplier = grams / 100;
                return {
                    ...f,
                    estimated_grams: grams,
                    calories_total: Math.round(f.calories_per_100g * multiplier),
                    protein_total: Number((f.protein_per_100g * multiplier).toFixed(1)),
                    carbs_total: Number((f.carbs_per_100g * multiplier).toFixed(1)),
                    fat_total: Number((f.fat_per_100g * multiplier).toFixed(1)),
                };
            }
            return f;
        }));
    };

    const handleSave = async () => {
        if (!user || foods.length === 0) return;
        setIsSaving(true);

        try {
            const mappedMealType = mealType === 'kahvalti' ? 'breakfast' :
                mealType === 'ogle' ? 'lunch' :
                    mealType === 'aksam' ? 'dinner' : 'snack';

            const mealDataRows = foods.map(food => ({
                user_id: user.id,
                meal_type: mappedMealType,
                food_name: food.name_tr,
                food_name_en: food.name_en,
                portion_grams: food.estimated_grams,
                calories: food.calories_total,
                protein: food.protein_total,
                carbs: food.carbs_total,
                fat: food.fat_total,
                fiber: food.fiber_per_100g ? Number(((food.fiber_per_100g * food.estimated_grams) / 100).toFixed(1)) : 0,
                ai_confidence: food.confidence,
                logged_date: new Date().toISOString().split('T')[0] // Use current date for 'logged_date' type DATE
            }));

            const mealRowsResult = await supabase.from('meals').insert(mealDataRows);

            if (mealRowsResult.error) throw mealRowsResult.error;

            // Also save any newly discovered AI items to the global dictionary
            const newDictionaryItems = foods
                .filter(food => !food.id.startsWith('manual-')) // Don't re-insert DB discoveries
                .map(food => ({
                    name_tr: food.name_tr,
                    name_en: food.name_en,
                    calories_per_100g: food.calories_per_100g,
                    protein_per_100g: food.protein_per_100g,
                    carbs_per_100g: food.carbs_per_100g,
                    fat_per_100g: food.fat_per_100g,
                    fiber_per_100g: food.fiber_per_100g || 0,
                    common_portion_grams: food.estimated_grams,
                    category: 'ai_discovery',
                    is_turkish: true
                }));

            if (newDictionaryItems.length > 0) {
                // Silently attempt to extend the dictionary
                await supabase.from('food_items').insert(newDictionaryItems);
            }

            toast.success('Öğün başarıyla günlüğe eklendi!');
            navigate('/app/diary');
        } catch (error) {
            console.error('Kayıt hatası:', error);
            toast.error('Öğün kaydedilirken bir hata oluştu');
        } finally {
            setIsSaving(false);
        }
    };

    const totals = useMemo(() => {
        return foods.reduce((acc, curr) => ({
            calories: acc.calories + curr.calories_total,
            protein: acc.protein + curr.protein_total,
            carbs: acc.carbs + curr.carbs_total,
            fat: acc.fat + curr.fat_total,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [foods]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col pb-32">
            <header className="px-4 py-4 flex items-center justify-between sticky top-0 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-md z-10 border-b border-zinc-200 dark:border-zinc-800">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800">
                    <ArrowLeft className="size-6" />
                </button>
                <h1 className="text-xl font-bold">{isManualMode ? 'Öğün Oluştur' : 'Analiz Sonucu'}</h1>
                <div className="w-10" />
            </header>

            <main className="flex-1 px-4 py-6 space-y-6">

                {foods.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 border-dashed text-zinc-500">
                        <IconPlate size={64} className="mb-4 opacity-50" />
                        <p className="font-medium text-sm text-center px-8 text-zinc-400">Listeniz şu an boş.<br />Aşağıdaki butonları kullanarak yemeğinizi aratabilir veya tamamen kendi besininizi oluşturabilirsiniz.</p>
                    </div>
                )}


                <AnimatePresence>
                    {foods.map((food, i) => (
                        <motion.div
                            key={food.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-5 shadow-sm border border-zinc-200 dark:border-zinc-800"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg">{food.name_tr}</h3>
                                        {food.confidence > 0.8 ? (
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                        ) : (
                                            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                                        )}
                                    </div>
                                    <AnimatePresence mode="popLayout">
                                        <motion.div
                                            key={food.calories_total}
                                            initial={{ y: -10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400"
                                        >
                                            {food.calories_total} <span className="text-sm text-zinc-500 font-sans">kcal</span>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                                <button onClick={() => removeFood(food.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors bg-zinc-100 dark:bg-zinc-800 rounded-full">
                                    <Trash2 className="size-4" />
                                </button>
                            </div>

                            {/* Slider */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between text-sm font-semibold">
                                    <div className="flex items-center gap-1.5 text-zinc-500">
                                        <IconSlider size={16} />
                                        <span>Porsiyon</span>
                                    </div>
                                    <span className="text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">{food.estimated_grams}g</span>
                                </div>

                                <Slider
                                    value={[food.estimated_grams]}
                                    min={10} max={1000} step={5}
                                    onValueChange={(val: number[]) => updateGrams(food.id, val[0])}
                                    className="py-2"
                                />

                                {/* Quick Portions */}
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { label: 'S', g: 100 },
                                        { label: 'M', g: 200 },
                                        { label: 'L', g: 300 },
                                        { label: 'XL', g: 450 }
                                    ].map(p => (
                                        <button
                                            key={p.label}
                                            onClick={() => updateGrams(food.id, p.g)}
                                            className={`h-10 text-xs font-bold rounded-xl border ${food.estimated_grams === p.g ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50'}`}
                                        >
                                            {p.label} <span className="block text-[10px] font-normal opacity-70">{p.g}g</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-3">
                    <FoodSearchModal onAdd={handleAddFood}>
                        <Button variant="outline" className="w-full h-14 border-dashed rounded-2xl border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                            <IconScan size={20} className="mr-2" /> Yemek Ara
                        </Button>
                    </FoodSearchModal>

                    <ManualFoodAddModal onAdd={handleAddFood}>
                        <Button variant="outline" className="w-full h-14 border-dashed rounded-2xl border-2 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400">
                            <IconPlate size={20} className="mr-2" /> Kendi Yemeğini Ekle
                        </Button>
                    </ManualFoodAddModal>
                </div>
            </main>

            {/* Fixed Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-zinc-950 text-white rounded-t-3xl shadow-2xl p-6 pb-safe border-t border-zinc-800 z-40">

                {/* Totals Tracker */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <div className="text-zinc-400 text-sm font-medium mb-1">Toplam Alınan</div>
                        <motion.div
                            key={totals.calories}
                            initial={{ scale: 1.1, color: '#10b981' }}
                            animate={{ scale: 1, color: '#ffffff' }}
                            className="text-4xl font-mono font-bold"
                        >
                            {totals.calories} <span className="text-xl text-zinc-500 font-sans">kcal</span>
                        </motion.div>
                    </div>

                    <div className="flex gap-4 text-xs font-mono font-medium text-right mb-1">
                        <div className="flex flex-col items-center">
                            <IconLeaf size={16} className="text-blue-400 mb-1" />
                            {Math.round(totals.protein)}g
                        </div>
                        <div className="flex flex-col items-center">
                            <IconPlate size={16} className="text-amber-400 mb-1" />
                            {Math.round(totals.carbs)}g
                        </div>
                        <div className="flex flex-col items-center">
                            <IconFlame size={16} className="text-rose-400 mb-1" />
                            {Math.round(totals.fat)}g
                        </div>
                    </div>
                </div>


                {/* Meal Selector & Actions */}
                <div className="flex gap-3 mb-4 overflow-x-auto hide-scrollbar pb-2">
                    {['kahvalti', 'ogle', 'aksam', 'ara'].map(m => (
                        <button
                            key={m}
                            onClick={() => setMealType(m)}
                            className={`px-4 py-2 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-colors ${mealType === m ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                        >
                            {m === 'kahvalti' ? 'Kahvaltı' : m === 'ogle' ? 'Öğle' : m === 'aksam' ? 'Akşam' : 'Ara Öğün'}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/app/scan')} className="h-14 px-4 bg-zinc-900 border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-2xl flex-shrink-0">
                        <RefreshCcw className="size-5" />
                    </Button>
                    <Button disabled={isSaving || foods.length === 0} onClick={handleSave} className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20">
                        {isSaving ? <Loader2 className="mr-2 size-6 animate-spin" /> : <Check className="mr-2 size-6" />} Günlüğe Ekle & Git
                    </Button>
                </div>
            </div>
        </div>
    );
}
