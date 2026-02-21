import type { IconProps } from './types';

export default function IconPlate({ size = 24, className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <circle cx="24" cy="24" r="19" fill="none" stroke="#10b981" strokeWidth="2" />
            <circle cx="24" cy="24" r="14" fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
            <path d="M24 24 L24 10 A14 14 0 0 1 37 20Z" fill="#10b981" opacity="0.7" />
            <path d="M24 24 L37 20 A14 14 0 0 1 32 36Z" fill="#3b82f6" opacity="0.6" />
            <path d="M24 24 L32 36 A14 14 0 0 1 16 36Z" fill="#f59e0b" opacity="0.5" />
            <path d="M24 24 L16 36 A14 14 0 0 1 24 10Z" fill="#f43f5e" opacity="0.4" />
            <circle cx="24" cy="24" r="4" fill="#18181b" stroke="#10b981" strokeWidth="1.5" />
        </svg>
    );
}
