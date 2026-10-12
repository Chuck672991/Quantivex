'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
    const media = window.matchMedia(QUERY);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
};

/**
 * `prefers-reduced-motion`, safe for SSR: the server and the hydration pass
 * both report `false`, then the real preference applies straight after, so
 * markup never mismatches.
 */
export const useReducedMotion = () =>
    useSyncExternalStore(
        subscribe,
        () => window.matchMedia(QUERY).matches,
        () => false,
    );
