'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import SectionTitle from '@/components/SectionTitle';
import CategoryShowcaseCarousel from '@/components/CategoryShowcaseCarousel';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ProjectList = () => {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            gsap.from(sectionRef.current, {
                y: 100,
                opacity: 0,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top bottom',
                    end: 'top 80%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });
        },
        { scope: sectionRef },
    );

    return (
        <section ref={sectionRef} className="pb-section max-md:pb-20" id="selected-projects">
            <div className="container">
                <SectionTitle title="SELECTED PROJECTS" />
                <CategoryShowcaseCarousel />
            </div>
        </section>
    );
};

export default ProjectList;
