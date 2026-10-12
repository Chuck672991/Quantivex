'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Pauses every CSS animation inside `ref` while it is off-screen.
 *
 * Chrome services running CSS animations on the main thread every frame once
 * any rAF loop is alive (Lenis, framer, R3F), re-styling and re-painting the
 * page for animations nobody can see. The attribute is written straight to
 * the DOM so scrolling never causes a React render; globals.css does the
 * pausing (`[data-anim='off']`).
 */
export const useAnimGate = (
    ref: RefObject<HTMLElement | null>,
    rootMargin = '-1px 0px',
) => {
    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === 'undefined') return;

        const io = new IntersectionObserver(
            ([entry]) => {
                el.dataset.anim = entry.isIntersecting ? 'on' : 'off';
            },
            { rootMargin },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [ref, rootMargin]);
};
