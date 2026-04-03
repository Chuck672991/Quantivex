'use client';
import { GENERAL_INFO, SOCIAL_LINKS } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Contact = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            gsap.from('.contact-element', {
                y: 60,
                opacity: 0,
                stagger: 0.08,
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

    return (
        <section className="pb-section max-md:pb-20" id="contact">
            <div className="container" ref={containerRef}>
                <div className="relative border border-border overflow-hidden px-8 md:px-16 py-16 md:py-24">
                    {/* Faint decorative large text in background */}
                    <p
                        className="absolute bottom-4 right-6 text-[8rem] md:text-[14rem] font-anton leading-none text-foreground/[0.03] pointer-events-none select-none"
                        aria-hidden
                    >
                        CONTACT
                    </p>

                    <p className="contact-element text-xs text-muted-foreground uppercase tracking-[0.2em] mb-6">
                        Get In Touch
                    </p>

                    <h2 className="contact-element text-4xl sm:text-5xl md:text-7xl font-anton leading-[.9] mb-8 max-w-3xl">
                        LET&apos;S BUILD SOMETHING{' '}
                        <span className="text-primary">GREAT</span>
                    </h2>

                    <p className="contact-element text-muted-foreground text-lg max-w-md mb-10">
                        Have a project in mind? I&apos;m currently available for
                        freelance work and full-time opportunities.
                    </p>

                    {/* CTAs */}
                    <div className="contact-element flex flex-wrap items-center gap-3">
                        <a
                            href={`mailto:${GENERAL_INFO.email}`}
                            className="group inline-flex items-center gap-2 font-anton text-sm tracking-wider uppercase px-6 py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-300"
                        >
                            Send a Message
                            <ArrowUpRight
                                size={18}
                                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                            />
                        </a>

                        <a
                            href={GENERAL_INFO.linkedinProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2 font-medium text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 px-5 py-3.5 border border-border hover:border-primary/50"
                        >
                            LinkedIn
                            <ArrowUpRight
                                size={15}
                                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                            />
                        </a>

                        {SOCIAL_LINKS.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-2 font-medium text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 px-5 py-3.5 border border-border hover:border-primary/50 capitalize"
                            >
                                {link.name}
                                <ArrowUpRight
                                    size={15}
                                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
                                />
                            </a>
                        ))}
                    </div>

                    {/* Email + response note strip */}
                    <div className="contact-element mt-14 pt-8 border-t border-border flex flex-wrap gap-4 items-center justify-between">
                        <a
                            href={`mailto:${GENERAL_INFO.email}`}
                            className="text-xl sm:text-2xl md:text-3xl font-anton hover:text-primary transition-colors duration-200 break-all"
                        >
                            {GENERAL_INFO.email}
                        </a>
                        <p className="text-muted-foreground text-sm">
                            Usually responds within 24 hours
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
