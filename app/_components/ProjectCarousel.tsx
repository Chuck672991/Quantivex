'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  useReducedMotion,
  PanInfo,
} from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PROJECTS as ALL_PROJECTS } from '@/lib/data';
import { IProject } from '@/types';
import TransitionLink from '@/components/TransitionLink';
import { cn } from '@/lib/utils';

// ─── Data helpers ─────────────────────────────────────────────────────────────

type Category = 'All' | 'Web' | 'Mobile';

const VISIBLE = ALL_PROJECTS.filter((p) => !p.hidden);

function resolveCategory(project: IProject): Category[] {
  const stack = project.techStack.join(' ').toLowerCase();
  const cats: Category[] = [];
  if (stack.includes('react native') || stack.includes('ios') || stack.includes('android')) {
    cats.push('Mobile');
  }
  // A project can be both (e.g. BreakTime has React Native + React.js)
  if (
    stack.includes('next') ||
    stack.includes('react.js') ||
    stack.includes('three') ||
    stack.includes('tailwind') ||
    stack.includes('framer')
  ) {
    cats.push('Web');
  }
  return cats.length > 0 ? cats : ['Web'];
}

// ─── Project card ─────────────────────────────────────────────────────────────

function ProjectCard({ project }: { project: IProject }) {
  const [hovered, setHovered] = useState(false);

  return (
    <TransitionLink
      href={`/projects/${project.slug}`}
      className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
      aria-label={`View ${project.title} project`}
    >
      <motion.article
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="relative h-full flex flex-col border border-border bg-card overflow-hidden"
        style={{ borderRadius: 12 }}
      >
        {/* ── Thumbnail ── */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
          <motion.div
            animate={{ scale: hovered ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            className="absolute inset-0"
          >
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 28vw"
              loading="lazy"
            />
          </motion.div>

          {/* Hover scrim */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent pointer-events-none"
          />

          {/* Year pill */}
          <span className="absolute top-3 right-3 text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded-full bg-background/85 backdrop-blur-sm text-foreground border border-border/60 tabular-nums">
            {project.year}
          </span>

          {/* Category badge (mobile / web) */}
          {resolveCategory(project).map((cat) => (
            <span
              key={cat}
              className="absolute top-3 left-3 text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded-full backdrop-blur-sm border"
              style={{
                background: cat === 'Mobile' ? 'hsl(var(--primary)/0.15)' : 'rgba(99,102,241,0.15)',
                borderColor: cat === 'Mobile' ? 'hsl(var(--primary)/0.35)' : 'rgba(99,102,241,0.35)',
                color: cat === 'Mobile' ? 'hsl(var(--primary))' : 'rgb(129,140,248)',
              }}
            >
              {cat}
            </span>
          ))}

          {/* Live-link icon — reveals on hover */}
          {project.liveUrl && (
            <motion.div
              animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[10px] font-semibold text-white bg-black/40 backdrop-blur-sm border border-white/15 px-2.5 py-1 rounded-full"
            >
              <span>Live</span>
              <ArrowRight size={9} />
            </motion.div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          <h3 className="font-anton uppercase text-xl leading-tight tracking-wide line-clamp-2">
            {project.title}
          </h3>

          {/* Tech stack pills */}
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                style={{
                  background: 'hsl(var(--primary)/0.08)',
                  borderColor: 'hsl(var(--primary)/0.2)',
                  color: 'hsl(var(--primary))',
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          {/* CTA arrow */}
          <div className="mt-auto pt-1 flex items-center gap-1.5 text-xs font-semibold">
            <span className={cn('transition-colors duration-200', hovered ? 'text-primary' : 'text-muted-foreground')}>
              View Project
            </span>
            <motion.div
              animate={hovered ? { x: 3 } : { x: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className={cn('transition-colors duration-200', hovered ? 'text-primary' : 'text-muted-foreground')}
            >
              <ArrowRight size={12} />
            </motion.div>
          </div>
        </div>

        {/* Hover border glow */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-[12px] pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 0 1px hsl(var(--primary)/0.35)',
          }}
        />
      </motion.article>
    </TransitionLink>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

const CARD_GAP = 18; // px gap between cards
const CATEGORIES: Category[] = ['All', 'Web', 'Mobile'];

export default function ProjectCarousel() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);
  const [cardWidth, setCardWidth] = useState(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // ── Derived data ──
  const filtered = VISIBLE.filter((p) =>
    activeCategory === 'All' ? true : resolveCategory(p).includes(activeCategory),
  );
  const maxIndex = Math.max(0, filtered.length - itemsPerView);

  // ── Responsive items per view ──
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setItemsPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Card width from container ──
  useEffect(() => {
    const calc = () => {
      if (!viewportRef.current) return;
      const total = viewportRef.current.offsetWidth;
      const gaps = CARD_GAP * (itemsPerView - 1);
      setCardWidth((total - gaps) / itemsPerView);
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [itemsPerView]);

  // ── Reset on filter / resize ──
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory, itemsPerView]);

  // ── Navigation ──
  const goTo = useCallback(
    (idx: number) => setCurrentIndex(Math.max(0, Math.min(idx, maxIndex))),
    [maxIndex],
  );

  const prev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const next = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  // ── Drag / swipe ──
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const THRESHOLD = 40;
      if (info.offset.x < -THRESHOLD) next();
      else if (info.offset.x > THRESHOLD) prev();
    },
    [next, prev],
  );

  // ── Translate X ──
  const trackX = cardWidth > 0 ? -(currentIndex * (cardWidth + CARD_GAP)) : 0;

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;
  const dotCount = maxIndex + 1;

  return (
    <div>
      {/* ── Section sub-heading ── */}
      <div className="flex items-center gap-3 mb-7">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground px-1">
          Other Projects
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* ── Controls row ── */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        {/* Category tabs */}
        <div className="flex items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'text-[11px] sm:text-xs font-semibold tracking-wide px-3.5 py-1.5 border transition-colors',
                activeCategory === cat
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Counter + nav arrows */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {Math.min(currentIndex + itemsPerView, filtered.length)}&nbsp;/&nbsp;{filtered.length}
          </span>

          <div className="flex items-center gap-1.5">
            <NavArrow
              direction="left"
              enabled={canPrev}
              onClick={prev}
              aria-label="Previous projects"
            />
            <NavArrow
              direction="right"
              enabled={canNext}
              onClick={next}
              aria-label="Next projects"
            />
          </div>
        </div>
      </div>

      {/* ── Carousel track ── */}
      <div className="relative">
        {/* Edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

        {/* Viewport */}
        <div ref={viewportRef} className="overflow-hidden">
          {filtered.length === 0 ? (
            <div className="border border-border p-10 text-muted-foreground text-sm text-center rounded-lg">
              No projects in this category yet.
            </div>
          ) : (
            <motion.div
              drag={filtered.length > itemsPerView ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.06}
              onDragEnd={handleDragEnd}
              animate={{ x: trackX }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 320, damping: 36, mass: 0.9 }
              }
              className="flex"
              style={{ gap: CARD_GAP, cursor: filtered.length > itemsPerView ? 'grab' : 'default' }}
              whileDrag={{ cursor: 'grabbing' }}
            >
              {filtered.map((project) => (
                <div
                  key={project.slug}
                  style={{ width: cardWidth, minWidth: cardWidth, flexShrink: 0 }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Dot progress ── */}
      {dotCount > 1 && (
        <div
          className="flex items-center justify-center gap-2 mt-7"
          role="tablist"
          aria-label="Carousel slides"
        >
          {Array.from({ length: dotCount }).map((_, i) => {
            const active = currentIndex === i;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="flex items-center justify-center h-4 focus-visible:outline-none"
              >
                <motion.span
                  animate={{ width: active ? 22 : 7, opacity: active ? 1 : 0.3 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  className="block h-[3px] rounded-full bg-primary"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── NavArrow ─────────────────────────────────────────────────────────────────

function NavArrow({
  direction,
  enabled,
  onClick,
  'aria-label': ariaLabel,
}: {
  direction: 'left' | 'right';
  enabled: boolean;
  onClick: () => void;
  'aria-label': string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!enabled}
      animate={{ opacity: enabled ? 1 : 0.28 }}
      whileHover={enabled ? { scale: 1.08 } : {}}
      whileTap={enabled ? { scale: 0.9 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      aria-label={ariaLabel}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-border text-foreground bg-background hover:bg-primary/10 hover:border-primary/50 transition-colors disabled:pointer-events-none"
    >
      {direction === 'left' ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
    </motion.button>
  );
}
