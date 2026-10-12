'use client';

import { cn } from '@/lib/utils';
import { usePerfLevel } from '@/lib/perf';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { useSiteReady } from '@/lib/useSiteReady';
import dynamic from 'next/dynamic';
import {
    Component,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
    type ReactNode,
} from 'react';

// Three.js is client-only and heavy: keep it out of the initial bundle
const IsoScene = dynamic(() => import('./IsoScene'), {
    ssr: false,
    loading: () => null,
});

class SceneBoundary extends Component<
    { children: ReactNode; onFail: () => void },
    { failed: boolean }
> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error: unknown) {
        console.warn('[HeroScene] WebGL scene unavailable:', error);
        this.props.onFail();
    }

    render() {
        return this.state.failed ? null : this.props.children;
    }
}

let webglSupport: boolean | null = null;

const detectWebGL = () => {
    if (webglSupport !== null) return webglSupport;
    try {
        const canvas = document.createElement('canvas');
        webglSupport = Boolean(
            canvas.getContext('webgl2') || canvas.getContext('webgl'),
        );
    } catch {
        webglSupport = false;
    }
    return webglSupport;
};

const noopSubscribe = () => () => {};

interface Props {
    className?: string;
}

/**
 * The isometric hero scene. It mounts only when WebGL exists, pauses its
 * render loop whenever it is off-screen or the tab is hidden, and holds still
 * for visitors who prefer reduced motion. Without WebGL the static poster
 * (rendered from this same scene) stays in its place.
 */
const HeroScene = ({ className }: Props) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const ready = useSiteReady();
    // null while hydrating, then the (cached) feature check
    const supported = useSyncExternalStore(
        noopSubscribe,
        detectWebGL,
        () => null,
    );
    const [failed, setFailed] = useState(false);
    const [created, setCreated] = useState(false);
    const [inView, setInView] = useState(true);
    const [tabVisible, setTabVisible] = useState(true);
    const reduceMotion = useReducedMotion();
    const level = usePerfLevel();
    // Three.js (~700KB) is fetched and compiled after the page has been drawn and
    // is idle, so it never competes with the headline reveal for the main thread
    const [mountScene, setMountScene] = useState(false);

    useEffect(() => {
        if (!ready || !supported || mountScene) return;
        const mount = () => setMountScene(true);
        // Safari has no requestIdleCallback
        if (typeof window.requestIdleCallback === 'function') {
            const id = window.requestIdleCallback(mount, { timeout: 700 });
            return () => window.cancelIdleCallback(id);
        }
        const id = window.setTimeout(mount, 250);
        return () => window.clearTimeout(id);
    }, [ready, supported, mountScene]);

    useEffect(() => {
        const host = hostRef.current;
        if (!host || typeof IntersectionObserver === 'undefined') return;
        const io = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { rootMargin: '120px 0px' },
        );
        io.observe(host);
        return () => io.disconnect();
    }, []);

    useEffect(() => {
        const handleVisibility = () =>
            setTabVisible(document.visibilityState === 'visible');
        document.addEventListener('visibilitychange', handleVisibility);
        return () =>
            document.removeEventListener('visibilitychange', handleVisibility);
    }, []);

    const showPoster = supported === false || failed;

    return (
        <div ref={hostRef} className={cn('relative', className)} aria-hidden>
            {showPoster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src="/brand/hero-scene.webp"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-left"
                />
            )}

            {supported && mountScene && !failed && (
                <SceneBoundary onFail={() => setFailed(true)}>
                    <div
                        className={cn(
                            'absolute inset-0 transition-opacity duration-700',
                            created ? 'opacity-100' : 'opacity-0',
                        )}
                    >
                        <IsoScene
                            ready={ready}
                            reduceMotion={reduceMotion}
                            level={level}
                            active={inView && tabVisible}
                            onCreated={() => setCreated(true)}
                        />
                    </div>
                </SceneBoundary>
            )}
        </div>
    );
};

export default HeroScene;
