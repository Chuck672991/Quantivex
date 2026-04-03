'use client';
import SectionTitle from '@/components/SectionTitle';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Bot, Code2, Smartphone } from 'lucide-react';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SERVICES = [
    {
        Icon: Code2,
        number: '01',
        title: 'Full-Stack Web Development',
        description:
            'End-to-end web applications built with React, Next.js, Node.js, and modern databases. From landing pages to complex SaaS platforms — performant, scalable, and production-ready.',
        tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    },
    {
        Icon: Smartphone,
        number: '02',
        title: 'Mobile App Development',
        description:
            'Cross-platform iOS & Android apps with React Native. Shipped to both stores with real-time features, subscriptions, maps, and push notifications.',
        tags: ['React Native', 'Firebase', 'RevenueCat', 'Google Maps'],
    },
    {
        Icon: Bot,
        number: '03',
        title: 'AI Integration & Automation',
        description:
            'Smart systems powered by GPT-4, Whisper, and custom AI pipelines. Turn paper workflows into intelligent, voice-first applications that drive real ROI.',
        tags: ['GPT-4', 'Whisper API', 'OpenAI', 'Node.js'],
    },
];

const Services = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.service-card', {
                y: 70,
                opacity: 0,
                stagger: 0.15,
                duration: 0.9,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 72%',
                },
            });
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 1,
                },
            });
            tl.to(containerRef.current, { y: -100, opacity: 0 });
        },
        { scope: containerRef },
    );

    return (
        <section className="pb-section max-md:pb-20" id="services">
            <div className="container" ref={containerRef}>
                <SectionTitle title="What I Do" />

                <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border border border-border">
                    {SERVICES.map(({ Icon, number, title, description, tags }) => (
                        <div
                            key={number}
                            className="service-card group relative p-8 overflow-hidden hover:bg-primary/5 transition-colors duration-500"
                        >
                            {/* Top-border reveal on hover */}
                            <div className="absolute top-0 left-0 h-[2px] w-0 bg-primary group-hover:w-full service-top-line" />

                            <div className="flex items-start justify-between mb-8">
                                <span className="text-5xl font-anton text-muted-foreground/20 leading-none">
                                    {number}
                                </span>
                                <Icon
                                    size={22}
                                    className="text-primary opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 mt-1"
                                />
                            </div>

                            <h3 className="text-xl font-anton mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                                {title}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-7">
                                {description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground group-hover:border-primary/40 transition-colors duration-300"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
