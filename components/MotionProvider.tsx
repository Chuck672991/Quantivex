'use client';
import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/** Reduced-motion visitors get instant transforms from every framer animation. */
const MotionProvider = ({ children }: { children: ReactNode }) => (
    <MotionConfig reducedMotion="user">{children}</MotionConfig>
);

export default MotionProvider;
