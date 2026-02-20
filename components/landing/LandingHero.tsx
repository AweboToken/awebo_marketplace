'use client';

import Link from 'next/link';
import { useRef, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import HeroRevealWaveVideo from './HeroRevealWaveVideo';

export default function LandingHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mouseState, setMouseState] = useState<{
    in: boolean;
    x: number;
    y: number;
  }>({ in: false, x: 0.5, y: 0.5 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMouseState((s) => ({ ...s, x, y }));
    },
    []
  );
  const onMouseEnter = useCallback(() => {
    setMouseState((s) => ({ ...s, in: true }));
  }, []);
  const onMouseLeave = useCallback(() => {
    setMouseState((s) => ({ ...s, in: false }));
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Hero"
      className="relative w-full min-h-[85vh] flex flex-col justify-center overflow-hidden bg-gray-900 pt-24 pb-16 px-4 sm:px-6 lg:px-8"
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Background video with reveal wave effect (tracked over whole hero) */}
      <HeroRevealWaveVideo
        isMouseInCanvas={mouseState.in}
        mouseX={mouseState.x}
        mouseY={mouseState.y}
      />
      {/* Overlay for text readability */}
      <div
        className="absolute inset-0 bg-black/50 pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex flex-col items-start text-left space-y-6 max-w-2xl">
          {/* Live now pill */}
          <div className="inline-flex items-center rounded-full bg-green-500 px-4 py-1.5">
            <span className="text-black text-xs font-semibold uppercase tracking-wide">
              Live now: Genesis Creator Drop
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
            Launch Your
            <br />
            <span className="text-white">Brand.</span>
            <br />
            <span className="text-air-force-blue">Tokenize Your</span>
            <br />
            <span className="text-white">Culture.</span>
          </h1>

          <p className="text-gray-200 text-lg max-w-xl">
            The premium launchpad bridging physical streetwear with digital
            ownership. Create, drop, and scale your brand across worlds.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/launch"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-air-force-blue text-white font-semibold px-6 py-3 hover:bg-air-force-blue/90 transition-colors"
            >
              Launch Brand
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="#ecosystem"
              className="inline-flex items-center justify-center rounded-lg border-2 border-white text-white font-semibold px-6 py-3 hover:bg-white/10 transition-colors"
            >
              View Ecosystem
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
