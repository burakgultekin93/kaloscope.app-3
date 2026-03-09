import { gemini } from './gemini';
import { SYSTEM_PROMPT_DIET_PLAN } from './aiPrompts';

export interface DietMeal {
    name_tr: string;
    name_en: string;
    grams: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

export interface DietPlan {
    meals: {
        breakfast: DietMeal;
        lunch: DietMeal;
        dinner: DietMeal;
        snack: DietMeal;
    };
    smart_tip: string;
}

export const generateDietPlan = async (params: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    diet_preference: string;
}): Promise<DietPlan> => {
    try {
        const userPrompt = `Target Calories: ${params.calories}kcal, Protein: ${params.protein}g, Carbs: ${params.carbs}g, Fat: ${params.fat}g, Diet Preference: ${params.diet_preference}. Please generate a balanced 1-day menu.`;

        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: SYSTEM_PROMPT_DIET_PLAN,
                responseMimeType: "application/json",
                temperature: 0.7,
            }
        });

        const content = response.text || "";
        const data = JSON.parse(content);

        if (!data.meals || !data.smart_tip) {
            throw new Error("Invalid AI response format");
        }

        return data as DietPlan;
    } catch (error) {
        console.error("AI Diet Plan Error:", error);
        throw new Error("Diyet listesi oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
    }
};
