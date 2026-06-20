export interface IMobileProject {
  id: number;
  title: string;
  shortPitch: string;
  description: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  gitHubUrl?: string;
  techStack: string[];
  features: string[];
  screenshots: string[];
}

export const PROJECTS_DATA: IMobileProject[] = [
  {
    id: 1,
    title: "Julian Couriers",
    shortPitch: "Real-time logistics & package tracking engineered for fast courier delivery.",
    description: "A premium courier tracking and logistics application that streamlines final-mile delivery. Integrates location tracking, instant notifications, and proof-of-delivery signatures to keep drivers and clients synchronized in real time.",
    appStoreUrl: "https://apps.apple.com",
    playStoreUrl: "https://play.google.com",
    gitHubUrl: "https://github.com/Chuck672991",
    techStack: ["React Native", "TypeScript", "Node.js", "Express", "MongoDB", "Google Maps API"],
    features: [
      "Live courier route tracking and ETA recalculation on interactive maps",
      "Instant push notifications via FCM for delivery milestones",
      "Digital signature collection and photographic proof of delivery",
      "Dynamic route optimization for multi-stop delivery schedules"
    ],
    screenshots: [
      "/projects/mobileApps/JulianCouriers1.png",
      "/projects/mobileApps/JulianCouriers2.png",
      "/projects/mobileApps/JulianCouriers3.png",
      "/projects/mobileApps/JulianCouriers4.png"
    ]
  },
  {
    id: 2,
    title: "MWI AI – Welding Inspection",
    shortPitch: "Voice-first, GPT-powered inspection reports built for marine welding teams.",
    description: "An AI-powered mobile app built for marine welding inspectors. By replacing paper sheets with voice transcribing, inspectors can work hands-free. Real-time GPT-4 structures raw audio into regulatory reports on the fly.",
    appStoreUrl: "https://apps.apple.com",
    playStoreUrl: "https://play.google.com",
    gitHubUrl: "https://github.com/Chuck672991",
    techStack: ["React Native", "TypeScript", "GPT-4 API", "Whisper API", "Fastify", "MongoDB"],
    features: [
      "Hands-free report recording using OpenAI Whisper voice transcription",
      "Automated report classification and structure powered by GPT-4 API",
      "Offline-first sync engine designed for remote offshore environments",
      "Encrypted report export to PDF and CSV with secure digital keys"
    ],
    screenshots: [
      "/projects/mobileApps/MwiAi1.png",
      "/projects/mobileApps/MwiAi2.png",
      "/projects/mobileApps/MwiAi3.png",
      "/projects/mobileApps/MwiAi4.png"
    ]
  },
  {
    id: 3,
    title: "BoatDNA",
    shortPitch: "Logistics tracking and subscription platform for boat salvage operations.",
    description: "A comprehensive maritime commerce and tracking system. Provides users with detailed parts search, subscription access tiers, and live tracking of shipments and boat parts orders directly on Google Maps.",
    appStoreUrl: "https://apps.apple.com",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.turnuptech.qbs",
    gitHubUrl: "https://github.com/Chuck672991",
    techStack: ["React Native", "TypeScript", "Google Maps API", "RevenueCat", "Fastify", "Firebase"],
    features: [
      "Real-time shipment and courier routing on custom-styled maps",
      "Cross-platform subscription gating powered by RevenueCat",
      "Massive searchable inventory catalog with instant local caching",
      "FCM notifications alerting customers to transit checkpoints"
    ],
    screenshots: [
      "/projects/mobileApps/Qbs1.png",
      "/projects/mobileApps/Qbs2.png",
      "/projects/mobileApps/Qbs3.png",
      "/projects/mobileApps/Qbs4.png"
    ]
  },
  {
    id: 4,
    title: "Eagle IoT Car Tracking",
    shortPitch: "WebSocket-driven live vehicle tracking and instant anti-theft alarms.",
    description: "A high-performance vehicle monitoring application connecting directly to OBD-II hardware. Using persistent WebSockets, the app delivers real-time location feeds, geofence violations, and instant anti-theft alerts.",
    appStoreUrl: "https://apps.apple.com",
    playStoreUrl: "https://play.google.com",
    gitHubUrl: "https://github.com/Chuck672991",
    techStack: ["React Native", "TypeScript", "WebSockets", "Google Maps SDK", "Firebase", "Node.js"],
    features: [
      "Sub-second latency vehicle location updates via socket streaming",
      "Custom geofencing boundaries with instant breach notifications",
      "Vibration and unauthorized engine start detection alerts",
      "Interactive historical trip playback with speed graphs"
    ],
    screenshots: [
      "/projects/mobileApps/Iot1.png",
      "/projects/mobileApps/Iot2.png",
      "/projects/mobileApps/iot3.png",
      "/projects/mobileApps/Iot4.png"
    ]
  }
];
