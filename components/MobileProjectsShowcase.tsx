'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { PROJECTS_DATA, IMobileProject } from '@/lib/mobileData';
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

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.4, 1, 1, 0.4]
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
      style={{ opacity }}
      className="relative min-h-[90vh] flex items-center py-16 lg:py-28 overflow-visible border-b border-neutral-900 last:border-b-0"
    >
      {/* Background Ambient Glow for the current project */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[70%] rounded-full blur-[120px] pointer-events-none z-0 transition-all duration-1000"
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
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 1024; // tablet and mobile stacked

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight * 0.9,
      behavior: 'smooth',
    });
  };

  return (
    <div className="w-full bg-[#0B0C0E] text-white selection:bg-primary/30 selection:text-white overflow-hidden relative">
      {/* Grid Pattern Background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Hero Header Section */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-6 pt-24 pb-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none z-0" />
        
        <div className="max-w-4xl mx-auto space-y-6 z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full"
          >
            Portfolio Showcase
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 100 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight text-white font-anton uppercase leading-none"
          >
            Mobile <span className="text-gradient">Applications</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-neutral-400 font-sans max-w-2xl mx-auto font-light leading-relaxed"
          >
            A curated showcase of premium iOS & Android products, detailed with fluid 3D transformations, robust offline sync features, and pixel-perfect design languages.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={handleScrollDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ y: 5 }}
          className="absolute bottom-12 flex flex-col items-center gap-2 text-xs text-muted-foreground tracking-widest font-semibold hover:text-foreground transition-colors z-10"
        >
          <span>EXPLORE PRODUCTS</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="size-8 rounded-full border border-neutral-800 flex items-center justify-center"
          >
            <ArrowDown className="w-4 h-4 text-primary" />
          </motion.div>
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

      {/* Footer CTA */}
      <section className="relative py-28 text-center px-6 border-t border-neutral-900 bg-neutral-950/20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
        <div className="max-w-2xl mx-auto space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase font-anton">Have a mobile app in mind?</h2>
          <p className="text-muted-foreground text-neutral-400 leading-relaxed font-sans max-w-lg mx-auto">
            Whether you need a sleek AI transcribing tool, low-latency WebSocket interfaces, or high-performance cross-platform apps, let's collaborate to build something stunning.
          </p>
          <div className="pt-4">
            <motion.a
              href="mailto:ha33217@gmail.com?subject=Collaboration%20on%20Mobile%20App"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center px-8 py-3.5 border border-primary bg-primary/10 hover:bg-primary/25 text-primary hover:text-white font-semibold rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              Get In Touch
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
}
