import type { IconProps } from './types';

export default function IconMic({ size = 24, color = '#10b981', className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <rect x="18" y="6" width="12" height="22" rx="6" fill={color} />
            <path d="M12 24 C12 32, 17 38, 24 38 C31 38, 36 32, 36 24"
                stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <line x1="24" y1="38" x2="24" y2="44" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="18" y1="44" x2="30" y2="44" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}
