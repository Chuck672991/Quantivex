'use client';

import { useReducedMotion, useSpring } from 'framer-motion';
import type { PointerEvent } from 'react';

const SPRING = { stiffness: 120, damping: 18, mass: 0.5 };

/**
 * Subtle 3D tilt that follows a mouse pointer. Spread the result onto a
 * `motion.*` element. It does nothing for touch input or reduced motion.
 */
export function useTilt(max = 5) {
    const reduce = useReducedMotion();
    const rotateX = useSpring(0, SPRING);
    const rotateY = useSpring(0, SPRING);

    return {
        style: { rotateX, rotateY, transformPerspective: 1100 },
        onPointerMove: (e: PointerEvent<HTMLElement>) => {
            if (reduce || e.pointerType !== 'mouse') return;
            const r = e.currentTarget.getBoundingClientRect();
            rotateY.set(((e.clientX - r.left) / r.width - 0.5) * 2 * max);
            rotateX.set(-((e.clientY - r.top) / r.height - 0.5) * 2 * max);
        },
        onPointerLeave: () => {
            rotateX.set(0);
            rotateY.set(0);
        },
    };
}
