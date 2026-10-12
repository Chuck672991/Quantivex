'use client';
import parse from 'html-react-parser';
import ArrowAnimation from '@/components/ArrowAnimation';
import Button from '@/components/Button';
import TransitionLink from '@/components/TransitionLink';
import { IProject } from '@/types';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { useRef } from 'react';

interface Props {
    project: IProject;
    prevProject: IProject | null;
    nextProject: IProject | null;
    moreProjects: IProject[];
}

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Section labels: small technical caps, like every other eyebrow on the site
const LABEL =
    'mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground';

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
        // Light Arctic page: the global navbar is fixed, so content starts at pt-28
        <section className="pt-28 pb-20 px-1">
            <div className="container" ref={containerRef}>
                <TransitionLink
                    back
                    href="/"
                    className="mb-12 inline-flex gap-2 items-center group h-12 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 group-hover:text-primary transition-all duration-300" />
                    Back
                </TransitionLink>

                <div
                    className="top-0 min-h-[calc(100svh-7rem)] flex"
                    id="info"
                >
                    <div className="relative w-full">
                        <div className="flex flex-wrap items-start gap-x-6 gap-y-5 mx-auto mb-10 max-w-[635px] w-full">
                            {/* Geist is wider than the old display face, so the cap is lower */}
                            <h1 className="fade-in-later opacity-0 min-w-0 flex-1 basis-[16rem] font-display text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-foreground text-balance">
                                {project.title}
                            </h1>

                            {(project.liveUrl || project.sourceCode) && (
                                <div className="fade-in-later opacity-0 flex flex-wrap gap-2">
                                    {project.liveUrl && (
                                        <Button
                                            href={project.liveUrl}
                                            variant="ink"
                                            arrow
                                        >
                                            Visit site
                                        </Button>
                                    )}
                                    {project.sourceCode && (
                                        <Button
                                            href={project.sourceCode}
                                            variant="outline"
                                        >
                                            Source code
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="max-w-[635px] w-full space-y-7 pb-20 mx-auto">
                            <div className="fade-in-later">
                                <p className={LABEL}>Year</p>

                                <div className="text-lg">{project.year}</div>
                            </div>
                            <div className="fade-in-later">
                                <p className={LABEL}>Technology</p>

                                <div className="text-lg">
                                    {project.techStack.join(', ')}
                                </div>
                            </div>
                            <div className="fade-in-later">
                                <p className={LABEL}>Description</p>

                                <div className="text-lg prose-xl markdown-text [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-cobalt-800">
                                    {parse(project.description)}
                                </div>
                            </div>
                            {project.role && (
                                <div className="fade-in-later">
                                    <p className={LABEL}>Engineering scope</p>

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
                            className="group relative w-full aspect-[750/400] overflow-hidden rounded-2xl border border-border bg-background-light"
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
                                rel="noopener noreferrer"
                                aria-label="Open image in a new tab"
                                className="absolute top-4 right-4 bg-background/80 text-foreground size-12 rounded-full inline-flex justify-center items-center transition-all opacity-0 hover:bg-primary hover:text-primary-foreground focus-visible:opacity-100 group-hover:opacity-100"
                            >
                                <ExternalLink aria-hidden />
                            </a>
                        </div>
                    ))}
                </div>

                <div className="fade-in-later max-w-[900px] mx-auto mt-14 overflow-hidden rounded-2xl border border-border">
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                        <div className="p-7 md:p-10">
                            <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-3">
                                Previous
                            </p>
                            {prevProject ? (
                                <TransitionLink
                                    href={`/projects/${prevProject.slug}`}
                                    className="group inline-flex items-center justify-between gap-6 w-full"
                                >
                                    <span className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.02em] leading-tight group-hover:text-primary transition-colors">
                                        {prevProject.title}
                                    </span>
                                    <ArrowLeft className="shrink-0 opacity-60 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                                </TransitionLink>
                            ) : (
                                <p className="text-muted-foreground">This is the first project.</p>
                            )}
                        </div>

                        <div className="p-7 md:p-10">
                            <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-3">
                                Next
                            </p>
                            {nextProject ? (
                                <TransitionLink
                                    href={`/projects/${nextProject.slug}`}
                                    className="group inline-flex items-center justify-between gap-6 w-full"
                                >
                                    <span className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.02em] leading-tight group-hover:text-primary transition-colors">
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
                        <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.2em] mb-5">
                            More projects
                        </p>
                        <div className="grid md:grid-cols-3 gap-3">
                            {moreProjects.map((p) => (
                                <TransitionLink
                                    key={p.slug}
                                    href={`/projects/${p.slug}`}
                                    className="group rounded-2xl border border-border bg-background hover:border-primary/40 hover:bg-primary/5 transition-colors p-6"
                                >
                                    <p className="font-mono text-xs tabular-nums text-muted-foreground mb-2">
                                        {p.year}
                                    </p>
                                    <p className="font-display text-xl font-semibold tracking-[-0.02em] leading-tight group-hover:text-primary transition-colors">
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
