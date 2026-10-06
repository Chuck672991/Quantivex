import { AI_PROJECTS } from '@/lib/aiData';
import type { Metadata } from 'next';
import AIProjectHero from './_components/AIProjectHero';
import AIProjectList from './_components/AIProjectList';
import AIProjectShowcase from './_components/AIProjectShowcase';
import AIProjectsClosing from './_components/AIProjectsClosing';

const DESCRIPTION =
    'Agentic AI systems by Haider Ali — LLM agents with tool calling, MCP integrations, context-aware retrieval and n8n automation pipelines.';

export const metadata: Metadata = {
    title: 'AI Projects | Haider Ali',
    description: DESCRIPTION,
    openGraph: {
        title: 'AI Projects | Haider Ali',
        description: DESCRIPTION,
        type: 'website',
    },
};

export default function AIProjectsPage() {
    return (
        // overflow-x-clip, not hidden: hidden would stop the index preview
        // from sticking (it makes this element the sticky scroll container).
        <div
            id="ai-projects-page"
            className="relative w-full overflow-x-clip bg-[#0B0C0E] text-white selection:bg-primary/30 selection:text-white"
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
