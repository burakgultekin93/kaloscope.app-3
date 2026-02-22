export interface CheckResult {
    isOk: boolean;
    warnings: string[];
    tips: string[];
}

export function checkDietCompliance(
    dietSlug: string,
    todayTotals: { calories: number; protein: number; carbs: number; fat: number; sugar: number; fiber: number },
    targets: { calories: number; protein: number; carbs: number; fat: number; sugar_max: number; fiber: number },
    hasDiabetes: boolean
): CheckResult {
    const warnings: string[] = [];
    const tips: string[] = [];

    const calPct = todayTotals.calories / targets.calories;

    // ─── GENEL KONTROLLER ───
    if (calPct > 1.1) warnings.push('Günlük kalori hedefini %10+ aştın');
    if (calPct > 0.9 && calPct <= 1.0) tips.push('Harika! Kalori hedefine çok yakınsın');

    if (todayTotals.protein < targets.protein * 0.7) {
        warnings.push('Protein düşük — akşam bir avuç badem veya yoğurt ekle');
    }

    // ─── DİYETE ÖZEL KONTROLLER ───
    if (dietSlug === 'keto') {
        if (todayTotals.carbs > 50) warnings.push('Keto sınırı: Karbonhidrat 50g\'ı geçti!');
        if (todayTotals.fat < todayTotals.protein) tips.push('Keto\'da yağ, proteinden fazla olmalı');
    }

    if (dietSlug === 'lowcarb') {
        if (todayTotals.carbs > 130) warnings.push('Düşük karb sınırı: 130g\'ı geçti');
    }

    if (dietSlug === 'highprotein') {
        if (todayTotals.protein >= targets.protein) tips.push('Protein hedefini tutturdun! 💪');
    }

    if (dietSlug === 'intermittent') {
        tips.push('Yeme penceresine dikkat: 12:00-20:00 arası önerilir');
    }

    // ─── DİYABETİK KONTROLLER ───
    if (hasDiabetes || dietSlug === 'diabetic_t2' || dietSlug === 'insulin_resistance') {
        if (todayTotals.sugar > (targets.sugar_max || 25)) {
            warnings.push('⚠️ Şeker limiti aşıldı! Kan şekerini kontrol et');
        }
        if (todayTotals.carbs > 130) {
            warnings.push('Diyabetik plan: Karbonhidrat 130g üzerinde — dikkat!');
        }
        if (todayTotals.fiber < 25) {
            tips.push('Lif alımını artır — kan şekerini dengeler (baklagil, yulaf)');
        }
        if (todayTotals.carbs <= 130 && todayTotals.sugar <= 25) {
            tips.push('🩺 Kan şekeri dostu bir gün! Harika gidiyorsun.');
        }
    }

    return {
        isOk: warnings.length === 0,
        warnings,
        tips,
    };
}
