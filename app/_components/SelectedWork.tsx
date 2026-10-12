'use client';
import AIProjectPhones from '@/app/ai-projects/_components/AIProjectPhones';
import AnchorLink from '@/components/AnchorLink';
import Button from '@/components/Button';
import GridBackdrop from '@/components/GridBackdrop';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import {
    CASE_STUDIES,
    MORE_WORK,
    type CaseTone,
    type ICaseStudy,
} from '@/lib/caseStudies';
import { WORK_LINKS } from '@/lib/brand';
import { gsap } from '@/lib/scroll/gsap';
import { useAct } from '@/lib/scroll/useAct';
import { cn } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

// Top offset of each stacked card (px): later cards sit a little lower
const STACK_TOP = (index: number) => 96 + index * 14;

const TONES: Record<CaseTone, string> = {
    ink: 'dark bg-ink-950 text-foreground',
    ice: 'bg-background-light text-foreground',
    cobalt: 'cobalt bg-background text-foreground',
    white: 'bg-background text-foreground',
};

// Theme token that matches each panel's background (the grid fades into it)
const SURFACE: Record<CaseTone, 'background' | 'background-light'> = {
    ink: 'background',
    ice: 'background-light',
    cobalt: 'background',
    white: 'background',
};

const BrowserFrame = ({
    image,
    url,
    title,
}: {
    image: string;
    url: string;
    title: string;
}) => (
    <div className="relative mx-auto w-full max-w-[640px]">
        <div
            aria-hidden
            className="perf-fx absolute -inset-4 sm:-inset-16"
            style={{
                background:
                    'radial-gradient(closest-side, hsl(var(--primary) / 0.14), transparent)',
            }}
        />
        <div className="relative overflow-hidden rounded-2xl border border-border bg-background shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)]">
            <div className="flex items-center gap-2 border-b border-border bg-background-light px-4 py-3">
                <span className="size-2.5 rounded-full bg-foreground/15" />
                <span className="size-2.5 rounded-full bg-foreground/15" />
                <span className="size-2.5 rounded-full bg-foreground/15" />
                <span className="ml-3 flex-1 truncate rounded-md bg-background px-3 py-1 text-center font-mono text-[11px] text-muted-foreground">
                    {url}
                </span>
            </div>
            <div className="relative aspect-[16/10] bg-ink-950">
                <Image
                    src={image}
                    alt={`${title} website`}
                    fill
                    sizes="(max-width: 1024px) 90vw, 640px"
                    className="object-cover object-top"
                />
            </div>
        </div>
    </div>
);

const CaseStudy = ({ study, index }: { study: ICaseStudy; index: number }) => {
    const flip = index % 2 === 1;

    return (
        <article
            data-wk="card"
            id={study.slug}
            aria-labelledby={`${study.slug}-title`}
            // Sticky stacking only where the panel fits the viewport
            style={{ top: `${STACK_TOP(index)}px` }}
            className={cn(
                'relative rounded-[28px] border border-border/60 sm:rounded-[36px]',
                '[@media(min-width:1024px)_and_(min-height:720px)]:sticky',
                TONES[study.tone],
            )}
        >
            {/* Clip the static backdrop only: rounded overflow on the moving
                phones would force a clip mask while scrolling */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
            >
                <GridBackdrop at="75% 30%" surface={SURFACE[study.tone]} />
            </div>
            <div className="relative grid gap-10 p-6 sm:p-10 lg:min-h-[580px] lg:grid-cols-12 lg:items-center lg:gap-8 lg:p-14">
                <div
                    data-wk="copy"
                    className={cn('lg:col-span-5', flip && 'lg:order-2')}
                >
                    <p className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        <span className="text-foreground">
                            0{index + 1} / 0{CASE_STUDIES.length}
                        </span>
                        <span>{study.category}</span>
                        <span>{study.year}</span>
                    </p>

                    <h3
                        id={`${study.slug}-title`}
                        className="text-[clamp(2.2rem,4.4vw,3.6rem)] font-medium leading-[1] tracking-[-0.045em]"
                    >
                        {study.title}
                    </h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-[17px]">
                        {study.pitch}
                    </p>

                    <ul className="mt-6 space-y-3">
                        {study.highlights.map((highlight) => (
                            <li
                                key={highlight}
                                className="flex gap-3 text-[15px] leading-snug text-foreground/90"
                            >
                                <span
                                    aria-hidden
                                    className="mt-[7px] size-1.5 shrink-0 bg-primary"
                                />
                                {highlight}
                            </li>
                        ))}
                    </ul>

                    <ul
                        className="mt-6 flex flex-wrap gap-2"
                        aria-label="Technology"
                    >
                        {study.stack.map((tech) => (
                            <li
                                key={tech}
                                className="rounded-full border border-border/60 bg-foreground/[0.05] px-3 py-1 text-xs text-foreground/85"
                            >
                                {tech}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <Button href={study.href} variant="ink" size="md" arrow>
                            View case study
                        </Button>
                        {study.liveUrl && (
                            <Button
                                href={study.liveUrl}
                                variant="outline"
                                size="md"
                                arrow
                            >
                                Visit site
                            </Button>
                        )}
                    </div>
                </div>

                <div
                    data-wk="visual"
                    className={cn('lg:col-span-7', flip && 'lg:order-1')}
                >
                    {study.visual.kind === 'phones' ? (
                        <AIProjectPhones
                            parallax={false}
                            screenshots={study.visual.screenshots}
                            title={study.title}
                            accent={study.accent}
                        />
                    ) : (
                        <BrowserFrame
                            image={study.visual.image}
                            url={study.visual.url}
                            title={study.title}
                        />
                    )}
                </div>
            </div>

            {/* Gathers over the card while the next one stacks onto it */}
            <div
                data-wk="veil"
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-ink-950 opacity-0"
            />
        </article>
    );
};

const SelectedWork = () => {
    const ref = useRef<HTMLElement>(null);

    useAct(ref, ({ q, pinned }) => {
        const cards = q('[data-wk="card"]');

        cards.forEach((card, index) => {
            const copy = card.querySelector('[data-wk="copy"]');
            const visual = card.querySelector('[data-wk="visual"]');
            const veil = card.querySelector('[data-wk="veil"]');
            const next = cards[index + 1];

            // Copy lines rise once the card is well into view
            if (copy) {
                gsap.fromTo(
                    copy.children,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        ease: 'expo.out',
                        stagger: 0.07,
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 72%',
                            once: true,
                        },
                    },
                );
            }

            // The visual settles into its frame as the card arrives
            if (visual) {
                gsap.fromTo(
                    visual,
                    { scale: 1.12, y: 64 },
                    {
                        scale: 1,
                        y: 0,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 96%',
                            end: 'top 34%',
                            scrub: true,
                        },
                    },
                );
            }

            // Stacked cards: as the next one slides over, this one recedes
            if (pinned && next) {
                const recede = gsap.timeline({
                    defaults: { ease: 'none' },
                    scrollTrigger: {
                        trigger: next,
                        start: 'top 88%',
                        end: `top ${STACK_TOP(index + 1)}px`,
                        scrub: true,
                    },
                });
                recede.to(card, { scale: 0.94, transformOrigin: '50% 0%' }, 0);
                if (veil) recede.to(veil, { opacity: 0.32 }, 0);
            }
        });
    });

    return (
        <section id="work" ref={ref} className="py-24 md:py-36">
            <div className="container">
                <div className="mb-14 flex flex-col justify-between gap-8 md:mb-20 lg:flex-row lg:items-end">
                    <SectionHeading
                        index="05"
                        label="Selected work"
                        title={
                            <>
                                Products we have taken{' '}
                                <span className="text-gradient">
                                    from idea to release
                                </span>
                            </>
                        }
                    />
                    <Reveal
                        delay={0.2}
                        className="max-w-sm text-[15px] leading-relaxed text-muted-foreground"
                    >
                        Four case studies from our work across mobile, AI and
                        web. Each links to its full write-up.
                    </Reveal>
                </div>

                <div className="space-y-6 lg:space-y-8">
                    {CASE_STUDIES.map((study, i) => (
                        <CaseStudy key={study.slug} study={study} index={i} />
                    ))}
                </div>

                <div className="mt-24 grid gap-14 md:mt-32 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <Reveal>
                            <h3 className="mb-5 font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-muted-foreground">
                                More work
                            </h3>
                        </Reveal>
                        <ul className="border-b border-border">
                            {MORE_WORK.map((item) => (
                                <li
                                    key={item.title}
                                    className="border-t border-border"
                                >
                                    <AnchorLink
                                        href={item.href}
                                        className="group flex items-start justify-between gap-6 py-6"
                                    >
                                        <span>
                                            <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                                {item.category}
                                            </span>
                                            <span className="mt-2 block font-display text-2xl font-medium tracking-[-0.03em]">
                                                {item.title}
                                            </span>
                                            <span className="mt-2 block max-w-sm text-sm leading-relaxed text-muted-foreground">
                                                {item.pitch}
                                            </span>
                                        </span>
                                        <ArrowUpRight
                                            aria-hidden
                                            className="mt-1 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
                                        />
                                    </AnchorLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-7">
                        <Reveal>
                            <h3 className="mb-5 font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-muted-foreground">
                                Browse the full collection
                            </h3>
                        </Reveal>
                        <ul className="border-b border-border">
                            {WORK_LINKS.map((link, i) => (
                                <li
                                    key={link.name}
                                    className="border-t border-border"
                                >
                                    <AnchorLink
                                        href={link.href}
                                        className="group flex items-center justify-between gap-6 py-5 md:py-6"
                                    >
                                        <span className="flex items-baseline gap-5">
                                            <span className="font-mono text-xs tracking-[0.18em] text-muted-foreground">
                                                0{i + 1}
                                            </span>
                                            <span className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-medium tracking-[-0.04em] transition-colors group-hover:text-primary">
                                                {link.name}
                                            </span>
                                        </span>
                                        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border transition-colors duration-300 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                                            <ArrowUpRight
                                                size={17}
                                                aria-hidden
                                            />
                                        </span>
                                    </AnchorLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SelectedWork;
