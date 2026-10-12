'use client';
import AnchorLink from '@/components/AnchorLink';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { SERVICES } from '@/lib/brand';
import { MEDIA, SCROLL } from '@/lib/scroll/config';
import { gsap, ScrollTrigger } from '@/lib/scroll/gsap';
import { useAct } from '@/lib/scroll/useAct';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useRef, useState, type CSSProperties } from 'react';

const BEATS = SERVICES.length;
const RUNWAY = BEATS * SCROLL.services.beat + SCROLL.services.dwell;
const RUNWAY_STYLE = { '--sv-total': RUNWAY } as CSSProperties;
// The pinned layout stacks every detail panel in the row after the titles
const LIST_STYLE = { '--sv-detail-row': BEATS + 1 } as CSSProperties;

const Services = () => {
    const ref = useRef<HTMLElement>(null);
    const [activeId, setActiveId] = useState<string>(SERVICES[0].id);

    // Tall desktop screens: the section pins and the scroll walks through the
    // services one beat at a time (focus follows the scroll). Elsewhere the
    // list is the plain hover/click accordion.
    useAct(ref, ({ root, q, pinned }) => {
        if (!pinned) return;

        const fill = q('[data-sv-fill]');
        const count = q('[data-sv-count]')[0];
        let current = -1;

        const tl = gsap.timeline({ defaults: { ease: 'none' } });
        tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 1 });

        const focus = (index: number) => {
            if (index === current) return;
            current = index;
            setActiveId(SERVICES[index].id);
            if (count) count.textContent = String(index + 1).padStart(2, '0');
        };

        const trigger = ScrollTrigger.create({
            trigger: root,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            animation: tl,
            onUpdate: (self) =>
                focus(
                    Math.min(
                        BEATS - 1,
                        Math.floor(
                            (self.progress * RUNWAY) / SCROLL.services.beat,
                        ),
                    ),
                ),
        });
        focus(
            Math.min(
                BEATS - 1,
                Math.floor((trigger.progress * RUNWAY) / SCROLL.services.beat),
            ),
        );
    });

    return (
        <section
            id="services"
            ref={ref}
            className="sv relative"
            style={RUNWAY_STYLE}
        >
            <div className="sv-stage py-24 md:py-36">
                <div className="container grid gap-14 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-4 lg:self-start">
                        <SectionHeading
                            index="02"
                            label="Services"
                            title={
                                <>
                                    What we build{' '}
                                    <span className="text-gradient">
                                        for you
                                    </span>
                                </>
                            }
                        >
                            <p>
                                Five disciplines, one engineering team: so the
                                product, the platform behind it and the way it
                                ships all fit together.
                            </p>
                        </SectionHeading>

                        {/* Pinned layout only: where the scroll is in the list */}
                        <div aria-hidden className="sv-meter mt-12">
                            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                <span data-sv-count className="text-foreground">
                                    01
                                </span>{' '}
                                / {String(BEATS).padStart(2, '0')}
                            </p>
                            <div className="mt-3 h-px w-40 bg-border">
                                <div
                                    data-sv-fill
                                    className="h-full origin-left bg-primary"
                                    style={{ transform: 'scaleX(0)' }}
                                />
                            </div>
                        </div>
                    </div>

                    <Reveal className="lg:col-span-8" amount={0.1}>
                        <ul
                            className="sv-list border-b border-border"
                            style={LIST_STYLE}
                        >
                            {SERVICES.map((service, i) => {
                                const open = activeId === service.id;
                                const panelId = `service-${service.id}`;
                                return (
                                    <li
                                        key={service.id}
                                        className="relative border-t border-border"
                                    >
                                        <span
                                            aria-hidden
                                            className={cn(
                                                'absolute inset-x-0 -top-px h-px origin-left bg-primary transition-transform duration-700',
                                                open
                                                    ? 'scale-x-100'
                                                    : 'scale-x-0',
                                            )}
                                        />
                                        <h3 className="font-sans">
                                            <button
                                                type="button"
                                                id={`${panelId}-trigger`}
                                                aria-expanded={open}
                                                aria-controls={panelId}
                                                onClick={() =>
                                                    setActiveId(service.id)
                                                }
                                                onPointerMove={(event) => {
                                                    // Hover opens a row only when the mouse itself
                                                    // moved: content scrolling under a resting
                                                    // pointer must not toggle it (layout shift),
                                                    // and when pinned the scroll picks the service
                                                    if (
                                                        event.pointerType ===
                                                            'mouse' &&
                                                        (event.movementX !==
                                                            0 ||
                                                            event.movementY !==
                                                                0) &&
                                                        !window.matchMedia(
                                                            MEDIA.pinned,
                                                        ).matches
                                                    )
                                                        setActiveId(service.id);
                                                }}
                                                className="group flex w-full items-center gap-4 py-6 text-left sm:gap-6 sm:py-7"
                                            >
                                                <span className="w-7 shrink-0 font-mono text-xs tracking-[0.18em] text-muted-foreground">
                                                    0{i + 1}
                                                </span>
                                                <span
                                                    className={cn(
                                                        'flex-1 font-display text-[clamp(1.45rem,2.7vw,2.25rem)] font-medium leading-[1.1] tracking-[-0.04em] transition-colors duration-300',
                                                        open
                                                            ? 'text-foreground'
                                                            : 'text-foreground/50 group-hover:text-foreground/80',
                                                    )}
                                                >
                                                    {service.title}
                                                </span>
                                                <span
                                                    aria-hidden
                                                    className={cn(
                                                        'grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500',
                                                        open
                                                            ? 'rotate-45 border-foreground bg-foreground text-background'
                                                            : 'border-border text-foreground group-hover:border-foreground/50',
                                                    )}
                                                >
                                                    <Plus size={16} />
                                                </span>
                                            </button>
                                        </h3>

                                        <div
                                            id={panelId}
                                            role="region"
                                            aria-labelledby={`${panelId}-trigger`}
                                            inert={!open}
                                            className={cn(
                                                'grid transition-[grid-template-rows,opacity] duration-500 ease-out',
                                                open
                                                    ? 'grid-rows-[1fr] opacity-100'
                                                    : 'grid-rows-[0fr] opacity-0',
                                            )}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="grid gap-6 pb-9 sm:pl-[calc(1.75rem+1.5rem)] md:grid-cols-[1fr_auto] md:items-end md:gap-10">
                                                    <div className="max-w-xl space-y-3">
                                                        <p className="text-lg leading-snug tracking-[-0.015em] text-foreground">
                                                            {service.summary}
                                                        </p>
                                                        <p className="text-[15px] leading-relaxed text-muted-foreground">
                                                            {service.detail}
                                                        </p>
                                                        <ul className="flex flex-wrap gap-2 pt-2">
                                                            {service.tags.map(
                                                                (tag) => (
                                                                    <li
                                                                        key={
                                                                            tag
                                                                        }
                                                                        className="rounded-full border border-border bg-background-light px-3 py-1 text-xs text-foreground/80"
                                                                    >
                                                                        {tag}
                                                                    </li>
                                                                ),
                                                            )}
                                                        </ul>
                                                    </div>
                                                    <AnchorLink
                                                        href={
                                                            service.proof.href
                                                        }
                                                        className="group/link inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-foreground/25 underline-offset-[6px] transition-colors hover:decoration-primary"
                                                    >
                                                        {service.proof.label}
                                                        <ArrowUpRight
                                                            size={15}
                                                            aria-hidden
                                                            className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                                                        />
                                                    </AnchorLink>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default Services;
