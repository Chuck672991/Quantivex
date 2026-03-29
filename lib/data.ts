import { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'ha33217@gmail.com',

    emailSubject: "Let's collaborate on a project",
    emailBody: 'Hi Haider, I am reaching out to you because...',

    oldPortfolio: 'https://www.legacy.me.toinfinite.dev',
    upworkProfile: 'https://www.upwork.com/freelancers/Haider',
    linkedinProfile: 'https://www.linkedin.com/in/haider-ali-74122722a/',
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/Chuck672991' },
    { name: 'linkedin', url: 'https://www.linkedin.com/in/haider-ali-74122722a/' },
    { name: 'facebook', url: 'https://www.facebook.com/Haider.2000' },
];

export const MY_STACK = {
    frontend: [
        {
            name: 'Javascript',
            icon: '/logo/js.png',
        },
        {
            name: 'Typescript',
            icon: '/logo/ts.png',
        },
        {
            name: 'React',
            icon: '/logo/react.png',
        },
        {
            name: 'Next.js',
            icon: '/logo/next.png',
        },
        {
            name: 'React Native',
            icon: '/logo/react.png',
        },
        {
            name: 'Redux Toolkit',
            icon: '/logo/redux.png',
        },
        {
            name: 'Tailwind CSS',
            icon: '/logo/tailwind.png',
        },
        {
            name: 'Three.js',
            icon: '/logo/js.png',
        },
        {
            name: 'Framer Motion',
            icon: '/logo/framer-motion.png',
        },
        {
            name: 'GSAP',
            icon: '/logo/gsap.png',
        },
        {
            name: 'SASS',
            icon: '/logo/sass.png',
        },
    ],
    backend: [
        {
            name: 'Node.js',
            icon: '/logo/node.png',
        },
        {
            name: 'Fastify',
            icon: '/logo/node.png',
        },
        {
            name: 'Express.js',
            icon: '/logo/express.png',
        },
        {
            name: 'GraphQL',
            icon: '/logo/node.png',
        },
    ],
    database: [
        {
            name: 'MongoDB',
            icon: '/logo/mongodb.svg',
        },
        {
            name: 'Firebase',
            icon: '/logo/mongodb.svg',
        },
        {
            name: 'PostgreSQL',
            icon: '/logo/postgreSQL.png',
        },
        {
            name: 'Prisma',
            icon: '/logo/prisma.png',
        },
    ],
    tools: [
        {
            name: 'Git',
            icon: '/logo/git.png',
        },
        {
            name: 'Docker',
            icon: '/logo/docker.svg',
        },
        {
            name: 'AWS',
            icon: '/logo/aws.png',
        },
        {
            name: 'OpenAI API',
            icon: '/logo/js.png',
        },
    ],
};

export const PROJECTS: IProject[] = [
    {
        title: 'MWI AI – Marine Welding & Inspection',
        slug: 'mwi-ai',
        liveUrl: 'https://mwi.services/',
        year: 2025,
        description: `
      An AI-powered mobile application built at TURNUP Technologies for marine welding and inspection teams. The app replaces paper-based workflows with intelligent, voice-first documentation — enabling field engineers to generate inspection reports hands-free using GPT-4 and Whisper API. <br/><br/>

      Key Features:<br/>
      <ul>
        <li>🤖 AI Documentation: GPT-4 generates structured inspection reports from voice or text input</li>
        <li>🎙️ Voice Transcription: Whisper API converts spoken notes to accurate field data in real time</li>
        <li>📱 Cross-Platform Deployment: Shipped to both App Store and Google Play</li>
        <li>⚡ Offline Support: Data syncs when connectivity is restored</li>
        <li>🔒 Secure Storage: Encrypted inspection records with role-based access</li>
      </ul><br/>

      Technical Highlights:
      <ul>
        <li>Led end-to-end development — architecture, implementation, and store deployment</li>
        <li>Integrated OpenAI GPT-4 API with custom prompt engineering for domain-specific outputs</li>
        <li>Built Fastify REST APIs on Node.js with MongoDB for inspection data management</li>
        <li>Optimized React Native bundle for low-latency performance in field conditions</li>
      </ul>
      `,
        role: `
      Full-Stack Developer (Lead) <br/>
      <ul>
        <li>✅ Owned full product lifecycle — from architecture decisions to App Store submission</li>
        <li>🤖 Engineered GPT-4 + Whisper API integration with domain-tuned prompt flows</li>
        <li>🔧 Built and maintained Fastify/Node.js backend APIs and MongoDB schemas</li>
        <li>📱 Handled React Native performance optimization and CI/CD pipeline for releases</li>
      </ul>
      `,
        techStack: [
            'React Native',
            'Node.js',
            'Fastify',
            'GPT-4',
            'Whisper API',
            'MongoDB',
            'TypeScript',
        ],
        thumbnail: '/projects/thumbnail/mwi-ai.webp',
        longThumbnail: '/projects/long/mwi-ai.png',
        images: [
            '/projects/images/mwi-ai-1.png',
            '/projects/images/mwi-ai-2.png',
            '/projects/images/mwi-ai-3.png',
        ],
    },
    {
        title: 'Quality Boat Salvage (QBS)',
        slug: 'quality-boat-salvage',
        liveUrl: 'https://www.qualityboatsalvage.com/',
        year: 2025,
        description: `
      A full maritime logistics ecosystem engineered at TURNUP Technologies for Quality Boat Salvage — one of the largest used boat parts suppliers in the US. The platform includes a customer-facing mobile app with real-time parts tracking, in-app subscriptions, and a live inventory browsing experience. <br/><br/>

      Key Features:<br/>
      <ul>
        <li>🗺️ Real-time Tracking: Live asset and shipment tracking via Google Maps API</li>
        <li>💳 Subscriptions: In-app purchases and premium tiers managed through RevenueCat</li>
        <li>📦 Parts Catalog: Browse 10,000+ used and NOS boat parts with filtering</li>
        <li>🔔 Push Notifications: FCM alerts for order status and shipment updates</li>
        <li>📲 Available on <a href="https://play.google.com/store/apps/details?id=com.turnuptech.qbs" target="_blank" rel="noopener noreferrer">Google Play Store</a></li>
      </ul><br/>

      Technical Highlights:
      <ul>
        <li>Integrated Google Maps SDK for real-time location tracking of orders</li>
        <li>Implemented RevenueCat for cross-platform subscription management (iOS & Android)</li>
        <li>Built Node.js/Fastify APIs handling inventory, orders, and user management</li>
        <li>Used Firebase for real-time notification delivery and auth</li>
      </ul>
      `,
        role: `
      Full-Stack Developer <br/>
      <ul>
        <li>🗺️ Built the Google Maps integration for live order and asset tracking</li>
        <li>💳 Implemented RevenueCat subscription flows across iOS and Android</li>
        <li>📱 Developed the full React Native mobile app and deployed to both stores</li>
        <li>🔧 Designed backend APIs and database schemas for logistics operations</li>
      </ul>
      `,
        techStack: [
            'React Native',
            'Google Maps API',
            'RevenueCat',
            'Node.js',
            'Fastify',
            'Firebase',
            'MongoDB',
        ],
        thumbnail: '/projects/thumbnail/qbs.jpg',
        longThumbnail: '/projects/long/qbs.jpg',
        images: [
            '/projects/images/qbs-1.png',
        ],
    },
    {
        title: 'Eagle IoT Car Tracking',
        slug: 'eagle-iot',
        liveUrl: 'https://go.eagle-iot.com/',
        year: 2024,
        description: `
      A real-time vehicle monitoring and anti-theft mobile application built with React Native and Google Maps SDK, developed during my time at 360 Xpert Solutions. The app connects to IoT hardware installed in vehicles and provides live location updates, geofencing alerts, and trip history. <br/><br/>

      Key Features:<br/>
      <ul>
        <li>📍 Live Tracking: Real-time vehicle location on an interactive Google Maps view</li>
        <li>🚨 Anti-Theft Alerts: Instant FCM push notifications triggered by unauthorized movement</li>
        <li>🔒 Geofencing: Define custom zones — get alerted when a vehicle enters or exits</li>
        <li>📊 Trip History: Full route playback with timestamps and distance metrics</li>
        <li>🔌 IoT Integration: WebSocket connection to onboard GPS hardware for sub-second updates</li>
      </ul><br/>

      Technical Highlights:
      <ul>
        <li>Built real-time WebSocket bridge between IoT device firmware and React Native app</li>
        <li>Implemented background location tracking with battery optimization on Android and iOS</li>
        <li>Used Firebase Cloud Messaging for instant push delivery even when app is closed</li>
        <li>Reduced mobile app bundle size by 20% through code-splitting and lazy loading</li>
      </ul>
      `,
        role: `
      Mobile Developer <br/>
      <ul>
        <li>📍 Integrated Google Maps SDK for live, real-time vehicle tracking</li>
        <li>🔔 Implemented FCM-based anti-theft alert system with background wake support</li>
        <li>🔌 Built WebSocket layer to consume IoT GPS hardware data streams</li>
        <li>📱 Owned the full React Native app — UI, state management, and store deployment</li>
      </ul>
      `,
        techStack: [
            'React Native',
            'Google Maps SDK',
            'Firebase Cloud Messaging',
            'WebSockets',
            'Node.js',
            'MongoDB',
        ],
        thumbnail: '/projects/thumbnail/eagle-iot.png',
        longThumbnail: '/projects/thumbnail/eagle-iot.png',
        images: [
            '/projects/thumbnail/eagle-iot.png',
        ],
    },
    {
        title: 'Qatar Government CMS',
        slug: 'qatar-govt-cms',
        hidden: true,
        year: 2024,
        description: `
      A secure, multilingual content management system delivered for a Qatar government client at Siliconplex. Built to manage official digital content across Arabic and English audiences, the platform required strict access control, audit trails, and full RTL layout support. <br/><br/>

      Key Features:<br/>
      <ul>
        <li>🔐 Role-Based Access Control: Granular RBAC with editor, reviewer, and admin roles</li>
        <li>🌍 Bilingual / RTL: Full Arabic support with right-to-left layout switching</li>
        <li>🛡️ Audit Logging: Complete trail of content changes and user actions</li>
        <li>📊 Admin Dashboard: Content scheduling, approval workflows, and user management</li>
        <li>⚡ Performance: Next.js SSR/SSG reduced page load times and improved SEO by 25%</li>
      </ul><br/>

      Technical Highlights:
      <ul>
        <li>Designed and implemented multi-level RBAC system with TypeScript and Ant Design</li>
        <li>Built Arabic/English RTL toggle with full layout mirroring using React i18n</li>
        <li>Integrated secure authentication with JWT and session management</li>
        <li>Used Next.js SSR for fast, SEO-optimised public-facing pages</li>
      </ul>
      `,
        role: `
      Frontend Developer <br/>
      <ul>
        <li>🔐 Architected and built the RBAC system covering all content and admin routes</li>
        <li>🌍 Implemented full Arabic/English RTL support across all UI components</li>
        <li>🎨 Developed the admin dashboard UI with TypeScript and Ant Design</li>
        <li>🔌 Integrated RESTful APIs with proper auth guards and token refresh logic</li>
      </ul>
      `,
        techStack: [
            'Next.js',
            'TypeScript',
            'Ant Design',
            'Redux Toolkit',
            'React i18n',
            'RESTful APIs',
        ],
        thumbnail: '/projects/thumbnail/mti-electronics.webp',
        longThumbnail: '/projects/long/mti-electronics.webp',
        images: [
            '/projects/images/mti-electronics-1.webp',
            '/projects/images/mti-electronics-2.webp',
        ],
    },
    {
        title: 'BreakTime – Inventory Management',
        slug: 'breaktime',
        year: 2023,
        description: `
      A cross-platform inventory management system built at 360 Xpert Solutions, with real-time sync between a React Native mobile app and a React.js web dashboard — both powered by Firebase Realtime Database. Designed for small-to-mid retail operations that need instant stock visibility across locations. <br/><br/>

      Key Features:<br/>
      <ul>
        <li>🔄 Real-time Sync: Stock updates on web and mobile reflect instantly via Firebase</li>
        <li>📦 Full Inventory CRUD: Add, update, categorise, and retire products across locations</li>
        <li>📊 Low-Stock Alerts: Configurable thresholds trigger notifications when stock runs low</li>
        <li>📱 Cross-Platform: Warehouse staff use the mobile app; managers use the web dashboard</li>
        <li>🔒 Auth: Firebase Authentication with role separation for staff and admins</li>
      </ul><br/>

      Technical Highlights:
      <ul>
        <li>Built a Geofencing-based attendance module using Firebase for staff check-in</li>
        <li>Reduced app bundle size by 20% using code-splitting and dynamic imports</li>
        <li>Designed Firestore data schema for efficient real-time read/write operations</li>
        <li>Used Redux Toolkit for predictable state across the web dashboard</li>
      </ul>
      `,
        role: `
      Software Engineer <br/>
      <ul>
        <li>🔄 Designed and implemented the real-time Firebase sync architecture</li>
        <li>📱 Built the React Native mobile app for warehouse staff</li>
        <li>🌐 Developed the React.js admin dashboard for managers</li>
        <li>🔒 Implemented Firebase Auth with role-based route protection</li>
      </ul>
      `,
        techStack: [
            'React Native',
            'React.js',
            'Firebase',
            'Redux Toolkit',
            'Tailwind CSS',
            'Node.js',
        ],
        thumbnail: '/projects/thumbnail/breaktime.png',
        longThumbnail: '/projects/thumbnail/breaktime.png',
        images: [
            '/projects/images/breaktime-1.png',
            '/projects/images/breaktime-2.png',
            '/projects/images/breaktime-3.png',
        ],
    },
    {
        title: 'Real Estate – PropertyPro',
        slug: 'property-pro',
        liveUrl: 'https://demo.propertypro.siphertech.com/',
        year: 2023,
        description: `
      A real estate management platform built at 360 Xpert Solutions, enabling users to browse, filter, and manage property listings with a focus on performance and accessibility. Supports multilingual audiences with full RTL for Arabic users. <br/><br/>

      Key Features:<br/>
      <ul>
        <li>🏠 Property Listings: Browse and filter properties with dynamic, admin-configurable filters</li>
        <li>🌍 Multilingual: Arabic/English support with RTL layout via React i18n</li>
        <li>🎬 Animations: Smooth transitions and micro-interactions using Framer Motion</li>
        <li>📱 Fully Responsive: Optimised for all screen sizes from mobile to desktop</li>
      </ul><br/>

      Technical Highlights:
      <ul>
        <li>Built frontend from scratch with React, Redux (RTK Query), and Tailwind CSS</li>
        <li>Implemented dynamic product filtering logic with admin-configurable parameters</li>
        <li>Integrated React i18n for Arabic/English with full RTL layout mirroring</li>
        <li>Used Framer Motion for page transitions and card entry animations</li>
      </ul>
      `,
        role: `
      Frontend Developer <br/>
      <ul>
        <li>🏗️ Built the complete frontend using React, Redux Toolkit, and Tailwind CSS</li>
        <li>🔍 Developed dynamic filtering logic with admin-configurable search parameters</li>
        <li>🌍 Integrated multilingual support with Arabic RTL layout handling</li>
        <li>🎬 Added animations and transitions with Framer Motion</li>
      </ul>
      `,
        techStack: [
            'React.js',
            'Redux Toolkit',
            'Tailwind CSS',
            'React i18n',
            'Framer Motion',
            'RTK Query',
        ],
        thumbnail: '/projects/thumbnail/property-pro.jpg',
        longThumbnail: '/projects/long/property-pro.jpg',
        images: [
            '/projects/images/property-pro-1.png',
            '/projects/images/property-pro-2.png',
            '/projects/images/property-pro-3.png',
        ],
    },
    {
        title: 'Cosmetic Chemist',
        slug: 'cosmetic-chemist',
        liveUrl: 'https://cosmeticchemist.com/',
        year: 2022,
        description: `
      A visually immersive 3D marketing website built for Cosmetic Chemist — an elite group of cosmetic chemists, formulators, and industry experts. The site combines real-time 3D product models with GSAP-powered animations to deliver a premium, interactive brand experience. <br/><br/>

      Key Features:<br/>
      <ul>
        <li>🧊 3D Product Models: Interactive GLB/GLTF models rendered in-browser using Three.js and React Three Fiber</li>
        <li>🎬 GSAP Animations: Scroll-triggered animations, smooth transitions, and parallax effects throughout</li>
        <li>🌐 Hero Section: Full-screen animated 3D sphere with floating product model on entry</li>
        <li>🎨 Dark Luxury Aesthetic: High-contrast black background with pink accents for a premium feel</li>
        <li>📱 Fully Responsive: Adapts the 3D experience gracefully across all screen sizes</li>
        <li>🔊 Ambient Audio: Subtle background audio integration to enhance brand immersion</li>
      </ul><br/>

      Technical Highlights:
      <ul>
        <li>Built with Next.js for fast page loads and SEO-optimised static generation</li>
        <li>Integrated Three.js / React Three Fiber for real-time 3D rendering of .glb product models</li>
        <li>Implemented complex GSAP ScrollTrigger sequences for section reveal animations</li>
        <li>Session duration increased by 50% compared to client's previous static site</li>
      </ul>
      `,
        role: `
      Frontend Developer (Freelance) <br/>
      <ul>
        <li>🧊 Built the 3D scene using Three.js and React Three Fiber with custom lighting and materials</li>
        <li>🎬 Orchestrated all GSAP animations — hero entrance, scroll-triggered reveals, and hover effects</li>
        <li>🏗️ Architected the Next.js project structure, routing, and component library</li>
        <li>🎨 Translated Figma designs into pixel-perfect, animated UI components</li>
        <li>🚀 Deployed and optimised for performance — lazy-loaded 3D assets, compressed textures</li>
      </ul>
      `,
        techStack: [
            'Next.js',
            'Three.js',
            'React Three Fiber',
            'GSAP',
            'Tailwind CSS',
            'TypeScript',
        ],
        thumbnail: '/projects/thumbnail/cosmetic-chemist.png',
        longThumbnail: '/projects/long/cosmetic-chemist.png',
        images: [
            '/projects/images/cosmetic-chemist-1.png',
            '/projects/images/cosmetic-chemist-2.png',
        ],
    },
];

export const MY_EXPERIENCE = [
    {
        title: 'Software Engineer (Full-Stack)',
        company: 'TURNUP Technologies',
        duration: 'Oct 2025 - Present',
    },
    {
        title: 'Frontend Developer (React Native / Next.js)',
        company: 'Siliconplex',
        duration: 'May 2024 - Oct 2025',
    },
    {
        title: 'Software Engineer (React Native / React.js)',
        company: '360 Xpert Solutions',
        duration: 'Jan 2023 - May 2024',
    },
    {
        title: 'Frontend Developer',
        company: 'Freelance',
        duration: 'Mar 2021 - Jan 2023',
    },
];
