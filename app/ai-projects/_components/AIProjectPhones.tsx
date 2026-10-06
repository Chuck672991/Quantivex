'use client';

import DeviceFrame from '@/components/DeviceFrame';
import { cn } from '@/lib/utils';
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from 'framer-motion';
import { useRef } from 'react';
import { useTilt } from './useTilt';

interface Props {
    screenshots: string[];
    title: string;
    /** "r, g, b" */
    accent: string;
}

// Static classes so Tailwind sees them. Offsets are tighter on small screens
// so the outer phones stay inside the viewport instead of being cropped.
const SIDE = [
    '[transform:translateX(-46%)_rotateY(18deg)_scale(0.82)] sm:[transform:translateX(-62%)_rotateY(18deg)_scale(0.82)]',
    '',
    '[transform:translateX(46%)_rotateY(-18deg)_scale(0.82)] sm:[transform:translateX(62%)_rotateY(-18deg)_scale(0.82)]',
] as const;

/** Three real app screens in a fan, with scroll parallax and pointer tilt. */
const AIProjectPhones = ({ screenshots, title, accent }: Props) => {
    const ref = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const tilt = useTilt(4);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const sideY = useTransform(
        scrollYProgress,
        [0, 1],
        reduce ? [0, 0] : [36, -36],
    );
    const midY = useTransform(
        scrollYProgress,
        [0, 1],
        reduce ? [0, 0] : [-14, 14],
    );

    // Order the fan left / centre / right, centre being the hero screen.
    const shots = screenshots.slice(0, 3);
    const order = shots.length === 3 ? [1, 0, 2] : shots.map((_, i) => i);

    return (
        <motion.div
            ref={ref}
            {...tilt}
            className="relative mx-auto h-[430px] w-full max-w-[560px] sm:h-[540px]"
        >
            <div
                aria-hidden
                className="absolute inset-[8%] rounded-full"
                style={{
                    background: `radial-gradient(circle, rgba(${accent},0.28), transparent 68%)`,
                }}
            />
            {order.map((shotIndex, slot) => {
                const middle = slot === 1 || shots.length < 3;
                return (
                    <div
                        key={shots[shotIndex]}
                        className={cn(
                            'absolute left-1/2 top-1/2 -ml-[100px] -mt-[216px] sm:-ml-[120px] sm:-mt-[260px]',
                            middle ? 'z-10' : 'z-0 opacity-70',
                            shots.length === 3 && SIDE[slot],
                        )}
                    >
                        <motion.div style={{ y: middle ? midY : sideY }}>
                            <DeviceFrame
                                screenshotUrl={shots[shotIndex]}
                                altText={`${title} app screen ${shotIndex + 1}`}
                                active={middle}
                                // DeviceFrame sets xs: and md: widths too; twMerge only
                                // dedupes within a breakpoint, so each one is overridden.
                                className="w-[200px] xs:w-[200px] sm:w-[240px] md:w-[240px]"
                            />
                        </motion.div>
                    </div>
                );
            })}
        </motion.div>
    );
};

export default AIProjectPhones;
