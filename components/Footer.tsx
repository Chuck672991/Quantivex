import { BRAND, SERVICES, SOCIAL_LINKS, WORK_LINKS } from '@/lib/brand';
import AnchorLink from './AnchorLink';
import BackToTop from './BackToTop';
import GridBackdrop from './GridBackdrop';
import Logo from './Logo';
import Reveal from './Reveal';
import FooterWordmark from './scroll/FooterWordmark';

const COMPANY_LINKS = [
    { name: 'Selected work', href: '/#work' },
    { name: 'AI solutions', href: '/#ai-systems' },
    { name: 'Process', href: '/#process' },
    { name: 'Why Quantivex', href: '/#why-us' },
    { name: 'Contact', href: '/#contact' },
];

const linkClass =
    'text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground';

const Column = ({
    title,
    children,
    delay = 0,
}: {
    title: string;
    children: React.ReactNode;
    delay?: number;
}) => (
    <Reveal delay={delay}>
        <h2 className="mb-5 font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-foreground/50">
            {title}
        </h2>
        <ul className="space-y-3">{children}</ul>
    </Reveal>
);

const Footer = () => {
    return (
        <footer
            id="footer"
            className="dark relative overflow-hidden bg-ink-950 text-foreground"
        >
            <GridBackdrop fade="bottom" />

            <div className="container relative pb-10 pt-20 md:pt-28">
                <div className="grid gap-14 lg:grid-cols-12">
                    <Reveal className="lg:col-span-5">
                        <Logo tone="dark" />
                        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
                            Web platforms, mobile apps and AI systems —
                            engineered from first prototype to production.
                        </p>
                        <a
                            href={`mailto:${BRAND.email}`}
                            className="mt-8 inline-block font-display text-xl tracking-tight text-foreground underline decoration-foreground/30 underline-offset-[6px] transition-colors hover:decoration-primary sm:text-2xl"
                        >
                            {BRAND.email}
                        </a>
                    </Reveal>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:col-span-7">
                        <Column title="Services">
                            {SERVICES.map((service) => (
                                <li key={service.id}>
                                    <AnchorLink
                                        href="/#services"
                                        className={linkClass}
                                    >
                                        {service.title}
                                    </AnchorLink>
                                </li>
                            ))}
                        </Column>
                        <Column title="Work" delay={0.08}>
                            {WORK_LINKS.map((link) => (
                                <li key={link.name}>
                                    <AnchorLink
                                        href={link.href}
                                        className={linkClass}
                                    >
                                        {link.name}
                                    </AnchorLink>
                                </li>
                            ))}
                            {COMPANY_LINKS.slice(0, 1).map((link) => (
                                <li key={link.name}>
                                    <AnchorLink
                                        href={link.href}
                                        className={linkClass}
                                    >
                                        {link.name}
                                    </AnchorLink>
                                </li>
                            ))}
                        </Column>
                        <Column title="Company" delay={0.16}>
                            {COMPANY_LINKS.slice(1).map((link) => (
                                <li key={link.name}>
                                    <AnchorLink
                                        href={link.href}
                                        className={linkClass}
                                    >
                                        {link.name}
                                    </AnchorLink>
                                </li>
                            ))}
                            {SOCIAL_LINKS.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={linkClass}
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </Column>
                    </div>
                </div>

                <div className="mt-20 flex flex-col-reverse items-start justify-between gap-5 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
                    <p>
                        © {new Date().getFullYear()} {BRAND.name}. All rights
                        reserved.
                    </p>
                    <BackToTop />
                </div>
            </div>

            <FooterWordmark />
        </footer>
    );
};

export default Footer;
