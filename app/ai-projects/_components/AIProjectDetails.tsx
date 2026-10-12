'use client';
import { useReducedMotion } from '@/lib/useReducedMotion';

import type { IAIProject } from '@/lib/aiData';
import { AnimatePresence, motion } from 'framer-motion';
import { ink } from './accent';

interface Props {
    project: IAIProject;
    open: boolean;
    panelId: string;
}

const Block = ({
    label,
    accent,
    className,
    children,
}: {
    label: string;
    accent: string;
    className?: string;
    children: React.ReactNode;
}) => (
    <div className={className}>
        <p
            className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em]"
            style={{ color: ink(accent) }}
        >
            {label}
        </p>
        {children}
    </div>
);

/**
 * The expanded "system breakdown". Only sections the CV actually supports are
 * rendered — a project with no stated problem or outcome simply omits them.
 */
const AIProjectDetails = ({ project, open, panelId }: Props) => {
    const reduce = useReducedMotion();
    const { accent } = project;
    // A lone problem/approach block spans the row instead of leaving an empty half
    const pairSpan = project.problem && project.solution ? undefined : 'sm:col-span-2';

    return (
        <AnimatePresence initial={false}>
            {open && (
                <motion.div
                    id={panelId}
                    role="region"
                    aria-label={`${project.title} system breakdown`}
                    initial={reduce ? false : { height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={reduce ? undefined : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                >
                    <div className="mt-8 grid gap-7 border-t border-border pt-8 sm:grid-cols-2">
                        {project.problem && (
                            <Block label="The problem" accent={accent} className={pairSpan}>
                                <p className="max-w-[68ch] text-sm leading-relaxed text-foreground/80">
                                    {project.problem}
                                </p>
                            </Block>
                        )}
                        {project.solution && (
                            <Block label="The approach" accent={accent} className={pairSpan}>
                                <p className="max-w-[68ch] text-sm leading-relaxed text-foreground/80">
                                    {project.solution}
                                </p>
                            </Block>
                        )}

                        <div className="sm:col-span-2">
                            <Block label="Engineering details" accent={accent}>
                                <ul className="space-y-2">
                                    {project.highlights.map((h) => (
                                        <li
                                            key={h}
                                            className="flex gap-3 text-sm leading-relaxed text-foreground/80"
                                        >
                                            <span
                                                aria-hidden
                                                className="mt-[9px] size-1 shrink-0 rounded-full"
                                                style={{
                                                    background: `rgb(${accent})`,
                                                }}
                                            />
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </Block>
                        </div>

                        {project.outcome && (
                            <div className="sm:col-span-2">
                                <Block label="Outcome" accent={accent}>
                                    <p className="text-sm leading-relaxed text-foreground/80">
                                        {project.outcome}
                                    </p>
                                </Block>
                            </div>
                        )}

                        {project.context && (
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:col-span-2">
                                {project.context}
                            </p>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AIProjectDetails;
