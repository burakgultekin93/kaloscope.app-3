import { useState, useEffect } from 'react';
import { CheckCircle2, Crown, ArrowLeft, Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/brand';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

export default function Paywall() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [step, setStep] = useState<'plans' | 'checkout'>(location.state?.fromOnboarding ? 'checkout' : 'plans');
    const [loading, setLoading] = useState(false);
    const [gateway] = useState<'paddle'>('paddle');

    useEffect(() => {
        // @ts-ignore
        if (window.Paddle) {
            // @ts-ignore
            window.Paddle.Setup({ vendor: 12345 }); // Replace with actual vendor ID if required for legacy, 
            // but for v3 usually we just use the token in headers or initialization.
        }
    }, []);

    const handleSubscribe = async () => {
        if (!user) {
            toast.error('Lütfen önce giriş yapın');
            return;
        }
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: { gateway, priceId: 'pro_annual' }
            });

            if (error) throw error;

            if (data?.checkout_id) {
                // @ts-ignore
                window.Paddle.Checkout.open({
                    transactionId: data.checkout_id,
                    successCallback: (data: any) => {
                        console.log('Paddle Success:', data);
                        toast.success('Ödeme başarılı! KaloScope Pro aktif edildi.');
                        navigate('/app');
                    },
                    closeCallback: () => {
                        setLoading(false);
                    }
                });
            } else {
                toast.error('Ödeme başlatılamadı: Geçersiz işlem kimliği.');
            }
        } catch (error: any) {
            console.error('Payment Error:', error);
            toast.error(error.message || 'Ödeme başlatılamadı.');
        } finally {
            setLoading(false);
        }
    };

    const renderPlans = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
        >
            <div className="size-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <Crown className="size-10" />
            </div>
            <h1 className="text-3xl font-black mb-4 font-[Plus_Jakarta_Sans] tracking-tight text-white">{t('paywall_title')}</h1>
            <p className="text-zinc-400 text-lg mb-10 max-w-sm font-medium">{t('paywall_desc')}</p>

            <div className="w-full max-w-sm space-y-4 mb-10 text-left">
                {[
                    t('paywall_feat_1'),
                    t('paywall_feat_2'),
                    t('paywall_feat_3'),
                    t('paywall_feat_4'),
                    t('paywall_feat_5')
                ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className="size-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 border border-emerald-500/30">
                            <CheckCircle2 className="size-4 text-emerald-500" />
                        </div>
                        <span className="font-bold text-zinc-200">{feature}</span>
                    </div>
                ))}
            </div>

            <div className="w-full max-w-sm p-1 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-teal-600">
                <div className="bg-zinc-950 rounded-[2.3rem] p-8 relative">
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                        {t('plan_pro_promo')}
                    </div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Logo size={24} variant="dark" />
                            <h3 className="font-black text-xl uppercase tracking-wider text-white">KaloScope Pro</h3>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black text-white">{t('plan_pro_price').split(' / ')[0]}<span className="text-sm text-zinc-500 font-bold">.99</span></div>
                            <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">/ {t('plan_pro_price').split(' / ')[1] === 'ay' ? 'yıl' : 'year'}</div>
                        </div>
                    </div>
                    <p className="text-sm text-zinc-500 mt-4 mb-8 font-medium leading-relaxed">{t('paywall_summary_note')} {t('İstediğin zaman iptal et.')}</p>

                    <Button
                        onClick={() => setStep('checkout')}
                        className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xl font-black shadow-xl shadow-emerald-500/30 transition-all active:scale-95"
                    >
                        {t('plan_pro_cta')}
                    </Button>
                </div>
            </div>

            <button className="mt-10 text-sm font-bold text-zinc-500 hover:text-white transition-colors underline underline-offset-8 uppercase tracking-widest">
                {t('view_all_plans') || 'Tüm planları gör'}
            </button>
        </motion.div>
    );

    const renderCheckout = () => (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-sm"
        >
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black mb-3 tracking-tight">{t('paywall_checkout_title')}</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
                    <ShieldCheck className="size-3" /> {t('paywall_secure_note')}
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-emerald-500/5 border border-emerald-500/10 p-5 rounded-3xl mt-6">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-zinc-400">{t('paywall_summary_pay')}</span>
                        <span className="text-lg font-black text-white">₺399<span className="text-xs text-zinc-500">.99</span></span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-medium">{t('paywall_summary_note')} {t('paddle_billing_note') || 'Ödeme işlemleriniz Paddle.com tarafından güvenli bir şekilde gerçekleştirilir.'}</p>
                </div>

                <Button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xl font-black shadow-xl shadow-emerald-500/30 mt-4 transition-all active:scale-95"
                >
                    {loading ? <Loader2 className="size-6 animate-spin" /> : t('paywall_button_start')}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-6 text-zinc-500">
                    <Lock className="size-3" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">256-bit SSL {t('protection') || 'Koruma'}</span>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col relative overflow-hidden selection:bg-emerald-500/30">
            <div className="absolute top-0 inset-x-0 h-[60vh] bg-gradient-to-b from-emerald-500/20 via-zinc-900 to-zinc-950 pointer-events-none" />

            <header className="p-6 z-10 flex items-center justify-between">
                <button onClick={() => step === 'checkout' ? setStep('plans') : navigate(-1)} className="p-3 bg-zinc-800/50 hover:bg-zinc-800 rounded-2xl transition-all active:scale-90 border border-zinc-700/50 backdrop-blur-sm">
                    <ArrowLeft className="size-6 text-zinc-400" />
                </button>
                <div className="flex flex-col items-center">
                    <Logo size={28} variant="dark" />
                    <span className="font-black text-[10px] tracking-[0.2em] text-zinc-500 mt-1 uppercase text-center">KaloScope PRO</span>
                </div>
                <div className="w-12"></div>
            </header>

            <main className="flex-1 flex flex-col items-center px-6 pt-4 pb-24 z-10">
                <AnimatePresence mode="wait">
                    {step === 'plans' ? renderPlans() : renderCheckout()}
                </AnimatePresence>
            </main>
        </div>
    );
}
