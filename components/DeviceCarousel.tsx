'use client';
import { useReducedMotion } from '@/lib/useReducedMotion';

import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useViewportWidth } from '@/lib/useViewportWidth';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DeviceFrame from './DeviceFrame';
import { cn } from '@/lib/utils';

interface DeviceCarouselProps {
  screenshots: string[];
  title?: string;
}

export default function DeviceCarousel({
  screenshots,
  title = 'App Showcase',
}: DeviceCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const windowWidth = useViewportWidth();
  const shouldReduceMotion = useReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const N = screenshots.length;

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % N);
  }, [N]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + N) % N);
  }, [N]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on arrow keys when focused on carousel
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const activeTag = document.activeElement?.tagName;
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;
        
        e.preventDefault();
        if (e.key === 'ArrowLeft') {
          handlePrev();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Drag Gesture Handling
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 40;
    const swipeVelocity = 150;

    if (info.offset.x < -swipeThreshold || info.velocity.x < -swipeVelocity) {
      handleNext();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > swipeVelocity) {
      handlePrev();
    }
  };

  // Spring animation physics
  const transition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  };

  // Calculate 3D transformation values
  const getVariants = (index: number) => {
    // Calculate difference wrapping around the circular list
    let diff = ((index - activeIndex) % N + N) % N;
    if (diff > N / 2) {
      diff -= N;
    }

    if (shouldReduceMotion) {
      return {
        x: diff * (isMobile ? 120 : 200),
        scale: diff === 0 ? 1 : 0.85,
        opacity: diff === 0 ? 1 : diff === 1 || diff === -1 ? 0.4 : 0,
        zIndex: diff === 0 ? 10 : 5,
      };
    }

    // Responsive offset metrics
    const xOffset = isMobile ? 80 : isTablet ? 130 : 170;
    const zOffset = isMobile ? -80 : isTablet ? -120 : -160;
    const rotateYOffset = 25; // degrees

    if (diff === 0) {
      // ACTIVE
      return {
        x: 0,
        y: 0,
        z: 0,
        scale: 1,
        rotateY: 0,
        opacity: 1,
        zIndex: 10,
      };
    } else if (diff === 1) {
      // NEXT
      return {
        x: xOffset,
        y: 0,
        z: zOffset,
        scale: 0.88,
        rotateY: -rotateYOffset,
        opacity: 0.7,
        zIndex: 5,
      };
    } else if (diff === -1) {
      // PREVIOUS
      return {
        x: -xOffset,
        y: 0,
        z: zOffset,
        scale: 0.88,
        rotateY: rotateYOffset,
        opacity: 0.7,
        zIndex: 5,
      };
    } else if (diff === 2 || diff === -2) {
      // FARTHER OUT (Next 2 / Prev 2)
      return {
        x: diff === 2 ? xOffset * 1.7 : -xOffset * 1.7,
        y: 0,
        z: zOffset * 2,
        scale: 0.78,
        rotateY: diff === 2 ? -rotateYOffset * 1.5 : rotateYOffset * 1.5,
        opacity: 0.35,
        zIndex: 3,
      };
    } else {
      // OFFSCREEN
      return {
        x: diff > 0 ? xOffset * 2.2 : -xOffset * 2.2,
        y: 0,
        z: zOffset * 3,
        scale: 0.65,
        rotateY: diff > 0 ? -rotateYOffset * 2 : rotateYOffset * 2,
        opacity: 0,
        zIndex: 1,
      };
    }
  };

  return (
    <div
      ref={carouselRef}
      className="relative w-full flex flex-col items-center justify-center select-none py-10 md:py-16 overflow-visible"
      style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      aria-label={`${title} image carousel`}
    >
      {/* Dynamic Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-[400px] sm:w-80 sm:h-[500px] rounded-full pointer-events-none perf-fx z-0" style={{ background: 'radial-gradient(closest-side, hsl(var(--primary) / 0.2), transparent)' }} />

      {/* Swipe/Drag Container */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        className="relative w-full h-[460px] xs:h-[500px] md:h-[540px] flex items-center justify-center z-10 cursor-grab active:cursor-grabbing overflow-visible"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence initial={false}>
          {screenshots.map((screenshot, idx) => {
            const relativeIndex = ((idx - activeIndex) % N + N) % N;
            const diff = relativeIndex > N / 2 ? relativeIndex - N : relativeIndex;
            const isCenter = diff === 0;

            return (
              <motion.div
                key={`${screenshot}-${idx}`}
                style={{
                  position: 'absolute',
                  transformOrigin: 'center center',
                  transformStyle: 'preserve-3d',
                }}
                animate={getVariants(idx)}
                transition={transition}
                className={cn(
                  'flex items-center justify-center',
                  isCenter ? 'pointer-events-auto' : 'pointer-events-none md:pointer-events-auto'
                )}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(idx);
                  }
                }}
              >
                <DeviceFrame
                  screenshotUrl={screenshot}
                  altText={`${title} screenshot ${idx + 1}`}
                  active={isCenter}
                  className="transition-all duration-300"
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Slide Indicators & Navigation Controls */}
      <div className="flex items-center justify-between w-full max-w-[280px] xs:max-w-[320px] mt-8 sm:mt-12 z-20">
        <button
          onClick={handlePrev}
          className="size-11 rounded-full border border-border hover:border-foreground/40 bg-card/60 hover:bg-card text-foreground flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary/60"
          aria-label="Previous screenshot"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Circular Indicators */}
        <div className="flex gap-2.5">
          {screenshots.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                idx === activeIndex
                  ? 'w-6 bg-primary'
                  : 'w-2 bg-foreground/20 hover:bg-foreground/40'
              )}
              aria-label={`Go to screenshot ${idx + 1}`}
              aria-current={idx === activeIndex ? 'true' : 'false'}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="size-11 rounded-full border border-border hover:border-foreground/40 bg-card/60 hover:bg-card text-foreground flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-primary/60"
          aria-label="Next screenshot"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Swipe visual tip on mobile */}
      <p className="text-xs text-muted-foreground mt-4 block md:hidden select-none pointer-events-none">
        Drag or swipe to rotate screenshots
      </p>
    </div>
  );
}
