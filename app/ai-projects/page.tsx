import { BRAND } from '@/lib/brand';
import { AI_PROJECTS } from '@/lib/aiData';
import type { Metadata } from 'next';
import AIProjectHero from './_components/AIProjectHero';
import AIProjectList from './_components/AIProjectList';
import AIProjectShowcase from './_components/AIProjectShowcase';
import AIProjectsClosing from './_components/AIProjectsClosing';

const TITLE = `AI Projects | ${BRAND.name}`;
const DESCRIPTION = `Agentic AI systems from ${BRAND.name}: LLM agents with tool calling, MCP integrations, context-aware retrieval and n8n automation pipelines.`;

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

export default function AIProjectsPage() {
    return (
        // `dark` flips every token inside to the ink surface.
        // overflow-x-clip, not hidden: hidden would stop the index preview
        // from sticking (it makes this element the sticky scroll container).
        <div
            id="ai-projects-page"
            className="dark relative w-full overflow-x-clip bg-ink-950 text-foreground selection:bg-primary/30 selection:text-foreground"
        >
            <AIProjectHero />
            <AIProjectList projects={AI_PROJECTS} />
            {AI_PROJECTS.map((project, i) => (
                <AIProjectShowcase
                    key={project.id}
                    project={project}
                    index={i}
                    total={AI_PROJECTS.length}
                />
            ))}
            <AIProjectsClosing />
        </div>
    );
}
