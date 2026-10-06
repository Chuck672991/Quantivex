// Source of truth: HaiderAli_CV.md → "AI & AGENTIC PROJECTS" and the TURNUP
// experience bullets. Nothing here is invented: where the CV gives no metric
// there is no `outcome`, and projects without screenshots are shown through
// the architecture `flow` instead of imagery.
//
// To add a project: append an entry to AI_PROJECTS. The homepage section, the
// /ai-projects index, preview panel and showcase all render from this array.
//
// Eagle IoT is deliberately absent: the CV lists it under the AI heading, but
// it is a React Native tracking app with no AI component.

export type AIFlowKind = 'input' | 'model' | 'tool' | 'data' | 'guard' | 'output';

export interface IAIFlowNode {
    label: string;
    detail?: string;
    kind: AIFlowKind;
}

export interface IAIFlowBranch extends IAIFlowNode {
    /** Short mono label shown on the fork, e.g. "SUCCESS". */
    tag: string;
}

export interface IAIFlowStep extends IAIFlowNode {
    /** Optional fork after this step (rendered as parallel mini-nodes). */
    branches?: IAIFlowBranch[];
}

export interface IAIProject {
    /** URL-safe id: used for the #anchor and React keys. */
    id: string;
    title: string;
    /** Short descriptor under the title, e.g. "Voice-to-report AI". */
    category: string;
    /** System-type tags revealed on hover / focus and shown as pills. */
    tags: string[];
    /** One line for the index rows and preview panel. */
    teaser: string;
    /** 1–2 sentences for the showcase section. */
    summary: string;
    problem?: string;
    solution?: string;
    /** Engineering details, straight from the CV. */
    highlights: string[];
    /** Only set when the CV states an outcome. */
    outcome?: string;
    technologies: string[];
    /** AI architecture, in order. */
    flow: IAIFlowStep[];
    flowOrientation: 'horizontal' | 'vertical';
    /** split = text left / visual right, split-reverse flips it, wide stacks them. */
    layout: 'split' | 'split-reverse' | 'wide';
    /** Real device captures, when they exist. */
    screenshots?: string[];
    /** "r, g, b" — drives the ambient glow for this project. */
    accent: string;
    /** Internal detail page, if one exists. */
    href?: string;
    liveUrl?: string;
    /** Employer / product context, only where the CV states it. */
    context?: string;
}

export const AI_PROJECTS: IAIProject[] = [
    {
        id: 'mwi-ai',
        title: 'MWI AI',
        category: 'Voice-to-report documentation',
        tags: ['LLM', 'Speech-to-Text', 'Documentation'],
        teaser: 'GPT-4 and Whisper turn field engineers’ voice notes into documentation.',
        summary:
            'Led end-to-end development and production release of the MWI AI platform on iOS (Marine Welding & Inspection). An AI documentation pipeline built on GPT-4 and the Whisper API converts voice to text and drafts the documentation, so field engineers spend less time writing it up.',
        solution:
            'Voice is transcribed with the Whisper API, then GPT-4 turns it into documentation — a pipeline I architected and shipped.',
        highlights: [
            'Led end-to-end development and production release on iOS',
            'AI documentation pipeline on GPT-4 and the Whisper API (voice-to-text)',
            'Built the MWI web portal for client onboarding and service visibility',
            'Paired with a context-aware AI chat assistant for vessel inspection data',
        ],
        outcome: 'Reduced documentation time for field engineers.',
        technologies: [
            'GPT-4',
            'Whisper API',
            'React Native',
            'Node.js',
            'Fastify',
            'MongoDB',
            'TypeScript',
        ],
        flow: [
            { kind: 'input', label: 'Voice note', detail: 'Spoken by the field engineer' },
            { kind: 'model', label: 'Whisper API', detail: 'Speech-to-text' },
            { kind: 'model', label: 'GPT-4', detail: 'Drafts the documentation' },
            { kind: 'output', label: 'Inspection documentation', detail: 'Less documentation time for field engineers' },
        ],
        flowOrientation: 'vertical',
        layout: 'split',
        screenshots: [
            '/projects/mobileApps/MwiAi1.png',
            '/projects/mobileApps/MwiAi2.png',
            '/projects/mobileApps/MwiAi3.png',
        ],
        accent: '99, 102, 241',
        href: '/projects/mwi-ai',
        liveUrl: 'https://app.mwi.services/',
        context: 'TURNUP Technologies',
    },
    {
        id: 'vessel-chat',
        title: 'Context-Aware Vessel Chat',
        category: 'RAG · inspection assistant',
        tags: ['RAG', 'Intent Classification', 'Structured Output'],
        teaser: 'An intent classifier plus targeted MongoDB retrieval, instead of stuffing the prompt.',
        summary:
            'A client-facing assistant that answers questions about a client’s own vessels, inspections and defects. It replaced full-data prompt stuffing with an intent classifier and targeted MongoDB aggregation retrieval.',
        problem:
            'Putting a client’s whole dataset into the prompt costs tokens and makes exact counts hard to guarantee.',
        solution:
            'An LLM detects the intent and returns structured JSON (intent, vessel, filters). Only the matching data is pulled with a targeted MongoDB aggregation, scoped per client, and the model answers from that.',
        highlights: [
            'Answers questions about a client’s own vessels, inspections and defects',
            'LLM intent detection returns structured JSON: intent, vessel, filters',
            'Targeted MongoDB aggregation retrieval, scoped per client',
            'Returns exact defect and inspection counts',
        ],
        outcome: 'Lower token cost, with exact defect and inspection counts.',
        technologies: ['Node.js', 'MongoDB', 'React', 'Vercel AI SDK', 'LLM APIs'],
        flow: [
            { kind: 'input', label: 'Client question', detail: 'About their own vessels, inspections and defects' },
            { kind: 'model', label: 'Intent classifier', detail: 'Structured JSON: intent, vessel, filters' },
            { kind: 'data', label: 'MongoDB aggregation', detail: 'Targeted retrieval, scoped per client' },
            { kind: 'model', label: 'LLM answer', detail: 'Exact defect and inspection counts' },
        ],
        flowOrientation: 'vertical',
        layout: 'split-reverse',
        accent: '34, 211, 238',
        context: 'Part of the MWI AI platform',
    },
    {
        id: 'akacia',
        title: 'AKACIA',
        category: 'AI social content agent',
        tags: ['AI Agent', 'MCP', 'Automation'],
        teaser: 'An n8n agent that turns a content prompt into a finished Canva design via MCP.',
        summary:
            'An autonomous n8n workflow: it receives a content prompt through a webhook, has an AI agent turn it into a structured design brief, then calls Canva’s MCP server to generate the design and returns the edit URL.',
        solution:
            'The agent produces a design brief (format, headline, style, palette) and drives Canva’s MCP server over HTTP Streamable with OAuth2. URL extraction, success/failure branching and fallback handling close the loop.',
        highlights: [
            'Prompt in via webhook, design edit URL out — fully autonomous',
            'AI agent converts the prompt into format, headline, style and palette',
            'Calls Canva’s MCP server (HTTP Streamable, OAuth2) to generate the design',
            'URL extraction, success/failure branching and fallback handling',
        ],
        technologies: [
            'n8n',
            'AI Agent node',
            'OpenAI',
            'MCP (HTTP Streamable, OAuth2)',
            'Canva MCP',
        ],
        flow: [
            { kind: 'input', label: 'Webhook', detail: 'Receives a content prompt' },
            { kind: 'model', label: 'AI Agent', detail: 'OpenAI — structured brief: format, headline, style, palette' },
            { kind: 'tool', label: 'Canva MCP server', detail: 'HTTP Streamable · OAuth2 — generates the design' },
            { kind: 'tool', label: 'URL extraction', detail: 'Pulls the edit URL from the result' },
            {
                kind: 'guard',
                label: 'Result check',
                detail: 'Success / failure branching',
                branches: [
                    { kind: 'output', tag: 'SUCCESS', label: 'Edit URL returned' },
                    { kind: 'guard', tag: 'FAILURE', label: 'Fallback handling' },
                ],
            },
        ],
        flowOrientation: 'horizontal',
        layout: 'wide',
        accent: '168, 85, 247',
    },
    {
        id: 'workflow-platform',
        title: 'Multi-Tenant AI Workflow Platform',
        category: 'SaaS · async AI jobs',
        tags: ['Automation', 'Multi-Tenant', 'Async Workflows'],
        teaser: 'Server actions trigger n8n AI workflows; results persist per tenant and stream live.',
        summary:
            'A SaaS platform where server-side actions trigger n8n AI workflows — brand analysis, caption generation, content calendar, strategy — and persist the results per tenant.',
        solution:
            'A slug-based workflow registry lets new workflows plug in. Long-running AI jobs report back through an HMAC-verified async callback, and run tracking streams live through Supabase Realtime.',
        highlights: [
            'Server-side actions trigger n8n AI workflows and persist results per tenant',
            'Slug-based registry: new workflows (e.g. lead capture, email outreach) plug in',
            'Run tracking with live updates via Supabase Realtime',
            'HMAC-verified async callback design for long-running AI jobs',
        ],
        technologies: ['Next.js', 'Supabase (PostgreSQL, Realtime)', 'n8n', 'OpenAI'],
        flow: [
            { kind: 'input', label: 'Server-side action', detail: 'Triggers an AI workflow' },
            { kind: 'tool', label: 'Workflow registry', detail: 'Slug-based — new workflows plug in' },
            { kind: 'model', label: 'n8n AI workflow', detail: 'Brand analysis, captions, content calendar, strategy' },
            { kind: 'guard', label: 'HMAC-verified callback', detail: 'Async design for long-running jobs' },
            { kind: 'data', label: 'Per-tenant persistence', detail: 'Supabase PostgreSQL' },
            { kind: 'output', label: 'Live run updates', detail: 'Supabase Realtime' },
        ],
        flowOrientation: 'vertical',
        layout: 'split-reverse',
        accent: '20, 184, 166',
    },
    {
        id: 'pm-agent',
        title: 'AI Chat Agent with Tool Calling',
        category: 'Project management assistant',
        tags: ['AI Agent', 'Tool Calling', 'Guardrails'],
        teaser: 'Streaming agent with read tools, confirmed write tools and answer validation.',
        summary:
            'A real-time assistant for a project management app over JWT-authenticated WebSockets, with streamed token responses.',
        solution:
            'Read tools (e.g. budget summary) run directly. Write tools (create task, add expense) require user confirmation. A post-generation validation step checks the answer against tool data before it reaches the user.',
        highlights: [
            'Real-time over WebSockets, JWT-authenticated, with streamed token responses',
            'Read tools run directly; write tools require user confirmation',
            'Post-generation validation checks answers against tool data',
            'Claude API tool use on a NestJS + Prisma backend',
        ],
        technologies: ['NestJS', 'Prisma', 'WebSockets', 'Claude API (tool use)'],
        flow: [
            { kind: 'input', label: 'User message', detail: 'WebSockets, JWT-authenticated' },
            { kind: 'model', label: 'Claude API', detail: 'Tool use, streamed tokens' },
            {
                kind: 'tool',
                label: 'Tool call',
                detail: 'Read and write tools',
                branches: [
                    { kind: 'tool', tag: 'READ', label: 'Runs directly', detail: 'e.g. budget summary' },
                    { kind: 'guard', tag: 'WRITE', label: 'User confirms first', detail: 'e.g. create task, add expense' },
                ],
            },
            { kind: 'guard', label: 'Answer validation', detail: 'Checked against tool data' },
            { kind: 'output', label: 'Streamed answer', detail: 'Reaches the user' },
        ],
        flowOrientation: 'horizontal',
        layout: 'wide',
        accent: '56, 189, 248',
    },
];

/** The skills the CV groups under "AI & Agentic Systems", as the homepage callouts. */
export interface IAICapability {
    id: string;
    label: string;
    detail: string;
    /** Projects that demonstrate it — hovering the callout highlights them. */
    projectIds: string[];
    side: 'left' | 'right';
}

export const AI_CAPABILITIES: IAICapability[] = [
    { id: 'agents', label: 'LLM Agents', detail: 'Tool / function calling', projectIds: ['akacia', 'pm-agent'], side: 'left' },
    { id: 'mcp', label: 'MCP', detail: 'Model Context Protocol integrations', projectIds: ['akacia'], side: 'left' },
    { id: 'rag', label: 'RAG & Context', detail: 'Intent classification, targeted retrieval', projectIds: ['vessel-chat'], side: 'left' },
    { id: 'automation', label: 'n8n Automation', detail: 'AI Agent nodes, webhooks', projectIds: ['akacia', 'workflow-platform'], side: 'right' },
    { id: 'guardrails', label: 'Guardrails', detail: 'Human-in-the-loop, output validation', projectIds: ['pm-agent'], side: 'right' },
    { id: 'voice', label: 'Voice → Text', detail: 'Whisper + GPT-4 documentation', projectIds: ['mwi-ai'], side: 'right' },
];

/** The CV's AI skills in the order they meet a request — drives the hero diagram. */
export const AI_AGENT_LOOP = [
    { label: 'Intent Classification', note: 'What is being asked' },
    { label: 'RAG & Context', note: 'Retrieve only what matters' },
    { label: 'Tool Calling', note: 'Act through tools & MCP' },
    { label: 'Human-in-the-Loop', note: 'Confirm before writes' },
    { label: 'Output Validation', note: 'Check before replying' },
] as const;
