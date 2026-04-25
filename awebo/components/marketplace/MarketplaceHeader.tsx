'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MARKETPLACE_CATEGORIES } from '@/lib/marketplace-data';
import LaunchBrandLogin from '@/components/LaunchBrandLogin';

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) handler();
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [ref, handler]);
}

export default function MarketplaceHeader() {
  const pathname = usePathname();
  const [catOpen, setCatOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  useClickOutside(catRef, () => setCatOpen(false));
  useClickOutside(notifRef, () => setNotifOpen(false));

  return (
    <header className="sticky top-0 z-40 border-b border-silver/80 bg-seashell/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 md:h-16 items-center gap-3 min-w-0">
          <Link href="/marketplace" className="flex shrink-0 items-center gap-2 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue rounded-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-air-force-blue text-white font-bold text-sm" aria-hidden>
              A
            </span>
            <span className="font-semibold tracking-tight text-gray-900 text-lg">AWEBO</span>
          </Link>

          <div className="hidden sm:block flex-1 max-w-xl min-w-0 px-2">
            <label htmlFor="mp-search" className="sr-only">
              Search products and brands
            </label>
            <input
              id="mp-search"
              name="q"
              type="search"
              placeholder="Search products and brands…"
              autoComplete="off"
              spellCheck={false}
              className="w-full rounded-lg border border-silver bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-air-force-blue focus:border-transparent min-w-0"
            />
          </div>

          <nav className="flex items-center gap-1 sm:gap-2 ml-auto shrink-0" aria-label="Marketplace">
            <div className="relative" ref={catRef}>
              <button
                type="button"
                onClick={() => setCatOpen((o) => !o)}
                aria-expanded={catOpen}
                aria-haspopup="menu"
                className="rounded-lg px-2 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide text-gray-800 hover:bg-powder-petal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
              >
                Categories
              </button>
              {catOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-1 w-72 max-h-[70vh] overflow-y-auto rounded-xl border border-silver bg-white py-2 shadow-lg overscroll-contain"
                >
                  {MARKETPLACE_CATEGORIES.map((c) => (
                    <Link
                      key={c.slug}
                      role="menuitem"
                      href={`/marketplace/category/${c.slug}`}
                      className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-seashell no-underline"
                      onClick={() => setCatOpen(false)}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/marketplace/favorites"
              className={`rounded-lg px-2 py-2 text-xs sm:text-sm font-medium no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue ${
                pathname?.startsWith('/marketplace/favorites') ? 'text-air-force-blue bg-air-force-blue/10' : 'text-gray-700 hover:bg-powder-petal'
              }`}
            >
              Favorites
            </Link>

            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                aria-expanded={notifOpen}
                aria-haspopup="dialog"
                className="rounded-lg px-2 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-powder-petal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
                aria-label="Notifications"
              >
                Alerts
              </button>
              {notifOpen && (
                <div
                  role="dialog"
                  aria-label="Notifications preview"
                  className="absolute right-0 mt-1 w-80 max-h-80 overflow-y-auto rounded-xl border border-silver bg-white p-4 text-sm text-gray-600 shadow-lg overscroll-contain"
                >
                  <p className="font-semibold text-gray-900 mb-2">Platform</p>
                  <p className="text-xs leading-relaxed">New drops, policy updates, and feature announcements will appear here.</p>
                  <Link href="/marketplace/notifications" className="mt-3 inline-block text-air-force-blue font-medium text-sm no-underline hover:underline" onClick={() => setNotifOpen(false)}>
                    View all
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/app/profile"
              className="rounded-lg px-2 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-powder-petal no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
            >
              Profile
            </Link>

            <Link
              href="/marketplace/cart"
              className="rounded-lg px-2 py-2 text-xs sm:text-sm font-semibold text-gray-900 hover:bg-powder-petal no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
            >
              Cart
            </Link>

            <LaunchBrandLogin className="hidden md:inline-flex items-center justify-center rounded-lg bg-air-force-blue px-3 py-2 text-xs font-semibold text-gray-900 hover:bg-air-force-blue/90 transition-colors no-underline">
              Launch brand
            </LaunchBrandLogin>
          </nav>
        </div>
        <div className="sm:hidden pb-3">
          <label htmlFor="mp-search-m" className="sr-only">
            Search products and brands
          </label>
          <input
            id="mp-search-m"
            name="q"
            type="search"
            placeholder="Search products and brands…"
            autoComplete="off"
            spellCheck={false}
            className="w-full rounded-lg border border-silver bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-air-force-blue"
          />
        </div>
      </div>
    </header>
  );
}
