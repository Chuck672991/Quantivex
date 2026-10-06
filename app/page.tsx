import AboutMe from './_components/AboutMe';
import AISection from './_components/AISection';
import Banner from './_components/Banner';
import Contact from './_components/Contact';
import Experiences from './_components/Experiences';
import ProjectList from './_components/ProjectList';
import Services from './_components/Services';
import Skills from './_components/Skills';
import Testimonials from './_components/Testimonials';
import Marquee from '@/components/Marquee';

export default function Home() {
    return (
        <div className="page-">
            {/* 1. Hero — first impression, available badge + animated counters */}
            <Banner />

            {/* 2. Tech ticker — immediate proof of breadth right below hero */}
            <Marquee />

            {/* 3. About — personal story + key metrics */}
            <AboutMe />

            {/* 4. Services — what you offer, drives intent */}
            <Services />

            {/* 5. Stack — deep-dive into tools */}
            <Skills />

            {/* 6. Experience — credibility timeline */}
            <Experiences />

            {/* 7. Testimonials — social proof */}
            {/*
            <Testimonials />
            */}

            {/* 8. Projects — the work itself */}
            <ProjectList />

            {/* 8b. AI — sits directly under the project showcase (mobile first,
                then web, then this) and leads into /ai-projects */}
            <AISection />

            {/* 9. Contact — close with a CTA */}
            <Contact />
        </div>
    );
}
