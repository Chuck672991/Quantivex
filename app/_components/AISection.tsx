'use client';
import { useReducedMotion } from '@/lib/useReducedMotion';

import AiRobotScene from '@/components/AiRobotScene';
import Button from '@/components/Button';
import Reveal from '@/components/Reveal';
import TransitionLink from '@/components/TransitionLink';
import { AI_CAPABILITIES, AI_PROJECTS } from '@/lib/aiData';
import { cn } from '@/lib/utils';
import { motion, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { gsap } from '@/lib/scroll/gsap';
import { useAct } from '@/lib/scroll/useAct';
import { useAnimGate } from '@/lib/useAnimGate';
import { useRef, useState, type PointerEvent } from 'react';

const SPRING = { stiffness: 70, damping: 18, mass: 0.6 };
const DEFAULT_GLOW = '107, 140, 255';

// Static class names so Tailwind can see them: each side stacks in rows 1–3.
const ROW = ['lg:row-start-1', 'lg:row-start-2', 'lg:row-start-3'];
const COL = { left: 'lg:col-start-1', right: 'lg:col-start-3' } as const;

const pad = (n: number) => String(n).padStart(2, '0');

/** One line of the headline, sliding up inside its own clip. */
const MaskedLine = ({
    children,
    delay = 0,
    className,
}: {
    children: string;
    delay?: number;
    className?: string;
}) => (
    <Reveal variant="mask" delay={delay} className="pb-[0.1em]">
        <span className={cn('block', className)}>{children}</span>
    </Reveal>
);

const AISection = () => {
    const reduce = useReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    useAnimGate(cardRef);

    // Portal: the ink card starts as a window inside the page and opens to the
    // full width of the screen as it arrives, the robot growing into it. Only
    // the card's background layer is clipped (a static gradient: cheap to
    // repaint); the content on top is never masked.
    useAct(sectionRef, ({ q }) => {
        const card = cardRef.current;
        const bg = q('[data-ai="bg"]')[0];
        const robot = q('[data-ai="robot"]')[0];
        if (!card || !bg) return;

        gsap.set(bg, {
            left: '50%',
            right: 'auto',
            xPercent: -50,
            width: '100vw',
            borderWidth: 0,
            borderRadius: 0,
        });

        const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                end: 'top 22%',
                scrub: true,
                invalidateOnRefresh: true,
            },
        });
        tl.fromTo(
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
                duration: 1,
            },
            0,
        );
        if (robot) {
            tl.fromTo(
                robot,
                { scale: 0.82, opacity: 0.2 },
                { scale: 1, opacity: 1, ease: 'power2.out', duration: 0.8 },
                0.1,
            );
        }
    });
    const [activeCap, setActiveCap] = useState<string | null>(null);
    const [activeProject, setActiveProject] = useState<string | null>(null);

    // Capabilities and projects light each other up: hover a skill to see the
    // work that demonstrates it, or focus a project to see the skills it used.
    const capability = AI_CAPABILITIES.find((c) => c.id === activeCap);
    const litProjects = capability
        ? capability.projectIds
        : activeProject
        ? [activeProject]
        : [];
    const litCaps = activeProject
        ? AI_CAPABILITIES.filter((c) =>
              c.projectIds.includes(activeProject),
          ).map((c) => c.id)
        : activeCap
        ? [activeCap]
        : [];
    const anyLit = litProjects.length > 0 || litCaps.length > 0;
    const glowProject = activeProject ?? litProjects[0] ?? null;

    // Pointer parallax on the stage (mouse only, off for reduced motion).
    const px = useSpring(0, SPRING);
    const py = useSpring(0, SPRING);
    const leftX = useTransform(px, (v) => v * -9);
    const rightX = useTransform(px, (v) => v * 9);
    const calloutY = useTransform(py, (v) => v * 6);
    const ringX = useTransform(px, (v) => v * -14);
    const ringY = useTransform(py, (v) => v * -10);

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (reduce || e.pointerType !== 'mouse') return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    const onPointerLeave = () => {
        px.set(0);
        py.set(0);
    };

    return (
        <section id="ai-systems" ref={sectionRef} className="py-12 md:py-20">
            <div className="container">
                <div
                    ref={cardRef}
                    className="dark relative text-foreground"
                    onPointerMove={onPointerMove}
                    onPointerLeave={onPointerLeave}
                >
                    {/* The card's background: grid + ambient glows (opacity-only
                        transitions — no blur filters). It owns the clipping and
                        the border, so the portal can widen it past the card. */}
                    <div
                        data-ai="bg"
                        aria-hidden
                        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] border border-border bg-ink-950"
                    >
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0"
                            style={{
                                backgroundImage:
                                    'linear-gradient(to right,rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.022) 1px,transparent 1px)',
                                backgroundSize: '48px 48px',
                            }}
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background: `radial-gradient(55% 50% at 50% 56%, rgba(${DEFAULT_GLOW},0.14), transparent 70%), radial-gradient(40% 40% at 88% 8%, rgba(63,104,242,0.16), transparent 70%)`,
                            }}
                        />
                        {AI_PROJECTS.map((p) => (
                            <div
                                key={p.id}
                                aria-hidden
                                className={cn(
                                    'pointer-events-none absolute inset-0 transition-opacity duration-700',
                                    glowProject === p.id
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                )}
                                style={{
                                    background: `radial-gradient(55% 50% at 50% 56%, rgba(${p.accent},0.2), transparent 70%)`,
                                }}
                            />
                        ))}
                    </div>

                    <div className="relative z-10 px-6 pb-8 pt-10 md:px-12 md:pt-14 lg:px-16">
                        {/* ── Headline ── */}
                        <Reveal y={10}>
                            <p className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
                                <span className="relative flex size-2">
                                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                                    <span className="relative inline-flex size-2 rounded-full bg-primary" />
                                </span>
                                03 — AI Solutions
                            </p>
                        </Reveal>

                        <h3 className="max-w-5xl text-[clamp(2.1rem,5.6vw,4.6rem)] font-medium leading-[1] tracking-[-0.045em]">
                            <MaskedLine>
                                We don’t just build interfaces.
                            </MaskedLine>
                            <MaskedLine delay={0.12} className="text-gradient">
                                We build intelligent systems.
                            </MaskedLine>
                        </h3>

                        <Reveal delay={0.25} y={14}>
                            <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                                Agentic AI systems — LLM agents with tool
                                calling, MCP integrations, context-aware
                                retrieval and n8n automation pipelines — built
                                into the web and mobile products around them.
                            </p>
                        </Reveal>

                        {/* ── Robot + callouts ── */}
                        <div className="relative mt-6 grid grid-cols-2 gap-3 lg:mt-2 lg:grid-cols-[1fr_minmax(0,540px)_1fr] lg:grid-rows-3 lg:gap-x-4 lg:gap-y-0">
                            <div
                                data-ai="robot"
                                className="relative order-first col-span-2 mx-auto aspect-square w-full max-w-[400px] lg:order-none lg:col-span-1 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:aspect-auto lg:h-[640px] lg:max-w-none"
                            >
                                {/* Orbit rings sit behind the canvas */}
                                <motion.div
                                    aria-hidden
                                    style={{ x: ringX, y: ringY }}
                                    className="pointer-events-none absolute inset-0"
                                >
                                    <div className="ai-spin absolute inset-[4%] rounded-full border border-dashed border-primary/20 lg:inset-[2%]" />
                                    <div className="ai-spin-reverse absolute inset-[16%] rounded-full border border-primary/15 lg:inset-[14%]" />
                                    <div className="absolute inset-[30%] rounded-full border border-border lg:inset-[28%]" />
                                </motion.div>
                                <AiRobotScene className="absolute inset-0" />
                            </div>

                            {AI_CAPABILITIES.map((cap, i) => {
                                const sideIndex = AI_CAPABILITIES.filter(
                                    (c, j) => c.side === cap.side && j < i,
                                ).length;
                                const lit = litCaps.includes(cap.id);
                                const left = cap.side === 'left';

                                return (
                                    <Reveal
                                        key={cap.id}
                                        x={left ? -24 : 24}
                                        y={0}
                                        delay={0.15 + i * 0.07}
                                        amount={0.2}
                                        className={cn(
                                            'lg:self-center',
                                            COL[cap.side],
                                            ROW[sideIndex],
                                        )}
                                    >
                                        <motion.div
                                            style={{
                                                x: left ? leftX : rightX,
                                                y: calloutY,
                                            }}
                                            onPointerEnter={() =>
                                                setActiveCap(cap.id)
                                            }
                                            onPointerLeave={() =>
                                                setActiveCap(null)
                                            }
                                            className={cn(
                                                'relative rounded-xl border px-4 py-3 transition-[border-color,background-color,opacity] duration-300 lg:max-w-[240px]',
                                                left && 'lg:ml-auto',
                                                lit
                                                    ? 'border-primary/50 bg-primary/[0.08]'
                                                    : 'border-border bg-foreground/[0.03]',
                                                anyLit && !lit && 'opacity-50',
                                            )}
                                        >
                                            <p className="font-mono text-[10px] tracking-[0.22em] text-primary">
                                                {pad(i + 1)}
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-foreground">
                                                {cap.label}
                                            </p>
                                            <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                                                {cap.detail}
                                            </p>

                                            {/* Connector to the robot — desktop only */}
                                            <span
                                                aria-hidden
                                                className={cn(
                                                    'pointer-events-none absolute top-1/2 hidden h-px w-14 lg:block',
                                                    left
                                                        ? 'left-full bg-gradient-to-r from-primary/50 to-transparent'
                                                        : 'right-full bg-gradient-to-l from-primary/50 to-transparent',
                                                )}
                                            />
                                            <span
                                                aria-hidden
                                                className={cn(
                                                    'pointer-events-none absolute top-1/2 hidden size-1.5 -translate-y-1/2 rounded-full bg-primary transition-shadow duration-300 lg:block',
                                                    left
                                                        ? 'left-[calc(100%+3.5rem)]'
                                                        : 'right-[calc(100%+3.5rem)]',
                                                    lit &&
                                                        'shadow-[0_0_14px_3px_rgba(107,140,255,0.6)]',
                                                )}
                                            />
                                        </motion.div>
                                    </Reveal>
                                );
                            })}
                        </div>

                        {/* ── Systems shipped + CTA ── */}
                        <div className="mt-8 lg:mt-4">
                            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80">
                                Systems we’ve built
                            </p>
                            <ul className="grid sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-5">
                                {AI_PROJECTS.map((p, i) => {
                                    const lit = litProjects.includes(p.id);
                                    return (
                                        <li key={p.id}>
                                            <TransitionLink
                                                href={`/ai-projects#${p.id}`}
                                                onPointerEnter={() =>
                                                    setActiveProject(p.id)
                                                }
                                                onPointerLeave={() =>
                                                    setActiveProject(null)
                                                }
                                                onFocus={() =>
                                                    setActiveProject(p.id)
                                                }
                                                onBlur={() =>
                                                    setActiveProject(null)
                                                }
                                                className={cn(
                                                    'group relative flex h-full flex-col gap-1 border-t border-border py-4 pr-3 transition-opacity duration-300 focus-visible:outline-none',
                                                    anyLit &&
                                                        !lit &&
                                                        'opacity-45',
                                                )}
                                            >
                                                <span
                                                    aria-hidden
                                                    className={cn(
                                                        'absolute inset-x-0 -top-px h-px origin-left bg-primary transition-transform duration-500',
                                                        lit
                                                            ? 'scale-x-100'
                                                            : 'scale-x-0',
                                                    )}
                                                />
                                                <span className="font-mono text-[10px] tracking-[0.22em] text-primary">
                                                    {pad(i + 1)}
                                                </span>
                                                <span className="flex items-start justify-between gap-2 font-display text-[17px] font-medium leading-tight tracking-[-0.02em]">
                                                    {p.title}
                                                    <ArrowUpRight
                                                        size={15}
                                                        className={cn(
                                                            'mt-1 shrink-0 transition-all duration-300',
                                                            lit
                                                                ? 'translate-x-0 translate-y-0 opacity-100'
                                                                : '-translate-x-1 translate-y-1 opacity-0',
                                                        )}
                                                    />
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {p.category}
                                                </span>
                                            </TransitionLink>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                                <Button
                                    href="/ai-projects"
                                    variant="cobalt"
                                    size="lg"
                                    arrow
                                >
                                    Explore AI projects
                                </Button>
                                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80">
                                    {AI_PROJECTS.length} systems · agents ·
                                    retrieval · automation
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AISection;
