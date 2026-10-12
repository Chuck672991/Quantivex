'use client';
import Button from '@/components/Button';
import GridBackdrop from '@/components/GridBackdrop';
import { LogoMark } from '@/components/Logo';
import Reveal from '@/components/Reveal';
import { BRAND } from '@/lib/brand';
import { gsap } from '@/lib/scroll/gsap';
import { useAct } from '@/lib/scroll/useAct';
import { useRef } from 'react';

const CTA = () => {
    const ref = useRef<HTMLElement>(null);

    // Portal, as with the AI card: the ink panel opens from a window to the
    // full width of the screen as it arrives, and the cube mark drifts behind
    // the copy. Only the decorative background layer is clipped.
    useAct(ref, ({ q }) => {
        const card = q('[data-cta="card"]')[0];
        const bg = q('[data-cta="bg"]')[0];
        const mark = q('[data-cta="mark"]')[0];
        if (!card || !bg) return;

        gsap.set(bg, {
            left: '50%',
            right: 'auto',
            xPercent: -50,
            width: '100vw',
            borderRadius: 0,
        });

        gsap.fromTo(
            bg,
            {
                clipPath: () => {
                    const side = Math.max(
                        0,
                        (document.documentElement.clientWidth -
                            card.offsetWidth) /
                            2,
                    );
                    return `inset(0px ${side}px 0px ${side}px round 28px)`;
                },
            },
            {
                clipPath: 'inset(0px 0px 0px 0px round 0px)',
                ease: 'power2.inOut',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 94%',
                    end: 'top 30%',
                    scrub: true,
                    invalidateOnRefresh: true,
                },
            },
        );

        if (mark) {
            gsap.fromTo(
                mark,
                { yPercent: 14 },
                {
                    yPercent: -14,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    },
                },
            );
        }
    });

    return (
        <section
            ref={ref}
            aria-labelledby="cta-title"
            className="pb-12 md:pb-20"
        >
            <div className="container">
                <div
                    data-cta="card"
                    className="dark relative px-6 py-20 text-foreground md:px-16 md:py-28"
                >
                    <div
                        data-cta="bg"
                        aria-hidden
                        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] bg-ink-950 sm:rounded-[36px]"
                    >
                        <GridBackdrop at="90% 10%" className="opacity-100" />
                        <div
                            className="perf-fx absolute -right-48 -top-56 size-[52rem]"
                            style={{
                                background:
                                    'radial-gradient(closest-side, hsl(var(--primary) / 0.26), transparent)',
                            }}
                        />
                        <div
                            data-cta="mark"
                            className="absolute -bottom-16 -right-10 hidden md:block"
                        >
                            <LogoMark
                                tone="dark"
                                size={360}
                                className="opacity-[0.07]"
                            />
                        </div>
                    </div>
                    <div className="relative max-w-3xl">
                        <Reveal>
                            <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                <span
                                    aria-hidden
                                    className="size-1.5 bg-primary"
                                />
                                Let&apos;s talk
                            </p>
                        </Reveal>
                        <Reveal delay={0.08}>
                            <h2
                                id="cta-title"
                                className="text-[clamp(2.3rem,5.6vw,4.6rem)] font-medium leading-[1] tracking-[-0.05em]"
                            >
                                Have a product in mind?{' '}
                                <span className="text-gradient">
                                    Let&apos;s scope it together.
                                </span>
                            </h2>
                        </Reveal>
                        <Reveal delay={0.16}>
                            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
                                Tell us what you are building.{' '}
                                {BRAND.responseNote}
                            </p>
                        </Reveal>
                        <Reveal
                            delay={0.24}
                            className="mt-10 flex flex-wrap items-center gap-3"
                        >
                            <Button
                                href="/#contact"
                                variant="ink"
                                size="lg"
                                arrow
                            >
                                Start a project
                            </Button>
                            <Button
                                href={`mailto:${BRAND.email}`}
                                variant="outline"
                                size="lg"
                            >
                                Email us
                            </Button>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;
