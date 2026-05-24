'use client';

import Link from 'next/link';

export default function FoundersOfficeAboutPanel() {
  return (
    <aside
      className="pointer-events-none absolute inset-x-0 bottom-0 left-0 top-20 z-20 flex justify-end p-4 sm:top-24 sm:p-6 md:p-8 lg:p-10"
      aria-label="About AWEBO"
    >
      <div className="pointer-events-auto max-h-full w-full max-w-xl overflow-y-auto rounded-2xl border border-white/15 bg-black/35 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-200/90">
          Founders Office
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          About AWEBO
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
          AWEBO is a launchpad for culture-backed brands: a single, scalable
          infrastructure that unifies tokens, physical merchandise, and global
          logistics.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-white/75 sm:text-base">
          We enable designers and studios to design once, launch globally, and
          earn programmatically. Culture compounds.
        </p>

        <div className="mt-8 border-t border-white/15 pt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
            Contact
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            Support, partnerships, and press — visit the{' '}
            <Link
              href="/hq/room-03"
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              Meeting Room
            </Link>{' '}
            to reach the AWEBO team.
          </p>
        </div>
      </div>
    </aside>
  );
}
