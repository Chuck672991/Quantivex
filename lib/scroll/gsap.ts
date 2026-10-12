'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// One GSAP instance and one ScrollTrigger registration for every scroll
// animation (same rule as the Voxity reference).
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
    // The iOS URL bar fires resize events; ignoring them avoids refresh jitter
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (process.env.NODE_ENV !== 'production') {
        // Dev-only probe for scroll tests (trigger count, scroll budget)
        (window as unknown as Record<string, unknown>).__qxScroll = {
            triggers: () => ScrollTrigger.getAll().length,
            list: () =>
                ScrollTrigger.getAll().map((t) => ({
                    start: Math.round(t.start),
                    end: Math.round(t.end),
                    progress: +t.progress.toFixed(3),
                    id: t.vars.id ?? null,
                })),
        };
    }
}

export { gsap, ScrollTrigger, useGSAP };
