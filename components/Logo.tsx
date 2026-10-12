import { cn } from '@/lib/utils';
import { BRAND } from '@/lib/brand';

type Tone = 'light' | 'dark';

const MARK_COLORS: Record<
    Tone,
    { top: string; left: string; right: string; dial: string }
> = {
    // `tone` names the surface the logo sits on
    light: {
        top: '#1D4ED8',
        left: '#0F172A',
        right: '#6B8CFF',
        dial: '#FFFFFF',
    },
    dark: {
        top: '#6B8CFF',
        left: '#F1F5F9',
        right: '#93AEFF',
        dial: '#0A1020',
    },
};

/** The isometric block mark: a cube with a "dial" on its top face. */
export const LogoMark = ({
    tone = 'light',
    size = 26,
    className,
}: {
    tone?: Tone;
    size?: number;
    className?: string;
}) => {
    const c = MARK_COLORS[tone];

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className={className}
        >
            <path d="M12 1.5 20.6 6.5 12 11.5 3.4 6.5 12 1.5Z" fill={c.top} />
            <path d="M3.4 6.5 12 11.5V22.5L3.4 17.5V6.5Z" fill={c.left} />
            <path d="M20.6 6.5V17.5L12 22.5V11.5L20.6 6.5Z" fill={c.right} />
            <ellipse cx="12" cy="6.5" rx="3.1" ry="1.8" fill={c.dial} />
        </svg>
    );
};

interface LogoProps {
    tone?: Tone;
    /** Hide the wordmark and show only the cube. */
    markOnly?: boolean;
    className?: string;
}

const Logo = ({ tone = 'light', markOnly = false, className }: LogoProps) => (
    <span
        className={cn(
            'inline-flex items-center gap-2.5',
            tone === 'dark' ? 'text-white' : 'text-ink',
            className,
        )}
    >
        <LogoMark tone={tone} />
        {markOnly ? (
            <span className="sr-only">{BRAND.name}</span>
        ) : (
            <span className="font-display text-[13px] font-semibold uppercase leading-none tracking-[0.26em]">
                {BRAND.name}
            </span>
        )}
    </span>
);

export default Logo;
