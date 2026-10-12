'use client';

import { gsap, ScrollTrigger } from '@/lib/scroll/gsap';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, type ReactNode } from 'react';

/**
 * Lenis smooths the native scroll and GSAP owns the frame: Lenis is stepped
 * from gsap.ticker (one rAF loop for the whole page) and tells ScrollTrigger
 * after every scroll, so scrubbed timelines never lag the page by a frame.
 */
const Sync = () => {
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        const onScroll = () => ScrollTrigger.update();
        const tick = (time: number) => lenis.raf(time * 1000);

        lenis.on('scroll', onScroll);
        gsap.ticker.add(tick);
        // A long frame must not make the scrubbed timeline jump ahead
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.off('scroll', onScroll);
            gsap.ticker.remove(tick);
            gsap.ticker.lagSmoothing(500, 33);
        };
    }, [lenis]);

    // Layout that settles after first paint moves every trigger: re-measure once
    useEffect(() => {
        let refreshing: gsap.core.Tween | null = null;
        const refresh = () => {
            refreshing?.kill();
            refreshing = gsap.delayedCall(0.1, () => ScrollTrigger.refresh());
        };

        window.addEventListener('load', refresh);
        window.addEventListener('quantivex:ready', refresh);
        document.fonts?.ready.then(refresh);

        return () => {
            refreshing?.kill();
            window.removeEventListener('load', refresh);
            window.removeEventListener('quantivex:ready', refresh);
        };
    }, []);

    return null;
};

const SmoothScroll = ({ children }: { children: ReactNode }) => {
    const reduce = useReducedMotion();

    return (
        <ReactLenis
            root
            options={{
                autoRaf: false,
                lerp: 0.1,
                duration: 1.4,
                // Reduced motion: native wheel/touch scrolling, no easing
                smoothWheel: !reduce,
            }}
        >
            <Sync />
            {children}
        </ReactLenis>
    );
};

export default SmoothScroll;
