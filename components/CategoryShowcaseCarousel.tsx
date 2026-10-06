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
  Cpu,
} from 'lucide-react';
import { CATEGORIES, CategoryItem, CategoryType } from '@/lib/categoryData';
import TransitionLink from './TransitionLink';

// ─── Animation variants ───────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 52 : -52,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 310, damping: 32 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -52 : 52,
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' },
  }),
};

const fadeScale = {
  enter: { opacity: 0, scale: 0.94 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 28, delay: 0.07 },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.13 },
  },
};

// ─── Phone frame ──────────────────────────────────────────────────────────────

const PHONE_CFGS = [
  { offsetX: -92, ry: -20, rx:  5, scale: 0.81, opacity: 0.60 },
  { offsetX:   0, ry:   0, rx:  0, scale: 1.00, opacity: 1.00 },
  { offsetX:  92, ry:  20, rx: -5, scale: 0.81, opacity: 0.60 },
] as const;

function PhoneFrame({
  src,
  cfg,
}: {
  src: string;
  cfg: (typeof PHONE_CFGS)[number];
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        marginLeft: -54,
        marginTop: -114,
        transform: `translateX(${cfg.offsetX}px) rotateY(${cfg.ry}deg) rotateX(${cfg.rx}deg) scale(${cfg.scale})`,
        opacity: cfg.opacity,
        zIndex: cfg.offsetX === 0 ? 2 : 1,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Shell */}
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
            background:
              'linear-gradient(135deg,rgba(255,255,255,0.055) 0%,transparent 55%)',
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
    </div>
  );
}

// ─── Right-side visuals ───────────────────────────────────────────────────────

function PhoneVisual({ category }: { category: CategoryItem }) {
  const screens = (category.screenshots ?? []).slice(0, 3);
  return (
    <div
      className="relative w-full h-full"
      style={{ perspective: '1100px', minHeight: 280 }}
    >
      {/* Per-category radial glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 240,
          height: 240,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          background: category.glowColor,
          filter: 'blur(55px)',
        }}
      />
      {screens.map((src, i) => (
        <PhoneFrame key={src + i} src={src} cfg={PHONE_CFGS[i]} />
      ))}
    </div>
  );
}

function BrowserVisual({ category }: { category: CategoryItem }) {
  const img = category.previewImage;
  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ minHeight: 260 }}
    >
      {/* Glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: '18%',
          background: category.glowColor,
          filter: 'blur(72px)',
          borderRadius: '50%',
        }}
      />
      {/* Browser chrome */}
      <div
        className="relative w-full max-w-[400px]"
        style={{
          borderRadius: 12,
          background: 'linear-gradient(160deg,#1e1e28,#0d0d16)',
          border: '1.5px solid rgba(255,255,255,0.07)',
          boxShadow:
            '0 28px 56px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.08)',
          overflow: 'hidden',
        }}
      >
        {/* Titlebar */}
        <div
          className="flex items-center gap-1.5 px-3"
          style={{
            height: 34,
            background: 'rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {(['#FF5F57', '#FFBD2E', '#27C940'] as const).map((c) => (
            <div
              key={c}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: c,
                opacity: 0.85,
              }}
            />
          ))}
          <div
            className="flex-1 mx-2 text-[9px] text-neutral-600 px-2 truncate"
            style={{
              height: 18,
              lineHeight: '18px',
              borderRadius: 4,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            cosmeticchemist.com
          </div>
        </div>
        {/* Screenshot */}
        <div
          className="relative w-full"
          style={{ aspectRatio: '16/10', background: '#0a0a10' }}
        >
          {img ? (
            <Image
              src={img}
              alt={category.title}
              fill
              className="object-cover object-top"
              sizes="400px"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Monitor size={36} className="text-neutral-700" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Category type icon ───────────────────────────────────────────────────────

function TypeIcon({ type }: { type: CategoryType }) {
  if (type === 'mobile') return <Smartphone size={10} />;
  if (type === 'ai') return <Cpu size={10} />;
  return <Monitor size={10} />;
}

// ─── Left column — text content ───────────────────────────────────────────────

function CardContent({
  category,
  dir,
}: {
  category: CategoryItem;
  dir: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={`content-${category.id}`}
      custom={reduce ? 0 : dir}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      className="flex flex-col justify-center gap-5 p-8 lg:p-12 order-2 lg:order-1"
    >
      {/* Badge row */}
      <div className="flex items-center gap-2">
        <span
          className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
          style={{
            color: 'hsl(var(--primary))',
            background: 'hsl(var(--primary)/0.12)',
            border: '1px solid hsl(var(--primary)/0.25)',
          }}
        >
          <TypeIcon type={category.type} />
          {category.type === 'mobile'
            ? 'Mobile'
            : category.type === 'ai'
              ? 'AI'
              : 'Web'}
        </span>
        <span
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          {category.projectCount}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-anton uppercase leading-none text-white"
        style={{ fontSize: 'clamp(2rem,4vw,3.25rem)' }}
      >
        {category.title}
      </h3>

      {/* Pitch */}
      <p
        className="text-sm leading-relaxed max-w-sm"
        style={{ color: 'rgba(255,255,255,0.45)' }}
      >
        {category.shortPitch}
      </p>

      {/* Highlights */}
      <ul className="space-y-1.5">
        {category.highlights.map((h) => (
          <li
            key={h}
            className="flex items-start gap-2 text-[12px] leading-snug"
            style={{ color: 'rgba(255,255,255,0.42)' }}
          >
            <span
              className="mt-[5px] shrink-0 rounded-full"
              style={{
                width: 4,
                height: 4,
                background: 'hsl(var(--primary))',
                opacity: 0.85,
              }}
            />
            {h}
          </li>
        ))}
      </ul>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-1.5">
        {category.techBadges.map((t) => (
          <span
            key={t}
            className="text-[10px] font-medium px-2.5 py-1 rounded-full"
            style={{
              color: 'rgba(255,255,255,0.48)',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* CTA */}
      <TransitionLink
        href={category.route}
        className="w-fit inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg"
        style={{
          background: 'hsl(var(--primary)/0.15)',
          border: '1px solid hsl(var(--primary)/0.3)',
          color: 'hsl(var(--primary))',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        Explore {category.title}
        <ArrowUpRight size={13} />
      </TransitionLink>
    </motion.div>
  );
}

// ─── Right column — visual ────────────────────────────────────────────────────

function CardVisual({ category }: { category: CategoryItem }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={`visual-${category.id}`}
      variants={reduce ? undefined : fadeScale}
      initial="enter"
      animate="center"
      exit="exit"
      className="relative order-1 lg:order-2 flex items-center justify-center overflow-visible"
      style={{ minHeight: 300 }}
    >
      {category.type === 'web' ? (
        <BrowserVisual category={category} />
      ) : (
        <PhoneVisual category={category} />
      )}
    </motion.div>
  );
}

// ─── Edge nav arrow ───────────────────────────────────────────────────────────

function NavArrow({
  side,
  enabled,
  onClick,
}: {
  side: 'left' | 'right';
  enabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={side === 'left' ? 'Previous category' : 'Next category'}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      disabled={!enabled}
      animate={{ opacity: enabled ? 1 : 0.18 }}
      whileHover={enabled ? { scale: 1.13 } : {}}
      whileTap={enabled ? { scale: 0.87 } : {}}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-10 h-10 rounded-full disabled:pointer-events-none"
      style={{
        [side]: 16,
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: '#fff',
        boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
      }}
    >
      {side === 'left' ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
    </motion.button>
  );
}

// ─── Main carousel ────────────────────────────────────────────────────────────

export default function CategoryShowcaseCarousel() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const total = CATEGORIES.length;

  const navigate = useCallback(
    (step: 1 | -1) => {
      const next = index + step;
      if (next < 0 || next >= total) return;
      setDir(step);
      setIndex(next);
    },
    [index, total],
  );

  // Keyboard left / right
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate]);

  // Drag / swipe threshold
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x < -50) navigate(1);
      else if (info.offset.x > 50) navigate(-1);
    },
    [navigate],
  );

  const category = CATEGORIES[index];

  return (
    <div className="w-full" aria-label="Project categories showcase">

      {/* ── Card shell ── */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.04}
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
        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right,rgba(255,255,255,0.022) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.022) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Per-category ambient glow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`glow-${category.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55 }}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ borderRadius: 20 }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 480,
                height: 480,
                top: '-15%',
                left: '3%',
                background: category.glowColor,
                filter: 'blur(110px)',
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: 300,
                height: 300,
                bottom: '-8%',
                right: '8%',
                background: category.glowColor,
                filter: 'blur(80px)',
                opacity: 0.5,
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Two-column content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[420px] lg:min-h-[460px]">

          {/* Left — text (direction-aware slide) */}
          <AnimatePresence mode="wait" custom={dir}>
            <CardContent key={category.id} category={category} dir={dir} />
          </AnimatePresence>

          {/* Right — visual (cross-fade) */}
          <AnimatePresence mode="wait">
            <CardVisual key={category.id} category={category} />
          </AnimatePresence>

        </div>

        {/* Bottom bar */}
        <div
          className="relative z-10 flex items-center justify-between px-8 lg:px-12 py-3.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span
            className="text-[11px] font-semibold tabular-nums tracking-widest"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            {String(index + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(total).padStart(2, '0')}
          </span>
          <span
            className="text-[10px] font-semibold tracking-[0.2em] uppercase"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            {category.type === 'mobile'
              ? 'iOS · Android'
              : category.type === 'ai'
                ? 'LLM · MCP · RAG'
                : 'React · Next.js'}
          </span>
        </div>

        {/* Edge nav arrows */}
        <NavArrow side="left"  enabled={index > 0}           onClick={() => navigate(-1)} />
        <NavArrow side="right" enabled={index < total - 1}   onClick={() => navigate(1)}  />

      </motion.div>

      {/* ── Progress dots ── */}
      <div
        className="flex items-center justify-center gap-2 mt-5"
        role="tablist"
        aria-label="Category slides"
      >
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={index === i}
            aria-label={`Go to ${cat.title}`}
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
