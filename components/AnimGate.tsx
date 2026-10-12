'use client';
import { useAnimGate } from '@/lib/useAnimGate';
import { useRef, type ComponentPropsWithoutRef } from 'react';

/** A div whose CSS animations only run while it is on screen (see useAnimGate). */
const AnimGate = (props: ComponentPropsWithoutRef<'div'>) => {
    const ref = useRef<HTMLDivElement>(null);
    useAnimGate(ref);
    return <div ref={ref} {...props} />;
};

export default AnimGate;
