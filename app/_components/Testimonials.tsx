'use client';
import SectionTitle from '@/components/SectionTitle';
import { TESTIMONIALS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { useMemo, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Testimonials = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scrollerRef = useRef<HTMLDivElement>(null);

    const hasAvatars = useMemo(
        () => TESTIMONIALS.some((t) => Boolean(t.avatar)),
        [],
    );

    useGSAP(
        () => {
            gsap.from('.testimonial-item', {
                y: 60,
                opacity: 0,
                stagger: 0.12,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 72%',
                },
            });
        },
        { scope: containerRef },
    );

    const scrollByCard = (dir: 1 | -1) => {
        const el = scrollerRef.current;
        if (!el) return;
        const card = el.querySelector<HTMLElement>('[data-testimonial-card]');
        const step = (card?.offsetWidth ?? 360) + 16;
        el.scrollBy({ left: dir * step, behavior: 'smooth' });
    };

    return (
        <section className="pb-section max-md:pb-20" id="testimonials">
            <div className="container" ref={containerRef}>
                <div className="flex items-center justify-between gap-4">
                    <SectionTitle title="Testimonials" />

                    <div className="hidden md:flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => scrollByCard(-1)}
                            className="h-10 w-10 inline-flex items-center justify-center border border-border hover:border-primary/50 hover:text-primary transition-colors"
                            aria-label="Scroll testimonials left"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollByCard(1)}
                            className="h-10 w-10 inline-flex items-center justify-center border border-border hover:border-primary/50 hover:text-primary transition-colors"
                            aria-label="Scroll testimonials right"
                        >
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollerRef}
                    className={cn(
                        'testimonial-item',
                        'mt-6 flex gap-4 overflow-x-auto pb-2',
                        'snap-x snap-mandatory',
                        'md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-0 md:divide-x md:divide-y md:divide-border md:border md:border-border md:overflow-visible md:pb-0',
                    )}
                >
                    {TESTIMONIALS.map((t) => (
                        <article
                            key={`${t.name}-${t.title}-${t.company ?? ''}`}
                            data-testimonial-card
                            className={cn(
                                'snap-start shrink-0 w-[88%] xs:w-[75%] sm:w-[55%] md:w-auto',
                                'border border-border md:border-0',
                                'p-7 md:p-8 bg-background',
                                'hover:bg-primary/5 transition-colors duration-300',
                                'relative overflow-hidden',
                            )}
                        >
                            <div
                                className="absolute -top-5 -right-5 text-foreground/[0.04]"
                                aria-hidden
                            >
                                <Quote size={84} />
                            </div>

                            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                                “{t.quote}”
                            </p>

                            <div className="mt-7 flex items-center gap-3">
                                {hasAvatars && t.avatar ? (
                                    <Image
                                        src={t.avatar}
                                        alt={`${t.name} avatar`}
                                        width={44}
                                        height={44}
                                        className="h-11 w-11 rounded-full border border-border object-cover"
                                    />
                                ) : (
                                    <div className="h-11 w-11 rounded-full border border-border bg-primary/5" />
                                )}

                                <div className="leading-tight">
                                    <p className="font-medium">{t.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {t.title}
                                        {t.company ? ` · ${t.company}` : ''}
                                    </p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <p className="testimonial-item mt-6 text-xs text-muted-foreground">
                    Tip: replace the placeholder testimonials in `lib/data.ts`
                    with real client quotes for maximum impact.
                </p>
            </div>
        </section>
    );
};

export default Testimonials;

