import { notFound } from 'next/navigation';
import ProjectDetails from './_components/ProjectDetails';
import { PROJECTS as ALL_PROJECTS } from '@/lib/data';
import { BRAND } from '@/lib/brand';
import { Metadata } from 'next';

const PROJECTS = ALL_PROJECTS.filter((p) => !p.hidden);

/** Project descriptions are HTML snippets; the meta description must be plain text. */
const toPlainText = (html: string, max = 155) => {
    const text = html
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (text.length <= max) return text;
    return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
};

export const generateStaticParams = async () => {
    return PROJECTS.map((project) => ({ slug: project.slug }));
};

export const generateMetadata = async ({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
    const { slug } = await params;
    const project = PROJECTS.find((project) => project.slug === slug);

    if (!project) return { title: { absolute: `Project not found | ${BRAND.name}` } };

    const title = `${project.title} | ${BRAND.name}`;
    const description = toPlainText(project.description);

    return {
        // absolute: the root layout's title template would otherwise append the brand twice
        title: { absolute: title },
        description,
        openGraph: { title, description, type: 'website' },
    };
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
