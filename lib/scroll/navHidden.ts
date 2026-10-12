'use client';

import { useSyncExternalStore } from 'react';

/**
 * While the hero's opening is still on the lockup, the navbar (and the scroll
 * progress line) stay out of sight; they come in once the hole has opened over
 * them. Held outside React so a scroll timeline can flip it without a render
 * per frame: subscribers only re-render when the value changes.
 */
let hidden = false;
const listeners = new Set<() => void>();

export const setNavHidden = (next: boolean) => {
    if (next === hidden) return;
    hidden = next;
    listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

export const useNavHidden = () =>
    useSyncExternalStore(
        subscribe,
        () => hidden,
        () => false,
    );
