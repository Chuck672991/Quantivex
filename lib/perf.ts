'use client';

import { useSyncExternalStore } from 'react';

/**
 * Adaptive quality. 0 = full effects, 1 = reduced, 2 = minimal.
 *
 * It starts from cheap hardware hints, is persisted for the session, and the
 * watchdog in components/PerfMonitor.tsx demotes it when frames run slow.
 * `data-perf` on <html> drives the CSS; WebGL scenes read it with usePerfLevel.
 */
export type PerfLevel = 0 | 1 | 2;

const STORAGE_KEY = 'quantivex-perf';
const EVENT = 'quantivex:perf';

let level: PerfLevel | null = null;

const clamp = (value: number): PerfLevel =>
    (value <= 0 ? 0 : value >= 2 ? 2 : 1) as PerfLevel;

const detect = (): PerfLevel => {
    try {
        const stored = window.sessionStorage.getItem(STORAGE_KEY);
        if (stored !== null) return clamp(Number(stored));
    } catch {
        // storage blocked: fall through to the hints
    }

    const nav = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { saveData?: boolean };
    };
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;
    if (nav.connection?.saveData || cores <= 2 || memory <= 2) return 2;
    if (cores <= 4 || memory <= 4) return 1;
    return 0;
};

export const getPerfLevel = (): PerfLevel => {
    if (level === null) {
        level = detect();
        document.documentElement.dataset.perf = String(level);
    }
    return level;
};

/** Raise the level (never lowers it). Returns true when it changed. */
export const demotePerf = (to: PerfLevel) => {
    const current = getPerfLevel();
    if (to <= current) return false;
    level = to;
    document.documentElement.dataset.perf = String(to);
    try {
        window.sessionStorage.setItem(STORAGE_KEY, String(to));
    } catch {
        // storage blocked: the level just resets next load
    }
    window.dispatchEvent(new Event(EVENT));
    return true;
};

const subscribe = (onChange: () => void) => {
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
};

/** The current level; 0 on the server and while hydrating. */
export const usePerfLevel = () =>
    useSyncExternalStore(subscribe, getPerfLevel, () => 0 as PerfLevel);
