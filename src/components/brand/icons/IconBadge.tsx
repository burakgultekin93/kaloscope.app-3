import type { IconProps } from './types';

export default function IconBadge({ size = 24, color = '#10b981', className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <defs>
                <linearGradient id={`badge-${size}`} x1="10" y1="6" x2="38" y2="34">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#064e3b" />
                </linearGradient>
            </defs>
            <circle cx="24" cy="20" r="14" fill={`url(#badge-${size})`} stroke={color} strokeWidth="2" />
            <polygon points="24,41 18,48 20,38 12,34 22,33" fill={color} opacity="0.6" />
            <polygon points="24,41 30,48 28,38 36,34 26,33" fill={color} opacity="0.6" />
            <text x="24" y="24" textAnchor="middle" fontFamily="Plus Jakarta Sans" fontWeight="800" fontSize="13" fill="white">★</text>
        </svg>
    );
}
