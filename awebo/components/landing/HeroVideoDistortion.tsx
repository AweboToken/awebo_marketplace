'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const BULGE_RADIUS = 120;
const BULGE_STRENGTH = 0.15;

type HeroVideoDistortionProps = {
  src: string;
  className?: string;
};

export default function HeroVideoDistortion({ src, className = '' }: HeroVideoDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const animRef = useRef<number>();

  const draw = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!video || !canvas || !container || video.readyState < 2) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = rect.width;
    const h = rect.height;
    const cw = Math.round(w * dpr);
    const ch = Math.round(h * dpr);

    if (canvas.width !== cw || canvas.height !== ch) {
      canvas.width = cw;
      canvas.height = ch;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      animRef.current = requestAnimationFrame(draw);
      return;
    }

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const scale = Math.max(cw / vw, ch / vh);
    const dw = vw * scale;
    const dh = vh * scale;
    const sx = 0;
    const sy = 0;

    ctx.save();
    ctx.drawImage(video, 0, 0, vw, vh, sx, sy, dw, dh);
    ctx.restore();

    if (mouse) {
      const mx = (mouse.x - rect.left) * dpr;
      const my = (mouse.y - rect.top) * dpr;
      const r = BULGE_RADIUS * dpr;

      if (mx >= -r && mx <= cw + r && my >= -r && my <= ch + r) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, r, 0, Math.PI * 2);
        ctx.clip();
        const bulge = 1 + BULGE_STRENGTH;
        ctx.translate(mx, my);
        ctx.scale(bulge, bulge);
        ctx.translate(-mx, -my);
        ctx.drawImage(video, 0, 0, vw, vh, 0, 0, dw, dh);
        ctx.restore();
      }
    }

    animRef.current = requestAnimationFrame(draw);
  }, [mouse]);

  useEffect(() => {
    draw();
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setMouse({ x: e.clientX, y: e.clientY });
  }, []);

  const handleLeave = useCallback(() => {
    setMouse(null);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-hidden
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute opacity-0 pointer-events-none w-full h-full object-cover object-left-top"
        style={{ width: '100%', height: '100%' }}
      >
        <source src={src} type="video/mp4" />
      </video>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover object-left-top"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
