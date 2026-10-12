'use client';

import { useSyncExternalStore } from 'react';

const EVENT = 'quantivex:ready';

declare global {
    interface Window {
        __quantivexReady?: boolean;
    }
}

const subscribe = (onChange: () => void) => {
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
};

const getSnapshot = () => window.__quantivexReady === true;
const getServerSnapshot = () => false;

/** Non-reactive read, for code that already runs in an effect or callback. */
export const isSiteReady = () => window.__quantivexReady === true;

/** Called by the preloader once it has lifted (or immediately when skipped). */
export const markSiteReady = () => {
    window.__quantivexReady = true;
    window.dispatchEvent(new Event(EVENT));
};

/** True once the preloader is out of the way, so intro animations can start. */
export const useSiteReady = () =>
    useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
