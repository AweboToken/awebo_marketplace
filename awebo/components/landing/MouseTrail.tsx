'use client';

import { useEffect, useRef, useState } from 'react';

const GLYPH = '·';
const TRAIL_LENGTH = 16;
const INTERVAL_MS = 40;

type Point = { x: number; y: number; id: number };

export default function MouseTrail() {
  const [points, setPoints] = useState<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>();
  const nextIdRef = useRef(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMove);

    const tick = () => {
      const { x, y } = mouseRef.current;
      setPoints((prev) => {
        const next: Point[] = [{ x, y, id: nextIdRef.current++ }];
        for (let i = 0; i < Math.min(prev.length, TRAIL_LENGTH - 1); i++) {
          next.push(prev[i]);
        }
        return next.slice(0, TRAIL_LENGTH);
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
      aria-hidden
    >
      {points.map((p, i) => (
        <span
          key={p.id}
          className="absolute text-white select-none transition-opacity duration-150"
          style={{
            left: p.x,
            top: p.y,
            transform: 'translate(-50%, -50%)',
            opacity: 1 - i / TRAIL_LENGTH,
            fontSize: '0.5rem',
          }}
        >
          {GLYPH}
        </span>
      ))}
    </div>
  );
}
