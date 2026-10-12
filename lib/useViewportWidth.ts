'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
    window.addEventListener('resize', onChange);
    return () => window.removeEventListener('resize', onChange);
};

/** Window width in px. Reports `fallback` on the server and while hydrating. */
export const useViewportWidth = (fallback = 1200) =>
    useSyncExternalStore(
        subscribe,
        () => window.innerWidth,
        () => fallback,
    );
