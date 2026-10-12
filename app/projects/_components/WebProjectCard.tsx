'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import TransitionLink from '@/components/TransitionLink';

interface WebProjectCardProps {
    slug: string;
    title: string;
    type: string;
    year: number;
    coverImage: string;
    techStack: string[];
}

export default function WebProjectCard({
    slug,
    title,
    type,
    year,
    coverImage,
    techStack,
}: WebProjectCardProps) {
    return (
        <TransitionLink href={`/projects/${slug}`} className="group block">
            {/* Image frame */}
            <div className="relative w-full aspect-[3/2] rounded-[24px] overflow-hidden border border-border bg-background-light">
                <Image
                    src={coverImage}
                    alt={title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 580px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* Subtle dark overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />

                {/* Arrow reveal */}
                <div
                    className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center
                               bg-ink-950/60 backdrop-blur-md
                               opacity-0 translate-y-2
                               group-hover:opacity-100 group-hover:translate-y-0
                               transition-all duration-300 ease-out"
                >
                    <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={2} aria-hidden />
                </div>
            </div>

            {/* Meta */}
            <div className="mt-5 px-1">
                <div className="flex items-baseline justify-between gap-4">
                    <h3
                        className="text-xl lg:text-2xl font-semibold tracking-[-0.02em] text-foreground
                                   group-hover:text-primary transition-colors duration-300 leading-snug"
                    >
                        {title}
                    </h3>
                    <span className="shrink-0 text-sm text-muted-foreground font-mono tabular-nums">{year}</span>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">{type}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                    {techStack.map((tech) => (
                        <span
                            key={tech}
                            className="px-2.5 py-0.5 text-xs rounded-full border border-border text-muted-foreground"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </TransitionLink>
    );
}
