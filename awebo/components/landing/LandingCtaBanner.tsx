'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import LaunchBrandLogin from '@/components/LaunchBrandLogin';

const DEFAULT_CTA_BG = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&q=80';

export interface LandingCtaBannerProps {
  title?: string | null;
  description?: string | null;
  backgroundImageUrl?: string | null;
  primaryButtonText?: string | null;
  secondaryButtonText?: string | null;
  secondaryButtonLink?: string | null;
}

export default function LandingCtaBanner({
  title,
  description,
  backgroundImageUrl,
  primaryButtonText,
  secondaryButtonText,
  secondaryButtonLink,
}: LandingCtaBannerProps = {}) {
  const bgImage = backgroundImageUrl ?? DEFAULT_CTA_BG;
  const heading = title ?? 'Ready to Tokenize Your Brand?';
  const body = description ?? 'Join the next generation of culture-defining creators on AWEBO.';
  const primaryText = primaryButtonText ?? 'Launch Brand';
  const secondaryText = secondaryButtonText ?? 'View Ecosystem';
  const secondaryHref = secondaryButtonLink ?? '/ecosystem';

  return (
    <section
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      aria-label="Call to action"
    >
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl border border-gray-800 bg-card text-card-foreground shadow-xl'
        )}
      >
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 pointer-events-none cta-dither-overlay" aria-hidden />

        <div
          className="relative z-10 flex flex-col items-center justify-center gap-8 p-8 text-center md:p-12 lg:p-16"
        >
          <div className="flex flex-col items-center text-center text-white max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
              {heading}
            </h2>
            <p className="mt-4 text-lg text-neutral-200">
              {body}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <LaunchBrandLogin className="inline-flex h-12 items-center justify-center rounded-md bg-[#6e5dcb] px-6 font-semibold text-white hover:bg-[#5e4db8] transition-colors shrink-0">
              {primaryText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </LaunchBrandLogin>
            <Link
              href={secondaryHref}
              className="inline-flex h-12 items-center justify-center rounded-md border-2 border-white px-6 font-semibold text-white hover:bg-white/10 transition-colors shrink-0"
            >
              {secondaryText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
