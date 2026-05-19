'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { appPath } from '@/lib/app-path';
import UserMenu from '@/components/UserMenu';
import LaunchBrandLogin from '@/components/LaunchBrandLogin';

const AWEBO_NAV_ICON = '/awebo_icon.png';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.awebo.wtf';

const LANDING_NAV_LINKS = [
  { label: 'MARKETPLACE', href: '/marketplace' },
  { label: 'DROPS', href: '/drops' },
  { label: 'ECOSYSTEM', href: '/ecosystem' },
  { label: 'ABOUT', href: '/about' },
];

const linkClassApp =
  'bg-gray-800 rounded-lg h-6 w-12 sm:w-16 flex items-center justify-center text-xs !text-white hover:!text-white visited:!text-white hover:bg-gray-700 no-underline';

type NavVariant = 'app' | 'landing';

export default function Navigation({
  variant = 'app',
  landingChromeVisible = true,
}: {
  variant?: NavVariant;
  /** Landing only: hide nav until headline band / intro progress catches up (smooth scrub can lag scroll). */
  landingChromeVisible?: boolean;
}) {
  const pathname = usePathname() ?? '';

  if (variant === 'landing') {
    if (!landingChromeVisible) {
      return null;
    }
    return (
      <header
        className="pointer-events-none absolute inset-x-0 top-0 z-30 w-full bg-transparent"
        role="banner"
      >
        <div className="pointer-events-auto grid min-h-0 w-full min-w-0 grid-cols-[1fr_auto_1fr] items-center bg-transparent py-3 md:py-4">
          <div className="flex min-w-0 items-center gap-2 pl-4 sm:pl-6">
            <Link href="/" className="flex shrink-0 items-center gap-2.5 no-underline">
              <Image
                src={AWEBO_NAV_ICON}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 object-contain"
                priority
              />
              <span className="text-lg font-semibold tracking-tight text-white drop-shadow-md">
                AWEBO
              </span>
            </Link>
          </div>

          <nav
            aria-label="Main"
            className="hidden shrink-0 items-center justify-center gap-6 md:flex"
          >
            {LANDING_NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="!text-white/90 hover:!text-white text-sm font-medium uppercase tracking-wide drop-shadow-sm transition-colors no-underline"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-0 shrink-0 items-center justify-end gap-4 pr-4 sm:pr-6">
            <LaunchBrandLogin className="inline-flex items-center justify-center rounded-lg bg-air-force-blue px-5 py-2.5 text-sm font-semibold !text-black transition-colors no-underline hover:bg-air-force-blue/90">
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
