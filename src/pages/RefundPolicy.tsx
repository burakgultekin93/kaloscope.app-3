import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { Logo } from '@/components/brand';

export default function RefundPolicy() {
    const navigate = useNavigate();
    const { t, lang } = useTranslation();

    const sections = lang === 'tr' ? [
        {
            title: '1. Dijital İçerik ve Hizmetler',
            content: 'KaloScope tarafından sunulan hizmetler dijital içerik kapsamındadır. 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, elektronik ortamda anında ifa edilen hizmetler ve tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz.'
        },
        {
            title: '2. İade Şartları',
            content: 'Dijital abonelikleriniz başlatıldığı ve içeriklere erişim sağlandığı andan itibaren iade yapılamaz. Kullanıcılar aboneliklerini diledikleri zaman iptal edebilirler. İptal işlemi, o anki faturalandırma döneminin sonunda geçerli olur ve o tarihe kadar hizmetten yararlanmaya devam edebilirsiniz.'
        },
        {
            title: '3. İstisnai Durumlar',
            content: 'Teknik bir hata sonucu mükerrer ödeme yapılması veya hizmetin teknik nedenlerle hiç sunulamaması durumunda, destek ekibimizle (support@kaloscope.app) iletişime geçebilirsiniz. Bu durumlar incelenerek haklı görüldüğü takdirde iade işlemi Paddle üzerinden gerçekleştirilir.'
        }
    ] : [
        {
            title: '1. Digital Content and Services',
            content: 'Services provided by KaloScope are classified as digital content. In accordance with consumer protection laws and regulations regarding distance contracts, the right of withdrawal cannot be exercised for services performed instantly in an electronic environment or for intangible goods delivered instantly to the consumer.'
        },
        {
            title: '2. Refund Conditions',
            content: 'Refunds cannot be issued once digital subscriptions have started and access to content has been provided. Users can cancel their subscriptions at any time. The cancellation will take effect at the end of the current billing period, and you will continue to have access to the service until that time.'
        },
        {
            title: '3. Exceptional Cases',
            content: 'In case of duplicate payments due to a technical error or if the service cannot be provided at all due to technical reasons, you can contact our support team (support@kaloscope.app). These cases will be evaluated, and if found justified, a refund will be processed through Paddle.'
        }
    ];

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 py-12 px-6">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-zinc-500 hover:text-emerald-500 transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
                >
                    <ArrowLeft className="size-4" /> {lang === 'tr' ? 'Geri' : 'Back'}
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <div className="size-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <RefreshCcw className="size-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">{t('refund_policy')}</h1>
                        <p className="text-zinc-500 font-medium text-sm">{t('last_updated')}: {new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}</p>
                    </div>
                </div>

                <div className="space-y-12">
                    <div className="p-8 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem]">
                        <div className="flex items-start gap-4">
                            <ShieldCheck className="size-6 text-emerald-500 mt-1 shrink-0" />
                            <p className="text-sm font-bold leading-relaxed text-emerald-800 dark:text-emerald-200 uppercase tracking-wide">
                                {lang === 'tr'
                                    ? 'Dijital hizmetlerimize erişim sağlandıktan sonra iade yapılmamaktadır. Aboneliğinizi dilediğiniz zaman iptal edebilirsiniz.'
                                    : 'Digital services are non-refundable once accessed. You can cancel your subscription at any time.'}
                            </p>
                        </div>
                    </div>

                    {sections.map((section, idx) => (
                        <section key={idx} className="space-y-4">
                            <h2 className="text-xl font-bold tracking-tight text-zinc-800 dark:text-zinc-200">{section.title}</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                {section.content}
                            </p>
                        </section>
                    ))}

                    <footer className="pt-12 border-t border-zinc-200 dark:border-zinc-800 text-center space-y-4">
                        <Logo size={32} variant="dark" className="mx-auto" />
                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                            <p>Burak Gültekin</p>
                            <p>Harbiye, Şişli, Istanbul, Turkey</p>
                            <p className="text-emerald-500 mt-2">support@kaloscope.app</p>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
