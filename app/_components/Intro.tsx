'use client';
import Reveal from '@/components/Reveal';
import { AI_PROJECTS } from '@/lib/aiData';
import { gsap } from '@/lib/scroll/gsap';
import { useAct } from '@/lib/scroll/useAct';
import { SHOWCASE_PROJECTS } from '@/lib/showcaseData';
import { useRef } from 'react';

const STATEMENT =
    'Quantivex is a software development company. We design and build web platforms, mobile apps and AI systems for teams that need production-grade software, from first prototype to store release and production.';

const WORDS = STATEMENT.split(' ');

const DOMAINS = [
    'Maritime inspection',
    'Logistics & tracking',
    'Retail inventory',
    'Real estate',
    '3D brand experiences',
];

const STATS = [
    { value: SHOWCASE_PROJECTS.length, label: 'Projects in our selected work' },
    { value: AI_PROJECTS.length, label: 'AI and agentic systems' },
    { value: 3, label: 'Platforms: iOS, Android and web' },
];

const Intro = () => {
    const ref = useRef<HTMLElement>(null);

    useAct(ref, ({ q }) => {
        // The statement lights up word by word as it crosses the screen: one
        // scrubbed tween, each word a segment that overlaps its neighbours
        const statement = q('[data-statement]')[0];
        const words = q('[data-word]');
        if (statement && words.length) {
            gsap.fromTo(
                words,
                { opacity: 0.16 },
                {
                    opacity: 1,
                    ease: 'none',
                    duration: 1.6,
                    stagger: 1,
                    scrollTrigger: {
                        trigger: statement,
                        start: 'top 85%',
                        end: 'bottom 55%',
                        scrub: true,
                    },
                },
            );
        }

        // The figures count up once they come into view
        q('[data-count]').forEach((el) => {
            const value = Number(el.dataset.count);
            if (!Number.isFinite(value)) return;
            const counter = { n: 0 };
            el.textContent = '0';
            gsap.to(counter, {
                n: value,
                duration: 1.6,
                ease: 'power2.out',
                snap: { n: 1 },
                onUpdate: () => {
                    el.textContent = String(counter.n);
                },
                scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            });
        });

        return () => {
            q('[data-count]').forEach((el) => {
                el.textContent = el.dataset.count ?? el.textContent;
            });
        };
    });

    return (
        <section id="company" ref={ref} className="py-24 md:py-36">
            <div className="container">
                <p className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    <span aria-hidden className="size-1.5 bg-primary" />
                    01 — Company
                </p>

                <h2 className="sr-only">About Quantivex</h2>

                <div data-statement className="relative">
                    <p
                        className="max-w-[22ch] font-display text-[clamp(1.75rem,3.7vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.04em] sm:max-w-[30ch] lg:max-w-[34ch]"
                        aria-label={STATEMENT}
                    >
                        {WORDS.map((word, i) => (
                            <span
                                key={`${word}-${i}`}
                                data-word
                                className="mr-[0.26em] inline-block"
                            >
                                {word}
                            </span>
                        ))}
                    </p>
                </div>

                <div className="mt-20 grid gap-12 border-t border-border pt-10 md:grid-cols-12 md:gap-8">
                    <Reveal className="md:col-span-4">
                        <h3 className="mb-3 font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-muted-foreground">
                            What we build
                        </h3>
                        <p className="text-[15px] leading-relaxed text-foreground/85">
                            Web platforms, cross-platform mobile apps, AI agents
                            and automation, and the SaaS products and backends
                            that sit behind them.
                        </p>
                    </Reveal>
                    <Reveal delay={0.08} className="md:col-span-4">
                        <h3 className="mb-3 font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-muted-foreground">
                            Who we help
                        </h3>
                        <p className="text-[15px] leading-relaxed text-foreground/85">
                            Product teams, startups and operations-heavy
                            businesses that need dependable software, shipped
                            and maintained by engineers who own the outcome.
                        </p>
                    </Reveal>
                    <Reveal delay={0.16} className="md:col-span-4">
                        <h3 className="mb-3 font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-muted-foreground">
                            Where it has been applied
                        </h3>
                        <ul className="flex flex-wrap gap-2">
                            {DOMAINS.map((domain) => (
                                <li
                                    key={domain}
                                    className="rounded-full border border-border bg-background-light px-3 py-1 text-[13px] text-foreground/80"
                                >
                                    {domain}
                                </li>
                            ))}
                        </ul>
                    </Reveal>
                </div>

                <dl className="mt-16 grid gap-y-10 sm:grid-cols-3">
                    {STATS.map((stat, i) => (
                        <Reveal
                            key={stat.label}
                            delay={i * 0.08}
                            className="flex flex-col-reverse sm:border-l sm:border-border sm:pl-8 sm:first:border-l-0 sm:first:pl-0"
                        >
                            <dt className="mt-3 max-w-[16rem] text-sm text-muted-foreground">
                                {stat.label}
                            </dt>
                            <dd
                                data-count={stat.value}
                                className="font-display text-[clamp(3rem,6vw,4.75rem)] font-medium leading-none tracking-[-0.05em]"
                            >
                                {stat.value}
                            </dd>
                        </Reveal>
                    ))}
                </dl>
            </div>
        </section>
    );
};

export default Intro;
