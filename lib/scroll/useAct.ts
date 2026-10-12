'use client';

import { type RefObject } from 'react';
import { MEDIA } from './config';
import { gsap, useGSAP } from './gsap';

export interface ActContext {
    root: HTMLElement;
    /** Scoped selector: only descendants of the act's root */
    q: <T extends Element = HTMLElement>(selector: string) => T[];
    /** >= 1024px wide, motion allowed */
    full: boolean;
    /** full, and tall enough (>= 720px) to hold a pinned sequence */
    pinned: boolean;
    /** < 1024px wide, motion allowed */
    compact: boolean;
}

/**
 * One scroll act = one section. The build function runs once per tier (and
 * again if the viewport crosses a tier boundary); every tween and
 * ScrollTrigger it creates is recorded by the media context, so leaving the
 * tier, a re-render or an unmount reverts all of it, with inline styles
 * restored. Reduced motion never runs the build: the section stays static.
 *
 * The build may return a cleanup for anything it created outside GSAP.
 */
export const useAct = (
    scope: RefObject<HTMLElement | null>,
    build: (context: ActContext) => void | (() => void),
) => {
    useGSAP(
        () => {
            const root = scope.current;
            if (!root) return;

            const mm = gsap.matchMedia();
            mm.add(
                {
                    pinned: MEDIA.pinned,
                    full: MEDIA.full,
                    compact: MEDIA.compact,
                },
                (context) => {
                    const { pinned, full, compact } = context.conditions as Record<
                        'pinned' | 'full' | 'compact',
                        boolean
                    >;
                    return build({
                        root,
                        q: gsap.utils.selector(root),
                        full,
                        pinned,
                        compact,
                    });
                },
            );

            return () => mm.revert();
        },
        { scope },
    );
};
