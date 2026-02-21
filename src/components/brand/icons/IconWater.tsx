import type { IconProps } from './types';

export default function IconWater({ size = 24, className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <defs>
                <linearGradient id={`water-${size}`} x1="24" y1="4" x2="24" y2="46">
                    <stop offset="0%" stopColor="#67e8f9" />
                    <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
            </defs>
            <path d="M24 4 C24 4, 40 22, 40 30 C40 39, 33 46, 24 46 C15 46, 8 39, 8 30 C8 22, 24 4, 24 4Z"
                fill={`url(#water-${size})`} opacity="0.85" />
            <ellipse cx="19" cy="28" rx="4" ry="6" fill="white" opacity="0.2" transform="rotate(-15 19 28)" />
        </svg>
    );
}
