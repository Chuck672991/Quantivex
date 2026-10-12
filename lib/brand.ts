// Single source of truth for the company identity. Copy here is written from
// what the existing project data and HaiderAli_CV.md actually support: no
// invented clients, awards, headcount or company history.

export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://me.toinfinite.dev'
).replace(/\/$/, '');

export const BRAND = {
    name: 'Quantivex',
    tagline: 'Intelligent software for your next product',
    description:
        'Quantivex is a software development company building web platforms, mobile apps, AI systems and SaaS products — from first prototype to App Store release and production.',
    email: 'ha33217@gmail.com',
    emailSubject: 'Project inquiry — Quantivex',
    responseNote: 'We usually reply within 24 hours.',
} as const;

export const SOCIAL_LINKS = [
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/haider-ali-74122722a/',
    },
    { name: 'GitHub', url: 'https://github.com/Chuck672991' },
] as const;

export interface INavLink {
    name: string;
    href: string;
}

/** Primary navigation. Hash links resolve on the homepage from any route. */
export const NAV_LINKS: INavLink[] = [
    { name: 'Services', href: '/#services' },
    { name: 'Work', href: '/#work' },
    { name: 'AI', href: '/#ai-systems' },
    { name: 'Process', href: '/#process' },
    { name: 'Contact', href: '/#contact' },
];

/** Deeper pages, listed in the mobile menu and the footer. */
export const WORK_LINKS: INavLink[] = [
    { name: 'Mobile applications', href: '/mobile-applications' },
    { name: 'Web projects', href: '/projects' },
    { name: 'AI projects', href: '/ai-projects' },
];

export interface IService {
    id: string;
    title: string;
    summary: string;
    detail: string;
    tags: string[];
    /** A page that shows this kind of work. */
    proof: { label: string; href: string };
}

export const SERVICES: IService[] = [
    {
        id: 'web',
        title: 'Web Platforms',
        summary:
            'Fast, scalable web applications and marketing sites — from product dashboards to immersive 3D experiences.',
        detail: 'React and Next.js front ends with typed APIs behind them, built for performance, SEO and the way your team actually works.',
        tags: ['React', 'Next.js', 'TypeScript', 'Three.js'],
        proof: { label: 'Web projects', href: '/projects' },
    },
    {
        id: 'mobile',
        title: 'Mobile Apps',
        summary:
            'Cross-platform iOS and Android apps with React Native, taken all the way through store release.',
        detail: 'Live maps and tracking, subscriptions with RevenueCat, push notifications with FCM and real-time data — shipped to the App Store and Google Play.',
        tags: ['React Native', 'RevenueCat', 'Google Maps', 'FCM'],
        proof: { label: 'Mobile applications', href: '/mobile-applications' },
    },
    {
        id: 'ai',
        title: 'AI Solutions',
        summary:
            'LLM agents, retrieval and automation pipelines that plug into the products you already run.',
        detail: 'Tool-calling agents, MCP integrations, context-aware retrieval and n8n workflows — with validation and human confirmation built in.',
        tags: ['LLM Agents', 'MCP', 'RAG', 'n8n'],
        proof: { label: 'AI projects', href: '/ai-projects' },
    },
    {
        id: 'saas',
        title: 'SaaS Platforms',
        summary:
            'Multi-tenant products with workflows, realtime updates and the plumbing a subscription business needs.',
        detail: 'Tenant-scoped data, async job callbacks, live run tracking and a plug-in workflow registry so new capabilities ship without rewrites.',
        tags: ['Next.js', 'Supabase', 'PostgreSQL', 'Realtime'],
        proof: {
            label: 'Multi-tenant AI platform',
            href: '/ai-projects#workflow-platform',
        },
    },
    {
        id: 'custom',
        title: 'Custom Software & Cloud',
        summary:
            'APIs, backends and integrations engineered for reliability, then deployed and operated on AWS.',
        detail: 'Node.js, Fastify and NestJS services over MongoDB or PostgreSQL, WebSockets for live features, CI/CD pipelines and Linux/EC2 deployments.',
        tags: ['Node.js', 'NestJS', 'MongoDB', 'AWS'],
        proof: { label: 'Selected work', href: '/#work' },
    },
];

export interface IProcessStep {
    title: string;
    summary: string;
    points: string[];
}

export const PROCESS_STEPS: IProcessStep[] = [
    {
        title: 'Discovery & planning',
        summary:
            'We start with your goals, users and constraints, and turn them into a scoped plan.',
        points: [
            'Requirements & user flows',
            'Architecture & stack choices',
            'Milestones and scope',
        ],
    },
    {
        title: 'Design',
        summary:
            'Interfaces designed to be built: clear flows, responsive layouts and considered interaction details.',
        points: [
            'Wireframes & UI direction',
            'Component system',
            'Interaction & motion',
        ],
    },
    {
        title: 'Development',
        summary:
            'Typed, reviewed code in focused iterations, so you can see real progress as it lands.',
        points: [
            'TypeScript across the stack',
            'Code review & CI',
            'Working builds to react to',
        ],
    },
    {
        title: 'Testing',
        summary:
            'Device, browser and API checks — and for AI features, model output validated against real data.',
        points: [
            'Cross-device QA',
            'Performance passes',
            'AI guardrails & validation',
        ],
    },
    {
        title: 'Delivery & support',
        summary:
            'Store submissions, cloud deployment and handover, with room to keep improving after launch.',
        points: [
            'App Store & Play Store release',
            'AWS deployment & CI/CD',
            'Monitoring & iteration',
        ],
    },
];

export interface IStrength {
    title: string;
    body: string;
    proof: { label: string; href: string };
}

export const STRENGTHS: IStrength[] = [
    {
        title: 'Architecture to App Store, under one roof',
        body: 'The same engineers who design the system build the web, mobile and backend layers and take them through release — no hand-offs between vendors.',
        proof: { label: 'MWI AI', href: '/projects/mwi-ai' },
    },
    {
        title: 'AI engineered for production',
        body: 'Retrieval instead of prompt-stuffing, structured outputs, answer validation and human confirmation before any write action.',
        proof: { label: 'AI projects', href: '/ai-projects' },
    },
    {
        title: 'Shipped to the stores',
        body: 'Live Google Maps tracking, RevenueCat subscriptions and push notifications on both iOS and Android, through to store release.',
        proof: {
            label: 'Quality Boat Salvage',
            href: '/projects/quality-boat-salvage',
        },
    },
    {
        title: 'Real-time by design',
        body: 'WebSockets, Supabase Realtime, Firebase and PubNub for products that need to feel live: tracking, chat and run status.',
        proof: { label: 'Eagle IoT', href: '/projects/eagle-iot' },
    },
];
