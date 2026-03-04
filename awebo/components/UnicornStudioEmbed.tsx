'use client';

import Script from 'next/script';

const UNICORN_STUDIO_SCRIPT =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js';

export default function UnicornStudioEmbed() {
  return (
    <div className="unicorn-studio-embed relative w-full">
      <div
        data-us-project="s27I58a6DFYQ6LZQSrYK"
        style={{ width: '100%', maxWidth: 1440, height: 900, margin: '0 auto' }}
        className="w-full mx-auto"
      />
      <Script
        src={UNICORN_STUDIO_SCRIPT}
        strategy="afterInteractive"
        onLoad={() => {
          if (
            typeof window !== 'undefined' &&
            (window as unknown as { UnicornStudio?: { init?: () => void } }).UnicornStudio?.init
          ) {
            (window as unknown as { UnicornStudio: { init: () => void } }).UnicornStudio.init();
          }
        }}
      />
    </div>
  );
}
