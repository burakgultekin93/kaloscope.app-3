export const LEVELS = [
    { level: 1, title: 'Çaylak', minXP: 0, icon: '🌱' },
    { level: 2, title: 'Başlangıç', minXP: 50, icon: '🌿' },
    { level: 3, title: 'Kararlı', minXP: 150, icon: '💚' },
    { level: 4, title: 'Düzenli', minXP: 350, icon: '⭐' },
    { level: 5, title: 'Azimli', minXP: 600, icon: '🔥' },
    { level: 6, title: 'Uzman', minXP: 1000, icon: '💪' },
    { level: 7, title: 'Usta', minXP: 1500, icon: '🏆' },
    { level: 8, title: 'Efsane', minXP: 2500, icon: '👑' },
    { level: 9, title: 'Şampiyon', minXP: 4000, icon: '💎' },
    { level: 10, title: 'KaloScope Elite', minXP: 6000, icon: '🌟' },
];

export function getUserLevel(xp: number) {
    return [...LEVELS].reverse().find(l => xp >= l.minXP) || LEVELS[0];
}

export function getNextLevel(xp: number) {
    const current = getUserLevel(xp);
    return LEVELS.find(l => l.level === current.level + 1) || null;
}

export function getXPProgress(xp: number) {
    const current = getUserLevel(xp);
    const next = getNextLevel(xp);
    if (!next) return 100;
    return Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100);
}
