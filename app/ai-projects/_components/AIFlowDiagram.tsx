'use client';

import type {
    AIFlowKind,
    IAIFlowBranch,
    IAIFlowStep,
} from '@/lib/aiData';
import { cn } from '@/lib/utils';
import { ink, rgb } from './accent';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Database,
    Inbox,
    Send,
    ShieldCheck,
    Sparkles,
    Wrench,
    type LucideIcon,
} from 'lucide-react';
import type { CSSProperties } from 'react';

const KIND: Record<AIFlowKind, { label: string; Icon: LucideIcon }> = {
    input: { label: 'Input', Icon: Inbox },
    model: { label: 'Model', Icon: Sparkles },
    tool: { label: 'Tool', Icon: Wrench },
    data: { label: 'Data', Icon: Database },
    guard: { label: 'Guardrail', Icon: ShieldCheck },
    output: { label: 'Output', Icon: Send },
};

interface Props {
    steps: IAIFlowStep[];
    /** "r, g, b" */
    accent: string;
    /** Horizontal only applies from `lg`; below that it stacks. */
    orientation: 'horizontal' | 'vertical';
    /** Labels only — used by the index preview panel. */
    compact?: boolean;
}


/** Visual weight by role: models are filled, guardrails dashed. */
const nodeStyle = (kind: AIFlowKind, accent: string): CSSProperties => {
    if (kind === 'model')
        return { background: rgb(accent, 0.12), borderColor: rgb(accent, 0.45) };
    if (kind === 'guard')
        return { borderColor: rgb(accent, 0.4), borderStyle: 'dashed' };
    return {};
};

const Branch = ({
    branch,
    accent,
}: {
    branch: IAIFlowBranch;
    accent: string;
}) => {
    const { Icon } = KIND[branch.kind];
    return (
        <div
            className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5"
            style={nodeStyle(branch.kind, accent)}
        >
            <p
                className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.2em]"
                style={{ color: ink(accent) }}
            >
                <Icon size={10} />
                {branch.tag}
            </p>
            <p className="mt-1.5 text-xs font-medium text-white">
                {branch.label}
            </p>
            {branch.detail && (
                <p className="mt-0.5 text-[11px] leading-snug text-white/45">
                    {branch.detail}
                </p>
            )}
        </div>
    );
};

/** Number badge plus the line (with a travelling signal) to the next step. */
const Rail = ({
    index,
    last,
    horizontal,
    accent,
}: {
    index: number;
    last: boolean;
    horizontal: boolean;
    accent: string;
}) => {
    const signal = (axis: 'x' | 'y') => ({
        className: cn(
            'absolute left-0 top-0',
            axis === 'y' ? 'ai-pulse-y h-1/4 w-full' : 'ai-pulse-x h-full w-1/4',
        ),
        style: {
            '--ai-i': index,
            background: `linear-gradient(${axis === 'y' ? 'to bottom' : 'to right'}, transparent, ${rgb(accent)}, transparent)`,
        } as CSSProperties,
    });

    return (
        <div
            className={cn(
                'flex shrink-0 items-center',
                horizontal
                    ? 'flex-col lg:w-full lg:flex-row'
                    : 'flex-col',
            )}
        >
            <span
                className="flex size-6 shrink-0 items-center justify-center rounded-full border font-mono text-[10px]"
                style={{ borderColor: rgb(accent, 0.5), color: ink(accent) }}
            >
                {index + 1}
            </span>
            {!last && (
                <>
                    {/* Vertical line (stacked layouts) */}
                    <span
                        aria-hidden
                        className={cn(
                            'relative my-1 w-px flex-1 overflow-hidden bg-white/10',
                            horizontal && 'lg:hidden',
                        )}
                    >
                        <i {...signal('y')} />
                    </span>
                    {/* Horizontal line (wide layouts, lg+) */}
                    {horizontal && (
                        <span
                            aria-hidden
                            className="relative mx-1 hidden h-px flex-1 overflow-hidden bg-white/10 lg:block"
                        >
                            <i {...signal('x')} />
                        </span>
                    )}
                </>
            )}
        </div>
    );
};

const AIFlowDiagram = ({
    steps,
    accent,
    orientation,
    compact = false,
}: Props) => {
    const reduce = useReducedMotion() ?? false;
    const horizontal = orientation === 'horizontal';

    return (
        <ol
            className={cn(
                horizontal
                    ? 'flex flex-col lg:grid lg:grid-flow-col lg:auto-cols-fr'
                    : 'flex flex-col',
            )}
            style={{ '--ai-accent': accent } as CSSProperties}
        >
            {steps.map((step, i) => {
                const { Icon, label } = KIND[step.kind];
                const last = i === steps.length - 1;

                return (
                    <motion.li
                        key={step.label}
                        initial={reduce ? false : { opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{
                            duration: 0.6,
                            delay: i * 0.08,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className={cn(
                            'flex gap-3',
                            horizontal && 'lg:flex-col lg:gap-3',
                        )}
                    >
                        <Rail
                            index={i}
                            last={last}
                            horizontal={horizontal}
                            accent={accent}
                        />

                        <div
                            className={cn(
                                'min-w-0 flex-1',
                                !last && (compact ? 'pb-2' : 'pb-4'),
                                // spacing lives here, not in a grid gap, so the rail line runs unbroken
                                horizontal && 'lg:pr-3',
                                horizontal && !last && 'lg:pb-0',
                            )}
                        >
                            <div
                                className={cn(
                                    'rounded-xl border border-white/10 bg-white/[0.03] transition-[transform,border-color] duration-300 hover:-translate-y-0.5',
                                    compact ? 'px-3 py-2' : 'p-3.5',
                                )}
                                style={nodeStyle(step.kind, accent)}
                            >
                                <p
                                    className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em]"
                                    style={{ color: ink(accent) }}
                                >
                                    <Icon size={12} />
                                    {label}
                                </p>
                                <p
                                    className={cn(
                                        'font-semibold text-white',
                                        compact
                                            ? 'mt-1 text-[13px]'
                                            : 'mt-2 text-sm',
                                    )}
                                >
                                    {step.label}
                                </p>
                                {!compact && step.detail && (
                                    <p className="mt-1 text-xs leading-snug text-white/50">
                                        {step.detail}
                                    </p>
                                )}
                            </div>

                            {!compact && step.branches && (
                                <div
                                    className={cn(
                                        'mt-2 grid grid-cols-1 gap-2 border-l border-dashed pl-3 sm:grid-cols-2',
                                        horizontal && 'lg:grid-cols-1',
                                    )}
                                    style={{ borderColor: rgb(accent, 0.35) }}
                                >
                                    {step.branches.map((b) => (
                                        <Branch
                                            key={b.tag}
                                            branch={b}
                                            accent={accent}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.li>
                );
            })}
        </ol>
    );
};

export default AIFlowDiagram;
