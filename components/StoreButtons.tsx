'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/Button';

interface StoreButtonsProps {
  appStoreUrl?: string;
  playStoreUrl?: string;
  /** The product's public website. */
  liveUrl?: string;
}

export default function StoreButtons({
  appStoreUrl,
  playStoreUrl,
  liveUrl,
}: StoreButtonsProps) {
  // Nothing to link to (e.g. a product without a public listing or site)
  if (!appStoreUrl && !playStoreUrl && !liveUrl) return null;

  // Common animation configurations
  const buttonVariants = {
    hover: {
      scale: 1.04,
      filter: 'brightness(1.15)',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 15,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  // Store badges stay black with white type, as the platform guidelines expect
  const badgeClasses =
    'flex h-12 items-center gap-3 rounded-xl border border-foreground/20 bg-black px-4 text-white transition-colors select-none hover:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/60';

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* App Store Button */}
      {appStoreUrl && (
        <motion.a
          href={appStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={badgeClasses}
        >
          {/* Apple Logo SVG */}
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.5-.63.73-1.18 1.87-1.03 2.98 1.12.09 2.26-.6 2.96-1.42Z" />
          </svg>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[10px] uppercase font-medium text-neutral-400">Download on the</span>
            <span className="text-sm font-semibold font-sans mt-0.5">App Store</span>
          </div>
        </motion.a>
      )}

      {/* Google Play Store Button */}
      {playStoreUrl && (
        <motion.a
          href={playStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className={badgeClasses}
        >
          {/* Google Play Logo SVG */}
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M3.25 1.5c-.14 0-.27.05-.38.13L13.84 12 2.87 22.37c.11.08.24.13.38.13.23 0 .46-.08.64-.23l14.28-8.24-4.22-4.03-4.22-4.03L3.89 1.73c-.18-.15-.41-.23-.64-.23M20.5 10.74l-2.61-1.5-3.3 3.15 3.3 3.15 2.61-1.5c.67-.39 1-.95 1-1.65s-.33-1.26-1-1.65M2.1 2.3v19.4c0 .4.2.8.5 1.1L12.5 12 2.6 1.2c-.3.3-.5.7-.5 1.1Z" />
          </svg>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[10px] uppercase font-medium text-neutral-400">Get it on</span>
            <span className="text-sm font-semibold font-sans mt-0.5">Google Play</span>
          </div>
        </motion.a>
      )}

      {/* The product's own website */}
      {liveUrl && (
        <Button href={liveUrl} variant="outline" size="lg" arrow>
          Visit site
        </Button>
      )}
    </div>
  );
}
