import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DetectedFood } from '@/types/food';

interface ManualFoodAddModalProps {
    onAdd: (food: DetectedFood) => void;
    children: React.ReactNode;
}

export const ManualFoodAddModal = ({ onAdd, children }: ManualFoodAddModalProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [grams, setGrams] = useState('100');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !calories) return;

        const g = Number(grams) || 100;
        const cal = Number(calories) || 0;
        const p = Number(protein) || 0;
        const c = Number(carbs) || 0;
        const f = Number(fat) || 0;

        // Calculate per 100g values for the global DB
        const multiplier = 100 / g;

        const newFood: DetectedFood = {
            id: 'manual-' + Date.now(),
            name_tr: name,
            name_en: name,
            estimated_grams: g,
            confidence: 1,
            calories_total: cal,
            protein_total: p,
            carbs_total: c,
            fat_total: f,
            fiber_total: 0,
            calories_per_100g: Math.round(cal * multiplier),
            protein_per_100g: Number((p * multiplier).toFixed(1)),
            carbs_per_100g: Number((c * multiplier).toFixed(1)),
            fat_per_100g: Number((f * multiplier).toFixed(1)),
            fiber_per_100g: 0,
        };

        onAdd(newFood);

        // Reset form
        setName('');
        setGrams('100');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Kendi Yemeğini Ekle</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Yemek Adı <span className="text-red-500">*</span></Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Örn: Ev Yapımı Kek" required className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="grams">Porsiyon (g)</Label>
                            <Input id="grams" type="number" value={grams} onChange={e => setGrams(e.target.value)} placeholder="100" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="calories">Kalori (kcal) <span className="text-red-500">*</span></Label>
                            <Input id="calories" type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="Örn: 250" required className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="protein" className="text-blue-500">Protein (g)</Label>
                            <Input id="protein" type="number" value={protein} onChange={e => setProtein(e.target.value)} placeholder="0" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="carbs" className="text-amber-500">Karb (g)</Label>
                            <Input id="carbs" type="number" value={carbs} onChange={e => setCarbs(e.target.value)} placeholder="0" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fat" className="text-rose-500">Yağ (g)</Label>
                            <Input id="fat" type="number" value={fat} onChange={e => setFat(e.target.value)} placeholder="0" className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 rounded-xl" />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold mt-2">
                        <Plus className="size-5 mr-2" /> Listeye Ekle
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
