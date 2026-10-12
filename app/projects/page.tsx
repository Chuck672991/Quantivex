import { Metadata } from 'next';
import { PROJECTS as ALL_PROJECTS } from '@/lib/data';
import { BRAND } from '@/lib/brand';
import WebProjectCard from './_components/WebProjectCard';
import TransitionLink from '@/components/TransitionLink';
import { ArrowLeft } from 'lucide-react';

const TITLE = `Web Projects | ${BRAND.name}`;
const DESCRIPTION = `Full-stack web applications, 3D experiences and interactive platforms built by ${BRAND.name} with Next.js, Three.js, React and GSAP.`;

export const metadata: Metadata = {
    // absolute: the root layout's title template would otherwise append the brand twice
    title: { absolute: TITLE },
    description: DESCRIPTION,
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
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
        // `dark` flips every token inside to the ink surface
        <div className="dark min-h-screen bg-ink-950 text-foreground">
            <div className="container pt-28 pb-24 md:pt-36">

                {/* Back link */}
                <TransitionLink
                    href="/#work"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-14 group"
                >
                    <ArrowLeft
                        className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1"
                        strokeWidth={1.8}
                    />
                    Back
                </TransitionLink>

                {/* Hero */}
                <div className="mb-16 lg:mb-20">
                    <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-primary mb-4">
                        Selected work
                    </p>
                    <h1 className="font-display text-[clamp(2.5rem,9vw,5.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-foreground mb-6">
                        Web projects
                    </h1>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-[580px]">
                        Full-stack platforms and immersive 3D experiences, built with Next.js,
                        Three.js, React and GSAP. We ship every project end to end, from
                        architecture to deployment.
                    </p>

                    {/* Divider */}
                    <div className="mt-10 h-px bg-border w-full" />
                </div>

                {/* Project grid */}
                <h2 className="sr-only">All web projects</h2>
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
        </div>
    );
}
