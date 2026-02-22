-- ═══════════════════════════════
-- 8 DİYET PLANI — SEED DATA
-- ═══════════════════════════════
INSERT INTO public.diet_plans (slug, name_tr, name_en, description_tr, icon, color, difficulty, is_medical,
  protein_pct, carb_pct, fat_pct, max_carbs_grams, min_protein_grams, max_sugar_grams, min_fiber_grams,
  benefits_tr, avoid_foods_tr, recommended_foods_tr, warnings_tr)
VALUES
('mediterranean', 'Akdeniz Diyeti', 'Mediterranean Diet',
 'Zeytinyağı, balık, sebze ve tam tahıl temelli, kalp sağlığını koruyan beslenme biçimi. Dünyanın en çok araştırılmış ve en sürdürülebilir diyetidir.',
 '🫒', '#059669', 'easy', false,
 20, 50, 30, NULL, NULL, NULL, 30,
 ARRAY['Kalp hastalığı riskini %30 azaltır','Tip 2 diyabet riskini düşürür','Beyin sağlığını korur','Uzun vadede sürdürülebilir','İltihap azaltıcı'],
 ARRAY['İşlenmiş gıdalar','Beyaz un ürünleri','Rafine şeker','Kırmızı et (haftada 1-2 kez sınırlı)','Trans yağlar','Hazır soslar'],
 ARRAY['Zeytinyağı (ana yağ kaynağı)','Balık (haftada 2-3 kez)','Taze sebzeler','Baklagiller','Tam tahıllar','Ceviz, badem','Mevsim meyveleri','Az miktarda şarap (opsiyonel)'],
 ARRAY['Genel sağlıklı beslenme rehberidir','Herkes için uygundur']),

('keto', 'Ketojenik Diyet', 'Ketogenic Diet',
 'Çok düşük karbonhidrat, yüksek yağ diyeti. Vücudu yağ yakma moduna (ketoz) geçirir. Hızlı kilo kaybı sağlar ancak sürdürülebilirliği tartışmalıdır.',
 '🥑', '#7c3aed', 'hard', false,
 25, 5, 70, 50, 80, 20, NULL,
 ARRAY['Hızlı kilo kaybı','İnsülin direnci iyileşmesi','Açlık hissini azaltır','Trigliserit düşüşü','Odaklanma artışı'],
 ARRAY['Ekmek, makarna, pirinç','Patates','Meyvelerin çoğu','Şekerli tüm gıdalar','Baklagiller','Tahıllar','Bira, tatlı şarap'],
 ARRAY['Avokado','Tereyağı, ghee','Yumurta','Peynir','Yağlı balık (somon)','Fındık, ceviz','Zeytinyağı, hindistan cevizi yağı','Yeşil yapraklı sebzeler','Et, tavuk'],
 ARRAY['Doktorunuza danışmadan başlamayın','Böbrek hastalarına uygun değil','İlk hafta gribal belirtiler olabilir (keto flu)','İnsülin kullananlar mutlaka doktor kontrolünde başlamalı']),

('lowcarb', 'Düşük Karbonhidrat', 'Low Carbohydrate',
 'Keto kadar aşırı olmayan, karbonhidratı 100-130g arasında tutan dengeli bir yaklaşım. Sürdürülebilir ve etkili.',
 '🥩', '#dc2626', 'moderate', false,
 30, 25, 45, 130, 90, 40, 20,
 ARRAY['Kilo kontrolü','Kan şekeri dengeleme','Keto''dan daha sürdürülebilir','Enerji seviyesi stabil','Aşırı kısıtlama yok'],
 ARRAY['Beyaz ekmek','Şekerli içecekler','Pirinç (büyük porsiyon)','Makarna (büyük porsiyon)','Hazır atıştırmalıklar','Meyve suları'],
 ARRAY['Protein kaynakları (et, tavuk, balık)','Yumurta','Yeşil sebzeler','Avokado','Peynir','Tam tahıl (az miktar)','Yoğurt','Kuruyemiş'],
 ARRAY['Genel sağlıklı yaklaşım','Aktivite seviyenize göre karb ayarlayın']),

('highprotein', 'Yüksek Protein', 'High Protein',
 'Kas gelişimi ve koruma odaklı. Sporcular ve aktif bireyler için ideal. Tokluk hissi yüksek.',
 '💪', '#2563eb', 'moderate', false,
 35, 40, 25, NULL, 120, NULL, 25,
 ARRAY['Kas gelişimi ve koruma','Yüksek tokluk hissi','Metabolizma hızlandırma','Kilo verirken kas kaybını önler','Kemik sağlığı'],
 ARRAY['Şekerli gıdalar','İşlenmiş karbonhidratlar','Fazla yağlı yiyecekler','Hazır gıdalar'],
 ARRAY['Tavuk göğsü','Yumurta beyazı','Lor peyniri','Hindi','Ton balığı','Yunan yoğurdu','Mercimek','Kinoa','Protein tozu (opsiyonel)'],
 ARRAY['Böbrek hastaları dikkatli olmalı','Günde 2g/kg üzeri protein önerilmez']),

('intermittent', 'Aralıklı Oruç 16:8', 'Intermittent Fasting 16:8',
 '16 saat oruç, 8 saat yeme penceresi. Kalori kısıtlaması olmadan yağ yakımını destekler. Türk kültürüne yakın (ramazan benzeri).',
 '⏰', '#ea580c', 'moderate', false,
 25, 45, 30, NULL, NULL, NULL, 25,
 ARRAY['Yağ yakımı artışı','İnsülin hassasiyeti iyileşme','Hücresel onarım (otofaji)','Basit — kalori sayma şart değil','Esnek yeme penceresi'],
 ARRAY['Yeme penceresi dışında kalorili gıdalar','Aşırı porsiyon (pencerede)','Şekerli atıştırmalıklar','Gece geç yeme'],
 ARRAY['Yeme penceresi: 12:00-20:00 (önerilen)','Su, çay, kahve (oruç saatlerinde)','Dengeli öğünler','Bol protein (tokluk için)','Sebze ve lif ağırlıklı'],
 ARRAY['Diyabet hastaları doktora danışmalı','Hamile ve emziren kadınlara uygun değil','Yeme bozukluğu geçmişi olanlar dikkatli olmalı','İlk hafta baş ağrısı olabilir']),

('diabetic_t2', 'Diyabetik Diyet (Tip 2)', 'Type 2 Diabetic Diet',
 'Kan şekerini dengede tutan, düşük glisemik indeksli beslenme planı. İnsülin direncini azaltmaya odaklanır.',
 '🩺', '#0891b2', 'moderate', true,
 25, 45, 30, 130, 80, 25, 30,
 ARRAY['Kan şekeri stabilizasyonu','İnsülin direnci azalması','HbA1c iyileşmesi','Kilo kontrolü','Kardiyovasküler koruma'],
 ARRAY['Beyaz şeker ve şekerli gıdalar','Beyaz ekmek, beyaz pirinç','Meyve suları','Patates kızartması','Hazır gıdalar','Bal, reçel (büyük miktar)','Gazlı içecekler'],
 ARRAY['Düşük GI meyve (elma, armut, çilek)','Tam tahıllar (bulgur, yulaf)','Yeşil sebzeler','Baklagiller','Balık','Zeytinyağı','Ceviz','Tarçın (kan şekeri dengeleyici)','Bol lif'],
 ARRAY['MUTLAKA doktorunuza danışın','İnsülin dozunuz ayarlanmalı','Kan şekerinizi düzenli ölçün','Bu bir tıbbi tedavi yerine geçmez','İlaçlarınızı bırakmayın']),

('insulin_resistance', 'İnsülin Direnci Diyeti', 'Insulin Resistance Diet',
 'Pre-diyabet ve insülin direnci olan kişiler için özel plan. Kan şekeri dengesini korumaya ve diyabete geçişi önlemeye odaklanır.',
 '🛡️', '#0d9488', 'moderate', true,
 25, 40, 35, 150, 80, 30, 30,
 ARRAY['Diyabet geçişini önleme','İnsülin hassasiyeti artışı','Abdominal yağ azalması','Enerji dengeleme','PCOS semptomlarını hafifletme'],
 ARRAY['Rafine karbonhidratlar','Beyaz un','Şekerli içecekler','Yüksek GI meyveler (karpuz, kavun fazla)','Trans yağlar','İşlenmiş etler'],
 ARRAY['Avokado','Balık (omega-3)','Yeşil yapraklı sebzeler','Kinoa, bulgur','Yoğurt','Mercimek','Bitter çikolata (%70+)','Zerdeçal','Elma sirkesi','Chia tohumu'],
 ARRAY['Doktorunuza danışın','Düzenli kan şekeri takibi yapın','Bu plan tıbbi tedavinin yerini almaz']),

('custom', 'Özel Diyet', 'Custom Diet',
 'Kendi makro hedeflerini belirle. Tam esneklik — protein, karb ve yağ yüzdelerini kendin ayarla.',
 '✏️', '#6366f1', 'easy', false,
 30, 40, 30, NULL, NULL, NULL, NULL,
 ARRAY['Tam kişiselleştirme','Esnek hedefler','Herhangi bir beslenme tarzına uyarlanabilir'],
 ARRAY[]::TEXT[],
 ARRAY[]::TEXT[],
 ARRAY['Makro dengelerinizi diyetisyeninizle belirleyin'])

ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════
-- BAŞARI ROZETLERİ SEED DATA
-- ═══════════════════════════════
INSERT INTO public.achievements (slug, name_tr, description_tr, icon, category, condition_type, condition_value, xp_reward, sort_order) VALUES
('streak_3',      '3 Gün Streak',         '3 gün üst üste yemek logladın!',                    '🔥', 'streak',    'streak_days',    3,    10,  1),
('streak_7',      'Hafta Savaşçısı',      '7 gün kesintisiz takip!',                            '⚡', 'streak',    'streak_days',    7,    25,  2),
('streak_14',     'İki Hafta Şampiyonu',   '14 gün boyunca her gün logladın.',                   '💪', 'streak',    'streak_days',    14,   50,  3),
('streak_30',     'Aylık Kahraman',        '30 gün kesintisiz! Bu azim harika.',                  '🏆', 'streak',    'streak_days',    30,   100, 4),
('streak_60',     'Demir İrade',           '60 gün! Artık bu bir alışkanlık.',                    '🥇', 'streak',    'streak_days',    60,   200, 5),
('streak_100',    'Yüzüncü Gün',          '100 gün streak — efsane!',                            '👑', 'streak',    'streak_days',    100,  500, 6),
('streak_365',    'Bir Yıl',              '365 gün! Hayat tarzın bu artık.',                     '🌟', 'streak',    'streak_days',    365,  1000, 7),

('first_scan',    'İlk Tarama',           'İlk yemek fotoğrafını tarattın!',                    '📸', 'scan',      'total_scans',    1,    10,  10),
('scan_10',       '10. Tarama',           'AI ile 10 yemek tarattın.',                           '🤖', 'scan',      'total_scans',    10,   25,  11),
('scan_50',       'Tarama Ustası',        '50 yemek tarattın!',                                  '🔬', 'scan',      'total_scans',    50,   50,  12),
('scan_100',      'AI''nın En İyisi',     '100 tarama! AI seni çok iyi tanıyor.',                '🧠', 'scan',      'total_scans',    100,  100, 13),
('scan_500',      'Beş Yüzüncü',         '500 tarama — profesyonel seviye!',                    '💎', 'scan',      'total_scans',    500,  250, 14),

('weight_1',      'İlk Kilo',            'İlk 1 kg''nı verdin!',                               '⚖️', 'weight',    'weight_lost_kg', 1,    25,  20),
('weight_3',      '3 Kilo Gitti',         '3 kg eksildi, harika gidiyorsun!',                    '🎯', 'weight',    'weight_lost_kg', 3,    50,  21),
('weight_5',      '5 Kilo Kulübü',        '5 kg! Bu ciddi bir başarı.',                          '🥳', 'weight',    'weight_lost_kg', 5,    100, 22),
('weight_10',     '10 Kilo Efsanesi',     '10 kg verdin! İnanılmaz dönüşüm.',                   '🏅', 'weight',    'weight_lost_kg', 10,   250, 23),

('diet_week',     'Bir Hafta Uyum',       '1 hafta boyunca diyetine %80+ uydun!',               '🎖️', 'diet',      'diet_compliance_weeks', 1,  30, 30),
('diet_month',    'Aylık Uyum',           '4 hafta boyunca diyetine sadık kaldın!',              '🏋️', 'diet',      'diet_compliance_weeks', 4, 100, 31),
('perfect_day',   'Mükemmel Gün',         'Tüm makro hedeflerini %95+ tutturdun!',              '✨', 'diet',      'perfect_days',   1,    20,  32),
('perfect_week',  'Mükemmel Hafta',       '7 gün üst üste mükemmel skor!',                      '🌈', 'diet',      'perfect_days',   7,    150, 33),

('water_daily',   'Su İçicisi',           'Günlük su hedefini ilk kez tamamladın!',             '💧', 'water',     'water_goals_hit', 1,   10,  40),
('water_week',    'Hidrasyon Uzmanı',      '7 gün boyunca su hedefini tutturdun!',               '🌊', 'water',     'water_goals_hit', 7,   50,  41),

('onboarding',    'Hoş Geldin',           'Profilini ve hedefini oluşturdun!',                   '🎉', 'special',   'onboarding',     1,    5,   50),
('first_goal',    'İlk Hedef',            'İlk diyet hedefini belirledin!',                     '🎯', 'special',   'goal_created',   1,    10,  51),
('macro_master',  'Makro Ustası',         '3 gün üst üste tüm makroları dengeledin!',           '🧬', 'special',   'macro_balanced_days', 3, 75, 52)
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════
-- MOTİVASYON MESAJLARI SEED DATA
-- ═══════════════════════════════
INSERT INTO public.motivation_messages (trigger_type, mood, message_tr, emoji) VALUES
('goal_hit',        'excellent', 'Bugün tüm hedeflerini tutturdun! Sen bir yıldızsın.', '⭐'),
('goal_hit',        'excellent', 'Mükemmel gün! Vücudun sana teşekkür ediyor.', '🎉'),
('goal_hit',        'excellent', 'Hedefler: ✅ Azim: ✅ Sen: Harikasın! ✅', '💪'),
('goal_hit',        'excellent', 'Bugünü kilitledin! Yarın da aynı enerjiyle!', '🔒'),
('good_day',        'good', 'Çok iyi gidiyorsun! Küçük adımlar büyük sonuçlar getirir.', '👏'),
('good_day',        'good', 'Bugün güzel bir gündü. Kendini ödüllendir (sağlıklı şekilde 😄).', '🌟'),
('good_day',        'good', 'Hedefine çok yakınsın! Her gün biraz daha yaklaşıyorsun.', '🎯'),
('streak_milestone','excellent', 'Streak''in büyüyor! Bu tutarlılık her şeyi değiştirir.', '🔥'),
('streak_milestone','excellent', 'Her gün loglamak kolay değil — ama sen yapıyorsun!', '💯'),
('streak_milestone','excellent', 'Bu streak ile hedefe ulaşman an meselesi!', '🚀'),
('weight_loss',     'excellent', 'Tartıda düşüş var! Ama asıl önemli olan: nasıl hissediyorsun?', '⚖️'),
('weight_loss',     'excellent', 'Kilo vermen senin kararlılığının kanıtı. Devam et!', '📉'),
('over_calories',   'warning', 'Bugün biraz fazla kaçırdın — sorun değil! Yarın yeni bir gün.', '🌅'),
('over_calories',   'warning', 'Bir gün plan dışı olmak seni yoldan çıkarmaz. Devam et!', '💪'),
('low_protein',     'warning', 'Protein biraz düşük kaldı. Yarın bir avuç kuruyemiş ekle!', '🥜'),
('low_water',       'warning', 'Su içmeyi unutma! Hedefin %50 altında.', '💧'),
('high_sugar',      'warning', 'Bugün şeker biraz yüksek. Yarın meyveyi tercih et!', '🍎'),
('comeback',        'good', 'Tekrar hoş geldin! Ara vermek normal — önemli olan geri dönmek.', '🏠'),
('comeback',        'good', 'Bugün yeniden başladın. Bu kararın için kendini kutla!', '🎊'),
('blood_sugar_ok',  'excellent', 'Kan şekeri dostu bir gündü! Düşük GI seçimler harika iş çıkardı.', '🩺'),
('blood_sugar_high','warning', 'Bugün karbonhidrat biraz yüksek kaldı. GI dengesine dikkat!', '⚠️'),
('weekly_good',     'excellent', 'Bu hafta ortalama uyumun %85! Harika bir hafta geçirdin.', '📊'),
('weekly_avg',      'neutral', 'Bu hafta %65 uyum. Gelecek hafta daha iyi olacak, inanıyorum!', '📈');
