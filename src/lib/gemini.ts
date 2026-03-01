import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not defined in environment variables");
}

export const gemini = new GoogleGenAI({
    apiKey: apiKey || '',
});
