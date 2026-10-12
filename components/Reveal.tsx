'use client';
import { gsap, useGSAP } from '@/lib/scroll/gsap';
import { cn } from '@/lib/utils';
import { useRef, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    delay?: number;
    /** Starting offset in px (fade) */
    y?: number;
    x?: number;
    className?: string;
    /** How far into the viewport the element must be before it plays, as a fraction of the viewport height. */
    amount?: number;
    /** fade: rises and fades in. mask: slides up inside a clip, like the hero headline. */
    variant?: 'fade' | 'mask';
}

/**
 * Plays once when its children scroll into view. GSAP + ScrollTrigger like
 * every other scroll animation on the page; the start state is applied by
 * script, and hidden by CSS until then (see [data-reveal] in globals.css), so
 * nothing flashes. Reduced motion shows it as is.
 */
const Reveal = ({
    children,
    delay = 0,
    y = 26,
    x = 0,
    className,
    amount = 0.14,
    variant = 'fade',
}: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const el = ref.current;
            if (!el) return;

            const mm = gsap.matchMedia();
            mm.add('(prefers-reduced-motion: no-preference)', () => {
                const mask = variant === 'mask';
                const target = mask ? el.firstElementChild : el;
                if (!target) return;

                const trigger = {
                    trigger: el,
                    start: `top ${Math.round((1 - amount) * 100)}%`,
                    once: true,
                };

                gsap.set(el, { visibility: 'visible' });
                if (mask) {
                    gsap.fromTo(
                        target,
                        { yPercent: 112 },
                        {
                            yPercent: 0,
                            duration: 1.05,
                            delay,
                            ease: 'expo.out',
                            scrollTrigger: trigger,
                        },
                    );
                } else {
                    gsap.fromTo(
                        target,
                        { opacity: 0, y, x },
                        {
                            opacity: 1,
                            y: 0,
                            x: 0,
                            duration: 0.95,
                            delay,
                            ease: 'expo.out',
                            scrollTrigger: trigger,
                        },
                    );
                }
            });

            return () => mm.revert();
        },
        { scope: ref },
    );

    return (
        <div
            ref={ref}
            data-reveal={variant}
            className={cn(variant === 'mask' && 'overflow-hidden', className)}
        >
            {variant === 'mask' ? <div>{children}</div> : children}
        </div>
    );
};

export default Reveal;
