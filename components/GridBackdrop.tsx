import { cn } from '@/lib/utils';

interface Props {
    /** "radial" fades to the surface colour away from `at`; "bottom" fades downward. */
    fade?: 'radial' | 'bottom';
    /** Focus point of the radial fade, e.g. "75% 30%". */
    at?: string;
    /** Theme token of the surface behind the grid (the fade blends into it). */
    surface?: 'background' | 'background-light';
    className?: string;
}

/**
 * A blueprint grid that fades out, built from two plain gradient layers.
 * `mask-image` on large layers forces extra offscreen compositing passes while
 * scrolling; a gradient laid over the grid looks the same and costs nothing.
 */
const GridBackdrop = ({
    fade = 'radial',
    at = '75% 30%',
    surface = 'background',
    className,
}: Props) => {
    const colour = `hsl(var(--${surface}))`;
    const overlay =
        fade === 'radial'
            ? `radial-gradient(ellipse 75% 75% at ${at}, transparent 0%, ${colour} 82%)`
            : `linear-gradient(to bottom, transparent 0%, ${colour} 78%)`;

    return (
        <>
            <div
                aria-hidden
                className={cn(
                    'bg-grid pointer-events-none absolute inset-0 opacity-60',
                    className,
                )}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{ background: overlay }}
            />
        </>
    );
};

export default GridBackdrop;
