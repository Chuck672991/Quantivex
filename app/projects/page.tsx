import { Metadata } from 'next';
import { PROJECTS as ALL_PROJECTS } from '@/lib/data';
import WebProjectCard from './_components/WebProjectCard';
import TransitionLink from '@/components/TransitionLink';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Web Projects | Haider Ali',
    description:
        'Full-stack web applications, 3D experiences, and interactive platforms built with Next.js, Three.js, React, and GSAP.',
    openGraph: {
        title: 'Web Projects | Haider Ali',
        description:
            'Full-stack web applications, 3D experiences, and interactive platforms built with Next.js, Three.js, React, and GSAP.',
        type: 'website',
    },
};

const WEB_SLUGS = ['cosmetic-chemist', 'property-pro', 'breaktime'];

const CARD_META: Record<string, { type: string; coverImage: string }> = {
    'cosmetic-chemist': {
        type: '3D Web Experience',
        coverImage: '/projects/webProjectImages/chemist2.png',
    },
    'property-pro': {
        type: 'Real Estate Platform',
        coverImage: '/projects/long/property-pro.jpg',
    },
    breaktime: {
        type: 'Cross-Platform Dashboard',
        coverImage: '/projects/images/breaktime-1.png',
    },
};

export default function WebProjectsPage() {
    const webProjects = WEB_SLUGS.map((slug) =>
        ALL_PROJECTS.find((p) => p.slug === slug),
    ).filter(Boolean) as typeof ALL_PROJECTS;

    return (
        <main className="min-h-screen bg-[#0B0C0E]">
            <div className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-28 pb-24 md:pt-36">

                {/* Back link */}
                <TransitionLink
                    href="/#selected-projects"
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors duration-200 mb-14 group"
                >
                    <ArrowLeft
                        className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
                        strokeWidth={1.8}
                    />
                    Back
                </TransitionLink>

                {/* Hero */}
                <div className="mb-16 lg:mb-20">
                    <p className="text-xs font-mono tracking-[0.2em] uppercase text-primary mb-4">
                        Selected Work
                    </p>
                    <h1 className="font-anton text-5xl sm:text-6xl lg:text-7xl uppercase text-foreground leading-none mb-6">
                        Web Projects
                    </h1>
                    <p className="text-muted text-lg leading-relaxed max-w-[580px]">
                        Full-stack platforms and immersive 3D experiences — built with Next.js,
                        Three.js, React, and GSAP. Every project shipped end-to-end from architecture
                        to deployment.
                    </p>

                    {/* Divider */}
                    <div className="mt-10 h-px bg-white/[0.07] w-full" />
                </div>

                {/* Project grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-14">
                    {webProjects.map((project) => {
                        const meta = CARD_META[project.slug];
                        return (
                            <WebProjectCard
                                key={project.slug}
                                slug={project.slug}
                                title={project.title}
                                type={meta.type}
                                year={project.year}
                                coverImage={meta.coverImage}
                                techStack={project.techStack.slice(0, 3)}
                            />
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
