"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { InkBackground } from './InkBackground'
import { LetterReveal } from './LetterReveal'
import { FadeIn } from './FadeIn'
import Link from 'next/link'

const SLIDE_DURATION = 12000 

const slides = [
  {
    image: '/hero/brand_sanctum.png',
    tagline: 'Elite ghostwriting and editorial strategy for the world’s most innovative visionaries.',
    title: "Mastering the Narrative"
  },
  {
    image: '/hero/brand_blueprint.png',
    tagline: 'We construct narrative foundations that stand the test of time.',
    title: "Architectural Stories"
  },
  {
    image: '/hero/brand_visionary.png',
    tagline: 'Elevating the human experience through the art of strategic storytelling.',
    title: "Your Legacy, Defined"
  }
]

export interface HeroSlideshowProps {
  settings?: any
}

export function HeroSlideshow({ settings }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0)
  
  // Dynamic Content Overrides
  const activeSlides = [
    {
      ...slides[0],
      title: settings?.hero_slide_1_title || slides[0].title,
      tagline: settings?.hero_slide_1_tagline || slides[0].tagline
    },
    {
      ...slides[1],
      title: settings?.hero_slide_2_title || slides[1].title,
      tagline: settings?.hero_slide_2_tagline || slides[1].tagline
    },
    {
      ...slides[2],
      title: settings?.hero_slide_3_title || slides[2].title,
      tagline: settings?.hero_slide_3_tagline || slides[2].tagline
    }
  ]
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const startTimer = useCallback(() => {
    stopTimer()
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % activeSlides.length)
    }, SLIDE_DURATION)
  }, [stopTimer])

  useEffect(() => {
    startTimer()
    return () => stopTimer()
  }, [startTimer, stopTimer])

  const handleManualSlide = (index: number) => {
    setCurrent(index)
    startTimer() 
  }

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Dynamic Backgrounds - CLEAN ARTWORK FIXED */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={activeSlides[current].image}
            alt="Hero Background"
            fill
            className="object-cover opacity-100 transition-all duration-[2500ms]"
            priority
          />
          {/* Light Cinematic Grad to keep UI readable */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </motion.div>
      </AnimatePresence>

      <InkBackground />
      
      <div className="relative z-20 text-center px-6 w-full max-w-5xl flex flex-col items-center justify-center h-full pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="flex flex-col items-center gap-8"
          >
            <LetterReveal 
              text={activeSlides[current].title}
              className="text-5xl md:text-8xl lg:text-9xl text-white drop-shadow-2xl leading-[1.1] font-serif" 
              delay={0.2}
            />
            
            <p className="text-white/90 text-lg md:text-2xl lg:text-3xl font-light italic tracking-widest leading-relaxed max-w-3xl px-4 text-shadow-lg">
              {activeSlides[current].tagline}
            </p>
          </motion.div>
        </AnimatePresence>
        
        <FadeIn delay={2}>
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-center justify-center pt-8 md:pt-12">
            <Link 
              href="/shelf" 
              className="w-[220px] md:w-auto px-12 md:px-16 py-5 md:py-6 bg-white text-slate-900 font-bold hover:bg-slate-50 transition-all active:scale-95 tracking-[0.3em] uppercase text-[10px] md:text-[11px]"
              style={{ borderRadius: '1px' }}
            >
              The Library
            </Link>
            <Link 
              href="/blog" 
              className="w-[220px] md:w-auto px-12 md:px-16 py-5 md:py-6 bg-transparent border-2 border-white/50 text-white font-bold hover:bg-white/10 transition-all active:scale-95 tracking-[0.3em] uppercase text-[10px] md:text-[11px]"
              style={{ borderRadius: '1px' }}
            >
              The Journal
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* Manual Slide Indicators (FIXED OVERLAP & CLICKABLE) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-4 md:gap-6 px-10 py-2 pointer-events-auto">
        {activeSlides.map((_, i) => (
          <button 
            key={i}
            onClick={() => handleManualSlide(i)}
            className="group py-2 flex flex-col items-center"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div 
              className={`h-[1px] md:h-0.5 transition-all duration-1000 origin-left cursor-pointer ${i === current ? 'w-12 md:w-20 bg-white' : 'w-4 md:w-8 bg-white/30 group-hover:bg-white/60'}`}
            />
            <span className={`block text-[8px] md:text-[10px] mt-1 font-serif transition-opacity duration-700 ${i === current ? 'opacity-100 text-white' : 'opacity-0'}`}>
              0{i + 1}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
