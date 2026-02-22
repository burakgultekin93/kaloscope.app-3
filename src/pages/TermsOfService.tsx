import { motion } from 'framer-motion';
import { ArrowLeft, FileText, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';

export default function TermsOfService() {
    const navigate = useNavigate();
    const { t, lang } = useTranslation();

    const isTR = lang === 'tr';

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col selection:bg-emerald-500/30">
            <header className="p-6 border-b border-zinc-900 sticky top-0 bg-zinc-950/80 backdrop-blur-xl z-20 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-2xl transition-all border border-zinc-800">
                    <ArrowLeft className="size-6 text-zinc-400" />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="font-black text-xs uppercase tracking-widest text-zinc-500">{t('terms_of_service')}</h1>
                </div>
                <div className="w-12"></div>
            </header>

            <main className="flex-1 max-w-3xl mx-auto px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-invert prose-emerald max-w-none"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="size-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 text-emerald-500">
                            <FileText className="size-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black m-0">{t('terms_of_service')}</h2>
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1 m-0">{t('last_updated')}: 22 Şubat 2026</p>
                        </div>
                    </div>

                    <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl mb-12 flex gap-4">
                        <AlertTriangle className="size-6 text-amber-500 shrink-0 mt-1" />
                        <p className="text-amber-200/80 text-sm font-medium m-0">
                            {isTR
                                ? "KaloScope tıbbi bir tavsiye sunmaz. Beslenme kararlarınızdan önce bir uzmana danışın."
                                : "KaloScope does not provide medical advice. Consult a professional before making dietary decisions."}
                        </p>
                    </div>

                    {isTR ? (
                        <div className="space-y-8 text-zinc-300 leading-relaxed font-medium">
                            <section>
                                <h3 className="text-white font-black text-xl mb-4">1. Hizmet Tanımı</h3>
                                <p>KaloScope, yemek fotoğraflarını analiz ederek besin değerlerini tahmin eden yapay zeka destekli bir araçtır.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4">2. Tıbbi Feragatname</h3>
                                <p>Servis tarafından sağlanan veriler sadece bilgilendirme amaçlıdır. %100 doğruluk garanti edilemez. Herhangi bir sağlık sorunu veya diyet değişikliği için doktorunuza danışınız.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4">3. Ödemeler ve Abonelik</h3>
                                <p>Ödeme işlemlerimiz online bayimiz Paddle.com tarafından yürütülür. Paddle, tüm siparişler için "Kayıtlı Satıcı"dır (Merchant of Record).</p>
                                <ul className="list-disc pl-5 space-y-2 mt-4">
                                    <li><strong>Abonelikler:</strong> Aylık veya yıllık olarak önceden faturalandırılır.</li>
                                    <li><strong>İadeler:</strong> Abonelikler için 7 günlük para iade garantisi sunuyoruz.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4">4. Sorumluluk Sınırı</h3>
                                <p>KaloScope, servisin kullanımından kaynaklanabilecek dolaylı veya tesadüfi zararlardan sorumlu tutulamaz.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4">5. İletişim</h3>
                                <p>Destek: <span className="text-emerald-500 font-bold">info@kaloscope.app</span></p>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-8 text-zinc-300 leading-relaxed font-medium">
                            <section>
                                <h3 className="text-white font-black text-xl mb-4">1. Service Description</h3>
                                <p>KaloScope is an AI-powered tool that estimates nutritional values from food images.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4">2. Medical Disclaimer</h3>
                                <p>Data provided is for informational purposes only. accuracy is not guaranteed. Consult a healthcare professional for medical or dietary decisions.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4">3. Payments & Merchant of Record</h3>
                                <p>Our order process is conducted by Paddle.com. Paddle is the Merchant of Record for all our orders.</p>
                                <ul className="list-disc pl-5 space-y-2 mt-4">
                                    <li><strong>Subscriptions:</strong> Billed in advance on a recurring basis.</li>
                                    <li><strong>Refunds:</strong> 7-day money-back guarantee for subscriptions.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4">4. Limitation of Liability</h3>
                                <p>KaloScope shall not be liable for any indirect or incidental damages arising from the use of the service.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4">5. Contact</h3>
                                <p>Support: <span className="text-emerald-500 font-bold">info@kaloscope.app</span></p>
                            </section>
                        </div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
