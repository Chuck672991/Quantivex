// Homepage case studies. Highlights are limited to what HaiderAli_CV.md and
// lib/data.ts state; no figures are added. Full write-ups live on each
// project's own page.

export type CaseTone = 'ink' | 'ice' | 'cobalt' | 'white';

export type CaseVisual =
    | { kind: 'phones'; screenshots: string[] }
    | { kind: 'browser'; image: string; url: string };

export interface ICaseStudy {
    slug: string;
    title: string;
    category: string;
    year: number;
    pitch: string;
    highlights: string[];
    stack: string[];
    tone: CaseTone;
    /** "r, g, b" glow behind the visual. */
    accent: string;
    visual: CaseVisual;
    /** Case-study page on this site. */
    href: string;
    liveUrl?: string;
}

export const CASE_STUDIES: ICaseStudy[] = [
    {
        slug: 'mwi-ai',
        title: 'MWI AI',
        category: 'AI · Mobile',
        year: 2025,
        pitch: 'AI-powered documentation and chat for marine welding and inspection teams.',
        highlights: [
            'A GPT-4 and Whisper pipeline turns spoken inspection notes into structured documentation for field engineers.',
            'A context-aware assistant answers questions about a client’s own vessels, inspections and defects.',
            'Led end to end: architecture, iOS release and the companion web portal.',
        ],
        stack: [
            'React Native',
            'Node.js',
            'Fastify',
            'MongoDB',
            'GPT-4',
            'Whisper',
        ],
        tone: 'ink',
        accent: '99, 102, 241',
        visual: {
            kind: 'phones',
            screenshots: [
                '/projects/mobileApps/MwiAi1.png',
                '/projects/mobileApps/MwiAi2.png',
                '/projects/mobileApps/MwiAi3.png',
            ],
        },
        href: '/projects/mwi-ai',
        liveUrl: 'https://mwi.services/',
    },
    {
        slug: 'quality-boat-salvage',
        title: 'Quality Boat Salvage',
        category: 'Mobile · Logistics',
        year: 2025,
        pitch: 'Parts tracking, subscriptions and a live catalog for one of the largest used boat parts suppliers in the US.',
        highlights: [
            'Live Google Maps tracking of orders and shipments.',
            'RevenueCat subscriptions across iOS and Android.',
            'FCM push notifications for order and shipment updates, with a companion web portal.',
        ],
        stack: [
            'React Native',
            'Google Maps',
            'RevenueCat',
            'Firebase',
            'Fastify',
        ],
        tone: 'ice',
        accent: '20, 184, 166',
        visual: {
            kind: 'phones',
            screenshots: [
                '/projects/mobileApps/Qbs1.png',
                '/projects/mobileApps/Qbs2.png',
                '/projects/mobileApps/Qbs3.png',
            ],
        },
        href: '/projects/quality-boat-salvage',
        liveUrl: 'https://www.qualityboatsalvage.com/',
    },
    {
        slug: 'eagle-iot',
        title: 'Eagle IoT',
        category: 'Mobile · IoT',
        year: 2024,
        pitch: 'A real-time vehicle monitoring and anti-theft app with live maps and instant alerts.',
        highlights: [
            'Live vehicle location on an interactive Google Maps view.',
            'Instant FCM push alerts for anti-theft events.',
            'Owned the full release cycle, from build to store.',
        ],
        stack: ['React Native', 'Google Maps SDK', 'FCM', 'WebSockets'],
        tone: 'cobalt',
        accent: '147, 174, 255',
        visual: {
            kind: 'phones',
            screenshots: [
                '/projects/mobileApps/Iot1.png',
                '/projects/mobileApps/Iot2.png',
                '/projects/mobileApps/iot3.png',
            ],
        },
        href: '/projects/eagle-iot',
        liveUrl: 'https://go.eagle-iot.com/',
    },
    {
        slug: 'cosmetic-chemist',
        title: 'Cosmetic Chemist',
        category: 'Web · 3D',
        year: 2022,
        pitch: 'An immersive 3D marketing site for a group of cosmetic chemists and formulators.',
        highlights: [
            'Interactive 3D product models rendered in the browser with Three.js and React Three Fiber.',
            'Scroll-triggered GSAP sequences for the hero and section reveals.',
            'Average session duration up 50% compared with the client’s previous site.',
        ],
        stack: ['Next.js', 'Three.js', 'GSAP', 'TypeScript'],
        tone: 'white',
        accent: '236, 72, 153',
        visual: {
            kind: 'browser',
            image: '/projects/webProjectImages/chemist2.png',
            url: 'cosmeticchemist.com',
        },
        href: '/projects/cosmetic-chemist',
        liveUrl: 'https://cosmeticchemist.com/',
    },
];

export interface IMoreWork {
    title: string;
    category: string;
    pitch: string;
    stack: string[];
    href: string;
}

export const MORE_WORK: IMoreWork[] = [
    {
        title: 'PropertyPro',
        category: 'Web · Real estate',
        pitch: 'A property listing platform with admin-configurable filters and Arabic/English RTL support.',
        stack: ['React.js', 'Redux Toolkit', 'Tailwind CSS'],
        href: '/projects/property-pro',
    },
    {
        title: 'BreakTime',
        category: 'Web + Mobile · Inventory',
        pitch: 'Real-time inventory sync between a React Native app and a React.js dashboard, on Firebase.',
        stack: ['React Native', 'React.js', 'Firebase'],
        href: '/projects/breaktime',
    },
];
