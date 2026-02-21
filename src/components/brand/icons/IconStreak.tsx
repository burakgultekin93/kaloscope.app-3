import type { IconProps } from './types';

export default function IconStreak({ size = 24, className = '' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
            <path d="M24 2 C28 12, 42 18, 40 32 C38 42, 30 46, 24 46 C18 46, 10 42, 8 32 C6 18, 20 12, 24 2Z"
                fill="#f59e0b" opacity="0.9" />
            <path d="M24 16 C27 22, 34 26, 33 34 C32 40, 28 42, 24 42 C20 42, 16 40, 15 34 C14 26, 21 22, 24 16Z"
                fill="#fbbf24" opacity="0.7" />
            <path d="M24 28 C26 31, 29 33, 28 37 C27 40, 25 41, 24 41 C23 41, 21 40, 20 37 C19 33, 22 31, 24 28Z"
                fill="#fef3c7" opacity="0.6" />
        </svg>
    );
}
