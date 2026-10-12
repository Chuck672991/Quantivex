'use client';
import { ArrowUp } from 'lucide-react';
import { useLenis } from 'lenis/react';

const BackToTop = () => {
    const lenis = useLenis();

    const handleClick = () => {
        const reduce = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;
        if (lenis) lenis.scrollTo(0, { duration: 1.6, immediate: reduce });
        else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="group inline-flex items-center gap-2 text-foreground/80 transition-colors hover:text-foreground"
        >
            Back to top
            <span className="grid size-8 place-items-center rounded-full border border-border transition-colors group-hover:border-foreground/60">
                <ArrowUp size={14} aria-hidden />
            </span>
        </button>
    );
};

export default BackToTop;
