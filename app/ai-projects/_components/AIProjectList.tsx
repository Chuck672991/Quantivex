'use client';

import type { IAIProject } from '@/lib/aiData';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import { useLenis } from 'lenis/react';
import { useState, type MouseEvent } from 'react';
import AIProjectPreview from './AIProjectPreview';
import { ink } from './accent';

interface Props {
    projects: IAIProject[];
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Interactive index. On desktop, hovering or focusing a row swaps the sticky
 * preview and shifts the section's ambient colour; on touch there is no hover,
 * so every row simply shows its tags and a tap jumps to the project.
 */
const AIProjectList = ({ projects }: Props) => {
    const [activeId, setActiveId] = useState(projects[0].id);
    const lenis = useLenis();
    const activeIndex = projects.findIndex((p) => p.id === activeId);

    const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        else target.scrollIntoView({ behavior: 'smooth' });
        history.replaceState(null, '', `#${id}`);
    };

    return (
        <section
            id="ai-index"
            // overflow-clip, not hidden: hidden would stop the preview panel sticking
            className="relative overflow-clip border-t border-border/60 py-24 lg:py-32"
        >
            {/* One ambient layer per project; only the active one is visible */}
            {projects.map((p) => (
                <div
                    key={p.id}
                    aria-hidden
                    className={cn(
                        'pointer-events-none absolute inset-0 transition-opacity duration-700',
                        p.id === activeId ? 'opacity-100' : 'opacity-0',
                    )}
                    style={{
                        background: `radial-gradient(50% 55% at 78% 45%, rgba(${p.accent},0.13), transparent 70%)`,
                    }}
                />
            ))}

            <div className="container relative z-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-7">
                    <h2 className="mb-8 font-mono text-[11px] font-normal uppercase tracking-[0.22em] text-muted-foreground">
                        Index · {pad(projects.length)} systems
                    </h2>

                    <ul>
                        {projects.map((p, i) => {
                            const active = p.id === activeId;
                            return (
                                <li key={p.id}>
                                    <a
                                        href={`#${p.id}`}
                                        onClick={(e) => jump(e, p.id)}
                                        onPointerEnter={(e) => {
                                            if (e.pointerType === 'mouse')
                                                setActiveId(p.id);
                                        }}
                                        onFocus={() => setActiveId(p.id)}
                                        className="group relative grid grid-cols-[auto_1fr_auto] items-start gap-x-4 border-t border-border py-6 focus-visible:outline-none md:gap-x-6 md:py-8"
                                    >
                                        <span
                                            aria-hidden
                                            className={cn(
                                                'absolute inset-x-0 -top-px h-px origin-left transition-transform duration-500',
                                                active
                                                    ? 'scale-x-100'
                                                    : 'scale-x-0',
                                            )}
                                            style={{
                                                background: `rgb(${p.accent})`,
                                            }}
                                        />

                                        <span
                                            className={cn(
                                                'pt-1 font-mono text-sm tracking-[0.2em] transition-[transform,color] duration-300 md:pt-2',
                                                active
                                                    ? 'translate-x-1'
                                                    : 'text-foreground/40',
                                            )}
                                            style={
                                                active
                                                    ? {
                                                          color: ink(p.accent),
                                                      }
                                                    : undefined
                                            }
                                        >
                                            {pad(i + 1)}
                                        </span>

                                        <div className="min-w-0">
                                            <h3
                                                className={cn(
                                                    'font-display text-2xl font-semibold leading-[1.02] tracking-[-0.035em] transition-colors duration-300 sm:text-3xl md:text-4xl',
                                                    // no hover on touch: keep every title at full strength there
                                                    active
                                                        ? 'text-foreground'
                                                        : 'text-foreground/40 max-lg:text-foreground',
                                                )}
                                            >
                                                {p.title}
                                            </h3>
                                            <p className="mt-2.5 text-sm text-muted-foreground">
                                                {p.category}
                                            </p>

                                            {/* Tags reveal on hover/focus (always open on touch) */}
                                            <div
                                                className={cn(
                                                    'grid transition-[grid-template-rows,opacity] duration-500',
                                                    active
                                                        ? 'grid-rows-[1fr] opacity-100'
                                                        : 'grid-rows-[0fr] opacity-0 max-lg:grid-rows-[1fr] max-lg:opacity-100',
                                                )}
                                            >
                                                <div className="overflow-hidden">
                                                    <ul className="flex flex-wrap gap-1.5 pt-3">
                                                        {p.tags.map((tag) => (
                                                            <li
                                                                key={tag}
                                                                className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]"
                                                                style={{
                                                                    borderColor: `rgba(${p.accent},0.4)`,
                                                                    color: ink(p.accent),
                                                                }}
                                                            >
                                                                {tag}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                                                        {p.technologies
                                                            .slice(0, 5)
                                                            .join(' · ')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <ArrowUpRight
                                            aria-hidden
                                            className={cn(
                                                'mt-1 size-5 transition-all duration-300 md:mt-2',
                                                active
                                                    ? 'translate-x-0 translate-y-0 text-foreground opacity-100'
                                                    : '-translate-x-1 translate-y-1 text-foreground opacity-0 max-lg:opacity-40',
                                            )}
                                        />
                                    </a>
                                </li>
                            );
                        })}
                        <li className="border-t border-border" aria-hidden />
                    </ul>
                </div>

                <div className="hidden lg:col-span-5 lg:block">
                    <div className="sticky top-28">
                        <AIProjectPreview
                            project={projects[activeIndex]}
                            index={activeIndex}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AIProjectList;
