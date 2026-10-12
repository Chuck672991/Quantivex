'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedHeadingProps {
  title: string;
  shortPitch: string;
  projectId: number;
}

export default function AnimatedHeading({
  title,
  shortPitch,
  projectId,
}: AnimatedHeadingProps) {
  // Animates when the projectId changes by using it as a key in layout
  return (
    <motion.div
      key={projectId}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.12,
          },
        },
      }}
      className="space-y-4"
    >
      {/* Category/Eyebrow Badge */}
      <motion.span
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
        }}
        className="inline-block font-mono text-[11px] font-medium tracking-[0.2em] text-primary uppercase bg-primary/10 border border-primary/20 px-3 py-1 rounded-full"
      >
        Mobile Application
      </motion.span>

      {/* Project Title */}
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 150, damping: 20 },
          },
        }}
        className="text-balance font-display text-[clamp(2rem,5.2vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-foreground"
      >
        {title}
      </motion.h2>

      {/* Short Product Pitch */}
      <motion.p
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 150, damping: 22 },
          },
        }}
        className="text-lg md:text-xl font-medium text-gradient font-sans leading-snug"
      >
        {shortPitch}
      </motion.p>
    </motion.div>
  );
}
