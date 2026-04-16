'use client';
import SectionTitle from '@/components/SectionTitle';
import { MY_EXPERIENCE } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Experiences = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // 1. Line Drawing Animation
            gsap.fromTo(
                '.timeline-line-fill',
                { scaleY: 0 },
                {
                    scaleY: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: scrollRef.current,
                        start: 'top 60%',
                        end: 'bottom 60%',
                        scrub: 0.5,
                    },
                }
            );

            // 2. Dots Activation
            const dots = gsap.utils.toArray<HTMLElement>('.timeline-dot');
            dots.forEach((dot) => {
                gsap.to(dot, {
                    backgroundColor: '#64f63b', // Changed to blue to match your screenshot style
                    borderColor: '#59ae1c',
                    scale: 1.2,
                    duration: 0.1,
                    scrollTrigger: {
                        trigger: dot,
                        start: 'top 60%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });

            // 3. Reveal Items
            gsap.from('.experience-item', {
                y: 30,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: scrollRef.current,
                    start: 'top 80%',
                },
            });
        },
        { scope: containerRef }
    );

    return (
        <section
            className="py-24 max-md:py-16 overflow-hidden bg-[#f3f4ee] dark:bg-slate-950"
            id="my-experience"
            ref={containerRef}
        >
            <div className="container px-4 mx-auto">
                <SectionTitle
                    title="My Experience"
                    classNames={{
                        title: 'text-2xl sm:text-3xl font-semibold tracking-[0.28em] text-slate-900 dark:text-slate-100',
                        container: 'gap-3 mb-12',
                    }}
                />

                <div className="relative mt-20 max-w-6xl mx-auto" ref={scrollRef}>

                    {/* The Vertical Line - Centered in the middle column */}
                    <div className="hidden md:block absolute left-[180px] md:left-[220px] top-0 bottom-0 w-[2px] bg-black/10 dark:bg-white/10">
                        <div className="timeline-line-fill absolute inset-0 bg-primary origin-top scale-y-0" />
                    </div>

                    <div className="flex flex-col gap-16 md:gap-24">
                        {MY_EXPERIENCE.map((item, index) => (
                            <div
                                key={item.title + index}
                                className="experience-item grid grid-cols-1 md:grid-cols-[200px_40px_1fr] items-start gap-4 md:gap-0"
                            >
                                {/* 1. Duration Column */}
                                <div className="md:text-right md:pr-10 pt-2">
                                    <p className="text-sm font-bold text-black/50 dark:text-white/50 tracking-tighter whitespace-nowrap">
                                        {item.duration}
                                    </p>
                                </div>

                                {/* 2. Timeline Dot Column (Centered visually) */}
                                <div className="hidden md:flex justify-center pt-3 relative">
                                    <div className="timeline-dot w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-black/20 dark:border-white/20 z-10 transition-transform duration-300" />

                                    {index === 0 && (
                                        <div className="absolute -top-6 flex flex-col items-center gap-1">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                            </span>
                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                PRESENT
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* 3. Content Column */}
                                <div className="md:pl-10">
                                    <p className="text-sm font-semibold tracking-[0.24em] uppercase mb-2 opacity-90 text-slate-600 dark:text-slate-300">
                                        {item.company}
                                    </p>
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold uppercase leading-tight text-slate-950 dark:text-slate-50 tracking-tight">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experiences;