export type CategoryType = 'mobile' | 'web' | 'ai';

export interface CategoryItem {
  id: number;
  type: CategoryType;
  title: string;
  /** Shown next to the badge, e.g. "4 Projects" */
  projectCount: string;
  shortPitch: string;
  /** Up to 4 bullet-point highlights */
  highlights: string[];
  /** Tech stack pills */
  techBadges: string[];
  /** Where the card CTA navigates */
  route: string;
  /** mobile / ai → portrait phone screenshots (up to 3) */
  screenshots?: string[];
  /** web → single landscape image for browser mockup */
  previewImage?: string;
  /** Per-card ambient glow colour (rgba) */
  glowColor: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 1,
    type: 'mobile',
    title: 'Mobile Applications',
    projectCount: '4 Projects',
    shortPitch:
      '4 premium iOS & Android products — real-time courier logistics, AI voice inspection, maritime commerce, and IoT vehicle tracking.',
    highlights: [
      'Live route tracking with real-time GPS and ETA recalculation',
      'GPT-4 & Whisper voice-first inspection report generation',
      'Subscription commerce via RevenueCat on Google Maps',
      'WebSocket IoT anti-theft alerts and trip playback',
    ],
    techBadges: ['React Native', 'GPT-4', 'WebSockets', 'RevenueCat', 'Google Maps'],
    screenshots: [
      '/projects/mobileApps/JulianCouriers1.png',
      '/projects/mobileApps/JulianCouriers2.png',
      '/projects/mobileApps/JulianCouriers3.png',
    ],
    route: '/mobile-applications',
    glowColor: 'rgba(245,158,11,0.16)',
  },
  {
    id: 2,
    type: 'web',
    title: 'Web Applications',
    projectCount: '3 Projects',
    shortPitch:
      '3 full-stack web platforms — a 3D immersive marketing site, a bilingual real estate listing app, and a real-time inventory dashboard.',
    highlights: [
      'Interactive GLB product models with React Three Fiber',
      'GSAP ScrollTrigger sequences — +50% avg. session time',
      'Bilingual Arabic/English RTL layout via React i18n',
      'Real-time Firebase inventory sync across web & mobile',
    ],
    techBadges: ['Next.js', 'Three.js', 'React.js', 'GSAP', 'Tailwind CSS'],
    previewImage: '/projects/webProjectImages/chemist2.png',
    route: '/projects',
    glowColor: 'rgba(99,102,241,0.16)',
  },
  {
    id: 3,
    type: 'ai',
    title: 'AI Projects',
    projectCount: '5 Projects',
    shortPitch:
      'Agentic AI systems — LLM agents with tool calling, MCP integrations, context-aware retrieval and n8n automation pipelines.',
    highlights: [
      'GPT-4 and Whisper turn voice notes into field documentation',
      'Intent classification + targeted MongoDB retrieval instead of prompt stuffing',
      'An n8n agent that drives Canva’s MCP server to generate designs',
      'Tool-calling chat agent with confirmed writes and answer validation',
    ],
    techBadges: ['LLM Agents', 'MCP', 'RAG', 'n8n', 'GPT-4', 'Claude API'],
    screenshots: [
      '/projects/mobileApps/MwiAi1.png',
      '/projects/mobileApps/MwiAi2.png',
      '/projects/mobileApps/MwiAi3.png',
    ],
    route: '/ai-projects',
    glowColor: 'rgba(168,85,247,0.16)',
  },
];
