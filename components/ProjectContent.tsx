'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IMobileProject } from '@/lib/mobileData';
import AnimatedHeading from './AnimatedHeading';
import AnimatedFeatureList from './AnimatedFeatureList';
import StoreButtons from './StoreButtons';

interface ProjectContentProps {
  project: IMobileProject;
}

export default function ProjectContent({ project }: ProjectContentProps) {
  const { id, title, shortPitch, description, appStoreUrl, playStoreUrl, liveUrl, techStack, features } = project;
  const hasLinks = Boolean(appStoreUrl || playStoreUrl || liveUrl);

  // Variants for staggering tech stack pills
  const techStackContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const pillVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 200, damping: 18 },
    },
  };

  // Button fade-in variants
  const buttonsVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        type: 'spring',
        stiffness: 150,
        damping: 20,
      },
    },
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-10 justify-center h-full py-6">
      {/* Animated Heading & Pitch */}
      <AnimatedHeading
        title={title}
        shortPitch={shortPitch}
        projectId={id}
      />

      {/* Tech Stack Pills */}
      <motion.div
        key={`${id}-tech`}
        variants={techStackContainerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap gap-2"
      >
        {techStack.map((tech) => (
          <motion.span
            key={`${id}-tech-${tech}`}
            variants={pillVariants}
            whileHover={{ scale: 1.05, y: -2, transition: { duration: 0.2 } }}
            className="text-xs font-medium px-3 py-1.5 bg-secondary border border-border text-foreground/80 rounded-full hover:border-primary/50 transition-colors select-none"
          >
            {tech}
          </motion.span>
        ))}
      </motion.div>

      {/* Long Description Text */}
      <motion.p
        key={`${id}-desc`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="text-base text-muted-foreground font-sans leading-relaxed"
      >
        {description}
      </motion.p>

      {/* Features List */}
      <AnimatedFeatureList
        features={features}
        projectId={id}
      />

      {/* Store listings and the product's website, when they exist */}
      {hasLinks && (
        <motion.div
          key={`${id}-buttons`}
          variants={buttonsVariants}
          initial="hidden"
          animate="visible"
        >
          <StoreButtons
            appStoreUrl={appStoreUrl}
            playStoreUrl={playStoreUrl}
            liveUrl={liveUrl}
          />
        </motion.div>
      )}
    </div>
  );
}
