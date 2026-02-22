import { useState } from 'react';

type Language = 'tr' | 'en';

interface Translations {
    [key: string]: {
        tr: string;
        en: string;
    };
}

const translations: Translations = {
    // Navbar
    'nav_login': { tr: 'Giriş', en: 'Login' },
    'nav_start_free': { tr: 'Ücretsiz Başla', en: 'Start Free' },
    'dashboard_title': { tr: 'Panel', en: 'Dashboard' },

    // Hero
    'hero_title_1': { tr: 'Fotoğrafını Çek.', en: 'Capture Photo.' },
    'hero_title_2': { tr: 'Kalorisini Bil.', en: 'Know the Calories.' },
    'hero_badge': { tr: 'KaloScope v1.0 Yayında', en: 'KaloScope v1.0 Is Live' },
    'hero_desc': {
        tr: 'Yapay zeka ile yediklerini saniyeler içinde analiz et. Dünya mutfağını anlayan asistanınızla can sıkıcı diyet listelerine son.',
        en: 'Analyze what you eat in seconds with AI. End boring diet lists with your assistant who understands world cuisine.'
    },
    'hero_cta': { tr: 'Ücretsiz Başla', en: 'Start for Free' },

    // Trust Badges
    'trust_foods': { tr: '500+ Dünya ve Türk Mutfağı', en: '500+ World & Local Cuisines' },
    'trust_speed': { tr: '3 Saniye Analiz Hızı', en: '3 Second Analysis Speed' },
    'trust_security': { tr: 'Gizli Ücret Yok', en: 'No Hidden Fees' },

    // Features
    'feat_title': { tr: 'Neden KaloScope?', en: 'Why KaloScope?' },
    'feat_desc': { tr: 'Piyasadaki en yetenekli yemek analiz ve kalori takip aracı.', en: 'The most capable food analysis and calorie tracking tool on the market.' },

    'feat_1_title': { tr: 'Fotoğraf Çek, Sonucu Gör', en: 'Snap a Photo, See Results' },
    'feat_1_desc': { tr: 'Sadece tabağının fotoğrafını çek, AI kalorisini çıkarsın.', en: 'Just take a photo of your plate, let AI calculate the calories.' },

    'feat_2_title': { tr: 'Anında Düzelt', en: 'Correct Instantly' },
    'feat_2_desc': { tr: 'Porsiyon yanlış mı? Magic slider ile saniyeler içinde düzelt.', en: 'Portion wrong? Fix it in seconds with the magic slider.' },

    'feat_3_title': { tr: 'Sesle Söyle', en: 'Voice Log' },
    'feat_3_desc': { tr: "Fotoğraf çekemiyorsan 'Yarım lahmacun yedim' demen yeterli.", en: "Can't take a photo? Just say 'I ate half a pizza'." },

    'feat_4_title': { tr: 'Dünya Mutfağı Uzmanı', en: 'World Cuisine Expert' },
    'feat_4_desc': { tr: 'Global mutfaklardan yöresel tatlara, binlerce yemeği tanır.', en: 'Recognizes thousands of dishes, from global cuisines to local flavors.' },

    'feat_5_title': { tr: 'Trendlerini Takip Et', en: 'Track Your Trends' },
    'feat_5_desc': { tr: 'Kilo ve kalori hedeflerini haftalık raporlarla gör.', en: 'See weight and calorie goals with weekly reports.' },

    'feat_6_title': { tr: 'Hedefine Ulaş', en: 'Reach Your Goal' },
    'feat_6_desc': { tr: 'Oyunlaştırma ve seri sistemiyle motivasyonunu yüksek tut.', en: 'Keep motivation high with gamification and streak systems.' },

    // Pricing
    'pricing_title': { tr: 'Şeffaf Fiyatlandırma', en: 'Transparent Pricing' },
    'pricing_desc': { tr: 'Sürpriz yok, gizli ücret yok. Kullanıcı dostu planlar.', en: 'No surprises, no hidden fees. User-friendly plans.' },

    'plan_free_title': { tr: 'Başlangıç', en: 'Starter' },
    'plan_free_price': { tr: 'Ücretsiz', en: 'Free' },
    'plan_free_feat_1': { tr: 'Günde 3 AI Tarama', en: '3 AI Scans per day' },
    'plan_free_cta': { tr: 'Hemen Başla', en: 'Get Started' },

    'plan_pro_price': { tr: '₺149.99 / ay', en: '$14.99 / mo' },
    'plan_pro_promo': { tr: 'Yıllık planda %50 indirimli', en: '50% off with annual plan' },
    'plan_pro_feat_1': { tr: 'Sınırsız AI Tarama', en: 'Unlimited AI Scans' },
    'plan_pro_feat_2': { tr: 'Gelişmiş Makro Analizi', en: 'Advanced Macro Analysis' },
    'plan_pro_feat_3': { tr: 'AI Diyet Asistanı', en: 'AI Diet Assistant' },
    'plan_pro_cta': { tr: '7 Gün Ücretsiz Dene', en: 'Start 7-Day Free Trial' },

    // Paywall Detailed
    'paywall_title': { tr: 'KaloScope Limitlerini Kaldır', en: 'Remove KaloScope Limits' },
    'paywall_desc': { tr: 'Daha hızlı hedefe ulaşmak için premium özellikleri kilidini aç.', en: 'Unlock premium features to reach your goal faster.' },
    'paywall_feat_1': { tr: 'Sınırsız günlük AI fotoğraf taraması', en: 'Unlimited daily AI photo scans' },
    'paywall_feat_2': { tr: 'Gelişmiş makro analizi ve detaylı grafikler', en: 'Advanced macro analysis and detailed charts' },
    'paywall_feat_3': { tr: 'Sese dayalı yemek ekleme özelliği', en: 'Voice-based food logging' },
    'paywall_feat_4': { tr: 'Diyetisyen formatında PDF raporları', en: 'Dietitian-format PDF reports' },
    'paywall_feat_5': { tr: 'Öncelikli müşteri desteği', en: 'Priority customer support' },
    'paywall_checkout_title': { tr: 'Ödeme Bilgileri', en: 'Payment Information' },
    'paywall_secure_note': { tr: '256-bit Güvenli Ödeme', en: '256-bit Secure Payment' },
    'paywall_card_name': { tr: 'Kart Üzerindeki İsim', en: 'Name on Card' },
    'paywall_card_number': { tr: 'Kart Numarası', en: 'Card Number' },
    'paywall_expiry': { tr: 'Son Kullanma', en: 'Expiry' },
    'paywall_cvv': { tr: 'CVV', en: 'CVV' },
    'paywall_summary_pay': { tr: 'Bugün Ödenecek:', en: 'Due Today:' },
    'paywall_summary_note': { tr: 'Bir sonraki ay otomatik yenilenir. İstediğin an iptal et.', en: 'Auto-renews next month. Cancel anytime.' },
    'paywall_button_start': { tr: 'Üyeliği Başlat', en: 'Start Subscription' },
    'paywall_gateway_select': { tr: 'Ödeme Yöntemi Seçin', en: 'Select Payment Method' },
    'view_all_plans': { tr: 'Tüm planları gör', en: 'View all plans' },

    // Usage Limits
    'limit_reached_pro': { tr: 'Günlük 25 tarama limitine ulaştınız. Yarın tekrar bekleriz!', en: 'Daily 25 scan limit reached. See you tomorrow!' },
    'limit_reached_free': { tr: 'Günlük 3 tarama limitine ulaştınız. Sınırsız analiz için Pro\'ya geçin!', en: 'Daily 3 scan limit reached. Upgrade to Pro for unlimited analysis!' },

    // Diet Status
    'diet_status_ketogenic': { tr: 'Ketojenik Mod Aktif', en: 'Keto Mode Active' },
    'diet_status_diabetic': { tr: 'Diyabetik Mod Aktif', en: 'Diabetic Mode Active' },
    'diet_status_high_protein': { tr: 'Yüksek Protein Modu', en: 'High Protein Mode' },
    'diet_status_mediterranean': { tr: 'Akdeniz Diyeti Modu', en: 'Mediterranean Mode' },
    'diet_status_vegan': { tr: 'Vegan Mod Aktif', en: 'Vegan Mode Active' },
    'diet_status_vegetarian': { tr: 'Vejetaryen Mod Aktif', en: 'Vegetarian Mode Active' },
    'diet_status_standard': { tr: 'Standart Mod', en: 'Standard Mode' },

    // AI Diet AI
    'ai_diet_warning_sugar': { tr: 'Şeker Uyarısı: Günlük limitinizi aşmak üzeresiniz. Diyabetik kontrolünüzü aksatmayın.', en: 'Sugar Warning: You are about to exceed your daily limit. Watch your diabetic control.' },
    'ai_diet_warning_keto': { tr: 'Keto Uyarısı: Karbonhidrat alımınız yüksek. Ketozis durumundan çıkabilirsiniz.', en: 'Keto Warning: Your carb intake is high. You might fall out of ketosis.' },
    'ai_diet_tip_protein': { tr: 'Kas Gelişimi: Hedefine ulaşmak için bugün biraz daha protein alabilirsin.', en: 'Muscle Gain: You can have some more protein to reach your goal today.' },
    'ai_diet_tip_standard': { tr: 'Dengeli Beslenme: Bugün harika gidiyorsun! Su içmeyi unutma.', en: 'Balanced Nutrition: You are doing great today! Don\'t forget to drink water.' },

    // Health Logging
    'health_title': { tr: 'Sağlık Takibi', en: 'Health Tracking' },
    'health_log_insulin': { tr: 'İnsülin (Ünite)', en: 'Insulin (Units)' },
    'health_log_sugar': { tr: 'Şeker (mg/dL)', en: 'Sugar (mg/dL)' },
    'health_log_ketones': { tr: 'Keton (mmol/L)', en: 'Ketones (mmol/L)' },
    'health_log_medication': { tr: 'İlaç (Doz)', en: 'Medication (Dose)' },
    'health_add_button': { tr: 'Kaydet', en: 'Save' },
    'health_notes_placeholder': { tr: 'Not ekle...', en: 'Add notes...' },
    'health_summary_insulin': { tr: 'İnsülin Kaydı', en: 'Insulin Log' },
    'health_summary_sugar': { tr: 'Şeker Kaydı', en: 'Sugar Log' },

    // Auth Refinement
    'auth_verify_email_title': { tr: 'E-postanızı Onaylayın', en: 'Verify Your Email' },
    'auth_verify_email_desc': { tr: 'Kaydınızı tamamlamak için e-posta adresinize bir onay linki gönderdik. Lütfen gelen kutunuzu (ve gereksiz kutusunu) kontrol edin.', en: 'We\'ve sent a confirmation link to your email address. Please check your inbox (and spam folder) to complete your registration.' },
    'auth_unconfirmed_error': { tr: 'Lütfen giriş yapmadan önce e-posta adresinizi onaylayın. Onay linki kayıt sırasında gönderilmiştir.', en: 'Please confirm your email address before logging in. The confirmation link was sent during registration.' },
    'auth_callback_loading': { tr: 'Hesabınız onaylanıyor...', en: 'Verifying your account...' },

    // Footer
    'footer_desc': { tr: 'Dünya mutfağını anlayan akıllı beslenme asistanınız.', en: 'Your smart nutrition assistant who understands world cuisine.' },
    'footer_rights': { tr: 'Tüm hakları saklıdır.', en: 'All rights reserved.' },

    // Profile & Settings
    'profile_title': { tr: 'Profilim', en: 'Profile' },
    'profile_user': { tr: 'Kullanıcı', en: 'User' },
    'profile_pro_cta': { tr: 'Pro\'ya Geçiş Yap', en: 'Upgrade to Pro' },
    'profile_pro_desc': { tr: 'Sınırsız tarama ve gelişmiş raporlar', en: 'Unlimited scans and advanced reports' },
    'profile_targets_body': { tr: 'Hedeflerim & Vücut Ölçülerim', en: 'My Goals & Body Specs' },
    'profile_diet_pref': { tr: 'Diyet Tercihi', en: 'Diet Preference' },
    'profile_privacy': { tr: 'Hesap Gizliliği', en: 'Account Privacy' },
    'profile_dark_mode': { tr: 'Karanlık Mod', en: 'Dark Mode' },
    'profile_logout': { tr: 'Çıkış Yap', en: 'Log Out' },
    'diet_label_standard': { tr: 'Standart', en: 'Standard' },
    'diet_label_ketogenic': { tr: 'Ketojenik (Yüksek Yağ)', en: 'Ketogenic (High Fat)' },
    'diet_label_diabetic': { tr: 'Diyabetik (Dengeli)', en: 'Diabetic (Balanced)' },
    'diet_label_high_protein': { tr: 'Yüksek Protein', en: 'High Protein' },
    'diet_label_vegan': { tr: 'Vegan', en: 'Vegan' },
    'diet_label_vegetarian': { tr: 'Vejetaryen', en: 'Vegetarian' },
    'diet_label_mediterranean': { tr: 'Akdeniz (Pro)', en: 'Mediterranean (Pro)' },

    // Goals & Body Specs
    'goals_age_label': { tr: 'Yaş', en: 'Age' },
    'goals_weight_label': { tr: 'Mevcut Kilo (kg)', en: 'Current Weight (kg)' },
    'goals_height_label': { tr: 'Boy (cm)', en: 'Height (cm)' },
    'goals_activity_label': { tr: 'Aktivite Seviyesi', en: 'Activity Level' },
    'goals_primary_goal': { tr: 'Ana Hedef', en: 'Primary Goal' },
    'goals_weekly_target': { tr: 'Haftalık Hedef (kg)', en: 'Weekly Target (kg)' },
    'goals_save_button': { tr: 'Değişiklikleri Kaydet', en: 'Save Changes' },
    'goals_updating': { tr: 'Güncelleniyor...', en: 'Updating...' },
    'goals_success_toast': { tr: 'Hedeflerin başarıyla güncellendi!', en: 'Goals updated successfully!' },
    'goals_calc_result': { tr: 'Yeni Günlük Hedefin:', en: 'Your New Daily Goal:' },

    'activity_sedentary_label': { tr: 'Hareketsiz', en: 'Sedentary' },
    'activity_light_label': { tr: 'Hafif Aktif', en: 'Lightly Active' },
    'activity_moderate_label': { tr: 'Orta Aktif', en: 'Moderately Active' },
    'activity_active_label': { tr: 'Çok Aktif', en: 'Very Active' },
    'activity_very_active_label': { tr: 'Ekstra Aktif', en: 'Extra Active' },

    'goal_type_lose': { tr: 'Kilo Ver', en: 'Lose Weight' },
    'goal_type_maintain': { tr: 'Kilomu Koru', en: 'Maintain Weight' },
    'goal_type_gain': { tr: 'Kilo Al', en: 'Gain Weight' },

    // Diet List
    'diet_list_title': { tr: 'Günün Diyet Listesi', en: 'Daily Diet Plan' },
    'diet_list_desc': { tr: 'Hedeflerine göre AI tarafından önerilen öğünler.', en: 'AI suggested meals based on your goals.' },
    'diet_list_morning': { tr: 'Kahvaltı', en: 'Breakfast' },
    'diet_list_afternoon': { tr: 'Öğle Yemeği', en: 'Lunch' },
    'diet_list_evening': { tr: 'Akşam Yemeği', en: 'Dinner' },
    'diet_list_snack': { tr: 'Atıştırmalık', en: 'Snack' },
    'diet_list_regenerate': { tr: 'Listeyi Yenile', en: 'Regenerate List' },
    'diet_list_smart_tip': { tr: 'Akıllı İpucu:', en: 'Smart Tip:' },
    'diet_list_loading': { tr: 'Size özel diyet listesi hazırlanıyor...', en: 'Preparing your custom diet plan...' },

    // Gamification
    'achievements_title': { tr: 'Başarılar & Rozetler', en: 'Achievements & Badges' },
    'streak_label': { tr: 'Günlük Seri', en: 'Daily Streak' },
    'streak_unit': { tr: 'Gün', en: 'Day' },
    'xp_label': { tr: 'Deneyim Puanı', en: 'Experience Points' },
    'level_label': { tr: 'Seviye', en: 'Level' },
    'next_level_label': { tr: 'Sonraki Seviye:', en: 'Next Level:' },
    'max_level_label': { tr: 'Maksimum Seviye', en: 'Maximum Level' },
    'how_to_earn_badges': { tr: 'Nasıl Rozet Kazanırım?', en: 'How to Earn Badges?' },
    'badges_info_desc': { tr: 'Uygulamayı kullandıkça, yemeklerini tarattıkça ve diyetine sadık kaldıkça otomatik olarak rozet kazanırsın. Her rozet sana ekstra XP kazandırır!', en: 'Earn badges automatically as you use the app, scan meals, and stick to your diet. Each badge grants you extra XP!' },

    // Diet System Pages
    'diet_plans_title': { tr: 'Diyet Planları', en: 'Diet Plans' },
    'diet_plans_search_placeholder': { tr: 'Diyet ara...', en: 'Search diet...' },
    'diet_plans_not_found': { tr: 'Arama kriterlerine uygun diyet bulunamadı.', en: 'No diets found matching your search.' },
    'diet_start_plan': { tr: 'Bu Plana Başla', en: 'Start This Plan' },
    'diet_current_plan': { tr: 'Şu Anki Planınız', en: 'Your Current Plan' },
    'diet_med_plan_warning': { tr: 'Medikal Plan', en: 'Medical Plan' },
    'diet_difficulty_easy': { tr: 'Kolay', en: 'Easy' },
    'diet_difficulty_moderate': { tr: 'Orta', en: 'Moderate' },
    'diet_difficulty_hard': { tr: 'Zor', en: 'Hard' },
    'diet_benefits': { tr: 'Faydaları', en: 'Benefits' },
    'diet_recommended_foods': { tr: 'Önerilen Gıdalar', en: 'Recommended Foods' },
    'diet_avoid_foods': { tr: 'Kaçınılması Gerekenler', en: 'Foods to Avoid' },
    'diet_important_warnings': { tr: 'Önemli Uyarılar', en: 'Important Warnings' },
    'diet_macro_target': { tr: 'Makro Hedefi', en: 'Macro Target' },
    'diet_macro_pct': { tr: 'Kalori Yüzdesi', en: 'Calorie Percentage' },

    // Dashboard Integration
    'ai_coach_analysis': { tr: 'AI Koç Analizi', en: 'AI Coach Analysis' },
    'ai_coach_suggestions': { tr: 'Öneriler', en: 'Suggestions' },
    'diet_weekly_compliance': { tr: 'Haftalık Uyum', en: 'Weekly Compliance' },
    'streak_consecutive': { tr: 'Seri', en: 'Streak' },
    'last_earned_achievements': { tr: 'Son Başarılar', en: 'Recent Achievements' },
    'view_all_badges': { tr: 'Tüm Rozetler', en: 'View All Badges' },

    // Legal & Support
    'privacy_policy': { tr: 'Gizlilik Politikası', en: 'Privacy Policy' },
    'terms_of_service': { tr: 'Kullanım Koşulları', en: 'Terms of Service' },
    'last_updated': { tr: 'Son Güncelleme', en: 'Last Updated' },
    'paddle_billing_note': { tr: 'Ödeme işlemleriniz Paddle.com tarafından güvenli bir şekilde gerçekleştirilir.', en: 'Your payment is processed securely by Paddle.com.' },
    'protection': { tr: 'Koruma', en: 'Protection' },
    'contact_support': { tr: 'Destekle İletişime Geç', en: 'Contact Support' },
};

export const useTranslation = () => {
    const getInitialLang = (): Language => {
        if (typeof window !== 'undefined') {
            const browserLang = navigator.language.split('-')[0];
            return browserLang === 'en' ? 'en' : 'tr';
        }
        return 'tr';
    };

    const [lang, setLang] = useState<Language>(getInitialLang);

    const t = (key: string) => {
        return translations[key]?.[lang] || key;
    };

    return { t, lang, setLang };
};
