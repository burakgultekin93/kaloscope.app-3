interface WordmarkProps {
    height?: number;
    variant?: 'dark' | 'light';
    className?: string;
}

export default function Wordmark({ height = 40, variant = 'dark', className = '' }: WordmarkProps) {
    const isDark = variant === 'dark';
    const textColor = isDark ? '#fafafa' : '#18181b';
    const accentColor = isDark ? '#10b981' : '#059669';
    const stemColor = isDark ? '#fafafa' : '#18181b';
    const boxFill = isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.06)';
    const boxStroke = isDark ? '#10b981' : '#059669';

    const width = height * (300 / 64);

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 300 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Mini K icon */}
            <rect x="2" y="2" width="60" height="60" rx="16" fill={boxFill} stroke={boxStroke} strokeWidth="2" />
            <path d="M20 16 L20 48" stroke={stemColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M20 32 L42 16" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
            <path d="M30 26 L48 48" stroke={accentColor} strokeWidth="5" strokeLinecap="round" />
            <circle cx="52" cy="16" r="4.5" fill={accentColor} />
            {/* Text */}
            <text x="76" y="43" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="800" fontSize="30" fill={textColor}>
                Kalo<tspan fill={accentColor}>Scope</tspan>
            </text>
        </svg>
    );
}
