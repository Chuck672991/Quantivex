'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface AnimatedFeatureListProps {
  features: string[];
  projectId: number;
}

export default function AnimatedFeatureList({
  features,
  projectId,
}: AnimatedFeatureListProps) {
  // Container variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3, // delayed until heading starts rendering
      },
    },
  };

  // Child variant
  const itemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      key={projectId}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-medium">
        Key Feature Highlights
      </h3>
      <ul className="space-y-3">
        {features.map((feature, idx) => (
          <motion.li
            key={`${projectId}-feat-${idx}`}
            variants={itemVariants}
            className="flex items-start gap-3 text-base text-foreground/80 font-sans leading-relaxed"
          >
            <span className="flex-shrink-0 mt-1 size-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            </span>
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
