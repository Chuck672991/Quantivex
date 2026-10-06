'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Three.js is client-only and heavy, so it stays out of the initial bundle
// (same pattern Banner uses for DevMonolith).
const AiRobot = dynamic(() => import('./AiRobot'), {
    ssr: false,
    loading: () => null,
});

/**
 * A WebGL failure (disabled, no GPU, context creation refused) must not take
 * the page down. The glow behind the robot stays as the fallback.
 */
class RobotBoundary extends Component<
    { children: ReactNode },
    { failed: boolean }
> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error: unknown) {
        console.warn('[AiRobot] WebGL scene unavailable:', error);
    }

    render() {
        return this.state.failed ? null : this.props.children;
    }
}

interface Props {
    /** Must give the box a size — the scene fills it. */
    className?: string;
}

/**
 * Mounts the robot only once it is near the viewport. The container reserves
 * its own space, so nothing shifts when the scene loads.
 */
const AiRobotScene = ({ className }: Props) => {
    const hostRef = useRef<HTMLDivElement>(null);
    const [armed, setArmed] = useState(false);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;
        if (typeof IntersectionObserver === 'undefined') {
            setArmed(true);
            return;
        }

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setArmed(true);
                io.disconnect();
            },
            { rootMargin: '400px 0px' },
        );
        io.observe(host);
        return () => io.disconnect();
    }, []);

    return (
        <div ref={hostRef} className={cn('relative', className)} aria-hidden>
            {/* Placeholder while three.js loads, and the fallback without WebGL */}
            <div
                className="absolute inset-[14%] rounded-full"
                style={{
                    background:
                        'radial-gradient(circle, rgba(34,211,238,0.20) 0%, rgba(99,102,241,0.13) 45%, transparent 70%)',
                }}
            />
            {armed && (
                <RobotBoundary>
                    <AiRobot />
                </RobotBoundary>
            )}
        </div>
    );
};

export default AiRobotScene;
