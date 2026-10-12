'use client';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { PROCESS_STEPS } from '@/lib/brand';
import { gsap, ScrollTrigger } from '@/lib/scroll/gsap';
import { SPRING_16_6 } from '@/lib/scroll/springs';
import { useAct } from '@/lib/scroll/useAct';
import { Check } from 'lucide-react';
import { useRef } from 'react';

const Process = () => {
    const sectionRef = useRef<HTMLElement>(null);

    // One scrubbed pass down the steps: the line draws itself, and each step
    // marker lights up and settles as the line reaches it
    useAct(sectionRef, ({ q, full }) => {
        const list = q('[data-pr="list"]')[0];
        const fill = q('[data-pr="fill"]');
        const dots = q('[data-pr="dot"]');
        if (!list) return;

        const count = dots.length;
        gsap.set(dots, { scale: 0.7 });

        const tl = gsap.timeline({ defaults: { ease: 'none' } });
        // Horizontal on desktop, vertical below: both fills draw, one is shown
        tl.fromTo(
            fill,
            full ? { scaleX: 0 } : { scaleY: 0 },
            full
                ? { scaleX: 1, duration: count }
                : { scaleY: 1, duration: count },
            0,
        );
        dots.forEach((dot, index) => {
            tl.to(
                dot,
                { scale: 1, duration: 0.5, ease: SPRING_16_6 },
                index * ((count - 1) / count),
            );
        });

        ScrollTrigger.create({
            trigger: list,
            start: 'top 75%',
            end: 'bottom 65%',
            scrub: true,
            animation: tl,
            onUpdate: (self) => {
                const reached = self.progress * count;
                dots.forEach((dot, index) => {
                    const lit = index <= reached + 0.05;
                    if (dot.dataset.lit !== String(lit)) {
                        dot.dataset.lit = String(lit);
                    }
                });
            },
        });
    });

    return (
        <section
            id="process"
            ref={sectionRef}
            className="bg-background-light py-24 md:py-36"
        >
            <div className="container">
                <SectionHeading
                    index="06"
                    label="Process"
                    title={
                        <>
                            From first conversation{' '}
                            <span className="text-gradient">to launch</span>
                        </>
                    }
                >
                    <p>
                        A clear path from discovery to delivery, so you always
                        know what is being built, why, and what comes next.
                    </p>
                </SectionHeading>

                <ol
                    data-pr="list"
                    className="relative mt-16 grid gap-12 lg:mt-24 lg:grid-cols-5 lg:gap-6"
                >
                    {/* Progress line: horizontal on desktop, vertical on small screens */}
                    <div
                        aria-hidden
                        className="absolute bottom-6 left-[27px] top-6 w-px bg-border lg:bottom-auto lg:left-0 lg:right-0 lg:top-[27px] lg:h-px lg:w-auto"
                    >
                        <div
                            data-pr="fill"
                            className="absolute inset-0 origin-top bg-primary lg:hidden"
                        />
                        <div
                            data-pr="fill"
                            className="absolute inset-0 hidden origin-left bg-primary lg:block"
                        />
                    </div>

                    {PROCESS_STEPS.map((step, i) => (
                        <li
                            key={step.title}
                            className="relative pl-[88px] lg:pl-0 lg:pt-[88px]"
                        >
                            <span
                                data-pr="dot"
                                className="absolute left-0 top-0 z-10 grid size-[54px] place-items-center rounded-full border border-border bg-background font-mono text-sm tracking-widest shadow-sm transition-colors duration-300 data-[lit=true]:border-primary data-[lit=true]:text-primary"
                            >
                                0{i + 1}
                            </span>
                            <Reveal delay={i * 0.07} amount={0.4}>
                                <h3 className="font-display text-xl font-medium tracking-[-0.03em]">
                                    {step.title}
                                </h3>
                                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                                    {step.summary}
                                </p>
                                <ul className="mt-5 space-y-2.5">
                                    {step.points.map((point) => (
                                        <li
                                            key={point}
                                            className="flex items-start gap-2.5 text-[13.5px] leading-snug text-foreground/85"
                                        >
                                            <Check
                                                size={15}
                                                aria-hidden
                                                className="mt-px shrink-0 text-primary"
                                            />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </Reveal>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

export default Process;
