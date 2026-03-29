'use client';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutMe = () => {
    const container = React.useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-in',
                    trigger: container.current,
                    start: 'top 70%',
                    end: 'bottom bottom',
                    scrub: 0.5,
                },
            });

            tl.from('.slide-up-and-fade', {
                y: 150,
                opacity: 0,
                stagger: 0.05,
            });
        },
        { scope: container },
    );

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    id: 'about-me-out',
                    trigger: container.current,
                    start: 'bottom 50%',
                    end: 'bottom 10%',
                    scrub: 0.5,
                },
            });

            tl.to('.slide-up-and-fade', {
                y: -150,
                opacity: 0,
                stagger: 0.02,
            });
        },
        { scope: container },
    );

    return (
        <section className="pb-section max-md:pb-20" id="about-me">
            <div className="container" ref={container}>
                <h2 className="text-2xl sm:text-4xl md:text-6xl font-thin mb-10 md:mb-20 slide-up-and-fade">
                    I build production-ready applications — from mobile apps on
                    the App Store to AI-powered platforms and real-time systems.
                </h2>

                <p className="pb-3 border-b text-muted-foreground slide-up-and-fade">
                    This is me.
                </p>

                <div className="grid md:grid-cols-12 mt-9 gap-6 md:gap-0">
                    <div className="md:col-span-5">
                        <p className="text-3xl sm:text-5xl slide-up-and-fade">
                            Hi, I&apos;m Haider.
                        </p>
                    </div>
                    <div className="md:col-span-7">
                        <div className="text-base sm:text-lg text-muted-foreground max-w-[450px]">
                            <p className="slide-up-and-fade">
                                I&apos;m a Full-Stack Developer with 4+ years of
                                experience specializing in React, Next.js, and
                                React Native. I&apos;ve shipped apps to both the
                                App Store and Play Store, and I love integrating
                                AI to make products smarter.
                            </p>
                            <p className="mt-3 slide-up-and-fade">
                                My expertise spans AI integration (GPT-4,
                                Whisper), FinTech (RevenueCat), real-time
                                systems (WebSockets, Firebase), and 3D web
                                experiences (Three.js). I focus on delivering
                                scalable, high-performance solutions that drive
                                real business results.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutMe;
