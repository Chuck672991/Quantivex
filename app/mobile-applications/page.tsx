import MobileProjectsShowcase from '@/components/MobileProjectsShowcase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobile Applications | Haider Ali',
  description: 'Explore a premium curated collection of iOS and Android mobile applications built using React Native, TypeScript, OpenAI GPT-4/Whisper APIs, and real-time WebSockets.',
  openGraph: {
    title: 'Mobile Applications Showcase | Haider Ali',
    description: 'Explore a premium curated collection of iOS and Android mobile applications built using React Native, TypeScript, OpenAI GPT-4/Whisper APIs, and real-time WebSockets.',
    type: 'website',
  },
};

export default function MobileApplicationsPage() {
  return (
    <main id="mobile-applications-page" className="w-full min-h-screen bg-[#0B0C0E]">
      <MobileProjectsShowcase />
    </main>
  );
}
