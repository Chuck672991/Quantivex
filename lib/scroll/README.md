# Scroll system

How the homepage scroll animations are built. The approach is ported from the
Voxity reference (`/Users/haiderali/MERN/vox-city`), adapted to Quantivex's
flowing page instead of one pinned stage.

## Pieces

| File | Role |
| --- | --- |
| `gsap.ts` | The only place GSAP, ScrollTrigger and `useGSAP` are registered. Import from here. |
| `config.ts` | The scroll budget (`SCROLL`, 1 = 100vh), the hole geometry (`CAVE`, `ZOOM`), and the media queries that pick the tier (`MEDIA`). Tune lengths here and nowhere else. |
| `springs.ts` | `springEase` as a GSAP function ease, ported from Voxity (the Process step markers settle with `SPRING_16_6`; the opening uses `power2.out` like the reference). |
| `useAct.ts` | `useAct(ref, build)`: one section = one act. Runs `build` per tier inside `gsap.matchMedia`, so everything it creates is reverted on tier change and unmount. |
| `hole.ts` | The broken peephole outline (an SVG path, generated once with a fixed seed). |
| `navHidden.ts` | Tiny external store (no per-frame React renders): the navbar and progress line stay hidden until the hole has opened over them. |
| `../../components/scroll/SmoothScroll.tsx` | Lenis + GSAP wiring: Lenis is stepped from `gsap.ticker` (`autoRaf: false`), calls `ScrollTrigger.update` on scroll, `lagSmoothing(0)`. Also refreshes triggers after fonts/load/preloader. |

## Tiers

Chosen by CSS media query only, so there is no flash and no hydration mismatch.

- **full**: >= 1024px wide, motion allowed. Pinned opening, hand-off, portals.
- **pinned**: full and >= 720px tall. Also pins Services and stacks the case studies.
- **compact**: < 1024px, motion allowed. Same reveals, no pinning.
- **reduced motion**: `useAct` never runs the build and `Reveal` never plays. The page is static and fully visible (the hidden start states in `globals.css` / `hero.css` are all inside `prefers-reduced-motion: no-preference`).

## The hero opening (`app/_components/Hero.tsx`, `hero.css`)

One ScrollTrigger scrubs one timeline over a tall runway section; the stage is
`position: sticky` inside it (no pin spacer, so React never sees DOM it did not
render). The runway height is `calc(100svh * (1 + total + handoff))`, with the
numbers set from `config.ts` as CSS variables, so the page is the right height
before any script runs.

1. `T01`: the lockup ("welcome to", the thumbnail, the wordmark) scales
   `1/ZOOM -> 1` about the viewport centre (`power2.out`). The hero behind the
   wall slides back to rest at the same time: it starts shifted so the scene's
   focal point (`PEEK`) shows in the peephole.
2. `T02`: the wall (an ink SVG square with the broken hole cut out of it,
   `hole.ts`) scales `1 -> CAVE.end` while the hero copy slides up inside its
   masks. The wall is the same ink as the stage, so the thumbnail has no
   visible edge; it is not clipped by the composite (that left a 1px seam).
3. `H`: hand-off. `.op-rise` (marquee + intro) is pulled up by the same
   distance in CSS, so it slides over the still-pinned hero while the hero
   recedes (scene scales, copy lifts, an ink veil gathers).

Rules that keep it correct: geometry is authored at the END pose and scaled
down; start poses come from CSS (or an explicit `gsap.set`), because a timeline
only renders a tween once the playhead reaches it; `CAVE.rMin * CAVE.end * CAVE.side / 100`
must exceed 1 so the hole clears the corners at any aspect ratio (re-check it
if you change the hole shape); never put
`will-change` on the big text. A canvas inside the scaled strip (the R3F hero
scene) must be measured by layout size (`resize={{ offsetSize: true }}`):
`getBoundingClientRect` reports the scaled box and sizes the canvas too small.

## Adding an act

```tsx
const ref = useRef<HTMLElement>(null);
useAct(ref, ({ q, full, pinned }) => {
    gsap.fromTo(q('[data-x]'), { opacity: 0 }, {
        opacity: 1,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', scrub: true },
    });
});
```

- Create ScrollTriggers only inside `useAct` (or `useGSAP`) so cleanup is automatic.
- Prefer transform/opacity. A clipped layer should be a decorative background, never the content (see the AI card and CTA portals).
- Pinned sequences: a tall section with `--x-total` in CSS and a sticky stage (see `Services` + `acts.css`), not `pin: true`.
- Anything that persists after the matchMedia reverts (text content, store values) needs its own cleanup returned from `build`.

## Debugging

In development `window.__qxScroll.triggers()` / `.list()` report the live
ScrollTriggers. The count should be the same after navigating away from the
page and back.
