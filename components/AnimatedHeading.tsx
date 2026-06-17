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
        className="inline-block text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 px-3 py-1 rounded-full"
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
        className="text-4xl xs:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground font-anton uppercase"
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
        className="text-lg xs:text-xl md:text-2xl font-medium text-gradient font-sans leading-snug"
      >
        {shortPitch}
      </motion.p>
    </motion.div>
  );
}
