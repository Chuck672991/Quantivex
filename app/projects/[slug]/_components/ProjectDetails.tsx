'use client';
import parse from 'html-react-parser';
import ArrowAnimation from '@/components/ArrowAnimation';
import TransitionLink from '@/components/TransitionLink';
import { IProject } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowLeft, ArrowRight, ExternalLink, Github } from 'lucide-react';
import { useRef } from 'react';

interface Props {
    project: IProject;
    prevProject: IProject | null;
    nextProject: IProject | null;
    moreProjects: IProject[];
}

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ProjectDetails = ({ project, prevProject, nextProject, moreProjects }: Props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            gsap.set('.fade-in-later', {
                autoAlpha: 0,
                y: 30,
            });
            const tl = gsap.timeline({
                delay: 0.5,
            });

            tl.to('.fade-in-later', {
                autoAlpha: 1,
                y: 0,
                stagger: 0.1,
            });
        },
        { scope: containerRef },
    );

    // blur info div and make it smaller on scroll
    useGSAP(
        () => {
            if (window.innerWidth < 992) return;

            gsap.to('#info', {
                filter: 'blur(3px)',
                autoAlpha: 0,
                scale: 0.9,
                // position: 'sticky',
                scrollTrigger: {
                    trigger: '#info',
                    start: 'bottom bottom',
                    end: 'bottom top',
                    pin: true,
                    pinSpacing: false,
                    scrub: 0.5,
                },
            });
        },
        { scope: containerRef },
    );

    // parallax effect on images
    useGSAP(
        () => {
            gsap.utils
                .toArray<HTMLDivElement>('#images > div')
                .forEach((imageDiv, i) => {
                    gsap.to(imageDiv, {
                        backgroundPosition: `center 0%`,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: imageDiv,
                            start: () => (i ? 'top bottom' : 'top 50%'),
                            end: 'bottom top',
                            scrub: true,
                            // invalidateOnRefresh: true, // to make it responsive
                        },
                    });
                });
        },
        { scope: containerRef },
    );

    return (
        <section className="pt-5 pb-14 px-1">
            <div className="container" ref={containerRef}>
                <TransitionLink
                    back
                    href="/"
                    className="mb-16 inline-flex gap-2 items-center group h-12"
                >
                    <ArrowLeft className="group-hover:-translate-x-1 group-hover:text-primary transition-all duration-300" />
                    Back
                </TransitionLink>

                <div
                    className="top-0 min-h-[calc(100svh-100px)] flex"
                    id="info"
                >
                    <div className="relative w-full">
                        <div className="flex flex-wrap items-start gap-4 mx-auto mb-10 max-w-[635px] w-full">
                            <h1 className="fade-in-later opacity-0 text-3xl sm:text-4xl md:text-[60px] leading-tight font-anton flex-1">
                                {project.title}
                            </h1>

                            <div className="fade-in-later opacity-0 flex gap-2">
                                {project.sourceCode && (
                                    <a
                                        href={project.sourceCode}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="hover:text-primary"
                                    >
                                        <Github size={30} />
                                    </a>
                                )}
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="hover:text-primary"
                                    >
                                        <ExternalLink size={30} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="max-w-[635px] w-full space-y-7 pb-20 mx-auto">
                            <div className="fade-in-later">
                                <p className="text-muted-foreground font-anton mb-3">
                                    Year
                                </p>

                                <div className="text-lg">{project.year}</div>
                            </div>
                            <div className="fade-in-later">
                                <p className="text-muted-foreground font-anton mb-3">
                                    Tech & Technique
                                </p>

                                <div className="text-lg">
                                    {project.techStack.join(', ')}
                                </div>
                            </div>
                            <div className="fade-in-later">
                                <p className="text-muted-foreground font-anton mb-3">
                                    Description
                                </p>

                                <div className="text-lg prose-xl markdown-text">
                                    {parse(project.description)}
                                </div>
                            </div>
                            {project.role && (
                                <div className="fade-in-later">
                                    <p className="text-muted-foreground font-anton mb-3">
                                        My Role
                                    </p>

                                    <div className="text-lg">
                                        {parse(project.role)}
                                    </div>
                                </div>
                            )}
                        </div>

                        <ArrowAnimation />
                    </div>
                </div>

                <div
                    className="fade-in-later relative flex flex-col gap-2 max-w-[800px] mx-auto"
                    id="images"
                >
                    {project.images.map((image) => (
                        <div
                            key={image}
                            className="group relative w-full aspect-[750/400] bg-background-light"
                            style={{
                                backgroundImage: `url(${image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center 50%',
                                backgroundRepeat: 'no-repeat',
                            }}
                        >
                            <a
                                href={image}
                                target="_blank"
                                className="absolute top-4 right-4 bg-background/70 text-foreground size-12 inline-flex justify-center items-center transition-all opacity-0 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100"
                            >
                                <ExternalLink />
                            </a>
                        </div>
                    ))}
                </div>

                <div className="fade-in-later max-w-[900px] mx-auto mt-14 border border-border">
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                        <div className="p-7 md:p-10">
                            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-3">
                                Previous
                            </p>
                            {prevProject ? (
                                <TransitionLink
                                    href={`/projects/${prevProject.slug}`}
                                    className="group inline-flex items-center justify-between gap-6 w-full"
                                >
                                    <span className="text-xl sm:text-2xl font-anton leading-tight group-hover:text-primary transition-colors">
                                        {prevProject.title}
                                    </span>
                                    <ArrowLeft className="shrink-0 opacity-60 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                                </TransitionLink>
                            ) : (
                                <p className="text-muted-foreground">This is the first project.</p>
                            )}
                        </div>

                        <div className="p-7 md:p-10">
                            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-3">
                                Next
                            </p>
                            {nextProject ? (
                                <TransitionLink
                                    href={`/projects/${nextProject.slug}`}
                                    className="group inline-flex items-center justify-between gap-6 w-full"
                                >
                                    <span className="text-xl sm:text-2xl font-anton leading-tight group-hover:text-primary transition-colors">
                                        {nextProject.title}
                                    </span>
                                    <ArrowRight className="shrink-0 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                </TransitionLink>
                            ) : (
                                <p className="text-muted-foreground">This is the latest project.</p>
                            )}
                        </div>
                    </div>
                </div>

                {moreProjects.length > 0 && (
                    <div className="fade-in-later max-w-[900px] mx-auto mt-14">
                        <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] mb-5">
                            More projects
                        </p>
                        <div className="grid md:grid-cols-3 gap-3">
                            {moreProjects.map((p) => (
                                <TransitionLink
                                    key={p.slug}
                                    href={`/projects/${p.slug}`}
                                    className="group border border-border bg-background hover:bg-primary/5 transition-colors p-6"
                                >
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {p.year}
                                    </p>
                                    <p className="font-anton text-xl leading-tight group-hover:text-primary transition-colors">
                                        {p.title}
                                    </p>
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        {p.techStack.slice(0, 3).join(' · ')}
                                    </p>
                                </TransitionLink>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProjectDetails;
