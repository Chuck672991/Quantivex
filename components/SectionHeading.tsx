import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import Reveal from './Reveal';

interface Props {
    /** Section number, e.g. "02". */
    index: string;
    label: string;
    title: ReactNode;
    children?: ReactNode;
    className?: string;
}

/** Eyebrow + headline + optional lead paragraph shared by every homepage section. */
const SectionHeading = ({
    index,
    label,
    title,
    children,
    className,
}: Props) => (
    <div className={cn('max-w-2xl', className)}>
        <Reveal>
            <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                <span aria-hidden className="size-1.5 bg-primary" />
                {index} — {label}
            </p>
        </Reveal>
        {/* The headline slides up inside a clip: the padding keeps descenders in it */}
        <Reveal variant="mask" delay={0.06} className="-mb-[0.1em] pb-[0.1em]">
            <h2 className="text-[clamp(2.1rem,4.6vw,3.6rem)] font-medium text-balance leading-[1.02] tracking-[-0.045em]">
                {title}
            </h2>
        </Reveal>
        {children && (
            <Reveal delay={0.16}>
                <div className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                    {children}
                </div>
            </Reveal>
        )}
    </div>
);

export default SectionHeading;
