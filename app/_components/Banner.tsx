'use client';
import ArrowAnimation from '@/components/ArrowAnimation';
import Button from '@/components/Button';
import { GENERAL_INFO } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import dynamic from 'next/dynamic';
import { useRef } from 'react';

// Loaded client-side only — Three.js cannot run on the server
const DevMonolith = dynamic(() => import('@/components/DevMonolith'), {
    ssr: false,
    loading: () => null,
});

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Banner = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const yearsRef = useRef<HTMLSpanElement>(null);
    const projectsRef = useRef<HTMLSpanElement>(null);
    const hoursRef = useRef<HTMLSpanElement>(null);

    // Scroll-out: nudge content upward as next section enters
    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 70%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });
            tl.fromTo(
                '.slide-up-and-fade',
                { y: 0 },
                { y: -150, opacity: 1, stagger: 0.02 },
            );
        },
        { scope: containerRef },
    );

    // Animated stat counters on load (runs once on mount)
    useGSAP(
        () => {
            const counters = { years: 0, projects: 0, hours: 0 };
            gsap.to(counters, {
                years: 4,
                projects: 10,
                hours: 15,
                duration: 2.2,
                ease: 'power2.out',
                delay: 0.7,
                onUpdate() {
                    if (yearsRef.current)
                        yearsRef.current.textContent = String(
                            Math.round(counters.years),
                        );
                    if (projectsRef.current)
                        projectsRef.current.textContent = String(
                            Math.round(counters.projects),
                        );
                    if (hoursRef.current)
                        hoursRef.current.textContent = String(
                            Math.round(counters.hours),
                        );
                },
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden" id="banner">
            {/* Decorative background orbs */}
            <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] rounded-full hero-orb pointer-events-none" />
            <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full hero-orb pointer-events-none opacity-60" />

            <ArrowAnimation />

            <div
                className="container h-[100svh] min-h-[530px] max-md:pb-10 flex justify-between items-center max-md:flex-col"
                ref={containerRef}
            >
                {/* ── Left: Main copy ── */}
                <div className="max-md:grow max-md:flex flex-col justify-center items-start max-w-[560px]">
                    {/* Available-for-work badge */}
                    <div className="slide-up-and-fade flex items-center gap-2.5 mb-7 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/5 w-fit">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
                            Available for work
                        </span>
                    </div>

                    <h1 className="banner-title slide-up-and-fade leading-[.95] text-5xl sm:text-6xl md:text-[80px] font-anton">
                        <span className="text-primary">FULL-STACK</span>
                        <br />
                        <span className="ml-4">DEVELOPER</span>
                    </h1>

                    <p className="banner-description slide-up-and-fade mt-6 text-lg text-muted-foreground max-w-[440px]">
                        Hi! I&apos;m{' '}
                        <span className="font-medium text-foreground">
                            Haider
                        </span>
                        . A Full-Stack Developer with 4+ years of experience
                        specializing in React, Next.js, React Native, and AI
                        integration.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-9">
                        <Button
                            as="link"
                            target="_blank"
                            rel="noopener noreferrer"
                            href={GENERAL_INFO.linkedinProfile}
                            variant="primary"
                            className="banner-button hover:text-muted slide-up-and-fade"
                        >
                            Hire Me
                        </Button>
                        <Button
                            as="link"
                            href="#selected-projects"
                            variant="no-color"
                            className="banner-button slide-up-and-fade border border-foreground/20 hover:border-primary transition-colors duration-300"
                        >
                            View Work
                        </Button>
                    </div>
                </div>

                {/* ── Centre-right: 3D DevMonolith (desktop only) ── */}
                <div
                    className="hidden lg:block absolute top-1/2 -translate-y-[52%] pointer-events-none"
                    style={{ left: '46%', width: '320px', height: '440px' }}
                >
                    <DevMonolith />
                </div>

                {/* ── Right/Bottom: Stats ── */}
                <div className="md:absolute bottom-[10%] right-[4%] flex md:flex-col gap-4 md:gap-10 text-center md:text-right w-full max-md:justify-between max-md:pb-4">
                    <div className="slide-up-and-fade">
                        <h5 className="text-2xl sm:text-4xl font-anton text-primary mb-1">
                            <span ref={yearsRef}>4</span>+
                        </h5>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            Years of Experience
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-2xl sm:text-4xl font-anton text-primary mb-1">
                            <span ref={projectsRef}>10</span>+
                        </h5>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            Completed Projects
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-2xl sm:text-4xl font-anton text-primary mb-1">
                            <span ref={hoursRef}>15</span>K+
                        </h5>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            Hours Worked
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;
