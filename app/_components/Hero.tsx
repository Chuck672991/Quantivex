'use client';
import Button from '@/components/Button';
import HeroScene from '@/components/hero/HeroScene';
import { BRAND } from '@/lib/brand';
import {
    CAVE,
    HERO_FROM,
    MEDIA,
    OPENING_TOTAL,
    PEEK,
    SCROLL,
    ZOOM,
} from '@/lib/scroll/config';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/scroll/gsap';
import { HOLE_PATH } from '@/lib/scroll/hole';
import { setNavHidden } from '@/lib/scroll/navHidden';
import { isSiteReady } from '@/lib/useSiteReady';
import { useRef, type CSSProperties, type ReactNode } from 'react';
import './hero.css';

/** One headline line, masked so it rises into place. */
const Line = ({ children }: { children: ReactNode }) => (
    <span className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
        <span className="block" data-hb="mask">
            {children}
        </span>
    </span>
);

const OPENING_STYLE = {
    '--op-total': OPENING_TOTAL,
    '--op-handoff': SCROLL.handoff,
    '--op-wall-side': CAVE.side,
    // Start pose of the hero inside the thumbnail: slid so the scene's focal
    // point sits under the peephole (percent of the hero's own box)
    '--op-pan-x': `${(0.5 - PEEK.x) * 100}%`,
    '--op-pan-y': `${(0.5 - PEEK.y) * 100}%`,
} as CSSProperties;

const Hero = () => {
    const rootRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const root = rootRef.current;
            if (!root) return;

            const q = gsap.utils.selector(root);
            const strip = q('[data-op="strip"]');
            const cave = q('[data-op="cave"]');
            const photo = q('[data-op="photo"]');
            const composite = q('[data-op="composite"]');
            const veil = q('[data-op="veil"]');
            const copy = q('[data-op="hero"]');
            const cue = q('[data-op="cue"]');
            const rise = q<HTMLElement>('[data-hb]');
            const cta = q('[data-op="cta"] [data-hb]');
            const mm = gsap.matchMedia();

            mm.add(
                {
                    full: MEDIA.full,
                    compact: MEDIA.compact,
                    reduce: MEDIA.reduce,
                },
                (context) => {
                    const { full, compact } = context.conditions as Record<
                        'full' | 'compact' | 'reduce',
                        boolean
                    >;

                    if (!full) {
                        if (!compact) return; // reduced motion: nothing animates

                        // Compact screens: the headline rises once the preloader lifts
                        const masks = q('[data-hb="mask"]');
                        const soft = q('[data-hb="fade"]');
                        const intro = gsap.timeline({ paused: true });
                        gsap.set(masks, {
                            yPercent: 112,
                            visibility: 'visible',
                        });
                        gsap.set(soft, {
                            opacity: 0,
                            y: 18,
                            visibility: 'visible',
                        });
                        intro
                            .to(
                                masks,
                                {
                                    yPercent: 0,
                                    duration: 0.85,
                                    ease: 'expo.out',
                                    stagger: 0.08,
                                },
                                0.02,
                            )
                            .to(
                                soft,
                                {
                                    opacity: 1,
                                    y: 0,
                                    duration: 0.7,
                                    ease: 'expo.out',
                                    stagger: 0.1,
                                },
                                0.2,
                            );

                        if (isSiteReady()) {
                            intro.play();
                            return;
                        }
                        const start = () => intro.play();
                        window.addEventListener('quantivex:ready', start, {
                            once: true,
                        });
                        return () =>
                            window.removeEventListener(
                                'quantivex:ready',
                                start,
                            );
                    }

                    // ── Full tier: pinned scroll opening ──────────────────
                    const tl = gsap.timeline({ defaults: { ease: 'none' } });
                    // Pose the copy now, below its mask. A timeline only renders a
                    // tween once the playhead reaches it, so the start pose cannot
                    // come from the tween itself. The buttons stay hidden (they are
                    // focusable) until the reveal.
                    const fromOf = (index: number) => HERO_FROM[index] ?? 160;
                    gsap.set(rise, { yPercent: fromOf });
                    gsap.set(
                        rise.filter((el) => !cta.some((c) => c === el)),
                        { visibility: 'visible' },
                    );

                    tl.addLabel('F28');
                    tl.to({}, { duration: SCROLL.opening.lead });

                    // T01: the whole lockup (words + hole thumbnail) scales together
                    // about the viewport centre until the thumbnail covers the screen
                    tl.addLabel('T01');
                    tl.fromTo(
                        strip,
                        { scale: 1 / ZOOM },
                        {
                            scale: 1,
                            ease: 'power2.out',
                            duration: SCROLL.opening.zoom,
                        },
                        'T01',
                    );
                    // The hero behind the wall slides from the pose that shows its
                    // focal point in the peephole back to rest, arriving with the zoom
                    tl.fromTo(
                        photo,
                        {
                            x: () => (0.5 - PEEK.x) * window.innerWidth,
                            y: () => (0.5 - PEEK.y) * window.innerHeight,
                        },
                        {
                            x: 0,
                            y: 0,
                            ease: 'power2.out',
                            duration: SCROLL.opening.zoom,
                        },
                        'T01',
                    );
                    tl.to(
                        cue,
                        { autoAlpha: 0, duration: 0.2, ease: 'power1.out' },
                        'T01',
                    );

                    // T02: the wall expands past the viewport while the hero copy
                    // slides up inside its masks (concurrently, like Smart Animate)
                    tl.addLabel('F6');
                    tl.addLabel('T02');
                    tl.fromTo(
                        cave,
                        { scale: 1 },
                        {
                            scale: CAVE.end,
                            ease: 'power2.out',
                            duration: SCROLL.opening.cave,
                        },
                        'T02',
                    );
                    tl.fromTo(
                        rise,
                        { yPercent: fromOf },
                        {
                            yPercent: 0,
                            ease: 'power2.out',
                            duration: SCROLL.opening.cave,
                        },
                        'T02',
                    );
                    // Buttons are focusable: keep them out of reach until they show
                    tl.set(cta, { visibility: 'visible' }, 'T02');

                    tl.addLabel('F7');
                    tl.to({}, { duration: SCROLL.opening.heroDwell });

                    // Hand-off: the next block rises over the still-pinned hero
                    // (CSS pulls it up by the same distance) while the hero
                    // recedes: the scene eases in, the copy lifts, an ink veil
                    // gathers.
                    tl.addLabel('H');
                    tl.to(
                        composite,
                        { scale: 1.07, duration: SCROLL.handoff },
                        'H',
                    );
                    tl.to(
                        copy,
                        {
                            y: () => -0.09 * window.innerHeight,
                            duration: SCROLL.handoff,
                        },
                        'H',
                    );
                    tl.to(
                        veil,
                        { opacity: 0.6, duration: SCROLL.handoff },
                        'H',
                    );

                    // The navbar stays out of sight until the hole has opened over
                    // it. When is that? Measured from where the bar's content
                    // actually is (it depends on the viewport): the hole's typical
                    // radius reaches that distance at some scale, and the scale is
                    // eased by the cave tween (power2.out), so invert both.
                    let navShowAt = tl.labels.T02;
                    const measureNavShow = () => {
                        const centreX = window.innerWidth / 2;
                        const centreY = window.innerHeight / 2;
                        const reach = Math.hypot(centreX, centreY);
                        let farthest = 0;
                        document
                            .querySelectorAll<HTMLElement>(
                                'header a, header button',
                            )
                            .forEach((item) => {
                                const box = item.getBoundingClientRect();
                                if (!box.width) return;
                                farthest = Math.max(
                                    farthest,
                                    Math.hypot(
                                        (box.left + box.right) / 2 - centreX,
                                        (box.top + box.bottom) / 2 - centreY,
                                    ),
                                );
                            });
                        const holeRadius =
                            (CAVE.rMean / 100) * CAVE.side * reach;
                        const scale = farthest / holeRadius;
                        const progress = Math.min(
                            1,
                            Math.max(0, (scale - 1) / (CAVE.end - 1)),
                        );
                        navShowAt =
                            tl.labels.T02 +
                            (1 - Math.sqrt(1 - progress)) * SCROLL.opening.cave;
                    };
                    measureNavShow();

                    const sync = (progress: number) => {
                        setNavHidden(progress * tl.duration() < navShowAt);
                    };

                    const trigger = ScrollTrigger.create({
                        trigger: root,
                        // The stage is sticky for exactly the scroll runway
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: true,
                        animation: tl,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => sync(self.progress),
                        onRefresh: (self) => {
                            measureNavShow();
                            sync(self.progress);
                        },
                    });
                    sync(trigger.progress);

                    return () => {
                        trigger.kill();
                        setNavHidden(false);
                    };
                },
            );

            return () => mm.revert();
        },
        { scope: rootRef },
    );

    return (
        <section
            id="top"
            ref={rootRef}
            className="op"
            style={OPENING_STYLE}
            aria-labelledby="hero-title"
        >
            <div className="op-stage relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-background-light">
                {/* Lockup: "welcome to [peephole] Quantivex". The peephole shows
                    the hero behind a wall; zooming in carries you through it. */}
                <div className="op-strip" data-op="strip" aria-hidden>
                    <p className="op-word op-welcome">welcome to</p>

                    <div className="op-composite" data-op="composite">
                        <div className="op-photo" data-op="photo">
                            {/* Isometric lattice texture, faded toward the corners */}
                            <div className="pointer-events-none absolute inset-0 -z-10">
                                <div className="bg-lattice absolute inset-0" />
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background:
                                            'radial-gradient(ellipse 90% 80% at 62% 45%, transparent 0%, hsl(var(--background-light)) 85%)',
                                    }}
                                />
                            </div>
                            <HeroScene className="order-2 h-[46svh] min-h-[340px] w-full lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:min-h-0 lg:w-[66%]" />
                        </div>
                    </div>

                    {/* The wall: ink, with the broken peephole cut out of it */}
                    <svg
                        className="op-cave"
                        data-op="cave"
                        viewBox="0 0 100 100"
                        focusable="false"
                    >
                        <path
                            fillRule="evenodd"
                            d={`M0 0H100V100H0Z ${HOLE_PATH}`}
                        />
                    </svg>

                    <p className="op-word op-brand">{BRAND.name}</p>
                </div>

                <div className="op-veil" data-op="veil" aria-hidden />

                <div className="op-hero" data-op="hero">
                    <div className="container relative z-10 flex flex-1 items-start pb-2 pt-[104px] sm:pt-[120px] lg:items-end lg:pb-[15vh] lg:pt-0">
                        <div className="max-w-[560px] min-[1700px]:max-w-[700px]">
                            <h1
                                id="hero-title"
                                className="text-[clamp(2.15rem,9.4vw,3rem)] font-medium leading-[0.98] tracking-[-0.045em] text-foreground sm:text-[clamp(2.6rem,6.6vw,3.5rem)] lg:text-[clamp(3rem,4.05vw,4.1rem)]"
                            >
                                <Line>Intelligent software</Line>
                                <Line>for your next product</Line>
                            </h1>

                            <div className="hb-soft mt-5 lg:mt-6">
                                <p
                                    data-hb="fade"
                                    className="max-w-[26rem] text-[15px] leading-[1.5] tracking-[-0.012em] text-foreground/75 sm:text-base lg:text-[17px]"
                                >
                                    Quantivex designs and builds web platforms,
                                    mobile apps and AI systems — from first
                                    prototype to App Store release and
                                    production.
                                </p>
                            </div>

                            <div data-op="cta" className="hb-soft mt-7 lg:mt-9">
                                <div
                                    data-hb="fade"
                                    className="flex flex-wrap items-center gap-3"
                                >
                                    <Button
                                        href="/#contact"
                                        variant="ink"
                                        size="lg"
                                    >
                                        Discuss your project
                                    </Button>
                                    <Button
                                        href="/#work"
                                        variant="outline"
                                        size="lg"
                                    >
                                        View our work
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="op-cue" data-op="cue" aria-hidden>
                    Scroll
                </p>
            </div>
        </section>
    );
};

export default Hero;
