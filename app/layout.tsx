import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';

import 'lenis/dist/lenis.css';
import './globals.css';
import Footer from '@/components/Footer';
import MotionProvider from '@/components/MotionProvider';
import Navbar from '@/components/Navbar';
import PerfMonitor from '@/components/PerfMonitor';
import Preloader from '@/components/Preloader';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import SmoothScroll from '@/components/scroll/SmoothScroll';
import { BRAND, SITE_URL, SOCIAL_LINKS } from '@/lib/brand';
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-geist',
    display: 'swap',
});

const geistMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-geist-mono',
    display: 'swap',
    // small technical labels only: fetched when first used, not on the critical path
    preload: false,
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const TITLE = `${BRAND.name} — ${BRAND.tagline}`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: TITLE,
        template: `%s | ${BRAND.name}`,
    },
    description: BRAND.description,
    applicationName: BRAND.name,
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        siteName: BRAND.name,
        title: TITLE,
        description: BRAND.description,
        url: '/',
    },
    twitter: {
        card: 'summary',
        title: TITLE,
        description: BRAND.description,
    },
};

export const viewport: Viewport = {
    themeColor: '#F1F5F9',
};

const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.name,
    url: SITE_URL,
    description: BRAND.description,
    email: BRAND.email,
    sameAs: SOCIAL_LINKS.map((link) => link.url),
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationJsonLd).replace(
                            /</g,
                            '\\u003c',
                        ),
                    }}
                />
                {/* Quality tier before first paint (mirrors lib/perf.ts) */}
                <Script id="perf-init" strategy="beforeInteractive">
                    {`(function(){try{var s=sessionStorage.getItem('quantivex-perf'),l;if(s!==null){l=+s}else{var n=navigator,c=n.hardwareConcurrency||8,m=n.deviceMemory||8,d=n.connection&&n.connection.saveData;l=d||c<=2||m<=2?2:(c<=4||m<=4?1:0)}document.documentElement.dataset.perf=String(l)}catch(e){}})();`}
                </Script>
                <GoogleAnalytics gaId="G-MHLY1LNGY5" />
                <Script id="hotjar" strategy="lazyOnload">
                    {`(function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:6380611,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
                </Script>
            </head>
            <body
                className={`${geist.variable} ${geistMono.variable} ${inter.variable} antialiased`}
            >
                <SmoothScroll>
                    <MotionProvider>
                        <a
                            href="#main-content"
                            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
                        >
                            Skip to main content
                        </a>
                        <Navbar />
                        <main id="main-content">{children}</main>
                        <Footer />

                        <Preloader />
                        <PerfMonitor />
                        <ScrollProgressIndicator />
                    </MotionProvider>
                </SmoothScroll>
            </body>
        </html>
    );
}
