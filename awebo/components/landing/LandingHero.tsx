'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import LaunchBrandLogin from '@/components/LaunchBrandLogin';

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=1600&q=80';

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

function pickHeroImage(slides?: Array<HeroSlide> | null) {
  const firstImage = slides?.find(
    (s) => (s.mediaType ?? '') !== 'video' && (s.url?.trim() ?? '').length > 0
  );
  return firstImage?.url?.trim() || DEFAULT_HERO_IMAGE;
}

export default function LandingHero({ badge, headline, subtext, slides }: LandingHeroProps) {
  const heroImage = pickHeroImage(slides);

  return (
    <>
      <section
        aria-label="Hero"
        className="w-full pt-24 pb-8 px-4 sm:px-6 lg:px-8"
      >
        <div
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[20px] bg-gray-900 min-h-[480px] md:min-h-[520px] lg:min-h-[560px]"
        >
          <img
            src={heroImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/55" aria-hidden />

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
