'use client';

import TransitionLink from '@/components/TransitionLink';
import { AI_AGENT_LOOP, AI_PROJECTS } from '@/lib/aiData';
import { cn } from '@/lib/utils';
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowDown, ArrowLeft } from 'lucide-react';
import { useRef } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;
const CAPABILITIES = [
    'LLM Agents',
    'Tool Calling',
    'MCP',
    'RAG',
    'n8n Automation',
];

const Line = ({
    children,
    delay,
    className,
    reduce,
}: {
    children: string;
    delay: number;
    className?: string;
    reduce: boolean;
}) => (
    <span className="block overflow-hidden pb-[0.1em]">
        <motion.span
            className={cn('block', className)}
            initial={reduce ? false : { y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, ease: EASE, delay }}
        >
            {children}
        </motion.span>
    </span>
);

const AIProjectHero = () => {
    const ref = useRef<HTMLElement>(null);
    const reduce = useReducedMotion() ?? false;
    const lenis = useLenis();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -90]);
    const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

    const explore = () => {
        const target = document.getElementById('ai-index');
        if (!target) return;
        if (lenis) lenis.scrollTo(target, { duration: 1.4 });
        else target.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            ref={ref}
            className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-14 pt-28"
        >
            {/* Grid, masked so it fades out away from the headline */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    backgroundImage:
                        'linear-gradient(to right,rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.035) 1px,transparent 1px)',
                    backgroundSize: '56px 56px',
                    maskImage:
                        'radial-gradient(ellipse 70% 60% at 30% 40%, #000 30%, transparent 100%)',
                    WebkitMaskImage:
                        'radial-gradient(ellipse 70% 60% at 30% 40%, #000 30%, transparent 100%)',
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(40% 45% at 18% 30%, rgba(34,211,238,0.13), transparent 70%), radial-gradient(38% 42% at 88% 22%, rgba(99,102,241,0.16), transparent 70%)',
                }}
            />

            {/* Outlined count — the number of systems below */}
            <span
                aria-hidden
                className="pointer-events-none absolute -right-4 bottom-16 hidden select-none font-anton text-[clamp(14rem,30vw,28rem)] leading-none text-transparent md:block"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.07)' }}
            >
                {String(AI_PROJECTS.length).padStart(2, '0')}
            </span>

            <motion.div
                style={{ y, opacity }}
                className="container relative z-10"
            >
                <TransitionLink
                    href="/#ai-systems"
                    className="group mb-12 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
                >
                    <ArrowLeft
                        className="size-4 transition-transform duration-200 group-hover:-translate-x-1"
                        strokeWidth={1.8}
                    />
                    Back
                </TransitionLink>

                <motion.p
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-300/80"
                >
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-300 opacity-60 motion-reduce:animate-none" />
                        <span className="relative inline-flex size-2 rounded-full bg-cyan-300" />
                    </span>
                    AI / Intelligent Systems
                </motion.p>

                <h1 className="font-anton text-[clamp(2.1rem,8.4vw,7rem)] uppercase leading-[0.92] text-white">
                    <Line reduce={reduce} delay={0.1}>
                        Building intelligent
                    </Line>
                    <Line reduce={reduce} delay={0.2}>
                        products with modern
                    </Line>
                    <Line reduce={reduce} delay={0.3} className="text-gradient">
                        AI systems.
                    </Line>
                </h1>

                <motion.ul
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.55 }}
                    className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/55 md:text-base"
                    aria-label="Focus areas"
                >
                    {CAPABILITIES.map((c, i) => (
                        <li key={c} className="flex items-center gap-3">
                            {i > 0 && (
                                <span aria-hidden className="text-white/20">
                                    •
                                </span>
                            )}
                            {c}
                        </li>
                    ))}
                </motion.ul>

                <motion.div
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE, delay: 0.7 }}
                    className="mt-10"
                >
                    <button
                        type="button"
                        onClick={explore}
                        className="group inline-flex items-center gap-2 bg-primary px-6 py-3.5 font-anton text-sm uppercase tracking-wider text-primary-foreground transition-colors duration-300 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                    >
                        Explore AI Work
                        <ArrowDown
                            size={18}
                            className="transition-transform duration-200 group-hover:translate-y-0.5"
                        />
                    </button>
                </motion.div>
            </motion.div>

            {/* The CV's AI skills in the order a request meets them */}
            <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="container relative z-10 mt-16 hidden md:block"
            >
                <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
                    The pieces I build agents from
                </p>
                <ol className="relative grid grid-cols-5">
                    <span
                        aria-hidden
                        className="absolute left-3 right-3 top-3 h-px overflow-hidden bg-white/10"
                    >
                        <i
                            className="ai-pulse-x absolute left-0 top-0 h-full w-1/5"
                            style={{
                                background:
                                    'linear-gradient(to right, transparent, rgb(34,211,238), transparent)',
                            }}
                        />
                    </span>
                    {AI_AGENT_LOOP.map((step, i) => (
                        <li key={step.label} className="relative pr-4">
                            <span className="relative flex size-6 items-center justify-center rounded-full border border-cyan-300/50 bg-[#0B0C0E] font-mono text-[10px] text-cyan-300">
                                {i + 1}
                            </span>
                            <p className="mt-3 text-sm font-semibold text-white">
                                {step.label}
                            </p>
                            <p className="mt-0.5 text-xs text-white/45">
                                {step.note}
                            </p>
                        </li>
                    ))}
                </ol>
            </motion.div>
        </section>
    );
};

export default AIProjectHero;
