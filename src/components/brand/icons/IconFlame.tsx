import type { IconProps } from './types';

export default function IconFlame({ size = 24, className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <defs>
                <linearGradient id={`flame-${size}`} x1="24" y1="4" x2="24" y2="46">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
            </defs>
            <path d="M24 4 C30 14, 40 18, 38 30 C36 40, 30 46, 24 46 C18 46, 12 40, 10 30 C8 18, 18 14, 24 4Z"
                fill={`url(#flame-${size})`} />
            <path d="M24 20 C28 25, 32 28, 31 34 C30 39, 27 42, 24 42 C21 42, 18 39, 17 34 C16 28, 20 25, 24 20Z"
                fill="#6ee7b7" opacity="0.5" />
        </svg>
    );
}
