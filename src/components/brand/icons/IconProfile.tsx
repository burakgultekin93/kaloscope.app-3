import type { IconProps } from './types';

export default function IconProfile({ size = 24, color = '#10b981', className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <circle cx="24" cy="18" r="10" fill={color} opacity="0.7" />
            <path d="M6 44 C6 34, 14 28, 24 28 C34 28, 42 34, 42 44" fill={color} opacity="0.4" />
        </svg>
    );
}
