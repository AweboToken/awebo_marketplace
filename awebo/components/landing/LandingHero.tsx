'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import LaunchBrandLogin from '@/components/LaunchBrandLogin';
import HeroHotspot from '@/components/landing/HeroHotspot';
import HeroOrbitScrub, {
  type HeroOrbitScrubHandle,
} from '@/components/landing/HeroOrbitScrub';
import {
  isOrbitCenterHotspotFrame,
  ORBIT_CENTER_FRAME,
  ORBIT_EXIT_END_FRAME,
  ORBIT_EXIT_START_FRAME,
  preloadHeroOrbitFrames,
} from '@/lib/hero-orbit-frames';
import ExitVaultEasterEgg from '@/components/landing/ExitVaultEasterEgg';
import SidestandOverlay, {
  preloadSidestandImage,
} from '@/components/landing/SidestandOverlay';
import { preloadCenterTableImage } from '@/components/landing/CenterTableScene';

/** Vault display focal point on orbit center frame (percent of hero). */
const HERO_ECOSYSTEM_HOTSPOT = { left: 62, top: 42 };
/** Center table + — horizontally centered, 150px from viewport bottom. */
const HERO_CENTER_TABLE_HOTSPOT_BOTTOM_PX = 150;
/** Sidestand + — fixed 140px from viewport right, vertically centered. */
const SIDESTAND_HOTSPOT_RIGHT_PX = 140;
/** Outdoors exit plus — left side, vertical center (percent of hero). */
const HERO_OUTDOORS_HOTSPOT = { left: 10, top: 50 };

/** Right half of viewport — click to return from exit state to vault orbit. */
const VAULT_RETURN_RIGHT_HALF = 0.5;

const HERO_COPY_FADE_MS = 600;

type VaultExitPhase = 'idle' | 'animating' | 'outdoors-ready';

const HERO_LAST_FRAME_FALLBACK = '/awebo_last_frame.webp';
const PRELOADER_BG = '/snowbg.jpg';
const PRELOADER_LOGO = '/1c5c3f75ac6dfd4846b57a663b6cf0cf.png';

const PRELOADER_MIN_MS = 1400;
const PRELOADER_FADE_MS = 500;
const CHROME_FADE_MS = 2000;
/** Scroll (px) over which hero hotspots fade out. */
const HOTSPOT_FADE_START_PX = 24;
const HOTSPOT_FADE_END_PX = 160;

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

type IntroPhase = 'preloader' | 'hero';

export default function LandingHero({
  badge,
  headline,
  subtext,
}: LandingHeroProps) {
  const router = useRouter();
  const orbitScrubRef = useRef<HeroOrbitScrubHandle>(null);
  const vaultExitBusyRef = useRef(false);

  const [introPhase, setIntroPhase] = useState<IntroPhase>('preloader');
  const [preloaderMounted, setPreloaderMounted] = useState(true);
  const [chromeVisible, setChromeVisible] = useState(false);
  const [orbitFrames, setOrbitFrames] = useState<HTMLImageElement[]>([]);
  const [vaultExitPhase, setVaultExitPhase] = useState<VaultExitPhase>('idle');
  const [sidestandActive, setSidestandActive] = useState(false);
  const [orbitFrame, setOrbitFrame] = useState(ORBIT_CENTER_FRAME);
  const [scrollHotspotOpacity, setScrollHotspotOpacity] = useState(1);
  const orbitReady = orbitFrames.length > 0;

  const revealChrome = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setChromeVisible(true));
    });
  }, []);

  const leavePreloader = useCallback(() => {
    setIntroPhase('hero');
    revealChrome();
    window.setTimeout(() => setPreloaderMounted(false), PRELOADER_FADE_MS);
  }, [revealChrome]);

  /** Preloader → preload orbit frames → hero orbit. */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    const start = async () => {
      const [, frames] = await Promise.all([
        new Promise<void>((resolve) => {
          window.setTimeout(resolve, PRELOADER_MIN_MS);
        }),
        preloadHeroOrbitFrames().catch(() => [] as HTMLImageElement[]),
        preloadSidestandImage().catch(() => undefined),
        preloadCenterTableImage().catch(() => undefined),
      ]);

      if (cancelled) return;

      if (frames.length > 0) setOrbitFrames(frames);
      leavePreloader();
    };

    void start();

    return () => {
      cancelled = true;
    };
  }, [leavePreloader]);

  /** Lock page scroll while preloader is mounted (including fade-out). */
  useEffect(() => {
    if (!preloaderMounted) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      overflow: style.overflow,
      width: style.width,
    };

    style.position = 'fixed';
    style.top = `-${scrollY}px`;
    style.left = '0';
    style.right = '0';
    style.width = '100%';
    style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.left = prev.left;
      style.right = prev.right;
      style.width = prev.width;
      style.overflow = prev.overflow;
      document.documentElement.style.overflow = '';
      window.scrollTo(0, scrollY);
    };
  }, [preloaderMounted]);

  useEffect(() => {
    if (preloaderMounted) return;

    const updateHotspotOpacity = () => {
      const scrollY = window.scrollY;
      const fadeRange = HOTSPOT_FADE_END_PX - HOTSPOT_FADE_START_PX;
      const progress = (scrollY - HOTSPOT_FADE_START_PX) / fadeRange;
      setScrollHotspotOpacity(Math.max(0, Math.min(1, 1 - progress)));
    };

    updateHotspotOpacity();
    window.addEventListener('scroll', updateHotspotOpacity, { passive: true });
    return () => window.removeEventListener('scroll', updateHotspotOpacity);
  }, [preloaderMounted]);

  const showPreloader = preloaderMounted;
  const preloaderVisible = introPhase === 'preloader';
  const showOrbitLayer = introPhase === 'hero';
  const hotspotsVisible = scrollHotspotOpacity > 0.05;
  const orbitScrubEnabled =
    introPhase === 'hero' && chromeVisible && orbitReady;
  const orbitPointerScrubEnabled =
    orbitScrubEnabled &&
    vaultExitPhase === 'idle' &&
    !sidestandActive &&
    hotspotsVisible;
  const showSidestandHotspot =
    chromeVisible &&
    introPhase === 'hero' &&
    vaultExitPhase === 'idle' &&
    !sidestandActive;
  const showCenterTableHotspot =
    showSidestandHotspot && isOrbitCenterHotspotFrame(orbitFrame);

  const handleVaultExitClick = useCallback(async () => {
    if (vaultExitPhase !== 'idle' || !orbitScrubRef.current || vaultExitBusyRef.current) {
      return;
    }

    vaultExitBusyRef.current = true;
    setVaultExitPhase('animating');
    try {
      await orbitScrubRef.current.playSequence(
        ORBIT_EXIT_START_FRAME,
        ORBIT_EXIT_END_FRAME
      );
      setVaultExitPhase('outdoors-ready');
    } catch {
      setVaultExitPhase('idle');
    } finally {
      vaultExitBusyRef.current = false;
    }
  }, [vaultExitPhase]);

  const handleReturnToVault = useCallback(async () => {
    if (
      vaultExitPhase !== 'outdoors-ready' ||
      !orbitScrubRef.current ||
      vaultExitBusyRef.current
    ) {
      return;
    }

    vaultExitBusyRef.current = true;
    setVaultExitPhase('animating');
    try {
      await orbitScrubRef.current.playSequence(
        ORBIT_EXIT_END_FRAME,
        ORBIT_EXIT_START_FRAME
      );
      setVaultExitPhase('idle');
    } catch {
      setVaultExitPhase('outdoors-ready');
    } finally {
      vaultExitBusyRef.current = false;
    }
  }, [vaultExitPhase]);

  /** Right-half click returns from exit state to default hero orbit. */
  useEffect(() => {
    if (vaultExitPhase !== 'outdoors-ready') return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.clientX < window.innerWidth * VAULT_RETURN_RIGHT_HALF) return;
      void handleReturnToVault();
    };

    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [vaultExitPhase, handleReturnToVault]);

  const handleHeroPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (!orbitPointerScrubEnabled) return;
      orbitScrubRef.current?.setTargetFromClientX(e.clientX);
    },
    [orbitPointerScrubEnabled]
  );

  const handleHeroPointerLeave = useCallback(() => {
    if (!orbitPointerScrubEnabled) return;
    orbitScrubRef.current?.resetToCenter();
  }, [orbitPointerScrubEnabled]);

  const showHeroCopy =
    chromeVisible &&
    introPhase === 'hero' &&
    vaultExitPhase === 'idle' &&
    !sidestandActive;

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#0a0a0a]"
      onPointerMove={handleHeroPointerMove}
      onPointerLeave={handleHeroPointerLeave}
    >
      {showOrbitLayer ? (
        <div className="absolute inset-0 z-10 bg-[#0a0a0a]">
          {orbitReady ? (
            <HeroOrbitScrub
              ref={orbitScrubRef}
              frames={orbitFrames}
              scrubEnabled={orbitPointerScrubEnabled}
              onFrameChange={setOrbitFrame}
            />
          ) : (
            <Image
              src={HERO_LAST_FRAME_FALLBACK}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
        </div>
      ) : null}

      {showPreloader ? (
        <div
          className={`absolute inset-0 z-50 flex min-h-[100dvh] items-center justify-center transition-opacity ease-out ${
            preloaderVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDuration: `${PRELOADER_FADE_MS}ms` }}
          aria-busy={preloaderVisible}
          aria-label="Loading"
        >
          <div className="absolute inset-0 overflow-hidden bg-[#e8eef5]">
            <Image
              src={PRELOADER_BG}
              alt=""
              fill
              priority
              sizes="100vw"
              className="scale-110 object-cover object-center blur-[48px] brightness-[1.02] saturate-[0.85]"
            />
            <div className="absolute inset-0 bg-white/25 backdrop-blur-sm" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center px-6">
            <Image
              src={PRELOADER_LOGO}
              alt="AWEBO"
              width={320}
              height={320}
              priority
              className="h-auto w-[min(280px,72vw)] max-w-[320px] object-contain drop-shadow-lg"
            />
          </div>
        </div>
      ) : null}

      <Navigation
        variant="landing"
        landingTheme="overlay"
        landingChromeVisible={chromeVisible && !sidestandActive}
      />

      {showSidestandHotspot ? (
        <div
          className={`transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            hotspotsVisible ? '' : 'pointer-events-none'
          }`}
          style={{ opacity: scrollHotspotOpacity }}
        >
          <HeroHotspot
            href="/ecosystem"
            label="Explore the AWEBO ecosystem"
            left={HERO_ECOSYSTEM_HOTSPOT.left}
            top={HERO_ECOSYSTEM_HOTSPOT.top}
          />
          <HeroHotspot
            label="View sidestand display"
            rightPx={SIDESTAND_HOTSPOT_RIGHT_PX}
            onActivate={() => setSidestandActive(true)}
          />
          <HeroHotspot
            label="View center table"
            bottomPx={HERO_CENTER_TABLE_HOTSPOT_BOTTOM_PX}
            onActivate={() => router.push('/centertable')}
            className={`transition-opacity duration-300 ease-out motion-reduce:transition-none ${
              showCenterTableHotspot
                ? 'opacity-100'
                : 'pointer-events-none opacity-0'
            }`}
          />
        </div>
      ) : null}

      <SidestandOverlay
        active={sidestandActive}
        onClose={() => setSidestandActive(false)}
      />

      {vaultExitPhase === 'outdoors-ready' ? (
        <div
          className={`transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            hotspotsVisible ? '' : 'pointer-events-none'
          }`}
          style={{ opacity: scrollHotspotOpacity }}
        >
          <HeroHotspot
            href="/outdoors"
            label="Exit vault to outdoors"
            left={HERO_OUTDOORS_HOTSPOT.left}
            top={HERO_OUTDOORS_HOTSPOT.top}
          />
        </div>
      ) : null}

      <ExitVaultEasterEgg
        active={
          orbitScrubEnabled &&
          vaultExitPhase === 'idle' &&
          !sidestandActive &&
          hotspotsVisible
        }
        onExitClick={() => void handleVaultExitClick()}
      />

      <div
        className={`relative z-10 flex min-h-[100dvh] w-full flex-col justify-center px-4 pb-16 pt-24 transition-opacity ease-in-out motion-reduce:transition-none sm:px-6 md:px-12 md:pb-20 md:pt-28 lg:px-16 ${
          showHeroCopy
            ? 'opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        style={{
          transitionDuration: `${vaultExitPhase !== 'idle' ? HERO_COPY_FADE_MS : CHROME_FADE_MS}ms`,
        }}
        aria-hidden={!showHeroCopy}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <div className="inline-flex">
              <span className="inline-flex items-center rounded-full bg-[#6e5dcb] px-3 py-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-white sm:text-xs">
                  {badge ?? 'Live now: Genesis Creator Drop'}
                </span>
              </span>
            </div>

            <div className="w-fit max-w-full">
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl whitespace-pre-line">
                {headline ?? 'Launch Your\nBrand.\nTokenize Your\nCulture.'}
              </h1>

              <p className="mt-3 w-full whitespace-pre-line text-base text-gray-100 drop-shadow-md text-pretty">
                {subtext ??
                  'The launchpad bridging streetwear and digital ownership.\nCreate, drop, and scale.'}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <LaunchBrandLogin className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#6e5dcb] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5e4db8]">
                Launch Brand
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </LaunchBrandLogin>
              <Link
                href="/ecosystem"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 no-underline"
              >
                View Ecosystem
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
