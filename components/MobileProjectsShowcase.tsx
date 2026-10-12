'use client';
import { useReducedMotion } from '@/lib/useReducedMotion';

import React, { useRef } from 'react';
import { useAnimGate } from '@/lib/useAnimGate';
import { useViewportWidth } from '@/lib/useViewportWidth';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PROJECTS_DATA, IMobileProject } from '@/lib/mobileData';
import Button from './Button';
import GridBackdrop from './GridBackdrop';
import ProjectContent from './ProjectContent';
import DeviceCarousel from './DeviceCarousel';
import { ArrowDown } from 'lucide-react';

// Individual Project Section Component with Parallax Scroll
function ProjectSection({
  project,
  isMobile,
}: {
  project: IMobileProject;
  isMobile: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Track scroll position of this section relative to viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Parallax translations: text scrolls up faster, carousel scrolls down slower
  const yText = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : isMobile ? [20, -20] : [80, -80]
  );

  const yCarousel = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : isMobile ? [-15, 15] : [-50, 50]
  );

  // App-specific background glow mappings
  const getGlowColor = (id: number) => {
    switch (id) {
      case 1: return 'rgba(245, 158, 11, 0.08)'; // Amber (Julian Couriers)
      case 2: return 'rgba(99, 102, 241, 0.08)';  // Indigo (MWI AI)
      case 3: return 'rgba(20, 184, 166, 0.08)';  // Teal (QBS)
      case 4: return 'rgba(16, 185, 129, 0.08)';  // Emerald (Eagle IoT)
      default: return 'rgba(125, 211, 252, 0.08)';
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center py-16 lg:py-28 overflow-visible border-b border-border last:border-b-0"
    >
      {/* Background Ambient Glow for the current project */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] rounded-full pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${getGlowColor(project.id)} 0%, transparent 70%)`,
        }}
      />

      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10">

        {/* Left Side Content Column */}
        <motion.div
          style={{ y: yText }}
          className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1"
        >
          <ProjectContent project={project} />
        </motion.div>

        {/* Right Side Device Carousel Column */}
        <motion.div
          style={{ y: yCarousel }}
          className="lg:col-span-6 flex items-center justify-center order-1 lg:order-2 overflow-visible"
        >
          <DeviceCarousel screenshots={project.screenshots} title={project.title} />
        </motion.div>

      </div>
    </motion.section>
  );
}

// Main Showcase Component
export default function MobileProjectsShowcase() {
  const windowWidth = useViewportWidth();
  const heroRef = useRef<HTMLElement>(null);
  useAnimGate(heroRef);

  const isMobile = windowWidth < 1024; // tablet and mobile stacked

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: 'smooth',
    });
  };

  return (
    // `dark` flips every token inside to the ink surface
    <div className="dark w-full bg-ink-950 text-foreground selection:bg-primary/30 selection:text-foreground overflow-hidden relative">
      {/* Hero Header Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-28 pb-28">
        <GridBackdrop at="50% 0%" />
        <div
          className="perf-fx absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] pointer-events-none z-0"
          style={{ background: 'radial-gradient(closest-side, hsl(var(--primary) / 0.14), transparent)' }}
        />

        <div className="max-w-4xl mx-auto space-y-6 z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block font-mono text-[11px] font-medium tracking-[0.2em] text-primary uppercase bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full"
          >
            Selected work
          </motion.span>

          {/* Geist is far wider than Anton: "applications" must still fit at 360px */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 100 }}
            className="font-display text-[clamp(2.5rem,10vw,6rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-foreground"
          >
            Mobile <span className="text-gradient">applications</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground font-sans max-w-2xl mx-auto leading-relaxed"
          >
            iOS and Android products we build with React Native: live tracking, subscriptions, real-time data and AI.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={handleScrollDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ y: 5 }}
          className="absolute bottom-12 flex flex-col items-center gap-2 font-mono text-[11px] uppercase text-muted-foreground tracking-[0.2em] hover:text-foreground transition-colors z-10"
        >
          <span>Explore apps</span>
          <div className="cue-bounce size-8 rounded-full border border-border flex items-center justify-center">
            <ArrowDown className="w-4 h-4 text-primary" />
          </div>
        </motion.button>
      </section>

      {/* Projects list sections */}
      <div className="relative">
        {PROJECTS_DATA.map((project) => (
          <ProjectSection
            key={project.id}
            project={project}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Closing CTA */}
      <section className="relative py-28 text-center px-6 border-t border-border bg-card/50">
        <div
          className="perf-fx absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] pointer-events-none"
          style={{ background: 'radial-gradient(closest-side, hsl(var(--primary) / 0.08), transparent)' }}
        />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-balance font-display text-[clamp(2rem,6vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-foreground">
            Have a mobile app in mind?
          </h2>
          <p className="text-muted-foreground leading-relaxed font-sans max-w-lg mx-auto">
            From AI-assisted tools to live tracking and subscription apps, we design, build and release cross-platform products for iOS and Android.
          </p>
          <div className="pt-4">
            <Button href="/#contact" variant="ink" size="lg" arrow>
              Start a project
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
