'use client';

import type { IAIProject } from '@/lib/aiData';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';
import AIFlowDiagram from './AIFlowDiagram';
import { ink } from './accent';

interface Props {
    project: IAIProject;
    index: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The sticky panel beside the index. It follows whichever project is hovered
 * or focused: real screens when they exist, otherwise the system's
 * architecture in compact form.
 */
const AIProjectPreview = ({ project, index }: Props) => {
    const shots = project.screenshots?.slice(0, 3);

    return (
        <div className="relative min-h-[600px] overflow-hidden rounded-2xl border border-white/10 bg-[#0e1013]">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-[background] duration-700"
                style={{
                    background: `radial-gradient(70% 50% at 80% 0%, rgba(${project.accent},0.22), transparent 70%)`,
                }}
            />

            <AnimatePresence mode="wait">
                <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex h-full min-h-[600px] flex-col p-7"
                >
                    {/* Outlined number */}
                    <span
                        aria-hidden
                        className="pointer-events-none absolute -right-3 -top-7 select-none font-anton text-[8rem] leading-none text-transparent"
                        style={{
                            WebkitTextStroke: `1px rgba(${project.accent},0.28)`,
                        }}
                    >
                        {pad(index + 1)}
                    </span>

                    <p
                        className="font-mono text-[11px] uppercase tracking-[0.22em]"
                        style={{ color: ink(project.accent) }}
                    >
                        {project.category}
                    </p>
                    <h3 className="mt-3 max-w-[85%] font-anton text-3xl uppercase leading-none text-white">
                        {project.title}
                    </h3>
                    <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-white/55">
                        {project.teaser}
                    </p>

                    <ul className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                            <li
                                key={tag}
                                className="rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em]"
                                style={{
                                    borderColor: `rgba(${project.accent},0.4)`,
                                    color: ink(project.accent),
                                }}
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex-1">
                        {shots?.length ? (
                            <div className="relative mx-auto h-[290px] w-full max-w-[360px]">
                                {shots.map((src, i) => (
                                    <div
                                        key={src}
                                        className="absolute top-0 aspect-[9/19.5] w-[34%] overflow-hidden rounded-[18px] border border-white/15 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)]"
                                        style={{
                                            left: `${i * 31}%`,
                                            zIndex: i === 1 ? 2 : 1,
                                            transform: `translateY(${i === 1 ? 0 : 18}px)`,
                                        }}
                                    >
                                        <Image
                                            src={src}
                                            alt=""
                                            fill
                                            sizes="140px"
                                            className="object-cover object-top"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <AIFlowDiagram
                                steps={project.flow}
                                accent={project.accent}
                                orientation="vertical"
                                compact
                            />
                        )}
                    </div>

                    <p className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-white/35">
                        <ArrowDown size={12} />
                        Click to view the system
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default AIProjectPreview;
