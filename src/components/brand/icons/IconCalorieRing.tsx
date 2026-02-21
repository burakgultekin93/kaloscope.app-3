import type { IconProps } from './types';

export default function IconCalorieRing({ size = 24, color = '#10b981', className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <circle cx="24" cy="24" r="20" stroke="#27272a" strokeWidth="4" fill="none" />
            <circle cx="24" cy="24" r="20" stroke={color} strokeWidth="4" fill="none"
                strokeDasharray="125" strokeDashoffset="31" strokeLinecap="round"
                transform="rotate(-90 24 24)" />
            <circle cx="24" cy="24" r="13" stroke="#27272a" strokeWidth="3" fill="none" />
            <circle cx="24" cy="24" r="13" stroke="#3b82f6" strokeWidth="3" fill="none" opacity="0.7"
                strokeDasharray="82" strokeDashoffset="33" strokeLinecap="round"
                transform="rotate(-90 24 24)" />
        </svg>
    );
}
