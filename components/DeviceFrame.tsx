'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface DeviceFrameProps {
  screenshotUrl: string;
  altText?: string;
  className?: string;
  active?: boolean;
}

export default function DeviceFrame({
  screenshotUrl,
  altText = 'App Screenshot',
  className,
  active = false,
}: DeviceFrameProps) {
  return (
    <div
      className={cn(
        'relative mx-auto w-full select-none transition-shadow duration-500',
        'aspect-[9/19.5] w-[270px] xs:w-[290px] md:w-[300px]', // standard iPhone aspect ratio
        className
      )}
    >
      {/* 3D Metal Edge Frame / Outer Bezel */}
      <div
        className={cn(
          'absolute inset-0 rounded-[52px] p-[2.5px] bg-gradient-to-b transition-colors duration-500',
          active
            ? 'from-neutral-700 via-neutral-800 to-neutral-600 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
            : 'from-neutral-800 via-neutral-900 to-neutral-800 shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)]'
        )}
      >
        {/* Inner Black Bezel */}
        <div className="w-full h-full rounded-[50px] p-[9px] bg-black relative flex flex-col justify-between">
          
          {/* Speaker Ear Piece Grill */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-neutral-950 rounded-full z-40 border border-neutral-900/50" />

          {/* Screen Container */}
          <div className="relative w-full h-full rounded-[41px] overflow-hidden bg-neutral-950 flex-1 select-none">
            
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[26px] bg-black rounded-full z-40 flex items-center justify-end pr-2.5 shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]">
              {/* Subtle camera lens reflection indicator */}
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900/80 mr-1.5 border border-neutral-800/30 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-indigo-950/70" />
              </div>
              <div className="w-1 h-1 rounded-full bg-neutral-950" />
            </div>

            {/* Screen Screenshot Image */}
            <div className="absolute inset-0 w-full h-full select-none pointer-events-none">
              <Image
                src={screenshotUrl}
                alt={altText}
                fill
                priority={active}
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 290px, 300px"
                className="object-cover object-top pointer-events-none"
              />
            </div>

            {/* Glass Glare reflection overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.08] pointer-events-none z-30" />
            <div className="absolute top-0 -left-[50%] w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent rotate-12 -translate-y-[20%] pointer-events-none z-30" />
            
            {/* Inner shadow overlay for screen depth */}
            <div className="absolute inset-0 rounded-[41px] shadow-[inset_0_0_8px_rgba(0,0,0,0.6)] pointer-events-none z-30" />
          </div>
        </div>
      </div>
      
      {/* Phone side buttons */}
      {/* Left side volume buttons */}
      <div className="absolute top-[100px] -left-[2px] w-[3px] h-[35px] bg-neutral-800 rounded-l-md border-r border-neutral-900 z-10" />
      <div className="absolute top-[145px] -left-[2px] w-[3px] h-[35px] bg-neutral-800 rounded-l-md border-r border-neutral-900 z-10" />
      {/* Right side power button */}
      <div className="absolute top-[120px] -right-[2px] w-[3px] h-[55px] bg-neutral-800 rounded-r-md border-l border-neutral-900 z-10" />
    </div>
  );
}
