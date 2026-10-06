'use client';

import AiRobotScene from '@/components/AiRobotScene';
import SectionTitle from '@/components/SectionTitle';
import TransitionLink from '@/components/TransitionLink';
import { AI_CAPABILITIES, AI_PROJECTS } from '@/lib/aiData';
import { cn } from '@/lib/utils';
import {
    motion,
    useReducedMotion,
    useSpring,
    useTransform,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useState, type PointerEvent } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { stiffness: 70, damping: 18, mass: 0.6 };
const DEFAULT_GLOW = '34, 211, 238';

// Static class names so Tailwind can see them: each side stacks in rows 1–3.
const ROW = ['lg:row-start-1', 'lg:row-start-2', 'lg:row-start-3'];
const COL = { left: 'lg:col-start-1', right: 'lg:col-start-3' } as const;

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * One line of the headline, masked so it rises into view. The *mask* is what
 * gets observed: a translated child sits fully outside its own overflow-hidden
 * parent, so the browser reports zero intersection and it would never fire.
 */
const MaskedLine = ({
    children,
    delay = 0,
    className,
    reduce,
}: {
    children: string;
    delay?: number;
    className?: string;
    reduce: boolean;
}) => (
    <motion.span
        className="block overflow-hidden pb-[0.1em]"
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
    >
        <motion.span
            className={cn('block', className)}
            variants={{
                hidden: { y: '110%' },
                show: {
                    y: 0,
                    transition: { duration: 0.9, ease: EASE, delay },
                },
            }}
        >
            {children}
        </motion.span>
    </motion.span>
);

const AISection = () => {
    const reduce = useReducedMotion() ?? false;
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
        <section id="ai-systems" className="pb-section max-md:pb-20">
            <div className="container">
                <SectionTitle title="AI & INTELLIGENT SYSTEMS" />

                <div
                    className="relative overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#0B0C0E] text-white"
                    onPointerMove={onPointerMove}
                    onPointerLeave={onPointerLeave}
                >
                    {/* Grid + ambient glows (opacity-only transitions — no blur filters) */}
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
                            background: `radial-gradient(55% 50% at 50% 56%, rgba(${DEFAULT_GLOW},0.14), transparent 70%), radial-gradient(40% 40% at 88% 8%, rgba(99,102,241,0.14), transparent 70%)`,
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

                    <div className="relative z-10 px-6 pb-8 pt-10 md:px-12 md:pt-14 lg:px-16">
                        {/* ── Headline ── */}
                        <motion.p
                            initial={reduce ? false : { opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, ease: EASE }}
                            className="mb-5 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300/80"
                        >
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-300 opacity-60 motion-reduce:animate-none" />
                                <span className="relative inline-flex size-2 rounded-full bg-cyan-300" />
                            </span>
                            AI Engineering
                        </motion.p>

                        <h3 className="max-w-5xl font-anton text-4xl uppercase leading-[0.92] sm:text-5xl md:text-6xl lg:text-7xl">
                            <MaskedLine reduce={reduce}>
                                I don’t just build interfaces.
                            </MaskedLine>
                            <MaskedLine
                                reduce={reduce}
                                delay={0.12}
                                className="text-gradient"
                            >
                                I build intelligent systems.
                            </MaskedLine>
                        </h3>

                        <motion.p
                            initial={reduce ? false : { opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                duration: 0.7,
                                ease: EASE,
                                delay: 0.25,
                            }}
                            className="mt-6 max-w-xl text-sm leading-relaxed text-white/50 md:text-base"
                        >
                            Agentic AI systems — LLM agents with tool calling,
                            MCP integrations, context-aware retrieval and n8n
                            automation pipelines — built into the web and
                            mobile products around them.
                        </motion.p>

                        {/* ── Robot + callouts ── */}
                        <div className="relative mt-6 grid grid-cols-2 gap-3 lg:mt-2 lg:grid-cols-[1fr_minmax(0,540px)_1fr] lg:grid-rows-3 lg:gap-x-4 lg:gap-y-0">
                            <motion.div
                                initial={
                                    reduce
                                        ? false
                                        : { opacity: 0, scale: 0.9 }
                                }
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 1, ease: EASE }}
                                className="relative order-first col-span-2 mx-auto aspect-square w-full max-w-[400px] lg:order-none lg:col-span-1 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:aspect-auto lg:h-[640px] lg:max-w-none"
                            >
                                {/* Orbit rings sit behind the canvas */}
                                <motion.div
                                    aria-hidden
                                    style={{ x: ringX, y: ringY }}
                                    className="pointer-events-none absolute inset-0"
                                >
                                    <div className="ai-spin absolute inset-[4%] rounded-full border border-dashed border-cyan-300/15 lg:inset-[2%]" />
                                    <div className="ai-spin-reverse absolute inset-[16%] rounded-full border border-indigo-300/15 lg:inset-[14%]" />
                                    <div className="absolute inset-[30%] rounded-full border border-white/[0.06] lg:inset-[28%]" />
                                </motion.div>
                                <AiRobotScene className="absolute inset-0" />
                            </motion.div>

                            {AI_CAPABILITIES.map((cap, i) => {
                                const sideIndex = AI_CAPABILITIES.filter(
                                    (c, j) => c.side === cap.side && j < i,
                                ).length;
                                const lit = litCaps.includes(cap.id);
                                const left = cap.side === 'left';

                                return (
                                    <motion.div
                                        key={cap.id}
                                        initial={
                                            reduce
                                                ? false
                                                : {
                                                      opacity: 0,
                                                      x: left ? -24 : 24,
                                                  }
                                        }
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, amount: 0.5 }}
                                        transition={{
                                            duration: 0.8,
                                            ease: EASE,
                                            delay: 0.15 + i * 0.07,
                                        }}
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
                                                    ? 'border-cyan-300/50 bg-cyan-300/[0.07]'
                                                    : 'border-white/10 bg-white/[0.03]',
                                                anyLit && !lit && 'opacity-50',
                                            )}
                                        >
                                            <p className="font-mono text-[10px] tracking-[0.22em] text-cyan-300/80">
                                                {pad(i + 1)}
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-white">
                                                {cap.label}
                                            </p>
                                            <p className="mt-0.5 text-xs leading-snug text-white/50">
                                                {cap.detail}
                                            </p>

                                            {/* Connector to the robot — desktop only */}
                                            <span
                                                aria-hidden
                                                className={cn(
                                                    'pointer-events-none absolute top-1/2 hidden h-px w-14 lg:block',
                                                    left
                                                        ? 'left-full bg-gradient-to-r from-cyan-300/45 to-transparent'
                                                        : 'right-full bg-gradient-to-l from-cyan-300/45 to-transparent',
                                                )}
                                            />
                                            <span
                                                aria-hidden
                                                className={cn(
                                                    'pointer-events-none absolute top-1/2 hidden size-1.5 -translate-y-1/2 rounded-full bg-cyan-300 transition-shadow duration-300 lg:block',
                                                    left
                                                        ? 'left-[calc(100%+3.5rem)]'
                                                        : 'right-[calc(100%+3.5rem)]',
                                                    lit &&
                                                        'shadow-[0_0_14px_3px_rgba(34,211,238,0.65)]',
                                                )}
                                            />
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* ── Systems shipped + CTA ── */}
                        <div className="mt-8 lg:mt-4">
                            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">
                                Systems I’ve built
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
                                                    'group relative flex h-full flex-col gap-1 border-t border-white/10 py-4 pr-3 transition-opacity duration-300 focus-visible:outline-none',
                                                    anyLit &&
                                                        !lit &&
                                                        'opacity-45',
                                                )}
                                            >
                                                <span
                                                    aria-hidden
                                                    className={cn(
                                                        'absolute inset-x-0 -top-px h-px origin-left bg-cyan-300 transition-transform duration-500',
                                                        lit
                                                            ? 'scale-x-100'
                                                            : 'scale-x-0',
                                                    )}
                                                />
                                                <span className="font-mono text-[10px] tracking-[0.22em] text-cyan-300/70">
                                                    {pad(i + 1)}
                                                </span>
                                                <span className="flex items-start justify-between gap-2 font-anton text-lg uppercase leading-tight">
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
                                                <span className="text-xs text-white/45">
                                                    {p.category}
                                                </span>
                                            </TransitionLink>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                                <TransitionLink
                                    href="/ai-projects"
                                    className="group inline-flex items-center gap-2 bg-primary px-6 py-3.5 font-anton text-sm uppercase tracking-wider text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
                                >
                                    Explore AI Projects
                                    <ArrowUpRight
                                        size={18}
                                        className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </TransitionLink>
                                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/35">
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
