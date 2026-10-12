'use client';

import { useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useCallback, type MouseEvent } from 'react';

const NAV_OFFSET = -72;

/**
 * Scrolls to a same-page hash ("/#work", "#contact") through Lenis, which owns
 * the page scroll. Returns false, doing nothing, when the link points at
 * another route or the target is missing, so the caller can let next/link
 * navigate.
 */
export const useHashScroller = () => {
    const lenis = useLenis();
    const pathname = usePathname();

    return useCallback(
        (href: string) => {
            const [path, hash] = href.split('#');
            if (!hash || (path && path !== pathname)) return false;

            const target = document.getElementById(hash);
            if (!target) return false;

            const reduce = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;

            if (lenis) {
                lenis.scrollTo(target, {
                    offset: NAV_OFFSET,
                    duration: 1.4,
                    immediate: reduce,
                    force: true,
                });
            } else {
                target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
            }
            window.history.replaceState(null, '', `${pathname}#${hash}`);
            return true;
        },
        [lenis, pathname],
    );
};

/** Click handler for same-page hash links; other clicks fall through untouched. */
export const useAnchorScroll = () => {
    const scrollToHash = useHashScroller();

    return useCallback(
        (event: MouseEvent<HTMLElement>, href: string) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return false;
            }
            const handled = scrollToHash(href);
            if (handled) event.preventDefault();
            return handled;
        },
        [scrollToHash],
    );
};
