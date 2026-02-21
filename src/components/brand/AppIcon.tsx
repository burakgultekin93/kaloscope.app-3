interface AppIconProps {
    size?: number;
    bg?: 'gradient' | 'emerald' | 'dark' | 'white';
    className?: string;
}

export default function AppIcon({ size = 192, bg = 'gradient', className = '' }: AppIconProps) {
    const backgrounds: Record<string, string> = {
        gradient: 'url(#appGrad)',
        emerald: '#10b981',
        dark: '#09090b',
        white: '#ffffff',
    };

    const strokeColor = bg === 'white' ? '#18181b' : '#ffffff';
    const armColor = bg === 'white' ? '#059669' : '#34d399';
    const dotColor = bg === 'white' ? '#10b981' : (bg === 'emerald' ? '#ffffff' : '#10b981');

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="appGrad" x1="0" y1="0" x2="200" y2="200">
                    <stop offset="0%" stopColor="#064e3b" />
                    <stop offset="100%" stopColor="#09090b" />
                </linearGradient>
                <clipPath id="squircle">
                    <rect width="200" height="200" rx="44" />
                </clipPath>
            </defs>
            <g clipPath="url(#squircle)">
                <rect width="200" height="200" fill={backgrounds[bg]} />
                <path d="M65 38 L65 162" stroke={strokeColor} strokeWidth="14" strokeLinecap="round" />
                <path d="M65 100 L125 38" stroke={armColor} strokeWidth="14" strokeLinecap="round" />
                <path d="M92 77 L143 162" stroke={armColor} strokeWidth="14" strokeLinecap="round" />
                <circle cx="156" cy="38" r="12" fill={dotColor} />
            </g>
        </svg>
    );
}
