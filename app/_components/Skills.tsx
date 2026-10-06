'use client';
import SectionTitle from '@/components/SectionTitle';
import StackIcon from '@/components/StackIcon';
import { MY_STACK } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const slideUpEl =
                containerRef.current?.querySelectorAll('.slide-up');
            if (!slideUpEl?.length) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    end: 'bottom 80%',
                    scrub: 0.5,
                },
            });
            tl.from('.slide-up', {
                opacity: 0,
                y: 40,
                ease: 'none',
                stagger: 0.4,
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
            tl.to(containerRef.current, { y: -150, opacity: 0 });
        },
        { scope: containerRef },
    );

    return (
        <section
            id="my-stack"
            ref={containerRef}
            className="pb-section max-md:pb-20"
        >
            <div className="container">
                <SectionTitle title="My Stack" />

                <div className="space-y-12 md:space-y-16">
                    {MY_STACK.map((group) => (
                        <div
                            className="grid sm:grid-cols-12 gap-4 sm:gap-0"
                            key={group.key}
                        >
                            <div className="sm:col-span-5 sm:pr-8">
                                <p className="slide-up text-3xl sm:text-4xl md:text-5xl font-anton leading-none text-muted-foreground uppercase">
                                    {group.label}
                                </p>
                                {group.ai && (
                                    <span className="slide-up mt-3 inline-block rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase leading-none tracking-[0.2em] text-primary">
                                        AI
                                    </span>
                                )}
                            </div>

                            <ul className="sm:col-span-7 flex gap-x-8 gap-y-6 flex-wrap">
                                {group.items.map((item) => (
                                    <li
                                        className="slide-up group flex gap-2.5 items-center hover:text-primary transition-colors duration-200"
                                        key={item.name}
                                    >
                                        <StackIcon
                                            item={item}
                                            size={32}
                                            className="group-hover:scale-110 transition-transform duration-200"
                                        />
                                        <div className="leading-tight">
                                            <span className="block text-lg sm:text-xl">
                                                {item.name}
                                            </span>
                                            {item.detail && (
                                                <span className="mt-1 block max-w-[300px] text-xs text-muted-foreground">
                                                    {item.detail}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
