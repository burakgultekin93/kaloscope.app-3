import { openai } from './openai';
import { gemini } from './gemini';
import { SYSTEM_PROMPT_TURKISH_FOOD } from './aiPrompts';
import { parseAIResponse } from '@/utils/parseAIResponse';
import type { AnalysisResult } from '@/types/food';

export const analyzeFoodImage = async (base64Image: string): Promise<AnalysisResult> => {
    const makeRequest = async (model: string) => {
        return await openai.chat.completions.create({
            model: model,
            response_format: { type: "json_object" },
            max_tokens: 1500,
            temperature: 0.1,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_PROMPT_TURKISH_FOOD
                },
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Please analyze this food image and return the nutritional data as JSON." },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`,
                                detail: "high"
                            }
                        }
                    ]
                }
            ]
        });
    };

    try {
        const response = await makeRequest("gpt-4o");
        const content = response.choices[0]?.message?.content || null;
        return parseAIResponse(content);
    } catch (error: any) {
        console.warn("gpt-4o failed, trying fallback gpt-4o-mini...", error?.message);
        try {
            const fallbackResponse = await makeRequest("gpt-4o-mini");
            const content = fallbackResponse.choices[0]?.message?.content || null;
            return parseAIResponse(content);
        } catch (fallbackError: any) {
            console.error("AI Fallback Analysis Error:", fallbackError);
            if (fallbackError?.status === 429 || fallbackError?.status === 401) {
                throw new Error("Geçici bir servis sorunu var. Lütfen biraz bekleyip tekrar deneyin.");
            }
            throw new Error("Fotoğraf analiz edilemedi. Lütfen daha net bir fotoğraf çekin.");
        }
    }
};


export const analyzeFoodText = async (query: string): Promise<AnalysisResult> => {
    try {
        const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please analyze this food item: "${query}" and return the nutritional data as JSON.`,
            config: {
                systemInstruction: SYSTEM_PROMPT_TURKISH_FOOD,
                responseMimeType: "application/json",
                temperature: 0.1,
            }
        });

        const content = response.text || null;
        return parseAIResponse(content);
    } catch (error: any) {
        console.error("Gemini AI Text Analysis Error:", error);
        throw new Error("Yemek bilgisi alınamadı. Lütfen tekrar deneyin.");
    }
};

