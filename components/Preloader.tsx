'use client';
import { markSiteReady } from '@/lib/useSiteReady';
import { BRAND } from '@/lib/brand';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useLenis } from 'lenis/react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { LogoMark } from './Logo';

gsap.registerPlugin(useGSAP);

const STORAGE_KEY = 'quantivex-preloader';

const noopSubscribe = () => () => {};

// Decided once per page load: a visitor who has already seen the intro this
// session, or who prefers reduced motion, skips it.
let skipIntro: boolean | null = null;
const shouldSkipIntro = () => {
    if (skipIntro !== null) return skipIntro;
    const reduce = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
    ).matches;
    let seen = false;
    try {
        seen = window.sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
        // storage blocked: just play the intro
    }
    skipIntro = reduce || seen;
    return skipIntro;
};

/**
 * First-visit intro: the cube mark and wordmark resolve over a cobalt progress
 * line, then two panels lift away. It runs once per browser session and is
 * skipped entirely for reduced-motion visitors.
 */
const Preloader = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const [done, setDone] = useState(false);
    const lenis = useLenis();
    // null while hydrating (the overlay is already in the server HTML)
    const skip = useSyncExternalStore(
        noopSubscribe,
        shouldSkipIntro,
        () => null,
    );

    useEffect(() => {
        if (skip === null) return;
        if (skip) {
            markSiteReady();
            return;
        }
        try {
            window.sessionStorage.setItem(STORAGE_KEY, '1');
        } catch {
            // storage blocked: the intro will simply play again next visit
        }
    }, [skip]);

    // The page must not scroll under the intro (Lenis scrolls programmatically,
    // which overflow:hidden on the body does not stop)
    useEffect(() => {
        if (skip !== false || done || !lenis) return;
        lenis.stop();
        return () => lenis.start();
    }, [skip, done, lenis]);

    useGSAP(
        () => {
            if (skip !== false || done || !rootRef.current) return;

            const previousOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            const finish = () => {
                document.body.style.overflow = previousOverflow;
                markSiteReady();
                setDone(true);
            };

            const letters = gsap.utils.toArray<HTMLElement>('.pl-letter');
            gsap.set('.pl-bar', { scaleX: 0, transformOrigin: 'left center' });
            gsap.set('.pl-mark', { autoAlpha: 0, y: 14, scale: 0.9 });
            gsap.set(letters, { yPercent: 110 });

            const tl = gsap.timeline({ onComplete: finish });
            tl.to('.pl-mark', {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power3.out',
            })
                .to(
                    letters,
                    {
                        yPercent: 0,
                        duration: 0.55,
                        stagger: 0.035,
                        ease: 'power3.out',
                    },
                    '-=0.3',
                )
                .to(
                    '.pl-bar',
                    { scaleX: 1, duration: 0.85, ease: 'power2.inOut' },
                    0.1,
                )
                .to('.pl-content', {
                    autoAlpha: 0,
                    y: -10,
                    duration: 0.3,
                    delay: 0.15,
                    ease: 'power2.in',
                })
                .add(() => markSiteReady())
                .to('.pl-panel-2', {
                    yPercent: -100,
                    duration: 0.75,
                    ease: 'power3.inOut',
                })
                .to(
                    '.pl-panel-1',
                    { yPercent: -100, duration: 0.75, ease: 'power3.inOut' },
                    '-=0.62',
                );

            return () => {
                tl.kill();
                document.body.style.overflow = previousOverflow;
            };
        },
        { scope: rootRef, dependencies: [skip] },
    );

    if (skip === true || done) return null;

    return (
        <div
            ref={rootRef}
            className="fixed inset-0 z-[70]"
            role="status"
            aria-live="polite"
            aria-label={`Loading ${BRAND.name}`}
        >
            <div className="pl-panel-2 absolute inset-0 bg-primary" />
            <div className="pl-panel-1 absolute inset-0 bg-background-light bg-lattice">
                <div className="pl-content flex h-full flex-col items-center justify-center gap-6">
                    <LogoMark size={56} className="pl-mark opacity-0" />
                    <p
                        className="flex font-display text-xl font-semibold uppercase leading-none tracking-[0.3em] text-ink sm:text-2xl"
                        aria-hidden
                    >
                        {BRAND.name.split('').map((letter, i) => (
                            <span
                                key={i}
                                className="inline-block overflow-hidden pb-1"
                            >
                                <span className="pl-letter inline-block translate-y-[110%]">
                                    {letter}
                                </span>
                            </span>
                        ))}
                    </p>
                    <div className="h-px w-40 overflow-hidden bg-ink/10 sm:w-56">
                        <div className="pl-bar h-full w-full origin-left scale-x-0 bg-primary" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;
