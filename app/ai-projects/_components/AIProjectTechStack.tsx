import StackIcon from '@/components/StackIcon';
import { MY_STACK } from '@/lib/data';
import type { IStackItem } from '@/types';

const SKILLS = new Map<string, IStackItem>(
    MY_STACK.flatMap((g) => g.items).map((item) => [item.name, item]),
);

// Project tech strings that differ from the skill names they correspond to.
const ALIASES: Record<string, string> = {
    React: 'React.js',
    'GPT-4': 'OpenAI API',
    OpenAI: 'OpenAI API',
    'Claude API (tool use)': 'Claude API',
    'Supabase (PostgreSQL, Realtime)': 'PostgreSQL / Supabase',
    'MCP (HTTP Streamable, OAuth2)': 'MCP',
    'Canva MCP': 'MCP',
    'AI Agent node': 'LLM Agents',
};

interface Props {
    technologies: string[];
    /** "r, g, b" — colours the dot shown when a technology has no icon. */
    accent: string;
}

const AIProjectTechStack = ({ technologies, accent }: Props) => (
    <ul className="flex flex-wrap gap-2">
        {technologies.map((tech) => {
            const skill = SKILLS.get(ALIASES[tech] ?? tech);
            return (
                <li
                    key={tech}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/70"
                >
                    {skill ? (
                        <StackIcon item={skill} size={14} bare />
                    ) : (
                        <span
                            aria-hidden
                            className="size-1.5 rounded-full"
                            style={{ background: `rgb(${accent})` }}
                        />
                    )}
                    {tech}
                </li>
            );
        })}
    </ul>
);

export default AIProjectTechStack;
