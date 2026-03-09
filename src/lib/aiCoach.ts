import { gemini } from './gemini';

export interface AICoachData {
    mood: 'excellent' | 'good' | 'neutral' | 'warning' | 'alert';
    feedback_tr: string;
    suggestions_tr: string[];
    compliance_score: number;
    macro_balance_score: number;
}

export interface DailyData {
    date: string;
    consumed: { calories: number; protein: number; carbs: number; fat: number; fiber: number; sugar: number; water_ml: number };
    targets: { calories: number; protein: number; carbs: number; fat: number; fiber: number; sugar_max: number; water_ml: number };
    diet_plan: string;
    has_diabetes: boolean;
    meals: { name: string; calories: number; meal_type: string }[];
    streak_days: number;
    weight_trend: 'losing' | 'stable' | 'gaining';
    blood_sugar?: number;
}

const COACH_PROMPT = `Sen KaloScope AI Beslenme Koçusun.
Kullanıcının günlük beslenme verilerini analiz edip kısa, motive edici, TÜRKÇE geri bildirim vereceksin.

KURALLAR:
1. Her zaman destekleyici ve pozitif ol — eleştirme, yönlendir.
2. Kişinin diyet planına göre değerlendir (keto'da düşük karb iyi, akdeniz'de dengeli iyi).
3. Diyabetik kullanıcılara kan şekeri dostu tavsiyeler ver. Eğer kan şekeri verisi (blood_sugar) varsa onu da yorumla.
4. Makro dengesizliklerini nazikçe belirt ve pratik çözüm öner.
5. Streak'i kutla (özellikle 7, 14, 30 gün).
6. ASLA "daha az ye" deme — "X ekle" veya "Y ile değiştir" de.
7. Yanıtın 2-3 cümle olsun, uzun yazma.
8. Tıbbi tavsiye verme — "doktorunuza danışın" demeyi unutma (diyabetik ise).

JSON FORMATINDA YANIT VER:
{
  "mood": "excellent|good|neutral|warning|alert",
  "feedback_tr": "Ana değerlendirme mesajı",
  "suggestions_tr": ["Öneri 1", "Öneri 2"],
  "compliance_score": 85,
  "macro_balance_score": 78
}`;

export async function getDailyAIFeedback(data: DailyData) {
    try {
        const userMessage = `
Tarih: ${data.date}
Diyet Planı: ${data.diet_plan}
Diyabet: ${data.has_diabetes ? 'Evet' : 'Hayır'}
Kan Şekeri: ${data.blood_sugar ? data.blood_sugar + ' mg/dL' : 'Girilmedi'}
Streak: ${data.streak_days} gün
Kilo Trendi: ${data.weight_trend}

HEDEFLER: ${data.targets.calories} kcal | P:${data.targets.protein}g | K:${data.targets.carbs}g | Y:${data.targets.fat}g | Lif:${data.targets.fiber}g | Su:${data.targets.water_ml}ml
GERÇEKLEŞEN: ${data.consumed.calories} kcal | P:${data.consumed.protein}g | K:${data.consumed.carbs}g | Y:${data.consumed.fat}g | Lif:${data.consumed.fiber}g | Şeker:${data.consumed.sugar}g | Su:${data.consumed.water_ml}ml

ÖĞÜNLER:
${data.meals.map((m: any) => `- ${m.meal_type}: ${m.name} (${m.calories} kcal)`).join('\n')}

Değerlendir ve JSON döndür.`;

        const response = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userMessage,
            config: {
                systemInstruction: COACH_PROMPT,
                responseMimeType: "application/json",
                temperature: 0.7,
            }
        });

        const content = response.text;
        return content ? JSON.parse(content) : null;
    } catch (error) {
        console.error('AI Coach error:', error);
        return null;
    }
}
