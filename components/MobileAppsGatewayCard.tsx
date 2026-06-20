'use client';

import React, { useRef, useState, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import Image from 'next/image';
import { Smartphone, ArrowUpRight, Zap, Map, Wifi } from 'lucide-react';
import { PROJECTS_DATA } from '@/lib/mobileData';
import TransitionLink from './TransitionLink';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PhoneConfig {
  offsetX: number;
  rotateY: number;
  rotateX: number;
  scale: number;
  z: number;
  opacity: number;
  delay: number;
}

const PHONE_CONFIGS: PhoneConfig[] = [
  { offsetX: -95, rotateY: -20, rotateX: 5, scale: 0.82, z: -30, opacity: 0.65, delay: 0.25 },
  { offsetX: 0,   rotateY:   0, rotateX: 0, scale: 1.00, z:   0, opacity: 1.00, delay: 0.10 },
  { offsetX:  95, rotateY:  20, rotateX:-5, scale: 0.82, z: -30, opacity: 0.65, delay: 0.40 },
];

const TECH_FEATURES = [
  { icon: Map,       label: 'Live GPS' },
  { icon: Zap,       label: 'GPT-4 AI' },
  { icon: Wifi,      label: 'WebSockets' },
  { icon: Smartphone,label: 'React Native' },
];

// ─── Mini Phone Frame ─────────────────────────────────────────────────────────

function MiniPhone({
  screenshot,
  cfg,
  isCardHovered,
}: {
  screenshot: string;
  cfg: PhoneConfig;
  isCardHovered: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    // Outer: handles position / rotations / initial entrance
    <motion.div
      initial={{ opacity: 0, y: 50, scale: cfg.scale * 0.9 }}
      animate={{ opacity: cfg.opacity, y: 0, scale: isCardHovered ? cfg.scale * 1.03 : cfg.scale }}
      transition={{
        opacity: { duration: 0.7, delay: cfg.delay },
        y: { type: 'spring', stiffness: 160, damping: 22, delay: cfg.delay },
        scale: { type: 'spring', stiffness: 300, damping: 30 },
      }}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -55,
        marginTop: -115,
        x: cfg.offsetX,
        rotateY: cfg.rotateY,
        rotateX: cfg.rotateX,
        z: cfg.z,
        transformStyle: 'preserve-3d',
      }}
    >
    {/* Inner: handles continuous float loop independently */}
    <motion.div
      animate={
        isCardHovered && !shouldReduceMotion
          ? { y: [0, -8, 0] }
          : { y: 0 }
      }
      transition={{
        y: {
          duration: 3.2,
          repeat: isCardHovered ? Infinity : 0,
          ease: 'easeInOut',
          delay: cfg.delay * 1.5,
        },
      }}
    >
      {/* Phone shell */}
      <div
        style={{
          width: 110,
          height: 230,
          borderRadius: 26,
          background: 'linear-gradient(160deg, #1d1d2e 0%, #0a0a12 100%)',
          border: '1.5px solid rgba(255,255,255,0.07)',
          boxShadow: `
            0 35px 70px rgba(0,0,0,0.65),
            0 8px 20px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.09),
            inset 0 -1px 0 rgba(0,0,0,0.4)
          `,
          position: 'relative',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: 9,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 54,
            height: 14,
            background: '#000',
            borderRadius: 10,
            zIndex: 10,
          }}
        />

        {/* Screen */}
        <div
          style={{
            position: 'absolute',
            inset: 3,
            borderRadius: 23,
            overflow: 'hidden',
            background: '#111',
          }}
        >
          <Image
            src={screenshot}
            alt="Mobile app screenshot"
            fill
            className="object-cover object-top"
            sizes="110px"
            loading="lazy"
          />
        </div>

        {/* Glass sheen */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 26,
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.055) 0%, transparent 55%)',
            pointerEvents: 'none',
          }}
        />

        {/* Volume buttons */}
        {[50, 78].map((top) => (
          <div
            key={top}
            style={{
              position: 'absolute',
              left: -2.5,
              top,
              width: 3,
              height: 22,
              background: 'rgba(255,255,255,0.10)',
              borderRadius: '2px 0 0 2px',
            }}
          />
        ))}

        {/* Power button */}
        <div
          style={{
            position: 'absolute',
            right: -2.5,
            top: 60,
            width: 3,
            height: 30,
            background: 'rgba(255,255,255,0.10)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      </div>
    </motion.div>
    </motion.div>
  );
}

// ─── Gateway Card ─────────────────────────────────────────────────────────────

export default function MobileAppsGatewayCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 280, damping: 32 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [4, -4]), springConfig);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || shouldReduceMotion) return;
      const rect = cardRef.current.getBoundingClientRect();
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawX, rawY, shouldReduceMotion],
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    setIsHovered(false);
  }, [rawX, rawY]);

  // Pull the first 3 screenshots from actual project data
  const screenshots = [
    PROJECTS_DATA[0].screenshots[0],
    PROJECTS_DATA[0].screenshots[1],
    PROJECTS_DATA[3].screenshots[0],
  ];

  return (
    <TransitionLink href="/mobile-applications" aria-label="Explore Mobile Applications Showcase">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
          style={{
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.06)',
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.008 }}
        transition={{ type: 'spring', stiffness: 280, damping: 32 }}
        className="relative w-full overflow-hidden mb-10 cursor-pointer"
      >
        {/* ── Dark cinematic background ── */}
        <div className="absolute inset-0 bg-[#0B0C0E]" />

        {/* ── Subtle grid overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* ── Ambient glow blobs ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ borderRadius: 20 }}
        >
          <motion.div
            animate={
              isHovered
                ? { scale: 1.4, opacity: 0.9 }
                : { scale: 1, opacity: 0.5 }
            }
            transition={{ type: 'spring', stiffness: 160, damping: 25 }}
            className="absolute rounded-full blur-[90px]"
            style={{
              width: 350,
              height: 350,
              top: '20%',
              left: '15%',
              background: 'hsl(var(--primary) / 0.22)',
            }}
          />
          <motion.div
            animate={
              isHovered
                ? { scale: 1.3, opacity: 0.7 }
                : { scale: 1, opacity: 0.35 }
            }
            transition={{ type: 'spring', stiffness: 160, damping: 25, delay: 0.05 }}
            className="absolute rounded-full blur-[80px]"
            style={{
              width: 280,
              height: 280,
              bottom: '10%',
              right: '10%',
              background: 'rgba(99,102,241,0.18)',
            }}
          />
        </motion.div>

        {/* ── Content grid ── */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[380px] lg:min-h-[420px]">

          {/* Left: Copy */}
          <div className="flex flex-col justify-center gap-5 p-8 lg:p-12 order-2 lg:order-1">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex items-center gap-2 w-fit"
            >
              <span
                className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
                style={{
                  color: 'hsl(var(--primary))',
                  background: 'hsl(var(--primary) / 0.12)',
                  border: '1px solid hsl(var(--primary) / 0.25)',
                }}
              >
                <Smartphone size={10} />
                Mobile Applications
              </span>
              <span className="text-[10px] text-neutral-500 font-semibold tracking-widest uppercase">
                4 Projects
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 120 }}
              className="font-anton uppercase leading-none text-white"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
            >
              iOS &amp; Android
              <br />
              <span className="text-gradient">Products</span>
            </motion.h3>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: 'rgba(255,255,255,0.48)' }}
            >
              Real-time GPS courier apps, voice-first AI inspection tools, subscription
              commerce platforms, and IoT vehicle trackers — all built with React Native.
            </motion.p>

            {/* Feature chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.26 }}
              className="flex flex-wrap gap-2"
            >
              {TECH_FEATURES.map(({ icon: Icon, label }, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.28 + i * 0.06, type: 'spring', stiffness: 200 }}
                  className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
                  style={{
                    color: 'rgba(255,255,255,0.55)',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Icon size={10} />
                  {label}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="flex items-center gap-2 mt-1"
              style={{ color: 'hsl(var(--primary))' }}
            >
              <span className="text-sm font-semibold tracking-wide">
                Explore Showcase
              </span>
              <motion.div
                animate={isHovered ? { x: 3, y: -3 } : { x: 0, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <ArrowUpRight size={16} />
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Phone trio */}
          <div
            className="relative order-1 lg:order-2"
            style={{
              perspective: '1100px',
              minHeight: 300,
              overflow: 'visible',
            }}
          >
            {/* Radial glow behind phones */}
            <motion.div
              animate={isHovered ? { opacity: 0.7, scale: 1.1 } : { opacity: 0.3, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 260,
                height: 260,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'hsl(var(--primary) / 0.15)',
                filter: 'blur(60px)',
              }}
            />

            {screenshots.map((src, i) => (
              <MiniPhone
                key={i}
                screenshot={src}
                cfg={PHONE_CONFIGS[i]}
                isCardHovered={isHovered}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="relative z-10 flex items-center justify-between px-8 lg:px-12 py-3.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-5 text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            <span className="flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              iOS
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.341 8.393 20.32a1.79 1.79 0 0 1-2.521-.689 1.79 1.79 0 0 1-.244-.867v-9.53a1.79 1.79 0 0 1 1.79-1.79 1.79 1.79 0 0 1 .896.244l9.13 4.979a1.79 1.79 0 0 1 .658 2.445 1.79 1.79 0 0 1-.58.23z"/>
              </svg>
              Android
            </span>
            <span>React Native</span>
          </div>

          <motion.span
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0.45, x: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="text-[11px] font-semibold tracking-widest uppercase"
            style={{ color: 'hsl(var(--primary))' }}
          >
            View All →
          </motion.span>
        </div>
      </motion.div>
    </TransitionLink>
  );
}
