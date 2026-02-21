import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { optimizeImage } from '@/utils/imageOptimizer';
import { analyzeFoodImage } from '@/lib/analyzeFood';
import { getBarcodeProduct } from '@/lib/openFoodFacts';
import { BarcodeScanner } from '@/components/scan/BarcodeScanner';
import { toast } from 'sonner';
import { IconScan, Wordmark } from '@/components/brand';

export default function Scan() {
    const [mode, setMode] = useState<'ai' | 'barcode'>('ai');
    const [analyzing, setAnalyzing] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('Fotoğraf işleniyor...');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleCapture = () => {
        // In a real app we'd trigger a native camera or file input.
        fileInputRef.current?.click();
    };

    const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAnalyzing(true);
        setLoadingMsg('Görüntü optimize ediliyor...');

        try {
            const base64Image = await optimizeImage(file);

            setLoadingMsg('Yapay Zeka yemeğinizi inceliyor...');
            const result = await analyzeFoodImage(base64Image);

            navigate('/app/scan-result', { state: { result } });
        } catch (error: unknown) {
            const err = error as Error;
            console.error('Analiz hatası:', err);
            toast.error(err.message || 'Analiz sırasında bir hata oluştu.');
            setAnalyzing(false);
        }
    };

    const handleBarcodeSuccess = async (decodedText: string) => {
        setAnalyzing(true);
        setLoadingMsg('Barkod sorgulanıyor...');

        try {
            const product = await getBarcodeProduct(decodedText);
            if (!product) {
                toast.error('Bu barkoda ait ürün Veritabanında (OpenFoodFacts) bulunamadı.');
                setAnalyzing(false);
                return;
            }

            const result = { foods: [product] };
            navigate('/app/scan-result', { state: { result } });
        } catch (error) {
            console.error('Barkod hatası:', error);
            toast.error('Barkod sorgulanırken bir hata oluştu');
            setAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-50 relative overflow-hidden">

            <AnimatePresence>
                {analyzing ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center h-full w-full fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md"
                    >
                        <div className="relative mb-8 text-emerald-500">
                            <IconScan size={120} className="animate-pulse" />
                            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full animate-ping opacity-20" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Sistem Devrede</h2>
                        <p className="text-emerald-400 font-medium animate-pulse">{loadingMsg}</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full max-w-md px-6 flex flex-col items-center space-y-6 pt-12"
                    >
                        <Wordmark height={48} variant="dark" className="mb-4" />

                        {/* Tabs */}
                        <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-2xl w-full max-w-[280px] mb-4 shadow-inner">
                            <button
                                onClick={() => setMode('ai')}
                                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${mode === 'ai' ? 'bg-zinc-800 text-emerald-400 shadow-md transform scale-105 border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Yapay Zeka
                            </button>
                            <button
                                onClick={() => setMode('barcode')}
                                className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${mode === 'barcode' ? 'bg-zinc-800 text-emerald-400 shadow-md transform scale-105 border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Barkod
                            </button>
                        </div>

                        {mode === 'ai' ? (
                            <>
                                <div className="text-center">
                                    <h1 className="text-3xl font-bold mb-2">Tabağını Tarat</h1>
                                    <p className="text-zinc-400">Kalorisini öğrenmek için fotoğraf çek veya galeriden seç.</p>
                                </div>

                                <div
                                    className="w-64 h-64 rounded-[3.5rem] border-4 border-emerald-500/20 bg-zinc-900 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-zinc-800 transition-colors group"
                                    onClick={handleCapture}
                                >
                                    <IconScan size={80} color="#10b981" className="group-hover:scale-110 transition-transform duration-500" />
                                    <span className="font-semibold text-zinc-300 text-lg">Fotoğraf Çek</span>
                                </div>

                                <div className="flex items-center gap-4 w-full">
                                    <div className="h-px bg-zinc-800 flex-1" />
                                    <span className="text-zinc-500 text-sm font-medium">veya</span>
                                    <div className="h-px bg-zinc-800 flex-1" />
                                </div>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full h-14 rounded-2xl border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImageIcon className="mr-2 size-5 text-emerald-400" /> Galeriden Seç
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full h-14 rounded-2xl border-emerald-900/50 bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-500"
                                    onClick={() => navigate('/app/scan-result', { state: { result: { foods: [] }, isManual: true } })}
                                >
                                    <Search className="mr-2 size-5" /> Manuel Arama & Ekleme
                                </Button>


                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={onFileSelected}
                                />
                            </>
                        ) : (
                            <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center mb-6">
                                    <h1 className="text-3xl font-bold mb-2">Barkod Tarayıcı</h1>
                                    <p className="text-zinc-400">Paketli ürünlerin barkodunu kameraya gösterin.</p>
                                </div>
                                <BarcodeScanner onScanSuccess={handleBarcodeSuccess} />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
