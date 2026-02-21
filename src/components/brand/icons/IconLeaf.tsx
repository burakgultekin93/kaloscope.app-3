import type { IconProps } from './types';

export default function IconLeaf({ size = 24, className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <defs>
                <linearGradient id={`leaf-${size}`} x1="16" y1="6" x2="32" y2="44">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                </linearGradient>
            </defs>
            <path d="M24 6 C34 16, 40 24, 24 44 C8 24, 14 16, 24 6Z" fill={`url(#leaf-${size})`} opacity="0.85" />
            <path d="M24 12 L24 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
            <path d="M24 22 L17 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
            <path d="M24 28 L17 24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
            <path d="M24 22 L31 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
            <path d="M24 28 L31 24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.15" />
        </svg>
    );
}
