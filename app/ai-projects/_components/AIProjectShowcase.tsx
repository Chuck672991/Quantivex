'use client';

import TransitionLink from '@/components/TransitionLink';
import type { IAIProject } from '@/lib/aiData';
import { cn } from '@/lib/utils';
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';
import { ArrowUpRight, ChevronDown, ChevronRight } from 'lucide-react';
import { Fragment, useRef, useState } from 'react';
import AIFlowDiagram from './AIFlowDiagram';
import AIProjectDetails from './AIProjectDetails';
import AIProjectPhones from './AIProjectPhones';
import AIProjectTechStack from './AIProjectTechStack';
import { ink } from './accent';

interface Props {
    project: IAIProject;
    index: number;
    total: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;
const pad = (n: number) => String(n).padStart(2, '0');

const AIProjectShowcase = ({ project, index, total }: Props) => {
    const sectionRef = useRef<HTMLElement>(null);
    const reduce = useReducedMotion() ?? false;
    const [open, setOpen] = useState(false);
    const { accent, layout } = project;
    const wide = layout === 'wide';
    const hasScreens = Boolean(project.screenshots?.length);

    // The outlined numeral drifts against the scroll for depth
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });
    const numeralY = useTransform(
        scrollYProgress,
        [0, 1],
        reduce ? [0, 0] : [90, -90],
    );

    const panelId = `${project.id}-breakdown`;

    const text = (
        <div className={cn(wide && 'lg:grid lg:grid-cols-12 lg:gap-x-12')}>
            <div className={cn(wide && 'lg:col-span-12')}>
                {/* The h2 is the observed mask; its child slides up (see AISection) */}
                <motion.h2
                    id={`${project.id}-heading`}
                    className="overflow-hidden pb-[0.08em] font-anton text-[clamp(2.4rem,5.6vw,4.9rem)] uppercase leading-[0.95] text-white"
                    initial={reduce ? false : 'hidden'}
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    <motion.span
                        className="block"
                        variants={{
                            hidden: { y: '108%' },
                            show: {
                                y: 0,
                                transition: { duration: 0.9, ease: EASE },
                            },
                        }}
                    >
                        {project.title}
                    </motion.span>
                </motion.h2>
            </div>

            <div className={cn('mt-6', wide && 'lg:col-span-7')}>
                <motion.p
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
                    className="max-w-[56ch] text-base leading-relaxed text-white/60 md:text-lg"
                >
                    {project.summary}
                </motion.p>

                <ul className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                        <li
                            key={tag}
                            className="rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em]"
                            style={{
                                borderColor: `rgba(${accent},0.45)`,
                                background: `rgba(${accent},0.08)`,
                                color: ink(accent),
                            }}
                        >
                            {tag}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={cn('mt-6', wide && 'lg:col-span-5')}>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                    Tech stack
                </p>
                <AIProjectTechStack
                    technologies={project.technologies}
                    accent={accent}
                />
            </div>

            <div
                className={cn(
                    'mt-8 flex flex-wrap items-center gap-3',
                    wide && 'lg:col-span-12',
                )}
            >
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="group inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    style={{
                        borderColor: `rgba(${accent},0.5)`,
                        background: open ? `rgba(${accent},0.16)` : 'transparent',
                    }}
                >
                    {open ? 'Hide breakdown' : 'System breakdown'}
                    <ChevronDown
                        size={16}
                        className={cn(
                            'transition-transform duration-300',
                            open && 'rotate-180',
                        )}
                    />
                </button>

                {project.href && (
                    <TransitionLink
                        href={project.href}
                        className="group inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                        View project
                        <ArrowUpRight
                            size={15}
                            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </TransitionLink>
                )}
                {project.liveUrl && (
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
                    >
                        Live site
                        <ArrowUpRight
                            size={15}
                            className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                    </a>
                )}
            </div>

            <div className={cn(wide && 'lg:col-span-12')}>
                <AIProjectDetails
                    project={project}
                    open={open}
                    panelId={panelId}
                />
            </div>
        </div>
    );

    const visual = hasScreens ? (
        <div>
            <AIProjectPhones
                screenshots={project.screenshots!}
                title={project.title}
                accent={accent}
            />
            {/* The pipeline behind the screens, as a compact strip */}
            <ol
                aria-label="AI pipeline"
                className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-2"
            >
                {project.flow.map((step, i) => (
                    <Fragment key={step.label}>
                        {i > 0 && (
                            <ChevronRight
                                aria-hidden
                                size={14}
                                className="text-white/25"
                            />
                        )}
                        <li
                            className="rounded-full border px-3 py-1 text-xs text-white/75"
                            style={{
                                borderColor: `rgba(${accent},${step.kind === 'model' ? 0.5 : 0.18})`,
                                background:
                                    step.kind === 'model'
                                        ? `rgba(${accent},0.12)`
                                        : 'transparent',
                            }}
                        >
                            {step.label}
                        </li>
                    </Fragment>
                ))}
            </ol>
        </div>
    ) : (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-7">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `radial-gradient(60% 50% at 100% 0%, rgba(${accent},0.16), transparent 70%)`,
                }}
            />
            <p className="relative mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
                AI architecture
            </p>
            <div className="relative">
                <AIFlowDiagram
                    steps={project.flow}
                    accent={accent}
                    orientation={project.flowOrientation}
                />
            </div>
        </div>
    );

    return (
        <section
            ref={sectionRef}
            id={project.id}
            aria-labelledby={`${project.id}-heading`}
            className="relative overflow-hidden border-t border-white/[0.06] py-24 lg:py-36"
        >
            {/* Ambient light — its side follows the layout */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background: `radial-gradient(50% 55% at ${layout === 'split-reverse' ? '22%' : '78%'} 50%, rgba(${accent},0.12), transparent 70%)`,
                }}
            />

            {/* Outlined numeral */}
            <motion.span
                aria-hidden
                style={{ y: numeralY }}
                className={cn(
                    'pointer-events-none absolute top-16 select-none font-anton text-[clamp(14rem,34vw,30rem)] leading-none text-transparent',
                    layout === 'split-reverse' ? '-right-6' : '-left-6',
                )}
            >
                <span
                    style={{
                        WebkitTextStroke: `1px rgba(${accent},0.15)`,
                    }}
                >
                    {pad(index + 1)}
                </span>
            </motion.span>

            <div className="container relative z-10">
                <div className="mb-10 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
                    <span style={{ color: ink(accent) }}>
                        {pad(index + 1)} / {pad(total)}
                    </span>
                    <span>{project.category}</span>
                    {project.context && <span>{project.context}</span>}
                </div>

                {wide ? (
                    <div className="space-y-12">
                        {text}
                        {visual}
                    </div>
                ) : (
                    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
                        <div
                            className={cn(
                                'lg:col-span-6',
                                layout === 'split-reverse' && 'lg:order-2',
                            )}
                        >
                            {text}
                        </div>
                        <div
                            className={cn(
                                'lg:col-span-6',
                                layout === 'split-reverse' && 'lg:order-1',
                            )}
                        >
                            {visual}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AIProjectShowcase;
