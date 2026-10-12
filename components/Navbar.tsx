'use client';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { BRAND, NAV_LINKS, SOCIAL_LINKS, WORK_LINKS } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { useNavHidden } from '@/lib/scroll/navHidden';
import { useHashScroller } from '@/lib/useAnchorScroll';
import { useSiteReady } from '@/lib/useSiteReady';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type MouseEvent,
} from 'react';
import AnchorLink from './AnchorLink';
import Button from './Button';
import Logo from './Logo';

const SECTION_IDS = NAV_LINKS.map((link) => link.href.split('#')[1]);

// Showcase index pages are ink-dark; everything else is the light Arctic surface.
const DARK_ROUTES = ['/ai-projects', '/mobile-applications'];
const isDarkRoute = (pathname: string) =>
    pathname === '/projects' ||
    DARK_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

const EASE = [0.22, 1, 0.36, 1] as const;

const Navbar = () => {
    const pathname = usePathname();
    const lenis = useLenis();
    const scrollToHash = useHashScroller();
    const ready = useSiteReady();
    const reduce = useReducedMotion();

    // The menu belongs to the route it was opened on, so navigating closes it
    const [openedOn, setOpenedOn] = useState<string | null>(null);
    const [scrolled, setScrolled] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sentinelRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // The scroll opening keeps the bar out of sight until the hole has opened
    const hiddenByOpening = useNavHidden();
    const dark = isDarkRoute(pathname);
    const isHome = pathname === '/';

    const open = openedOn === pathname;
    const closeMenu = useCallback(() => setOpenedOn(null), []);

    // Frosted bar once the page has moved. A sentinel at the top of the document
    // reports it, so there is no scroll listener and no layout read per event.
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || typeof IntersectionObserver === 'undefined') return;
        const io = new IntersectionObserver(([entry]) =>
            setScrolled(!entry.isIntersecting),
        );
        io.observe(sentinel);
        return () => io.disconnect();
    }, []);

    // Highlight the section in view (homepage only)
    useEffect(() => {
        if (!isHome) return;
        const targets = SECTION_IDS.map((id) =>
            document.getElementById(id),
        ).filter((el): el is HTMLElement => Boolean(el));
        if (!targets.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { rootMargin: '-45% 0px -50% 0px' },
        );
        targets.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [isHome]);

    // Menu open: freeze page scroll, move focus in, trap Tab, close on Escape
    useEffect(() => {
        if (!open) return;
        lenis?.stop();

        const panel = panelRef.current;
        const focusables = () =>
            Array.from(
                panel?.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled])',
                ) ?? [],
            );
        focusables()[0]?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeMenu();
                toggleRef.current?.focus();
                return;
            }
            if (event.key !== 'Tab') return;
            const items = [toggleRef.current, ...focusables()].filter(
                (el): el is HTMLElement => Boolean(el),
            );
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            lenis?.start();
        };
    }, [open, lenis, closeMenu]);

    // Menu links close the menu first. Closing restarts Lenis, which would cancel a
    // scroll that began at the same moment, so same-page jumps wait a beat.
    const handleMenuNavigate = (
        event: MouseEvent<HTMLElement>,
        href: string,
    ) => {
        const [path, hash] = href.split('#');
        const samePage = Boolean(hash) && (!path || path === pathname);
        closeMenu();
        if (
            !samePage ||
            event.defaultPrevented ||
            event.metaKey ||
            event.ctrlKey
        )
            return;
        event.preventDefault();
        window.setTimeout(() => scrollToHash(href), 120);
    };

    const showBackground = scrolled || open;

    return (
        <>
            <div
                ref={sentinelRef}
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 h-6 w-px"
            />
            <motion.header
                initial={reduce ? false : { y: -18, opacity: 0 }}
                animate={
                    ready || reduce
                        ? hiddenByOpening
                            ? { y: -18, opacity: 0 }
                            : { y: 0, opacity: 1 }
                        : undefined
                }
                transition={{ duration: 0.8, ease: EASE }}
                // Out of reach as well as out of sight while the opening plays
                inert={hiddenByOpening}
                className={cn('fixed inset-x-0 top-0 z-50', dark && 'dark')}
            >
                {/* Frosted background lives on its own layer: backdrop-filter on the
                header itself would trap the fixed mobile panel inside it */}
                <div
                    aria-hidden
                    className={cn(
                        'absolute inset-0 -z-10 border-b border-transparent transition-all duration-500',
                        showBackground &&
                            'perf-glass border-border/70 bg-background/80',
                    )}
                />

                <div className="container flex h-[68px] items-center justify-between md:h-[76px]">
                    <AnchorLink
                        href="/"
                        aria-label={`${BRAND.name} home`}
                        className="relative z-10 rounded-sm"
                        onClick={() => {
                            closeMenu();
                            if (isHome) lenis?.scrollTo(0, { duration: 1.4 });
                        }}
                    >
                        <Logo tone={dark ? 'dark' : 'light'} />
                    </AnchorLink>

                    <div className="hidden items-center gap-7 md:flex">
                        <nav
                            aria-label="Primary"
                            className="flex items-center gap-6 lg:gap-7"
                        >
                            {NAV_LINKS.filter(
                                (link) => link.name !== 'Contact',
                            ).map((link) => {
                                const id = link.href.split('#')[1];
                                const active = isHome && activeId === id;
                                return (
                                    <AnchorLink
                                        key={link.name}
                                        href={link.href}
                                        aria-current={
                                            active ? 'location' : undefined
                                        }
                                        className={cn(
                                            'relative text-[13px] tracking-tight text-foreground/80 transition-colors hover:text-foreground',
                                            'after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100',
                                            active &&
                                                'text-foreground after:scale-x-100',
                                        )}
                                    >
                                        {link.name}
                                    </AnchorLink>
                                );
                            })}
                        </nav>
                        <Button href="/#contact" variant="outline" size="sm">
                            Start a project
                        </Button>
                    </div>

                    <button
                        ref={toggleRef}
                        type="button"
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        onClick={() => setOpenedOn(open ? null : pathname)}
                        className="relative z-10 -mr-2 grid size-11 place-items-center rounded-full md:hidden"
                    >
                        <span
                            className={cn(
                                'absolute h-px w-[22px] bg-foreground transition-transform duration-300',
                                open ? 'rotate-45' : '-translate-y-[4px]',
                            )}
                        />
                        <span
                            className={cn(
                                'absolute h-px w-[22px] bg-foreground transition-transform duration-300',
                                open ? '-rotate-45' : 'translate-y-[4px]',
                            )}
                        />
                    </button>
                </div>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            ref={panelRef}
                            id="mobile-menu"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Menu"
                            initial={
                                reduce
                                    ? { opacity: 0 }
                                    : { clipPath: 'inset(0 0 100% 0)' }
                            }
                            animate={
                                reduce
                                    ? { opacity: 1 }
                                    : { clipPath: 'inset(0 0 0% 0)' }
                            }
                            exit={
                                reduce
                                    ? { opacity: 0 }
                                    : { clipPath: 'inset(0 0 100% 0)' }
                            }
                            transition={{ duration: 0.55, ease: EASE }}
                            className="fixed inset-0 z-0 flex flex-col overflow-y-auto bg-background px-6 pb-8 pt-[88px] md:hidden"
                        >
                            <div
                                aria-hidden
                                className="bg-lattice pointer-events-none absolute inset-0"
                            />
                            <nav
                                aria-label="Mobile"
                                className="relative flex flex-col"
                            >
                                {NAV_LINKS.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={
                                            reduce
                                                ? false
                                                : { y: 24, opacity: 0 }
                                        }
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay: 0.12 + i * 0.05,
                                            duration: 0.6,
                                            ease: EASE,
                                        }}
                                    >
                                        <AnchorLink
                                            href={link.href}
                                            onClick={(event) =>
                                                handleMenuNavigate(
                                                    event,
                                                    link.href,
                                                )
                                            }
                                            className="flex items-baseline justify-between border-b border-border py-4 font-display text-[34px] font-medium leading-none tracking-[-0.04em]"
                                        >
                                            {link.name}
                                            <span className="font-mono text-xs tracking-widest text-muted-foreground">
                                                0{i + 1}
                                            </span>
                                        </AnchorLink>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="relative mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                                <p className="col-span-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                                    Our work
                                </p>
                                {WORK_LINKS.map((link) => (
                                    <AnchorLink
                                        key={link.name}
                                        href={link.href}
                                        onClick={closeMenu}
                                        className="text-foreground/85 hover:text-foreground"
                                    >
                                        {link.name}
                                    </AnchorLink>
                                ))}
                            </div>

                            <div className="relative mt-auto flex flex-col gap-4 pt-10">
                                <Button
                                    href="/#contact"
                                    variant="ink"
                                    size="lg"
                                    arrow
                                    onClick={(event) =>
                                        handleMenuNavigate(event, '/#contact')
                                    }
                                >
                                    Start a project
                                </Button>
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <a
                                        href={`mailto:${BRAND.email}`}
                                        className="hover:text-foreground"
                                    >
                                        {BRAND.email}
                                    </a>
                                    <span className="flex gap-4">
                                        {SOCIAL_LINKS.map((link) => (
                                            <a
                                                key={link.name}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-foreground"
                                            >
                                                {link.name}
                                            </a>
                                        ))}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>
        </>
    );
};

export default Navbar;
