'use client';
import { gsap } from '@/lib/scroll/gsap';
import { useAct } from '@/lib/scroll/useAct';
import { useReducedMotion } from '@/lib/useReducedMotion';
import GridBackdrop from '@/components/GridBackdrop';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import StackIcon from '@/components/StackIcon';
import { TECH_STACK } from '@/lib/data';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState, type KeyboardEvent } from 'react';

const EASE = [0.22, 1, 0.36, 1] as const;

const APPROACH = [
    {
        title: 'Typed end to end',
        body: 'TypeScript across web, mobile and backend keeps changes safe as the product grows.',
    },
    {
        title: 'AI with guardrails',
        body: 'Retrieval, structured outputs and answer validation, instead of hoping a prompt is enough.',
    },
    {
        title: 'Automated delivery',
        body: 'CI/CD pipelines and AWS deployments, so shipping is routine rather than an event.',
    },
];

const Capabilities = () => {
    const reduce = useReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const [activeKey, setActiveKey] = useState(TECH_STACK[0].key);
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const activeIndex = TECH_STACK.findIndex(
        (group) => group.key === activeKey,
    );
    const group = TECH_STACK[activeIndex];

    const selectIndex = (index: number) => {
        const next = (index + TECH_STACK.length) % TECH_STACK.length;
        setActiveKey(TECH_STACK[next].key);
        tabRefs.current[next]?.focus();
    };

    const handleKeyDown = (
        event: KeyboardEvent<HTMLButtonElement>,
        index: number,
    ) => {
        const forward = ['ArrowDown', 'ArrowRight'];
        const backward = ['ArrowUp', 'ArrowLeft'];
        if (forward.includes(event.key)) {
            event.preventDefault();
            selectIndex(index + 1);
        } else if (backward.includes(event.key)) {
            event.preventDefault();
            selectIndex(index - 1);
        } else if (event.key === 'Home') {
            event.preventDefault();
            selectIndex(0);
        } else if (event.key === 'End') {
            event.preventDefault();
            selectIndex(TECH_STACK.length - 1);
        }
    };

    // The tabs slide in one after another; the ink panel is brought up to scale
    // by the scroll (a scrubbed zoom, so it lands as the section settles)
    useAct(sectionRef, ({ q, full }) => {
        const tabs = q('[data-cap="tabs"]')[0];
        const items = q('[role="tab"]');
        const panel = q('[data-cap="panel"]')[0];

        if (tabs && items.length) {
            gsap.fromTo(
                items,
                { opacity: 0, x: full ? -32 : 0, y: full ? 0 : 14 },
                {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: 0.9,
                    ease: 'expo.out',
                    stagger: 0.07,
                    scrollTrigger: {
                        trigger: tabs,
                        start: 'top 88%',
                        once: true,
                    },
                },
            );
        }
        if (panel) {
            gsap.fromTo(
                panel,
                { scale: 0.9, y: 56, opacity: 0.35 },
                {
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: panel,
                        start: 'top 100%',
                        end: 'top 52%',
                        scrub: true,
                    },
                },
            );
        }
    });

    return (
        <section
            id="expertise"
            ref={sectionRef}
            className="bg-background-light py-24 md:py-36"
        >
            <div className="container">
                <SectionHeading
                    index="04"
                    label="Expertise"
                    title={
                        <>
                            Technical depth across the{' '}
                            <span className="text-gradient">whole stack</span>
                        </>
                    }
                >
                    <p>
                        From model APIs and automation to databases, cloud and
                        mobile integrations: the tools we ship with, grouped by
                        what they do.
                    </p>
                </SectionHeading>

                <div className="mt-14 grid gap-5 lg:grid-cols-12 lg:gap-6">
                    <div
                        data-cap="tabs"
                        role="tablist"
                        aria-label="Technology groups"
                        aria-orientation="vertical"
                        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
                    >
                        {TECH_STACK.map((item, i) => {
                            const selected = item.key === activeKey;
                            return (
                                <button
                                    key={item.key}
                                    ref={(el) => {
                                        tabRefs.current[i] = el;
                                    }}
                                    type="button"
                                    role="tab"
                                    id={`stack-tab-${item.key}`}
                                    aria-selected={selected}
                                    aria-controls={`stack-panel-${item.key}`}
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => setActiveKey(item.key)}
                                    onKeyDown={(event) =>
                                        handleKeyDown(event, i)
                                    }
                                    className={cn(
                                        'group relative flex shrink-0 items-center gap-3 rounded-full border px-4 py-2.5 text-left text-sm transition-colors duration-300',
                                        'lg:rounded-none lg:border-0 lg:border-b lg:border-border lg:px-0 lg:py-4 lg:first:border-t',
                                        selected
                                            ? 'border-foreground bg-foreground text-background lg:bg-transparent lg:text-foreground'
                                            : 'border-border bg-background text-foreground/70 hover:text-foreground lg:bg-transparent',
                                    )}
                                >
                                    <span
                                        aria-hidden
                                        className={cn(
                                            'absolute -bottom-px left-0 hidden h-px origin-left bg-primary transition-transform duration-500 lg:block lg:w-full',
                                            selected
                                                ? 'scale-x-100'
                                                : 'scale-x-0',
                                        )}
                                    />
                                    <span
                                        className={cn(
                                            'font-mono text-[11px] tracking-[0.16em] lg:w-7',
                                            selected
                                                ? 'opacity-70'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        0{i + 1}
                                    </span>
                                    <span className="whitespace-nowrap font-display text-[15px] font-medium tracking-tight lg:flex-1 lg:text-xl lg:tracking-[-0.03em]">
                                        {item.label}
                                    </span>
                                    <span className="hidden font-mono text-xs text-muted-foreground lg:inline">
                                        {item.items.length}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div
                        data-cap="panel"
                        role="tabpanel"
                        id={`stack-panel-${group.key}`}
                        aria-labelledby={`stack-tab-${group.key}`}
                        className="dark relative min-h-[26rem] overflow-hidden rounded-[28px] bg-ink-950 p-6 text-foreground sm:p-9 lg:col-span-8"
                    >
                        <GridBackdrop at="80% 0%" className="opacity-70" />
                        <div
                            aria-hidden
                            className="perf-fx pointer-events-none absolute -right-56 -top-56 size-[36rem]"
                            style={{
                                background:
                                    'radial-gradient(closest-side, hsl(var(--primary) / 0.22), transparent)',
                            }}
                        />

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={group.key}
                                initial={reduce ? false : { opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={
                                    reduce ? undefined : { opacity: 0, y: -8 }
                                }
                                transition={{ duration: 0.45, ease: EASE }}
                                className="relative"
                            >
                                <div className="mb-8 flex flex-wrap items-center gap-3">
                                    <h3 className="font-display text-2xl font-medium tracking-[-0.035em] sm:text-3xl">
                                        {group.label}
                                    </h3>
                                    {group.ai && (
                                        <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                                            AI
                                        </span>
                                    )}
                                </div>

                                <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                                    {group.items.map((item, i) => (
                                        <motion.li
                                            key={item.name}
                                            initial={
                                                reduce
                                                    ? false
                                                    : { opacity: 0, y: 12 }
                                            }
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                ease: EASE,
                                                delay: reduce
                                                    ? 0
                                                    : 0.06 + i * 0.035,
                                            }}
                                            className="flex items-center gap-3.5"
                                        >
                                            <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-foreground/[0.04]">
                                                <StackIcon
                                                    item={item}
                                                    size={20}
                                                    bare
                                                    mono="white"
                                                    className="size-5 text-foreground/90"
                                                />
                                            </span>
                                            <span className="min-w-0">
                                                <span className="block text-[15px] font-medium leading-snug">
                                                    {item.name}
                                                </span>
                                                {item.detail && (
                                                    <span className="mt-0.5 block text-[13px] leading-snug text-muted-foreground">
                                                        {item.detail}
                                                    </span>
                                                )}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-16 grid gap-10 border-t border-border pt-10 md:grid-cols-3">
                    {APPROACH.map((point, i) => (
                        <Reveal key={point.title} delay={i * 0.08}>
                            <h3 className="mb-2.5 flex items-center gap-3 font-display text-lg font-medium tracking-[-0.025em]">
                                <span
                                    aria-hidden
                                    className="size-1.5 bg-primary"
                                />
                                {point.title}
                            </h3>
                            <p className="max-w-xs text-[15px] leading-relaxed text-muted-foreground">
                                {point.body}
                            </p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Capabilities;
