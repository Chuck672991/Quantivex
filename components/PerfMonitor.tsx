'use client';
import { demotePerf, getPerfLevel, type PerfLevel } from '@/lib/perf';
import { useEffect } from 'react';

const WINDOW = 45; // frames per judgement
const SLOW_MS = 26; // average frame time that counts as struggling (~38fps)
const STRIKES = 2; // consecutive slow windows before demoting
const MAX_FRAMES = 900; // stop watching after this many healthy frames

/**
 * Watches real frame times for the first few seconds of activity (hero
 * animation, first scrolls) and steps quality down on devices that struggle.
 * It samples only while the user is interacting or the page is animating, and
 * detaches once the device has proven healthy.
 */
const PerfMonitor = () => {
    useEffect(() => {
        getPerfLevel(); // applies data-perf for the first paint of effects
        if (getPerfLevel() >= 2) return;

        let raf = 0;
        let last = 0;
        let sum = 0;
        let frames = 0;
        let total = 0;
        let strikes = 0;
        let stopped = false;

        const tick = (time: number) => {
            if (stopped) return;
            if (last && document.visibilityState === 'visible') {
                const dt = time - last;
                // ignore stalls from tab switches or devtools pauses
                if (dt < 250) {
                    sum += dt;
                    frames += 1;
                    total += 1;
                }
            }
            last = time;

            if (frames >= WINDOW) {
                strikes = sum / frames > SLOW_MS ? strikes + 1 : 0;
                sum = 0;
                frames = 0;
                if (strikes >= STRIKES) {
                    const next = (getPerfLevel() + 1) as PerfLevel;
                    demotePerf(next);
                    strikes = 0;
                    if (next >= 2) {
                        stopped = true;
                        return;
                    }
                }
            }
            if (total >= MAX_FRAMES) {
                stopped = true;
                return;
            }
            raf = requestAnimationFrame(tick);
        };

        // Let the intro and hydration settle before judging
        const start = window.setTimeout(() => {
            raf = requestAnimationFrame(tick);
        }, 2500);

        return () => {
            stopped = true;
            window.clearTimeout(start);
            cancelAnimationFrame(raf);
        };
    }, []);

    return null;
};

export default PerfMonitor;
