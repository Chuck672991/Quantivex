'use client';

import { BRAND } from '@/lib/brand';
import { gsap } from '@/lib/scroll/gsap';
import { useAct } from '@/lib/scroll/useAct';
import { useRef } from 'react';

/**
 * The oversized wordmark at the foot of the page. It rises out of the bottom
 * edge as the footer scrolls in, and is fully up exactly when the page ends
 * (the footer clips it).
 */
const FooterWordmark = () => {
    const ref = useRef<HTMLParagraphElement>(null);

    useAct(ref, ({ root }) => {
        gsap.fromTo(
            root,
            { yPercent: 62 },
            {
                yPercent: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: root,
                    start: 'top bottom',
                    end: 'bottom bottom',
                    scrub: true,
                },
            },
        );
    });

    return (
        <p
            ref={ref}
            aria-hidden
            className="pointer-events-none -mb-[0.16em] select-none whitespace-nowrap text-center font-display text-[16.4vw] font-semibold uppercase leading-[0.8] tracking-[-0.05em] text-foreground/[0.045]"
        >
            {BRAND.name}
        </p>
    );
};

export default FooterWordmark;
