'use client';

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
} from 'react';
import {
  ORBIT_CENTER_FRAME,
  orbitTargetFrameFromX,
} from '@/lib/hero-orbit-frames';

export type HeroOrbitScrubHandle = {
  setTargetFromClientX: (clientX: number) => void;
  resetToCenter: () => void;
  /** Step frame-by-frame from start to end (inclusive), no skips. */
  playSequence: (startFrame: number, endFrame: number) => Promise<void>;
};

type HeroOrbitScrubProps = {
  frames: HTMLImageElement[];
  scrubEnabled: boolean;
  onFrameChange?: (frame: number) => void;
  className?: string;
  style?: CSSProperties;
};

const HeroOrbitScrub = forwardRef<HeroOrbitScrubHandle, HeroOrbitScrubProps>(
  function HeroOrbitScrub(
    { frames, scrubEnabled, onFrameChange, className = '', style },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentFrameRef = useRef(ORBIT_CENTER_FRAME);
    const targetFrameRef = useRef(ORBIT_CENTER_FRAME);
    const rafRef = useRef(0);
    const scrubEnabledRef = useRef(scrubEnabled);
    const sequenceActiveRef = useRef(false);
    const sequenceResolveRef = useRef<(() => void) | null>(null);
    const onFrameChangeRef = useRef(onFrameChange);

    scrubEnabledRef.current = scrubEnabled;
    onFrameChangeRef.current = onFrameChange;

    const emitFrameChange = useCallback((frameIndex: number) => {
      onFrameChangeRef.current?.(frameIndex);
    }, []);

    const drawFrame = useCallback(
      (frameIndex: number) => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || frames.length === 0) return;

        const img = frames[frameIndex - 1];
        if (!img?.complete) return;

        const { width, height } = container.getBoundingClientRect();
        if (width < 1 || height < 1) return;

        const dpr = window.devicePixelRatio || 1;
        const pixelW = Math.round(width * dpr);
        const pixelH = Math.round(height * dpr);

        if (canvas.width !== pixelW || canvas.height !== pixelH) {
          canvas.width = pixelW;
          canvas.height = pixelH;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const scale = Math.max(
          width / img.naturalWidth,
          height / img.naturalHeight
        );
        const drawW = img.naturalWidth * scale;
        const drawH = img.naturalHeight * scale;
        const offsetX = (width - drawW) / 2;
        const offsetY = (height - drawH) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        emitFrameChange(frameIndex);
      },
      [emitFrameChange, frames]
    );

    const finishSequenceIfDone = useCallback(() => {
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;
      if (current !== target) return;

      if (sequenceActiveRef.current && sequenceResolveRef.current) {
        sequenceActiveRef.current = false;
        const resolve = sequenceResolveRef.current;
        sequenceResolveRef.current = null;
        resolve();
      }
    }, []);

    const tick = useCallback(() => {
      rafRef.current = 0;
      const current = currentFrameRef.current;
      const target = targetFrameRef.current;

      if (current === target) {
        finishSequenceIfDone();
        return;
      }

      const next = current < target ? current + 1 : current - 1;
      currentFrameRef.current = next;
      drawFrame(next);

      rafRef.current = requestAnimationFrame(tick);
    }, [drawFrame, finishSequenceIfDone]);

    const scheduleTick = useCallback(() => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(tick);
    }, [tick]);

    const setTargetFromClientX = useCallback(
      (clientX: number) => {
        if (!scrubEnabledRef.current || sequenceActiveRef.current) return;

        const el = containerRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width;
        const target = orbitTargetFrameFromX(x);

        if (target === targetFrameRef.current) return;
        targetFrameRef.current = target;
        scheduleTick();
      },
      [scheduleTick]
    );

    const resetToCenter = useCallback(() => {
      if (!scrubEnabledRef.current || sequenceActiveRef.current) return;
      targetFrameRef.current = ORBIT_CENTER_FRAME;
      scheduleTick();
    }, [scheduleTick]);

    const playSequence = useCallback(
      (startFrame: number, endFrame: number) => {
        const start = Math.round(startFrame);
        const end = Math.round(endFrame);

        currentFrameRef.current = start;
        targetFrameRef.current = end;
        drawFrame(start);

        if (start === end) return Promise.resolve();

        sequenceActiveRef.current = true;

        return new Promise<void>((resolve) => {
          sequenceResolveRef.current = resolve;
          scheduleTick();
        });
      },
      [drawFrame, scheduleTick]
    );

    useImperativeHandle(
      ref,
      () => ({
        setTargetFromClientX,
        resetToCenter,
        playSequence,
      }),
      [setTargetFromClientX, resetToCenter, playSequence]
    );

    useEffect(() => {
      currentFrameRef.current = ORBIT_CENTER_FRAME;
      targetFrameRef.current = ORBIT_CENTER_FRAME;
      drawFrame(ORBIT_CENTER_FRAME);
    }, [frames, drawFrame]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const ro = new ResizeObserver(() => {
        drawFrame(currentFrameRef.current);
      });
      ro.observe(container);
      return () => ro.disconnect();
    }, [drawFrame]);

    useEffect(() => {
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        sequenceResolveRef.current = null;
        sequenceActiveRef.current = false;
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={style}
      >
        <canvas
          ref={canvasRef}
          className="block h-full w-full"
          aria-hidden
        />
      </div>
    );
  }
);

export default HeroOrbitScrub;
