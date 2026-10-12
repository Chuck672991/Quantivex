/**
 * Scroll budget: the only place scroll lengths are tuned.
 * Unit: 1 = 100vh of scroll. A tween of `duration: 1.5` on a pinned timeline
 * occupies 150vh.
 */
export const SCROLL = {
    /** Pinned opening: lockup -> peephole zoom -> the hole opens onto the hero */
    opening: {
        lead: 0.15, // dead scroll so the lockup can be read
        zoom: 1.4, // lockup scales about the centre until the hole covers the screen
        cave: 1.1, // the dark wall expands past the edges; hero copy slides up
        heroDwell: 0.45,
    },
    /** Services: one pinned beat per service, focus follows the scroll */
    services: { beat: 0.5, dwell: 0.3 },
    /** The next block rises over the still-pinned hero while the hero recedes */
    handoff: 0.8,
} as const;

/** Length of the pinned opening in viewport heights (also drives the section height in CSS) */
export const OPENING_TOTAL =
    SCROLL.opening.lead +
    SCROLL.opening.zoom +
    SCROLL.opening.cave +
    SCROLL.opening.heroDwell;

/** The lockup is authored at the end pose and scaled down by this: the hole thumbnail is 1/ZOOM of the screen */
export const ZOOM = 1445.51 / 176.41; // 8.194

/**
 * The wall is an SVG square centred on the viewport (viewBox 0-100) with the
 * broken hole cut out of it (hole.ts). `side` is its edge as a multiple of the
 * viewport's half-diagonal, so it covers any aspect ratio. `rMin` is the
 * nearest wall point to the centre and `rMean` the hole's typical radius, in
 * viewBox units. `end` is how far the wall scales: rMin * end * side / 100
 * must exceed 1 so the open area clears the corners at any aspect ratio.
 */
export const CAVE = { side: 2.2, rMin: 7.80, rMean: 12.9, end: 6.3 } as const;

/**
 * Where slab A (the hero scene's focal point) sits in the hero, as a fraction
 * of the composite: the canvas is the right 66% and frames slab A at 45% x, 46% y
 * of itself (components/hero/IsoScene.tsx ANCHOR_WIDE). At the start pose the
 * hero is shifted so that point sits under the peephole; it slides back to rest
 * during the zoom.
 */
export const PEEK = { x: 0.34 + 0.66 * 0.45, y: 0.46 } as const;

/** Hero copy rises inside its masks: start offset (% of the element's own height) */
export const HERO_FROM = [130, 150, 170, 210] as const;


/** Experience tiers, chosen by media query only (no flash, no hydration mismatch) */
export const MEDIA = {
    /** Pinned sequences need room to hold their content */
    pinned:
        '(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)',
    full: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
    compact: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)',
} as const;
