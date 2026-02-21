import type { IconProps } from './types';

export default function IconStats({ size = 24, color = '#10b981', className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <rect x="6" y="28" width="8" height="16" rx="2" fill={color} opacity="0.5" />
            <rect x="17" y="18" width="8" height="26" rx="2" fill={color} opacity="0.7" />
            <rect x="28" y="8" width="8" height="36" rx="2" fill={color} />
            <path d="M10 26 L21 16 L32 6" stroke="#34d399" strokeWidth="2" strokeLinecap="round" fill="none" strokeDasharray="4 3" />
        </svg>
    );
}
