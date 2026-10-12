/**
 * Damped-spring step response as a GSAP function ease, ported from the Voxity
 * reference. The curve is normalised to settle at p = 1 so it works on a
 * scrubbed timeline: fast start, a small overshoot when under-damped.
 */
export function springEase(k: number, c: number, m = 1, settleTime?: number) {
    const w0 = Math.sqrt(k / m);
    const zeta = c / (2 * Math.sqrt(k * m));

    const x = (t: number) => {
        if (zeta < 1) {
            const wd = w0 * Math.sqrt(1 - zeta * zeta);
            return (
                1 -
                Math.exp(-zeta * w0 * t) *
                    (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
            );
        }
        // over-damped
        const s = Math.sqrt(zeta * zeta - 1);
        const r1 = -w0 * (zeta - s);
        const r2 = -w0 * (zeta + s);
        return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
    };

    const settle =
        settleTime ??
        (zeta < 1
            ? 4 / (zeta * w0)
            : 6 / (w0 * (zeta - Math.sqrt(zeta * zeta - 1))));
    const end = x(settle);
    return (p: number) => (p <= 0 ? 0 : p >= 1 ? 1 : x(p * settle) / end);
}

/** Voxity's default spring: fast start, one small overshoot, settles. */
export const SPRING_16_6 = springEase(16, 6);
