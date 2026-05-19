'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import LaunchBrandLogin from '@/components/LaunchBrandLogin';

const HERO_LAST_FRAME_IMAGE = '/awebo_last_frame.webp';
const HERO_INTRO_VIDEO = '/awebo_vault_room_optimized.webm';
const PRELOADER_BG = '/snowbg.jpg';
const PRELOADER_LOGO = '/1c5c3f75ac6dfd4846b57a663b6cf0cf.png';

/** Ignore empty/corrupt uploads — real WebMs are always larger than this. */
const MIN_INTRO_VIDEO_BYTES = 1024;

const PRELOADER_MIN_MS = 1400;
const PRELOADER_FADE_MS = 500;
const CHROME_FADE_MS = 2000;
const VIDEO_TO_STILL_CROSSFADE_MS = 1400;

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

type IntroPhase = 'preloader' | 'video' | 'hero';

async function introVideoIsPlayable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    if (!res.ok) return false;
    const length = Number(res.headers.get('content-length') ?? 0);
    return length >= MIN_INTRO_VIDEO_BYTES;
  } catch {
    return false;
  }
}

export default function LandingHero({
  badge,
  headline,
  subtext,
}: LandingHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishedRef = useRef(false);

  const [introPhase, setIntroPhase] = useState<IntroPhase>('preloader');
  const [preloaderMounted, setPreloaderMounted] = useState(true);
  const [chromeVisible, setChromeVisible] = useState(false);
  const [videoMounted, setVideoMounted] = useState(false);
  const [stillOpacity, setStillOpacity] = useState(0);
  const [videoOpacity, setVideoOpacity] = useState(1);

  const revealChrome = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setChromeVisible(true));
    });
  }, []);

  const finishIntro = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIntroPhase('hero');
    setStillOpacity(1);
    setVideoOpacity(0);
    setVideoMounted(false);
    revealChrome();
  }, [revealChrome]);

  const startVideoToStillCrossfade = useCallback(() => {
    if (finishedRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const duration = prefersReducedMotion ? 0 : VIDEO_TO_STILL_CROSSFADE_MS;

    requestAnimationFrame(() => {
      setStillOpacity(1);
      setVideoOpacity(0);
    });

    window.setTimeout(() => {
      finishedRef.current = true;
      setIntroPhase('hero');
      setVideoMounted(false);
      revealChrome();
    }, duration);
  }, [revealChrome]);

  const leavePreloader = useCallback(
    (next: 'video' | 'hero') => {
      if (next === 'hero') {
        finishedRef.current = true;
        setIntroPhase('hero');
        setStillOpacity(1);
        setVideoOpacity(0);
        setVideoMounted(false);
        revealChrome();
      } else {
        setIntroPhase('video');
        setVideoMounted(true);
        setStillOpacity(0);
        setVideoOpacity(1);
      }
      window.setTimeout(() => setPreloaderMounted(false), PRELOADER_FADE_MS);
    },
    [revealChrome]
  );

  /** Preloader → probe intro video → video or still hero. */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let cancelled = false;

    const start = async () => {
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      const [, playable] = await Promise.all([
        new Promise<void>((resolve) => {
          window.setTimeout(resolve, PRELOADER_MIN_MS);
        }),
        introVideoIsPlayable(HERO_INTRO_VIDEO),
      ]);

      if (cancelled) return;

      if (prefersReducedMotion || !playable) {
        leavePreloader('hero');
      } else {
        leavePreloader('video');
      }
    };

    void start();

    return () => {
      cancelled = true;
    };
  }, [leavePreloader]);

  /** Play intro video after preloader exits. */
  useEffect(() => {
    if (introPhase !== 'video') return;

    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => startVideoToStillCrossfade();
    const onError = () => finishIntro();

    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);

    const tryPlay = async () => {
      try {
        video.muted = true;
        await video.play();
      } catch {
        finishIntro();
      }
    };

    const onCanPlay = () => {
      void tryPlay();
    };

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      void tryPlay();
    } else {
      video.addEventListener('canplay', onCanPlay, { once: true });
    }

    return () => {
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
      video.removeEventListener('canplay', onCanPlay);
    };
  }, [introPhase, finishIntro, startVideoToStillCrossfade]);

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

  const showPreloader = preloaderMounted;
  const preloaderVisible = introPhase === 'preloader';
  const showStillLayer = introPhase === 'video' || introPhase === 'hero';

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#0a0a0a]"
    >
      {/* Last frame still — crossfades in under the video when playback ends. */}
      {showStillLayer ? (
        <div
          className="absolute inset-0 z-10 transition-opacity ease-in-out motion-reduce:transition-none"
          style={{
            opacity: stillOpacity,
            transitionDuration: `${VIDEO_TO_STILL_CROSSFADE_MS}ms`,
          }}
          aria-hidden={stillOpacity < 0.05}
        >
          <Image
            src={HERO_LAST_FRAME_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      ) : null}

      {videoMounted ? (
        <video
          ref={videoRef}
          className="absolute inset-0 z-20 h-full w-full object-cover object-center transition-opacity ease-in-out motion-reduce:transition-none"
          style={{
            opacity: videoOpacity,
            transitionDuration: `${VIDEO_TO_STILL_CROSSFADE_MS}ms`,
          }}
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden={videoOpacity < 0.05}
        >
          <source src={HERO_INTRO_VIDEO} type="video/webm" />
        </video>
      ) : null}

      {/* Blurred snow preloader + centered logo */}
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

      <Navigation variant="landing" landingChromeVisible={chromeVisible} />

      <div
        className={`relative z-10 flex min-h-[100dvh] w-full flex-col justify-center px-4 pb-16 pt-24 transition-opacity ease-in-out motion-reduce:transition-none sm:px-6 md:px-12 md:pb-20 md:pt-28 lg:px-16 ${
          chromeVisible
            ? 'opacity-100'
            : 'pointer-events-none opacity-0'
        }`}
        style={{ transitionDuration: `${CHROME_FADE_MS}ms` }}
      >
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-2xl">
            <div className="inline-flex">
              <span className="inline-flex items-center rounded-full bg-green-500 px-3 py-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-black sm:text-xs">
                  {badge ?? 'Live now: Genesis Creator Drop'}
                </span>
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl whitespace-pre-line">
              {headline ?? 'Launch Your\nBrand.\nTokenize Your\nCulture.'}
            </h1>

            <p className="mt-3 max-w-xl text-base text-gray-100 drop-shadow-md">
              {subtext ??
                'The premium launchpad bridging physical streetwear with digital ownership. Create, drop, and scale your brand across worlds.'}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <LaunchBrandLogin className="inline-flex items-center justify-center gap-2 rounded-lg bg-air-force-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-air-force-blue/90">
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
