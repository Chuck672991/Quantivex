'use client';
import { useReducedMotion } from '@/lib/useReducedMotion';

import Button from '@/components/Button';
import TransitionLink from '@/components/TransitionLink';
import { AI_AGENT_LOOP, AI_PROJECTS } from '@/lib/aiData';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { ArrowDown, ArrowLeft } from 'lucide-react';
import { useAnimGate } from '@/lib/useAnimGate';
import { useRef } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;
const CAPABILITIES = [
    'LLM Agents',
    'Tool Calling',
    'MCP',
    'RAG',
    'n8n Automation',
];

// Masked line reveal. The inner span carries the bottom padding so descenders
// (and the gradient clip, which only paints inside its own box) are not cut off.
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
    <span className="block overflow-hidden">
        <motion.span
            className={cn('block pb-[0.12em]', className)}
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
    useAnimGate(ref);
    const reduce = useReducedMotion();
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
            {/* Grid that fades out away from the headline (gradient overlay, no mask) */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    backgroundImage:
                        'linear-gradient(to right,hsl(var(--foreground) / 0.04) 1px,transparent 1px),linear-gradient(to bottom,hsl(var(--foreground) / 0.04) 1px,transparent 1px)',
                    backgroundSize: '56px 56px',
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(ellipse 70% 60% at 30% 40%, transparent 30%, hsl(var(--background)) 100%)',
                }}
            />
            {/* Cobalt and periwinkle light, the brand pair on ink */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        'radial-gradient(40% 45% at 18% 30%, hsl(var(--primary) / 0.14), transparent 70%), radial-gradient(38% 42% at 88% 22%, hsl(var(--accent) / 0.12), transparent 70%)',
                }}
            />

            {/* Outlined count: the number of systems below */}
            <span
                aria-hidden
                className="pointer-events-none absolute -right-4 bottom-16 hidden select-none font-display text-[clamp(12rem,24vw,22rem)] font-semibold leading-none tracking-[-0.05em] text-transparent md:block"
                style={{ WebkitTextStroke: '1px hsl(var(--foreground) / 0.09)' }}
            >
                {String(AI_PROJECTS.length).padStart(2, '0')}
            </span>

            <motion.div
                style={{ y, opacity }}
                className="container relative z-10"
            >
                <TransitionLink
                    href="/#ai-systems"
                    className="group mb-12 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
                    className="mb-6 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-primary"
                >
                    <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                        <span className="relative inline-flex size-2 rounded-full bg-primary" />
                    </span>
                    AI / Intelligent Systems
                </motion.p>

                {/* Geist is far wider than Anton: the longest line ("products with
                    modern") stays inside 360px at the 1.75rem floor. */}
                <h1 className="font-display text-[clamp(1.75rem,7.2vw,6rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-foreground">
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
                    className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground md:text-base"
                    aria-label="Focus areas"
                >
                    {CAPABILITIES.map((c, i) => (
                        <li key={c} className="flex items-center gap-3">
                            {i > 0 && (
                                <span aria-hidden className="text-foreground/20">
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
                    <Button variant="cobalt" size="lg" onClick={explore}>
                        Explore AI work
                        <ArrowDown
                            size={16}
                            aria-hidden
                            className="transition-transform duration-300 group-hover:translate-y-0.5"
                        />
                    </Button>
                </motion.div>
            </motion.div>

            {/* The AI skills in the order a request meets them */}
            <motion.div
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="container relative z-10 mt-16 hidden md:block"
            >
                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    The pieces we build agents from
                </p>
                <ol className="relative grid grid-cols-5">
                    <span
                        aria-hidden
                        className="absolute left-3 right-3 top-3 h-px overflow-hidden bg-foreground/10"
                    >
                        <i
                            className="ai-pulse-x absolute left-0 top-0 h-full w-1/5"
                            style={{
                                background:
                                    'linear-gradient(to right, transparent, hsl(var(--primary)), transparent)',
                            }}
                        />
                    </span>
                    {AI_AGENT_LOOP.map((step, i) => (
                        <li key={step.label} className="relative pr-4">
                            <span className="relative flex size-6 items-center justify-center rounded-full border border-primary/50 bg-ink-950 font-mono text-[10px] text-primary">
                                {i + 1}
                            </span>
                            <p className="mt-3 text-sm font-semibold text-foreground">
                                {step.label}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
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
