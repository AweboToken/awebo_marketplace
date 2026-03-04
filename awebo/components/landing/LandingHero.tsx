'use client';

import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import LaunchBrandLogin from '@/components/LaunchBrandLogin';

const HERO_BG_VIDEO =
  'https://ik.imagekit.io/3bfeucft4/grok-video-04525375-d090-47c8-9fc9-6b58ab16d924%20(2).mp4';

const DEFAULT_CAROUSEL_SLIDES = [
  { id: 'video', type: 'video' as const, src: HERO_BG_VIDEO },
  { id: 'slide2', type: 'image' as const, src: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80' },
  { id: 'slide3', type: 'image' as const, src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80' },
];

export interface HeroSlide {
  mediaType?: string;
  url?: string;
  alt?: string;
}

export interface LandingHeroProps {
  badge?: string | null;
  headline?: string | null;
  subtext?: string | null;
  slides?: Array<HeroSlide> | null;
}

function wrap(index: number, length: number) {
  return ((index % length) + length) % length;
}

function buildSlides(slides?: Array<HeroSlide> | null) {
  if (!slides?.length) return DEFAULT_CAROUSEL_SLIDES;
  const built = slides.map((s, i) => ({
    id: `slide-${i}`,
    type: (s.mediaType === 'video' ? 'video' : 'image') as 'video' | 'image',
    src: s.url?.trim() || '',
  })).filter((s) => s.src);
  return built.length > 0 ? built : DEFAULT_CAROUSEL_SLIDES;
}

export default function LandingHero({ badge, headline, subtext, slides }: LandingHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const carouselSlides = buildSlides(slides);
  if (carouselSlides.length === 0) return null;

  const activeIndex = wrap(currentIndex, carouselSlides.length);
  const goNext = useCallback(() => {
    setCurrentIndex((i) => i + 1);
  }, []);
  const goPrev = useCallback(() => {
    setCurrentIndex((i) => i - 1);
  }, []);

  useEffect(() => {
    if (isHovering) return;
    const t = setInterval(goNext, 5000);
    return () => clearInterval(t);
  }, [isHovering, goNext]);

  return (
    <>
      <section
        aria-label="Hero"
        className="w-full pt-24 pb-8 px-4 sm:px-6 lg:px-8"
      >
        {/* Banner container: rounded-[20px], full width within max-w */}
        <div
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[20px] bg-gray-900 min-h-[480px] md:min-h-[520px] lg:min-h-[560px]"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Carousel background layer */}
          <div className="absolute inset-0">
            <AnimatePresence mode="wait" initial={false}>
              {carouselSlides.map(
                (slide, i) =>
                  i === activeIndex && (
                    <motion.div
                      key={slide.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      {slide.type === 'video' ? (
                        <video
                          src={slide.src}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={slide.src}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                      <div
                        className="absolute inset-0 bg-black/50"
                        aria-hidden
                      />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>

          {/* Carousel nav arrows */}
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30 transition-colors md:left-4"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm hover:bg-white/30 transition-colors md:right-4"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {carouselSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === activeIndex
                    ? 'w-6 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Content + CTAs inside banner */}
          <div className="relative z-10 flex min-h-[480px] md:min-h-[520px] lg:min-h-[560px] flex-col justify-center px-8 py-12 md:px-12 lg:px-16">
            <div className="max-w-2xl">
              {(badge ?? 'Live now: Genesis Creator Drop') && (
                <div className="inline-flex items-center rounded-full bg-green-500 px-4 py-1.5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-black">
                    {badge ?? 'Live now: Genesis Creator Drop'}
                  </span>
                </div>
              )}

              <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl whitespace-pre-line">
                {headline ?? 'Launch Your\nBrand.\nTokenize Your\nCulture.'}
              </h1>

              <p className="mt-4 max-w-xl text-lg text-gray-200">
                {subtext ?? 'The premium launchpad bridging physical streetwear with digital ownership. Create, drop, and scale your brand across worlds.'}
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <LaunchBrandLogin className="inline-flex items-center justify-center gap-2 rounded-lg bg-air-force-blue px-6 py-3 font-semibold text-white transition-colors hover:bg-air-force-blue/90">
                  Launch Brand
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </LaunchBrandLogin>
                <Link
                  href="#ecosystem"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  View Ecosystem
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
