'use client';

import { useRef, useCallback } from 'react';

/** "awebo " repeated to fill 300vw at large type */
const AWEBO_REPEAT = 'awebo '.repeat(800);

export default function MidsectionAscii() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = scrollRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const maxScroll = el.scrollWidth - width;
      if (maxScroll <= 0) return;
      const t = Math.max(0, Math.min(1, x / width));
      el.scrollLeft = t * maxScroll;
    },
    []
  );

  return (
    <section
      className="w-full h-[80vh] min-h-[320px] overflow-hidden relative bg-air-force-blue"
      aria-label="ASCII art title"
      onMouseMove={handleMouseMove}
    >
      <div
        ref={scrollRef}
        className="h-full overflow-x-auto overflow-y-hidden flex items-center hide-scrollbar"
      >
        <div
          className="flex-shrink-0 h-full flex items-center py-8 px-4"
          style={{ width: '300vw' }}
        >
          <p
            className="text-seashell font-medium whitespace-pre-wrap break-words select-none m-0"
            style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: 'clamp(0.5rem, 2vw, 1rem)',
              lineHeight: 1.4,
            }}
          >
            {AWEBO_REPEAT}
          </p>
        </div>
      </div>
    </section>
  );
}
