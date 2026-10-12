'use client';
import AnchorLink from '@/components/AnchorLink';
import SectionHeading from '@/components/SectionHeading';
import { STRENGTHS } from '@/lib/brand';
import { gsap, ScrollTrigger } from '@/lib/scroll/gsap';
import { useAct } from '@/lib/scroll/useAct';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

const WhyUs = () => {
    const ref = useRef<HTMLElement>(null);

    // Focus follows the scroll: the row crossing the middle of the screen is
    // the lit one, its neighbours are held back. The counter in the sticky
    // heading tracks it.
    useAct(ref, ({ q, full }) => {
        const rows = q('[data-wh="row"]');
        const counter = q('[data-wh="count"]')[0];

        rows.forEach((row) => {
            const number = row.querySelector('[data-wh="number"]');
            const body = row.querySelector('[data-wh="body"]');

            // Arrive: slides up into place as the row enters the lower third
            gsap.fromTo(
                [number, body],
                { opacity: 0, y: 44 },
                {
                    opacity: 1,
                    y: 0,
                    ease: 'none',
                    stagger: 0.12,
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 92%',
                        end: 'top 58%',
                        scrub: true,
                    },
                },
            );

            // Hold back once it has passed the middle (desktop: the heading is pinned beside it)
            if (full) {
                gsap.to(row, {
                    opacity: 0.38,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: row,
                        start: 'bottom 44%',
                        end: 'bottom 12%',
                        scrub: true,
                    },
                });
            }
        });

        if (counter) {
            ScrollTrigger.create({
                trigger: rows[0]?.parentElement?.parentElement,
                start: 'top 60%',
                end: 'bottom 60%',
                onUpdate: (self) => {
                    const index = Math.min(
                        rows.length - 1,
                        Math.floor(self.progress * rows.length),
                    );
                    counter.textContent = String(index + 1).padStart(2, '0');
                },
            });
        }
    });

    return (
        <section id="why-us" ref={ref} className="py-24 md:py-36">
            <div className="container grid gap-14 lg:grid-cols-12 lg:gap-10">
                <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
                    <SectionHeading
                        index="07"
                        label="Why Quantivex"
                        title={
                            <>
                                Engineers who{' '}
                                <span className="text-gradient">
                                    own the outcome
                                </span>
                            </>
                        }
                    >
                        <p>
                            What you can expect from working with us, each with
                            a project you can look at.
                        </p>
                    </SectionHeading>

                    <p
                        aria-hidden
                        className="mt-12 hidden font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground lg:block"
                    >
                        <span data-wh="count" className="text-foreground">
                            01
                        </span>{' '}
                        / {String(STRENGTHS.length).padStart(2, '0')}
                    </p>
                </div>

                <ol className="lg:col-span-8">
                    {STRENGTHS.map((strength, i) => (
                        <li
                            key={strength.title}
                            className="border-t border-border last:border-b"
                        >
                            <div
                                data-wh="row"
                                className="grid gap-5 py-9 sm:grid-cols-[88px_1fr] md:py-11"
                            >
                                <span
                                    aria-hidden
                                    data-wh="number"
                                    data-n={`0${i + 1}`}
                                    className="font-display text-[clamp(2.5rem,5vw,3.75rem)] font-medium leading-none tracking-[-0.05em] text-foreground/15 before:content-[attr(data-n)]"
                                />
                                <div data-wh="body">
                                    <h3 className="max-w-lg text-balance font-display text-[clamp(1.4rem,2.5vw,1.9rem)] font-medium leading-[1.1] tracking-[-0.035em]">
                                        {strength.title}
                                    </h3>
                                    <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                                        {strength.body}
                                    </p>
                                    <AnchorLink
                                        href={strength.proof.href}
                                        className="group mt-5 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-[13px] text-foreground transition-colors duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
                                    >
                                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] opacity-60">
                                            Proof
                                        </span>
                                        {strength.proof.label}
                                        <ArrowUpRight
                                            size={14}
                                            aria-hidden
                                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </AnchorLink>
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    );
};

export default WhyUs;
