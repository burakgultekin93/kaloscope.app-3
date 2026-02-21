interface LogoProps {
    size?: number;
    variant?: 'dark' | 'light' | 'white' | 'mono';
    className?: string;
}

export default function Logo({ size = 48, variant = 'dark', className = '' }: LogoProps) {
    // Renk ayarları
    const colors = {
        dark: { stem: '#fafafa', arms: '#34d399', dot: '#10b981', box: 'rgba(16,185,129,0.1)', border: '#10b981' },
        light: { stem: '#18181b', arms: '#059669', dot: '#10b981', box: 'rgba(16,185,129,0.06)', border: '#059669' },
        white: { stem: '#ffffff', arms: 'rgba(255,255,255,0.8)', dot: '#ffffff', box: 'rgba(255,255,255,0.15)', border: 'rgba(255,255,255,0.4)' },
        mono: { stem: '#fafafa', arms: '#fafafa', dot: '#fafafa', box: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.2)' },
    };

    const c = colors[variant];

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect x="8" y="8" width="144" height="144" rx="36" fill={c.box} stroke={c.border} strokeWidth="2.5" />
            <path d="M52 40 L52 120" stroke={c.stem} strokeWidth="9" strokeLinecap="round" />
            <path d="M52 80 L95 40" stroke={c.arms} strokeWidth="9" strokeLinecap="round" />
            <path d="M72 68 L108 120" stroke={c.arms} strokeWidth="9" strokeLinecap="round" />
            <circle cx="118" cy="40" r="8" fill={c.dot} />
        </svg>
    );
}
