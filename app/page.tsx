import Marquee from '@/components/Marquee';
import { SCROLL } from '@/lib/scroll/config';
import type { CSSProperties } from 'react';
import './_components/acts.css';
import AISection from './_components/AISection';
import Capabilities from './_components/Capabilities';
import Contact from './_components/Contact';
import CTA from './_components/CTA';
import Hero from './_components/Hero';
import Intro from './_components/Intro';
import Process from './_components/Process';
import SelectedWork from './_components/SelectedWork';
import Services from './_components/Services';
import WhyUs from './_components/WhyUs';

const RISE_STYLE = { '--op-handoff': SCROLL.handoff } as CSSProperties;

export default function Home() {
    return (
        <>
            {/* Pinned scroll opening: lockup, peephole zoom, the hero */}
            <Hero />
            {/* Rises over the pinned hero (hero.css: .op-rise) */}
            <div className="op-rise" style={RISE_STYLE}>
                <Marquee />
                <Intro />
            </div>
            <Services />
            {/* AI spotlight */}
            <AISection />
            <Capabilities />
            <SelectedWork />
            <Process />
            <WhyUs />
            <CTA />
            <Contact />
        </>
    );
}
