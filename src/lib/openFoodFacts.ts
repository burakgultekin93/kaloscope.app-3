import type { DetectedFood } from '@/types/food';

export const getBarcodeProduct = async (barcode: string): Promise<DetectedFood | null> => {
    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();

        if (data.status !== 1) {
            console.warn('Barkod okunamadı veya ürün bulunamadı:', barcode);
            return null;
        }

        const product = data.product;
        const nutriments = product.nutriments || {};

        return {
            id: 'barcode-' + Date.now(),
            name_tr: product.product_name_tr || product.product_name || 'Bilinmeyen Ürün',
            name_en: product.product_name_en || product.product_name || 'Unknown Product',
            estimated_grams: 100, // OpenFoodFacts default measurement
            confidence: 1, // 100% confidence for barcode mapping
            calories_per_100g: Math.round(nutriments['energy-kcal_100g'] || 0),
            protein_per_100g: Math.round(nutriments.proteins_100g || 0),
            carbs_per_100g: Math.round(nutriments.carbohydrates_100g || 0),
            fat_per_100g: Math.round(nutriments.fat_100g || 0),
            fiber_per_100g: Math.round(nutriments.fiber_100g || 0),
            calories_total: Math.round(nutriments['energy-kcal_100g'] || 0),
            protein_total: Math.round(nutriments.proteins_100g || 0),
            carbs_total: Math.round(nutriments.carbohydrates_100g || 0),
            fat_total: Math.round(nutriments.fat_100g || 0),
            fiber_total: product.nutriments?.['fiber_100g'] ?? 0,
        };
    } catch (error) {
        console.error('OpenFoodFacts API Error:', error);
        return null; // Silent catch, handle in UI
    }
};
