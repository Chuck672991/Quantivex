import MobileProjectsShowcase from '@/components/MobileProjectsShowcase';
import { BRAND } from '@/lib/brand';
import { Metadata } from 'next';

const TITLE = `Mobile Applications | ${BRAND.name}`;
const DESCRIPTION = `iOS and Android apps built by ${BRAND.name} with React Native: live tracking, subscriptions, real-time data and AI, from architecture through store release.`;

export const metadata: Metadata = {
  // absolute: the root layout's title template would otherwise append the brand twice
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
  },
};

export default function MobileApplicationsPage() {
  return (
    // `dark` flips every token inside to the ink surface
    <div id="mobile-applications-page" className="dark w-full min-h-screen bg-ink-950 text-foreground">
      <MobileProjectsShowcase />
    </div>
  );
}
