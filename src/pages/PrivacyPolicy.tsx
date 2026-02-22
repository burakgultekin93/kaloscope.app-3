import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Lock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicy() {
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
                    <h1 className="font-black text-xs uppercase tracking-widest text-zinc-500">{t('privacy_policy')}</h1>
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
                            <ShieldCheck className="size-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black m-0">{t('privacy_policy')}</h2>
                            <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1 m-0">{t('last_updated')}: 22 Şubat 2026</p>
                        </div>
                    </div>

                    {isTR ? (
                        <div className="space-y-8 text-zinc-300 leading-relaxed font-medium">
                            <p>KaloScope ("biz", "bizim" veya "bize") gizliliğinizi korumayı taahhüt eder. Bu Gizlilik Politikası, web sitemizi veya mobil uygulamamızı ziyaret ettiğinizde bilgilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar.</p>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4 flex items-center gap-2">1. Topladığımız Bilgiler</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Kişisel Bilgiler:</strong> Google veya Apple ile giriş yaptığınızda adınız, e-posta adresiniz ve profil resminiz.</li>
                                    <li><strong>Sağlık Bilgileri:</strong> Kişiselleştirilmiş hedefler için sağladığınız boy, kilo, yaş, cinsiyet ve aktivite seviyesi.</li>
                                    <li><strong>Kullanıcı İçeriği:</strong> Analiz için yüklediğiniz yemek fotoğrafları ve günlükleriniz.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4 flex items-center gap-2">2. Bilgilerin Kullanımı</h3>
                                <p>Bilgilerinizi hizmetlerimizi sağlamak, yemek fotoğraflarını yapay zeka ile analiz etmek ve size özel beslenme önerileri sunmak için kullanırız.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4 flex items-center gap-2">3. Üçüncü Taraflar ve Yapay Zeka</h3>
                                <p>Verilerinizi satmıyoruz. Verileriniz sadece aşağıdaki amaçlar için paylaşılabilir:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Ödeme İşlemleri:</strong> Tüm ödemeler Paddle.com üzerinden gerçekleştirilir. Kart bilgilerinizi saklamıyoruz.</li>
                                    <li><strong>Yapay Zeka:</strong> Fotoğraf analizi için OpenAI kullanıyoruz. Görüntülerden kimlik belirleyici meta verileri temizliyoruz.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4 flex items-center gap-2">4. Veri Güvenliği</h3>
                                <p>Verilerinizi korumak için Supabase Row Level Security ve şifreleme gibi teknik önlemler uyguluyoruz. Hesabınızı istediğiniz zaman uygulama ayarlarından silebilirsiniz.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4 flex items-center gap-2">5. İletişim</h3>
                                <p>Sorularınız için: <span className="text-emerald-500 font-bold">info@kaloscope.app</span></p>
                            </section>
                        </div>
                    ) : (
                        <div className="space-y-8 text-zinc-300 leading-relaxed font-medium">
                            <p>KaloScope ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.</p>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4 flex items-center gap-2">1. Information We Collect</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Personal Information:</strong> Name, email, and profile picture from social login.</li>
                                    <li><strong>Health Data:</strong> Height, weight, age, and activity level provided by you.</li>
                                    <li><strong>User Content:</strong> Food photos and meal logs.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4 flex items-center gap-2">2. How We Use It</h3>
                                <p>We use your data to provide our service, analyze food images via AI, and generate personalized nutrition plans.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4 flex items-center gap-2">3. Third Parties</h3>
                                <p>We do not sell your data. We share only with:</p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Payments:</strong> All transactions are handled securely by Paddle.com.</li>
                                    <li><strong>AI Processing:</strong> We use OpenAI to analyze photos. Metadata is stripped before sending.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4 flex items-center gap-2">4. Security</h3>
                                <p>We use Row Level Security and encryption. You can delete your account and data at any time from settings.</p>
                            </section>

                            <section>
                                <h3 className="text-white font-black text-xl mb-4 flex items-center gap-2">5. Contact</h3>
                                <p>Email: <span className="text-emerald-500 font-bold">info@kaloscope.app</span></p>
                            </section>
                        </div>
                    )}

                    <div className="mt-16 p-8 bg-zinc-900/50 rounded-[2rem] border border-zinc-800 text-center">
                        <Lock className="size-10 text-zinc-600 mx-auto mb-4" />
                        <p className="text-zinc-500 text-sm italic">{t('privacy_secure_note') || 'Verileriniz bizimle güvende.'}</p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
