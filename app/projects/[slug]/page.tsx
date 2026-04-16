import { notFound } from 'next/navigation';
import ProjectDetails from './_components/ProjectDetails';
import { PROJECTS as ALL_PROJECTS } from '@/lib/data';

const PROJECTS = ALL_PROJECTS.filter((p) => !p.hidden);
import { Metadata } from 'next';

export const generateStaticParams = async () => {
    return PROJECTS.map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}) => {
    const { slug } = await params;
    const project = PROJECTS.find((project) => project.slug === slug);

    return {
        title: `${project?.title} - ${project?.techStack
            .slice(0, 3)
            .join(', ')}`,
        description: project?.description,
    } as Metadata;
};

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const project = PROJECTS.find((project) => project.slug === slug);

    if (!project) {
        return notFound();
    }

    const idx = PROJECTS.findIndex((p) => p.slug === slug);
    const prev = idx > 0 ? PROJECTS[idx - 1] : null;
    const next = idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null;

    return (
        <ProjectDetails
            project={project}
            prevProject={prev}
            nextProject={next}
            moreProjects={PROJECTS.filter((p) => p.slug !== slug).slice(0, 3)}
        />
    );
};

export default Page;
