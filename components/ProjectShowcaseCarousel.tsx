'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  PanInfo,
} from 'framer-motion';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Smartphone,
  Monitor,
  ExternalLink,
} from 'lucide-react';
import { SHOWCASE_PROJECTS, ShowcaseProject } from '@/lib/showcaseData';
import TransitionLink from './TransitionLink';
import { cn } from '@/lib/utils';

// ─── Variants ─────────────────────────────────────────────────────────────────

const contentVariants = {
  enter: (dir: number) => ({
    x: dir * 48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 320, damping: 32, mass: 0.8 },
  },
  exit: (dir: number) => ({
    x: dir * -48,
    opacity: 0,
    transition: { duration: 0.18, ease: 'easeIn' },
  }),
};

const previewVariants = {
  enter: { opacity: 0, scale: 0.93 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 28, delay: 0.06 },
  },
  exit: {
    opacity: 0,
    scale: 0.93,
    transition: { duration: 0.16, ease: 'easeIn' },
  },
};

// ─── Phone mockup ──────────────────────────────────────────────────────────────

interface PhoneCfg {
  offsetX: number;
  rotateY: number;
  rotateX: number;
  scale: number;
  z: number;
  opacity: number;
}

const PHONE_CFGS: PhoneCfg[] = [
  { offsetX: -92, rotateY: -20, rotateX:  5, scale: 0.82, z: -28, opacity: 0.6 },
  { offsetX:   0, rotateY:   0, rotateX:  0, scale: 1.00, z:   0, opacity: 1.0 },
  { offsetX:  92, rotateY:  20, rotateX: -5, scale: 0.82, z: -28, opacity: 0.6 },
];

function PhoneFrame({ src, cfg }: { src: string; cfg: PhoneCfg }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -54,
        marginTop: -114,
        transform: `translateX(${cfg.offsetX}px) rotateY(${cfg.rotateY}deg) rotateX(${cfg.rotateX}deg) scale(${cfg.scale})`,
        opacity: cfg.opacity,
        zIndex: cfg.z === 0 ? 2 : 1,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        style={{
          width: 108,
          height: 228,
          borderRadius: 26,
          background: 'linear-gradient(160deg,#1d1d2e,#0a0a12)',
          border: '1.5px solid rgba(255,255,255,0.07)',
          boxShadow:
            '0 32px 64px rgba(0,0,0,0.65),0 6px 18px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.09)',
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
            width: 52,
            height: 13,
            background: '#000',
            borderRadius: 9,
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
            src={src}
            alt="App screenshot"
            fill
            className="object-cover object-top"
            sizes="108px"
            loading="lazy"
          />
        </div>
        {/* Glass sheen */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 26,
            background: 'linear-gradient(135deg,rgba(255,255,255,0.055) 0%,transparent 55%)',
            pointerEvents: 'none',
          }}
        />
        {/* Side buttons */}
        {[50, 78].map((top) => (
          <div
            key={top}
            style={{
              position: 'absolute',
              left: -2.5,
              top,
              width: 3,
              height: 22,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '2px 0 0 2px',
            }}
          />
        ))}
        <div
          style={{
            position: 'absolute',
            right: -2.5,
            top: 60,
            width: 3,
            height: 30,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '0 2px 2px 0',
          }}
        />
      </div>
    </div>
  );
}

function MobilePreview({ project }: { project: ShowcaseProject }) {
  const screens = (project.screenshots ?? []).slice(0, 3);
  return (
    <div
      className="relative w-full h-full"
      style={{ perspective: '1100px', minHeight: 280 }}
    >
      {/* Ambient glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 240,
          height: 240,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          background: project.glowColor,
          filter: 'blur(55px)',
        }}
      />
      {screens.map((src, i) => (
        <PhoneFrame key={src + i} src={src} cfg={PHONE_CFGS[i]} />
      ))}
    </div>
  );
}

// ─── Browser / web preview ─────────────────────────────────────────────────────

function WebPreview({ project }: { project: ShowcaseProject }) {
  const [mainImg] = project.images ?? [];
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 260 }}>
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: project.glowColor,
          filter: 'blur(70px)',
          transform: 'scale(0.8)',
        }}
      />

      {/* Browser chrome */}
      <div
        className="relative w-full max-w-[420px]"
        style={{
          borderRadius: 12,
          background: 'linear-gradient(160deg,#1e1e28,#0d0d16)',
          border: '1.5px solid rgba(255,255,255,0.07)',
          boxShadow: '0 28px 56px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Titlebar */}
        <div
          className="flex items-center gap-2 px-4"
          style={{
            height: 36,
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Traffic lights */}
          {['#FF5F57','#FFBD2E','#27C940'].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.85 }} />
          ))}
          {/* URL bar */}
          <div
            className="flex-1 mx-2 flex items-center px-2.5 text-[9px] text-neutral-500 tracking-wide"
            style={{
              height: 20,
              borderRadius: 4,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            {project.liveUrl
              ? project.liveUrl.replace(/^https?:\/\//, '')
              : project.title.toLowerCase().replace(/\s+/g, '-') + '.com'}
          </div>
        </div>

        {/* Screenshot */}
        <div className="relative w-full" style={{ aspectRatio: '16/10', background: '#0a0a10' }}>
          {mainImg ? (
            <Image
              src={mainImg}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="420px"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Monitor size={40} className="text-neutral-700" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Card content (left column) ────────────────────────────────────────────────

function CardContent({
  project,
  dir,
}: {
  project: ShowcaseProject;
  dir: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={project.id + '-content'}
      custom={reduce ? 0 : dir}
      variants={contentVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col justify-center gap-5 p-8 lg:p-12 order-2 lg:order-1"
    >
      {/* Type badge */}
      <div className="flex items-center gap-2">
        <span
          className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
          style={{
            color: 'hsl(var(--primary))',
            background: 'hsl(var(--primary)/0.12)',
            border: '1px solid hsl(var(--primary)/0.25)',
          }}
        >
          {project.type === 'mobile' ? (
            <Smartphone size={10} />
          ) : (
            <Monitor size={10} />
          )}
          {project.type === 'mobile' ? 'Mobile App' : 'Web Project'}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-anton uppercase leading-none text-white"
        style={{ fontSize: 'clamp(1.75rem,3.5vw,2.75rem)' }}
      >
        {project.title}
      </h3>

      {/* Pitch */}
      <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(255,255,255,0.48)' }}>
        {project.shortPitch}
      </p>

      {/* Features */}
      <ul className="space-y-1.5">
        {project.features.slice(0, 4).map((feat) => (
          <li
            key={feat}
            className="flex items-start gap-2 text-[12px] leading-snug"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <span
              className="mt-[3px] shrink-0 rounded-full"
              style={{
                width: 5,
                height: 5,
                background: 'hsl(var(--primary))',
                opacity: 0.8,
              }}
            />
            {feat}
          </li>
        ))}
      </ul>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-1.5">
        {project.techStack.slice(0, 5).map((tech) => (
          <span
            key={tech}
            className="text-[10px] font-medium px-2.5 py-1 rounded-full"
            style={{
              color: 'rgba(255,255,255,0.5)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <TransitionLink
          href={project.href}
          className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          style={{
            background: 'hsl(var(--primary)/0.15)',
            border: '1px solid hsl(var(--primary)/0.3)',
            color: 'hsl(var(--primary))',
          }}
        >
          View Project
          <ArrowUpRight size={13} />
        </TransitionLink>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            onClick={(e) => e.stopPropagation()}
          >
            Live site
            <ExternalLink size={11} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Card visual (right column) ────────────────────────────────────────────────

function CardVisual({ project }: { project: ShowcaseProject }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={project.id + '-visual'}
      variants={reduce ? undefined : previewVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="relative order-1 lg:order-2 flex items-center justify-center overflow-visible"
      style={{ minHeight: 300 }}
    >
      {project.type === 'mobile' ? (
        <MobilePreview project={project} />
      ) : (
        <WebPreview project={project} />
      )}
    </motion.div>
  );
}

// ─── Nav arrow button ─────────────────────────────────────────────────────────

function NavArrow({
  direction,
  enabled,
  onClick,
  label,
}: {
  direction: 'left' | 'right';
  enabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={!enabled}
      animate={{ opacity: enabled ? 1 : 0.22 }}
      whileHover={enabled ? { scale: 1.12 } : {}}
      whileTap={enabled ? { scale: 0.88 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 z-20',
        'flex items-center justify-center w-10 h-10 rounded-full',
        'disabled:pointer-events-none',
      )}
      style={{
        [direction]: '14px',
        background: 'rgba(0,0,0,0.45)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      {direction === 'left' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
    </motion.button>
  );
}

// ─── Main carousel ─────────────────────────────────────────────────────────────

export default function ProjectShowcaseCarousel() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);

  const total = SHOWCASE_PROJECTS.length;
  const project = SHOWCASE_PROJECTS[index];

  const navigate = useCallback(
    (step: 1 | -1) => {
      const next = index + step;
      if (next < 0 || next >= total) return;
      setDir(step);
      setIndex(next);
    },
    [index, total],
  );

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  // Drag / swipe
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -50) navigate(1);
      else if (info.offset.x > 50) navigate(-1);
    },
    [navigate],
  );

  return (
    <div className="w-full" aria-label="Projects showcase carousel">
      {/* ── Card shell ── */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        className="relative w-full overflow-hidden"
        style={{
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.06)',
          background: '#0B0C0E',
          userSelect: 'none',
        }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right,rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.022) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Animated ambient glow (changes per project) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={project.id + '-glow'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ borderRadius: 20 }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 420,
                height: 420,
                top: '10%',
                left: '5%',
                background: project.glowColor,
                filter: 'blur(100px)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 280,
                height: 280,
                bottom: '0%',
                right: '5%',
                background: project.glowColor,
                filter: 'blur(80px)',
                opacity: 0.6,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Content grid */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[400px] lg:min-h-[440px]">
          {/* Left column — text (animates on navigation) */}
          <AnimatePresence mode="wait" custom={dir}>
            <CardContent key={project.id} project={project} dir={dir} />
          </AnimatePresence>

          {/* Right column — device preview (cross-fades) */}
          <AnimatePresence mode="wait">
            <CardVisual key={project.id} project={project} />
          </AnimatePresence>
        </div>

        {/* Bottom bar */}
        <div
          className="relative z-10 flex items-center justify-between px-8 lg:px-12 py-3.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Index */}
          <span
            className="text-[11px] font-semibold tabular-nums tracking-widest"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>

          {/* Type label */}
          <span
            className="text-[10px] font-semibold tracking-[0.18em] uppercase"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            {project.type === 'mobile' ? 'iOS · Android' : 'Web · Next.js'}
          </span>
        </div>

        {/* ── Nav arrows on card edges ── */}
        <NavArrow
          direction="left"
          enabled={index > 0}
          onClick={() => navigate(-1)}
          label="Previous project"
        />
        <NavArrow
          direction="right"
          enabled={index < total - 1}
          onClick={() => navigate(1)}
          label="Next project"
        />
      </motion.div>

      {/* ── Dot progress ── */}
      <div
        className="flex items-center justify-center gap-2 mt-5"
        role="tablist"
        aria-label="Project slides"
      >
        {SHOWCASE_PROJECTS.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={index === i}
            aria-label={`Go to ${p.title}`}
            onClick={() => {
              setDir(i > index ? 1 : -1);
              setIndex(i);
            }}
            className="flex items-center justify-center h-4 focus-visible:outline-none"
          >
            <motion.span
              animate={{ width: index === i ? 22 : 6, opacity: index === i ? 1 : 0.28 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className="block h-[3px] rounded-full"
              style={{ background: 'hsl(var(--primary))' }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
