// Diyet planı seçildiğinde makro hedeflerini otomatik hesapla

export interface UserProfileBasic {
    weight_kg: number;
    height_cm: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
    goal_type: 'lose' | 'maintain' | 'gain';
    weekly_goal_kg: number;
}

export interface DietMacros {
    protein_pct: number;
    carb_pct: number;
    fat_pct: number;
    max_carbs_grams?: number | null;
    min_protein_grams?: number | null;
    max_sugar_grams?: number | null;
    min_fiber_grams?: number | null;
}

export function calculateDietTargets(profile: UserProfileBasic, diet: DietMacros) {
    // Mifflin-St Jeor BMR
    let bmr: number;
    if (profile.gender === 'male' || profile.gender === 'other') {
        bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5;
    } else {
        bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;
    }

    // Aktivite çarpanı
    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = Math.round(bmr * multipliers[profile.activity_level]);

    // Hedef kalori
    let calorieTarget: number;
    const weeklyDeficit = profile.weekly_goal_kg * 7700; // 1kg yağ = 7700 kcal
    const dailyAdjust = Math.round(weeklyDeficit / 7);

    if (profile.goal_type === 'lose') {
        calorieTarget = Math.max(tdee - dailyAdjust, profile.gender === 'female' ? 1200 : 1500);
    } else if (profile.goal_type === 'gain') {
        calorieTarget = tdee + dailyAdjust;
    } else {
        calorieTarget = tdee;
    }

    // Makro hesaplama (kalori yüzdesinden gram'a)
    let proteinG = Math.round((calorieTarget * diet.protein_pct / 100) / 4);
    let carbG = Math.round((calorieTarget * diet.carb_pct / 100) / 4);
    let fatG = Math.round((calorieTarget * diet.fat_pct / 100) / 9);

    // Diyet kısıtlamaları uygula
    if (diet.min_protein_grams && proteinG < diet.min_protein_grams) {
        proteinG = diet.min_protein_grams;
    }
    if (diet.max_carbs_grams && carbG > diet.max_carbs_grams) {
        carbG = diet.max_carbs_grams;
    }

    return {
        daily_calorie_target: calorieTarget,
        daily_protein_g: proteinG,
        daily_carb_g: carbG,
        daily_fat_g: fatG,
        daily_fiber_g: diet.min_fiber_grams || 25,
        daily_sugar_max_g: diet.max_sugar_grams || null,
        daily_water_ml: Math.round(profile.weight_kg * 33), // 33ml/kg
        tdee,
        bmr: Math.round(bmr),
    };
}
