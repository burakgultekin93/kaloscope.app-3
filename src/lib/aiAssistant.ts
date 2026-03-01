import { gemini } from './gemini';
import { supabase } from './supabase';

const DIET_PLANNER_PROMPT = `
Sen profesyonel bir diyetisyen ve beslenme asistanısın. Kullanıcıların sana verdiği kişisel bilgiler (boy, kilo, yaş, hedefler, diyet tercihleri, hastalıklar) ve istedikleri listeye göre onlara en uygun, sağlıklı, sürdürülebilir bir diyet/beslenme programı veya tavsiye listesi sunacaksın.
Yanıtın her zaman nazik, motive edici ve yapılandırılmış (Markdown formatında gün gün veya öğün öğün ayrılarak) olmalı.
Asla doğrudan tıbbi tedavi önerme, her zaman "Bu bir tavsiye niteliğindedir, doktorunuza danışınız" ibaresini ekle.
`;

export const generateDietPlan = async (userId: string, userRequest: string): Promise<string> => {
    try {
        // Kullanıcı verilerini çekiyoruz (Opsiyonel olarak daha kişisel bir yanıt için)
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        let contextInfo = '';
        if (profile) {
            contextInfo = `Kullanıcı Bilgileri:\n- Yaş/Cinsiyet/Kilo: ${profile.age || 'Bilinmiyor'}, ${profile.weight ? profile.weight + 'kg' : 'Bilinmiyor'}, Boy: ${profile.height || 'Bilinmiyor'}\n- Diyet Tercihi: ${profile.diet_preference || 'Standart'}\n- Hastalık/Durum: ${profile.medical_conditions ? profile.medical_conditions.join(', ') : 'Yok'}\n- Hedef: ${profile.primary_goal || 'Bilinmiyor'}\n\n`;
        }

        const promptContent = `${contextInfo}Kullanıcı Talebi: "${userRequest}"`;

        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: promptContent,
            config: {
                systemInstruction: DIET_PLANNER_PROMPT,
                temperature: 0.7, // Daha yaratıcı bir diyet listesi/tavsiye için
            }
        });

        return response.text || "Diyet planı oluşturulamadı.";
    } catch (error) {
        console.error("Gemini Diet Planner Error:", error);
        throw new Error("Tavsiye oluşturulurken bir hata meydana geldi. Lütfen tekrar deneyin.");
    }
};
