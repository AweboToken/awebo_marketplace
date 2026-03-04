'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { appPath } from '@/lib/app-path';
import UserMenu from '@/components/UserMenu';
import LaunchBrandLogin from '@/components/LaunchBrandLogin';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.awebo.wtf';

const LANDING_NAV_LINKS = [
  { label: 'EXPLORE', href: '/explore' },
  { label: 'DROPS', href: '/drops' },
  { label: 'ECOSYSTEM', href: '/ecosystem' },
  { label: 'ABOUT', href: '/about' },
];

const linkClassApp =
  'bg-gray-800 rounded-lg h-6 w-12 sm:w-16 flex items-center justify-center text-xs !text-white hover:!text-white visited:!text-white hover:bg-gray-700 no-underline';

type NavVariant = 'app' | 'landing';

export default function Navigation({ variant = 'app' }: { variant?: NavVariant }) {
  const pathname = usePathname() ?? '';

  if (variant === 'landing') {
    return (
      <header
        className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent"
        role="banner"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-14 md:h-16 w-full min-w-0">
          <div className="pl-4 sm:pl-6 min-w-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 shrink-0 no-underline">
              <span
                className="w-8 h-8 flex items-center justify-center rounded bg-air-force-blue text-white font-bold text-sm"
                aria-hidden
              >
                A
              </span>
              <span className="text-white font-semibold tracking-tight text-lg">
                AWEBO
              </span>
            </Link>
          </div>

          <nav
            aria-label="Main"
            className="hidden md:flex items-center justify-center gap-6 shrink-0"
          >
            {LANDING_NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="!text-white hover:!text-white/90 text-sm font-medium uppercase tracking-wide transition-colors no-underline"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-4 pr-4 sm:pr-6 min-w-0 shrink-0">
            <LaunchBrandLogin className="inline-flex items-center justify-center rounded-lg bg-air-force-blue !text-white font-semibold px-5 py-2.5 text-sm hover:bg-air-force-blue/90 transition-colors no-underline">
              LAUNCH BRAND
            </LaunchBrandLogin>
          </div>
        </div>
      </header>
    );
  }

  return (
    <nav className="w-full bg-gray-900 border-b border-gray-800 shadow-sm">
      <div className="w-full h-px bg-gray-800" aria-hidden />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4 flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href={appPath(pathname, '')} className={linkClassApp}>
              Home
            </Link>
            <Link href={appPath(pathname, 'activity')} className={linkClassApp}>
              Activity
            </Link>
            <Link href="/launch" className={linkClassApp}>
              Launch
            </Link>
            <Link href={appPath(pathname, 'merch')} className={linkClassApp}>
              Merch
            </Link>
            <Link href={appPath(pathname, 'profile')} className={linkClassApp}>
              Profile
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <UserMenu />
          </div>
        </div>

        <div className="flex justify-center pb-4">
          <div className="bg-gray-800 rounded-lg h-8 w-64" />
        </div>
      </div>
    </nav>
  );
}
