import type { IconProps } from './types';

export default function IconSlider({ size = 24, color = '#10b981', className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <rect x="6" y="21" width="36" height="6" rx="3" fill="#27272a" />
            <rect x="6" y="21" width="24" height="6" rx="3" fill={color} />
            <circle cx="30" cy="24" r="8" fill={color} stroke="#09090b" strokeWidth="2" />
        </svg>
    );
}
