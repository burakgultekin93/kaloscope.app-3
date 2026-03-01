import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { generateDietPlan } from '@/lib/aiAssistant';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function DietPlan() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [request, setRequest] = useState('');
    const [plan, setPlan] = useState('');

    const handleGenerate = async () => {
        if (!user) return;
        if (!request.trim()) {
            toast.error("Lütfen nasıl bir liste veya tavsiye istediğinizi yazın.");
            return;
        }

        setLoading(true);
        try {
            const result = await generateDietPlan(user.id, request);
            setPlan(result);
            toast.success("Diyet listesi başarıyla oluşturuldu!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 pb-24 text-zinc-50 flex flex-col items-center">
            <header className="p-6 border-b border-zinc-900 w-full flex flex-col items-center sticky top-0 bg-zinc-950/80 backdrop-blur-xl z-20">
                <div className="size-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 mb-2 border border-emerald-500/20">
                    <Bot className="size-6" />
                </div>
                <h1 className="font-black text-xl tracking-tight text-white flex items-center gap-2">
                    AI Diyet Asistanı <Sparkles className="size-4 text-emerald-500" />
                </h1>
                <p className="text-zinc-500 text-sm font-medium mt-1">Özel tavsiyeler ve diyet listeleri</p>
            </header>

            <main className="flex-1 w-full max-w-lg px-6 py-6 space-y-6">
                <div className="space-y-3">
                    <label className="text-zinc-400 text-sm font-bold uppercase tracking-widest pl-2">Hedefiniz Nedir?</label>
                    <textarea
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium resize-none"
                        rows={3}
                        placeholder="Örn: 2 haftada kilo vermek için Akdeniz diyetine uygun, sebze ağırlıklı günlük bir beslenme listesi hazırla..."
                        value={request}
                        onChange={(e) => setRequest(e.target.value)}
                    />
                </div>

                <Button
                    variant="emerald"
                    className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center"
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? <Loader2 className="animate-spin mr-2" /> : <Calendar className="mr-2" />}
                    {loading ? 'Yapay Zeka Hazırlıyor...' : 'Diyet Listemi Oluştur'}
                </Button>

                {plan && (
                    <div className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="prose prose-invert prose-emerald prose-sm max-w-none">
                            <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                <Sparkles className="size-4" /> AI Yanıtı
                            </h3>
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {plan}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
