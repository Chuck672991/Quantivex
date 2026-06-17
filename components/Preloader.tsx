'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useEffect, useMemo, useRef, useState } from 'react';

gsap.registerPlugin(useGSAP);

const Preloader = () => {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const desktopRef = useRef<HTMLDivElement>(null);
    const mobileRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const percentRef = useRef<HTMLSpanElement>(null);

    const [isVisible, setIsVisible] = useState(true);

    const shouldReduceMotion = useMemo(() => {
        if (typeof window === 'undefined') return false
        return Boolean(
            window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,
        )
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return

        const alreadyShown = window.sessionStorage.getItem('portfolio-preloader') === '1'
        if (alreadyShown) {
            setIsVisible(false)
            return
        }

        window.sessionStorage.setItem('portfolio-preloader', '1')
    }, []);

    useGSAP(
        () => {
            if (!isVisible) return
            if (!preloaderRef.current) return

            const previousOverflow = document.body.style.overflow
            document.body.style.overflow = 'hidden'

            const counter = { value: 0 }

            const handleDone = () => {
                document.body.style.overflow = previousOverflow
                setIsVisible(false)
            }

            if (shouldReduceMotion) {
                if (percentRef.current) percentRef.current.textContent = '100'
                if (progressRef.current)
                    gsap.set(progressRef.current, { scaleX: 1, transformOrigin: 'left' })
                gsap.set(preloaderRef.current, { autoAlpha: 0 })
                handleDone()
                return
            }

            gsap.set(preloaderRef.current, { autoAlpha: 1, yPercent: 0 })

            const mm = gsap.matchMedia()

            mm.add(
                {
                    isDesktop: '(min-width: 768px)',
                    isMobile: '(max-width: 767px)',
                },
                (context) => {
                    const conditions = context.conditions as
                        | { isDesktop?: boolean; isMobile?: boolean }
                        | undefined

                    if (conditions?.isDesktop) {
                        const tl = gsap.timeline({
                            defaults: { ease: 'power1.inOut' },
                            onComplete: handleDone,
                        })

                        tl.to('.desktop-preloader .name-text span', {
                            y: 0,
                            stagger: 0.05,
                            duration: 0.2,
                        })
                        tl.to('.desktop-preloader .preloader-item', {
                            delay: 1,
                            y: '100%',
                            duration: 0.5,
                            stagger: 0.1,
                        })
                            .to(
                                '.desktop-preloader .name-text span',
                                { autoAlpha: 0 },
                                '<0.5',
                            )
                            .to(preloaderRef.current, { autoAlpha: 0 }, '<1')

                        return
                    }

                    // Mobile
                    gsap.set(progressRef.current, {
                        scaleX: 0,
                        transformOrigin: 'left',
                    })

                    const tl = gsap.timeline({
                        defaults: { ease: 'power2.inOut' },
                        onComplete: handleDone,
                    })

                    tl.to(counter, {
                        value: 100,
                        duration: 1.4,
                        ease: 'power1.out',
                        onUpdate: () => {
                            if (!percentRef.current) return
                            percentRef.current.textContent = String(
                                Math.round(counter.value),
                            )
                        },
                    })
                        .to(
                            progressRef.current,
                            {
                                scaleX: 1,
                                duration: 1.4,
                                ease: 'power1.out',
                            },
                            0,
                        )
                        .to(
                            preloaderRef.current,
                            { yPercent: -100, duration: 0.9 },
                            '+=0.1',
                        )
                        .set(preloaderRef.current, { autoAlpha: 0 })
                },
            )

            return () => {
                mm.revert()
                document.body.style.overflow = previousOverflow
            }
        },
        { scope: preloaderRef, dependencies: [isVisible, shouldReduceMotion] },
    );

    if (!isVisible) return null

    return (
        <div
            ref={preloaderRef}
            className="fixed inset-0 z-[6]"
            role="status"
            aria-live="polite"
            aria-label="Loading"
        >
            {/* Desktop preloader (previous animation) */}
            <div
                ref={desktopRef}
                className="desktop-preloader hidden md:flex h-full"
                aria-hidden
            >
                <div className="preloader-item h-full w-[10%] bg-[#EEF0E5]"></div>
                <div className="preloader-item h-full w-[10%] bg-[#D8DDCA]"></div>
                <div className="preloader-item h-full w-[10%] bg-[#C2CAAE]"></div>
                <div className="preloader-item h-full w-[10%] bg-[#A9B48E]"></div>
                <div className="preloader-item h-full w-[10%] bg-[#8FA06E]"></div>
                <div className="preloader-item h-full w-[10%] bg-[#7A8C5A]"></div>
                <div className="preloader-item h-full w-[10%] bg-[#637846]"></div>
                <div className="preloader-item h-full w-[10%] bg-[#4E6035]"></div>
                <div className="preloader-item h-full w-[10%] bg-[#3B4D27]"></div>
                <div className="preloader-item h-full w-[10%] bg-[#252F17]"></div>

                <p className="name-text flex text-[#EEF0E5] text-[11vw] sm:text-[14vw] lg:text-[160px] font-anton text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none overflow-hidden">
                    <span className="inline-block translate-y-full">H</span>
                    <span className="inline-block translate-y-full">A</span>
                    <span className="inline-block translate-y-full">I</span>
                    <span className="inline-block translate-y-full">D</span>
                    <span className="inline-block translate-y-full">E</span>
                    <span className="inline-block translate-y-full">R</span>
                    <span className="inline-block translate-y-full">A</span>
                    <span className="inline-block translate-y-full">L</span>
                    <span className="inline-block translate-y-full">I</span>
                </p>
            </div>

            {/* Mobile preloader (new animation) */}
            <div
                ref={mobileRef}
                className="mobile-preloader md:hidden h-full bg-background text-foreground"
            >
                <div className="container h-full py-10 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-6">
                        <p className="text-xs sm:text-sm tracking-[0.32em] uppercase text-muted-foreground">
                            Loading
                        </p>
                        <p className="text-xs sm:text-sm tracking-[0.32em] uppercase text-muted-foreground text-right">
                            Portfolio
                        </p>
                    </div>

                    <div className="flex items-end justify-between gap-6">
                        <p className="font-anton leading-none text-[18vw]">
                            <span ref={percentRef}>0</span>
                            <span className="text-primary">%</span>
                        </p>

                        <div className="w-[46%] max-w-[520px] pb-4">
                            <div className="h-[2px] w-full bg-border overflow-hidden">
                                <div
                                    ref={progressRef}
                                    className="h-full w-full bg-primary"
                                />
                            </div>
                            <p className="mt-3 text-xs tracking-[0.32em] uppercase text-muted-foreground text-right">
                                Haider Ali
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
