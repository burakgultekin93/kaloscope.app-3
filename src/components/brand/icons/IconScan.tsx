import type { IconProps } from './types';

export default function IconScan({ size = 24, color = '#10b981', className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2.5" fill="none" />
            <circle cx="24" cy="24" r="7" fill={color} />
            <circle cx="22" cy="22" r="2" fill="currentColor" opacity="0.3" />
            <line x1="24" y1="3" x2="24" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="24" y1="40" x2="24" y2="45" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="3" y1="24" x2="8" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="24" x2="45" y2="24" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
