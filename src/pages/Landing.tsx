import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo, IconSlider, IconMic, IconStats, IconStreak, IconPlate } from '@/components/brand';
import { useTranslation } from '@/hooks/useTranslation';

export default function Landing() {
    const { t } = useTranslation();

    const features = [
        { icon: <Logo size={24} variant="light" />, title: t('feat_1_title'), desc: t('feat_1_desc') },
        { icon: <IconSlider size={24} />, title: t('feat_2_title'), desc: t('feat_2_desc') },
        { icon: <IconMic size={24} />, title: t('feat_3_title'), desc: t('feat_3_desc') },
        { icon: <IconPlate size={24} />, title: t('feat_4_title'), desc: t('feat_4_desc') },
        { icon: <IconStats size={24} />, title: t('feat_5_title'), desc: t('feat_5_desc') },
        { icon: <IconStreak size={24} />, title: t('feat_6_title'), desc: t('feat_6_desc') },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 selection:bg-emerald-500/30 overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Logo size={36} variant="light" className="dark:hidden" />
                        <Logo size={36} variant="dark" className="hidden dark:block" />
                        <span className="font-bold text-2xl tracking-tight hidden sm:block">KaloScope</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-semibold hover:text-emerald-500 transition-colors">
                            {t('nav_login')}
                        </Link>
                        <Link to="/register">
                            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-bold px-6">
                                {t('nav_start_free')}
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="px-4 pt-16 pb-20 max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold mb-8 border border-emerald-500/20 shadow-sm"
                    >
                        <Logo size={18} variant="light" className="dark:hidden" />
                        <Logo size={18} variant="dark" className="hidden dark:block" />
                        {t('hero_badge')}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {t('hero_title_1')}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                            {t('hero_title_2')}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12 font-medium"
                    >
                        {t('hero_desc')}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link to="/register" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl shadow-2xl shadow-emerald-500/30 font-bold transition-transform active:scale-95">
                                {t('hero_cta')} <ArrowRight className="ml-2 size-6" />
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-16 flex flex-wrap justify-center gap-x-12 gap-y-6 text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest"
                    >
                        <span className="flex items-center gap-2"><IconPlate size={18} className="text-amber-500" /> {t('trust_foods')}</span>
                        <span className="flex items-center gap-2"><div className="text-amber-500 text-lg">⚡</div> {t('trust_speed')}</span>
                        <span className="flex items-center gap-2"><ShieldCheck className="size-5 text-emerald-500" /> {t('trust_security')}</span>
                    </motion.div>
                </section>

                {/* User Flow Mockup */}
                <section className="max-w-5xl mx-auto px-4 mb-32">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-transparent z-0" />
                        <div className="relative z-10 flex flex-col md:flex-row h-full items-center justify-center gap-12 p-12">
                            <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700 shadow-2xl transform -rotate-12 active:rotate-0 transition-transform cursor-pointer">
                                <Logo size={48} variant="dark" />
                            </div>
                            <ArrowRight className="size-10 text-emerald-500 hidden md:block" />
                            <div className="bg-zinc-800 p-6 rounded-2xl border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-pulse">
                                <div className="text-emerald-400 font-mono text-2xl font-bold tracking-tighter uppercase">🚀 Analyzing...</div>
                            </div>
                            <ArrowRight className="size-10 text-emerald-500 hidden md:block" />
                            <div className="bg-zinc-800 p-8 rounded-2xl border border-zinc-700 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform cursor-pointer">
                                <div className="flex justify-between items-center gap-6">
                                    <span className="font-black text-2xl text-white">Margherita Pizza</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 font-mono font-black text-2xl">720 kcal</span>
                                </div>
                                <div className="mt-6 h-3 bg-zinc-700 rounded-full w-64 overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[65%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Features Bento */}
                <section className="max-w-7xl mx-auto px-4 py-20 pb-32">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{t('feat_title')}</h2>
                        <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl mx-auto">{t('feat_desc')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 rounded-[2rem] overflow-hidden group">
                                    <CardContent className="p-10 flex flex-col items-start text-left h-full">
                                        <div className="size-16 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
                                        <p className="text-lg text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">{feature.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Pricing */}
                <section className="max-w-5xl mx-auto px-4 py-32 bg-emerald-500/5 rounded-[4rem] border border-emerald-500/10 mb-20">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{t('pricing_title')}</h2>
                        <p className="text-xl text-zinc-500 dark:text-zinc-400 font-medium">{t('pricing_desc')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
                        {/* Free */}
                        <Card className="border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-4 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md">
                            <CardContent className="p-10 text-center">
                                <h3 className="text-2xl font-bold mb-4 text-zinc-500 capitalize">{t('plan_free_title')}</h3>
                                <div className="text-5xl font-black mb-10 tracking-tighter">{t('plan_free_price')}</div>
                                <ul className="space-y-6 mb-12 text-left">
                                    <li className="flex items-center gap-4 font-medium"><CheckCircle2 className="size-6 text-emerald-500" /> {t('plan_free_feat_1')}</li>
                                    <li className="flex items-center gap-4 font-medium"><CheckCircle2 className="size-6 text-emerald-500" /> {t('trust_foods')}</li>
                                    <li className="flex items-center gap-4 font-medium"><CheckCircle2 className="size-6 text-emerald-500" /> {t('nav_start_free')}</li>
                                </ul>
                                <Link to="/register" className="w-full">
                                    <Button variant="outline" className="w-full h-16 rounded-2xl text-lg font-bold border-2 transition-all active:scale-95">
                                        {t('plan_free_cta')}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Pro */}
                        <Card className="border-4 border-emerald-500 shadow-[0_32px_64px_-16px_rgba(16,185,129,0.3)] relative overflow-hidden rounded-[3rem] bg-zinc-900 text-white group">
                            <div className="absolute top-0 right-10 bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-b-xl uppercase tracking-widest">
                                POPULAR
                            </div>
                            <CardContent className="p-10 text-center">
                                <h3 className="text-2xl font-bold mb-4 text-emerald-400 uppercase tracking-widest">Pro</h3>
                                <div className="text-5xl font-black mb-4 tracking-tighter">{t('plan_pro_price')}</div>
                                <p className="text-sm font-bold text-emerald-500/80 mb-10 bg-emerald-500/10 inline-block px-4 py-1 rounded-full uppercase tracking-widest">{t('plan_pro_promo')}</p>
                                <ul className="space-y-6 mb-12 text-left">
                                    <li className="flex items-center gap-4 font-medium"><CheckCircle2 className="size-6 text-emerald-500" /> {t('plan_pro_feat_1')}</li>
                                    <li className="flex items-center gap-4 font-medium"><CheckCircle2 className="size-6 text-emerald-500" /> {t('plan_pro_feat_2')}</li>
                                    <li className="flex items-center gap-4 font-medium"><CheckCircle2 className="size-6 text-emerald-500" /> {t('plan_pro_feat_3')}</li>
                                    <li className="flex items-center gap-4 font-medium"><CheckCircle2 className="size-6 text-emerald-500" /> {t('nav_start_free')}</li>
                                </ul>
                                <Link to="/register?plan=pro" className="w-full">
                                    <Button className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-white text-xl font-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95">
                                        {t('plan_pro_cta')}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-24 text-center">
                <div className="flex flex-col items-center gap-6 mb-12">
                    <div className="flex items-center justify-center gap-3">
                        <Logo size={48} variant="light" className="dark:hidden" />
                        <Logo size={48} variant="dark" className="hidden dark:block" />
                        <span className="font-black text-3xl tracking-tighter text-zinc-900 dark:text-white">KaloScope</span>
                    </div>
                    <p className="max-w-md mx-auto text-xl font-medium text-zinc-500">
                        {t('footer_desc')}
                    </p>
                </div>
                <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm font-bold text-zinc-500 uppercase tracking-widest">
                    <Link to="/privacy" className="hover:text-emerald-500 transition-colors">{t('privacy_policy')}</Link>
                    <Link to="/terms" className="hover:text-emerald-500 transition-colors">{t('terms_of_service')}</Link>
                    <a href="mailto:info@kaloscope.app" className="hover:text-emerald-500 transition-colors">{t('contact_support') || 'İletişim'}</a>
                </div>
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} KaloScope. {t('footer_rights')}
                </div>
            </footer>
        </div>
    );
}
