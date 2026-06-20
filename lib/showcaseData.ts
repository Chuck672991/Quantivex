export type ProjectType = 'mobile' | 'web';

export interface ShowcaseProject {
  id: number;
  type: ProjectType;
  title: string;
  shortPitch: string;
  description: string;
  techStack: string[];
  features: string[];
  // Where "View Project" CTA goes
  href: string;
  liveUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  // mobile: up to 3 portrait screenshots for phone frames
  screenshots?: string[];
  // web: one or two landscape screenshots for browser mockup
  images?: string[];
  // Per-project ambient glow colour (rgba string)
  glowColor: string;
}

export const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  // ── Mobile ────────────────────────────────────────────
  {
    id: 1,
    type: 'mobile',
    title: 'Julian Couriers',
    shortPitch: 'Real-time logistics & package tracking engineered for fast courier delivery.',
    description:
      'A premium courier tracking and logistics application that streamlines final-mile delivery. Integrates live location, instant notifications, and digital proof-of-delivery signatures.',
    techStack: ['React Native', 'TypeScript', 'Node.js', 'Google Maps API', 'MongoDB'],
    features: [
      'Live route tracking with real-time ETA recalculation',
      'Digital proof-of-delivery — signatures & photos',
      'FCM push notifications for every delivery milestone',
      'Dynamic multi-stop route optimisation',
    ],
    screenshots: [
      '/projects/mobileApps/JulianCouriers1.png',
      '/projects/mobileApps/JulianCouriers2.png',
      '/projects/mobileApps/JulianCouriers3.png',
    ],
    href: '/mobile-applications',
    glowColor: 'rgba(245,158,11,0.18)',
  },
  {
    id: 2,
    type: 'mobile',
    title: 'MWI AI — Welding Inspection',
    shortPitch: 'Voice-first GPT-4-powered inspection reports built for marine welding teams.',
    description:
      'An AI-powered mobile app for marine welding inspectors. Replaces paper sheets with hands-free voice transcription. GPT-4 structures raw audio into regulatory-grade reports on the fly.',
    techStack: ['React Native', 'TypeScript', 'GPT-4 API', 'Whisper API', 'Fastify', 'MongoDB'],
    features: [
      'Hands-free recording via OpenAI Whisper transcription',
      'GPT-4 auto-structures audio into regulatory reports',
      'Offline-first sync for remote offshore environments',
      'Encrypted export to PDF & CSV with digital keys',
    ],
    screenshots: [
      '/projects/mobileApps/MwiAi1.png',
      '/projects/mobileApps/MwiAi2.png',
      '/projects/mobileApps/MwiAi3.png',
    ],
    href: '/mobile-applications',
    liveUrl: 'https://mwi.services/',
    glowColor: 'rgba(99,102,241,0.2)',
  },
  {
    id: 3,
    type: 'mobile',
    title: 'Quality Boat Salvage',
    shortPitch: 'Logistics tracking & subscription platform for the largest boat-parts marketplace in the US.',
    description:
      'A comprehensive maritime commerce and tracking system. Live parts tracking, subscription access tiers, and a 10,000+ item searchable inventory — all shipping to both stores.',
    techStack: ['React Native', 'TypeScript', 'RevenueCat', 'Google Maps API', 'Firebase', 'Fastify'],
    features: [
      'Real-time shipment tracking on custom-styled Maps',
      'Cross-platform subscription gating via RevenueCat',
      '10,000+ part catalog with instant local caching',
      'FCM alerts for every transit checkpoint',
    ],
    screenshots: [
      '/projects/mobileApps/JulianCouriers1.png',
      '/projects/mobileApps/JulianCouriers3.png',
      '/projects/mobileApps/JulianCouriers4.png',
    ],
    href: '/mobile-applications',
    liveUrl: 'https://www.qualityboatsalvage.com/',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.turnuptech.qbs',
    glowColor: 'rgba(20,184,166,0.18)',
  },
  {
    id: 4,
    type: 'mobile',
    title: 'Eagle IoT — Car Tracking',
    shortPitch: 'WebSocket-driven live vehicle monitoring and instant anti-theft alarms.',
    description:
      'A high-performance vehicle monitoring app connecting directly to OBD-II hardware. Persistent WebSockets deliver real-time location feeds, geofence violations, and anti-theft alerts.',
    techStack: ['React Native', 'TypeScript', 'WebSockets', 'Google Maps SDK', 'Firebase', 'Node.js'],
    features: [
      'Sub-second location updates via persistent WebSocket',
      'Custom geofencing with instant breach notifications',
      'Historical trip playback with speed & distance graphs',
      'Vibration & engine-start anti-theft detection',
    ],
    screenshots: [
      '/projects/mobileApps/JulianCouriers2.png',
      '/projects/mobileApps/JulianCouriers4.png',
      '/projects/mobileApps/JulianCouriers3.png',
    ],
    href: '/mobile-applications',
    liveUrl: 'https://go.eagle-iot.com/',
    glowColor: 'rgba(16,185,129,0.18)',
  },
  // ── Web ───────────────────────────────────────────────
  {
    id: 5,
    type: 'web',
    title: 'Cosmetic Chemist',
    shortPitch: 'Immersive 3D marketing website with real-time product models and scroll storytelling.',
    description:
      'A visually immersive 3D marketing site for an elite group of cosmetic chemists. Combines real-time GLB product models with GSAP ScrollTrigger sequences — session time increased by 50%.',
    techStack: ['Next.js', 'Three.js', 'React Three Fiber', 'GSAP', 'TypeScript'],
    features: [
      'Interactive GLB/GLTF 3D product renders in-browser',
      'Complex GSAP ScrollTrigger reveal sequences',
      'Dark luxury aesthetic — +50% avg. session duration',
      'Ambient audio integration for brand immersion',
    ],
    images: ['/projects/images/cosmetic-chemist-1.png', '/projects/images/cosmetic-chemist-2.png'],
    href: '/projects/cosmetic-chemist',
    liveUrl: 'https://cosmeticchemist.com/',
    glowColor: 'rgba(236,72,153,0.15)',
  },
  {
    id: 6,
    type: 'web',
    title: 'Real Estate — PropertyPro',
    shortPitch: 'Full-featured property listing platform with bilingual Arabic/English RTL support.',
    description:
      'A real estate management platform enabling users to browse, filter, and manage property listings. Supports multilingual audiences with full RTL layout for Arabic users.',
    techStack: ['React.js', 'Redux Toolkit', 'Tailwind CSS', 'Framer Motion', 'RTK Query'],
    features: [
      'Admin-configurable dynamic property filters',
      'Full Arabic/English RTL layout via React i18n',
      'Framer Motion page transitions & card animations',
      'Optimised for all screen sizes and breakpoints',
    ],
    images: ['/projects/images/property-pro-1.png', '/projects/images/property-pro-2.png'],
    href: '/projects/property-pro',
    liveUrl: 'https://demo.propertypro.siphertech.com/',
    glowColor: 'rgba(59,130,246,0.15)',
  },
  {
    id: 7,
    type: 'web',
    title: 'BreakTime — Inventory System',
    shortPitch: 'Real-time inventory sync across React Native mobile and React.js web dashboard.',
    description:
      'A cross-platform inventory management system with real-time Firebase sync between a React Native mobile app and a React.js web dashboard — designed for retail operations.',
    techStack: ['React Native', 'React.js', 'Firebase', 'Redux Toolkit', 'Tailwind CSS', 'Node.js'],
    features: [
      'Live stock updates across web & mobile via Firebase',
      'Geofencing-based staff attendance module',
      'Role-separated Auth for staff vs. admin',
      '20% bundle reduction via code-splitting',
    ],
    images: ['/projects/images/breaktime-1.png', '/projects/images/breaktime-2.png'],
    href: '/projects/breaktime',
    glowColor: 'rgba(245,158,11,0.14)',
  },
];
