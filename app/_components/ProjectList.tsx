'use client';
import SectionTitle from '@/components/SectionTitle';
import { PROJECTS as ALL_PROJECTS } from '@/lib/data';

const PROJECTS = ALL_PROJECTS.filter((p) => !p.hidden);
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState, MouseEvent } from 'react';
import Project from './Project';
import { Search, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ProjectCategory = 'All' | 'Web' | 'Mobile' | 'AI' | '3D' | 'Realtime';

const getProjectCategories = (techStack: string[]): ProjectCategory[] => {
    const stack = techStack.join(' ').toLowerCase();
    const categories = new Set<ProjectCategory>();

    if (
        stack.includes('react native') ||
        stack.includes('ios') ||
        stack.includes('android')
    )
        categories.add('Mobile');

    if (
        stack.includes('gpt') ||
        stack.includes('openai') ||
        stack.includes('whisper') ||
        stack.includes('ai')
    )
        categories.add('AI');

    if (stack.includes('three') || stack.includes('react three fiber'))
        categories.add('3D');

    if (
        stack.includes('websocket') ||
        stack.includes('firebase') ||
        stack.includes('realtime') ||
        stack.includes('real-time')
    )
        categories.add('Realtime');

    if (
        stack.includes('next') ||
        stack.includes('react') ||
        stack.includes('tailwind') ||
        stack.includes('web')
    )
        categories.add('Web');

    return Array.from(categories);
};

const ProjectList = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const projectListRef = useRef<HTMLDivElement>(null);
    const imageContainer = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [activeCategory, setActiveCategory] =
        useState<ProjectCategory>('All');
    const [query, setQuery] = useState('');
    const [selectedProject, setSelectedProject] = useState<string | null>(
        PROJECTS[0].slug,
    );

    const categories = useMemo<ProjectCategory[]>(() => {
        const set = new Set<ProjectCategory>();
        PROJECTS.forEach((p) => getProjectCategories(p.techStack).forEach((c) => set.add(c)));
        return ['All', ...Array.from(set)];
    }, []);

    const filteredProjects = useMemo(() => {
        const q = query.trim().toLowerCase();

        return PROJECTS.filter((p) => {
            const matchesCategory =
                activeCategory === 'All'
                    ? true
                    : getProjectCategories(p.techStack).includes(activeCategory);
            if (!matchesCategory) return false;

            if (!q) return true;

            const haystack = [
                p.title,
                p.techStack.join(' '),
                String(p.year),
                p.slug,
            ]
                .join(' ')
                .toLowerCase();
            return haystack.includes(q);
        });
    }, [activeCategory, query]);

    useEffect(() => {
        if (filteredProjects.length === 0) {
            setSelectedProject(null);
            return;
        }

        setSelectedProject((prev) => {
            if (prev && filteredProjects.some((p) => p.slug === prev)) return prev;
            return filteredProjects[0].slug;
        });
    }, [filteredProjects]);

    // update imageRef.current href based on the cursor hover position
    // also update image position
    useGSAP(
        (context, contextSafe) => {
            // show image on hover
            if (window.innerWidth < 768) {
                setSelectedProject(null);
                return;
            }

            const handleMouseMove = contextSafe?.((e: MouseEvent) => {
                if (!containerRef.current) return;
                if (!imageContainer.current) return;

                if (window.innerWidth < 768) {
                    setSelectedProject(null);
                    return;
                }

                const containerRect =
                    containerRef.current?.getBoundingClientRect();
                const imageRect =
                    imageContainer.current.getBoundingClientRect();
                const offsetTop = e.clientY - containerRect.y;

                // if cursor is outside the container, hide the image
                if (
                    containerRect.y > e.clientY ||
                    containerRect.bottom < e.clientY ||
                    containerRect.x > e.clientX ||
                    containerRect.right < e.clientX
                ) {
                    return gsap.to(imageContainer.current, {
                        duration: 0.3,
                        opacity: 0,
                    });
                }

                gsap.to(imageContainer.current, {
                    y: offsetTop - imageRect.height / 2,
                    duration: 1,
                    opacity: 1,
                });
            }) as any;

            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        },
        { scope: containerRef, dependencies: [containerRef.current] },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'top 80%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });

            tl.from(containerRef.current, {
                y: 150,
                opacity: 0,
            });
        },
        { scope: containerRef },
    );

    const handleMouseEnter = (slug: string) => {
        if (window.innerWidth < 768) {
            setSelectedProject(null);
            return;
        }

        setSelectedProject(slug);
    };

    return (
        <section className="pb-section max-md:pb-20" id="selected-projects">
            <div className="container">
                <SectionTitle title="SELECTED PROJECTS" />

                <div className="mb-7 flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => setActiveCategory(c)}
                                className={cn(
                                    'text-xs sm:text-sm px-3.5 py-2 border transition-colors',
                                    activeCategory === c
                                        ? 'border-primary bg-primary/10 text-foreground'
                                        : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <div className="relative max-w-[520px]">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search projects (title, tech, year)…"
                            className="w-full h-11 pl-9 pr-10 border border-border bg-background focus:outline-none focus:border-primary/60 transition-colors"
                            aria-label="Search projects"
                        />
                        {query.trim().length > 0 && (
                            <button
                                type="button"
                                onClick={() => setQuery('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Clear search"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="group/projects relative" ref={containerRef}>
                    {selectedProject !== null && (
                        <div
                            className="max-md:hidden absolute right-0 top-0 z-[1] pointer-events-none w-[200px] xl:w-[350px] aspect-[3/4] overflow-hidden opacity-0"
                            ref={imageContainer}
                        >
                            {filteredProjects.map((project) => (
                                <Image
                                    src={project.thumbnail}
                                    alt="Project"
                                    width="400"
                                    height="500"
                                    className={cn(
                                        'absolute inset-0 transition-all duration-500 w-full h-full object-cover',
                                        {
                                            'opacity-0':
                                                project.slug !==
                                                selectedProject,
                                        },
                                    )}
                                    ref={imageRef}
                                    key={project.slug}
                                />
                            ))}
                        </div>
                    )}

                    <div
                        className="flex flex-col max-md:gap-10"
                        ref={projectListRef}
                    >
                        {filteredProjects.length === 0 ? (
                            <div className="border border-border p-8 text-muted-foreground">
                                No projects match your filters.
                            </div>
                        ) : (
                            filteredProjects.map((project, index) => (
                                <Project
                                    index={index}
                                project={project}
                                selectedProject={selectedProject}
                                onMouseEnter={handleMouseEnter}
                                key={project.slug}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProjectList;
