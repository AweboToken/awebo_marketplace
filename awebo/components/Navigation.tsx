'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LaunchBrandLogin from '@/components/LaunchBrandLogin';
import {
  LANDING_HOME_PATH,
  navigateToLandingHome,
} from '@/lib/auth-redirect';

const AWEBO_NAV_ICON = '/awebo_icon.png';

const LANDING_NAV_LINKS = [
  { label: 'MARKETPLACE', href: '/marketplace' },
  { label: 'DROPS', href: '/drops' },
  { label: 'ECOSYSTEM', href: '/ecosystem' },
  { label: 'ABOUT', href: '/about' },
];

type NavVariant = 'app' | 'landing';
type LandingTheme = 'overlay' | 'surface';

export default function Navigation({
  variant = 'landing',
  landingChromeVisible = true,
  landingTheme = 'surface',
}: {
  variant?: NavVariant;
  /** Landing only: hide nav until headline band / intro progress catches up (smooth scrub can lag scroll). */
  landingChromeVisible?: boolean;
  /** Landing only: overlay (hero/dark pages) or surface (sticky bar on light pages). */
  landingTheme?: LandingTheme;
}) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const theme: LandingTheme = variant === 'app' ? 'surface' : landingTheme;

  if (!landingChromeVisible) {
    return null;
  }

  const isSurface = theme === 'surface';
    const headerClass = isSurface
      ? 'sticky top-0 z-40 w-full border-b border-silver/80 bg-seashell/95 backdrop-blur-md'
      : 'pointer-events-none absolute inset-x-0 top-0 z-30 w-full bg-transparent';
    const logoTextClass = isSurface
      ? 'text-lg font-semibold tracking-tight text-gray-900'
      : 'text-lg font-semibold tracking-tight text-white drop-shadow-md';
    const linkClass = (href: string) => {
      const active = pathname === href || pathname.startsWith(`${href}/`);
      if (isSurface) {
        return active
          ? '!text-air-force-blue text-sm font-semibold uppercase tracking-wide transition-colors no-underline'
          : '!text-gray-700 hover:!text-gray-900 text-sm font-medium uppercase tracking-wide transition-colors no-underline';
      }
      return active
        ? '!text-white text-sm font-semibold uppercase tracking-wide drop-shadow-sm transition-colors no-underline'
        : '!text-white/90 hover:!text-white text-sm font-medium uppercase tracking-wide drop-shadow-sm transition-colors no-underline';
    };

    return (
      <header className={headerClass} role="banner">
        <div
          className={`grid min-h-0 w-full min-w-0 grid-cols-[1fr_auto_1fr] items-center py-3 md:py-4 ${
            isSurface ? '' : 'pointer-events-auto bg-transparent'
          }`}
        >
          <div className="relative z-10 flex min-w-0 items-center gap-2 pl-4 sm:pl-6">
            <Link
              href={LANDING_HOME_PATH}
              onClick={(event) => {
                event.preventDefault();
                navigateToLandingHome(router);
              }}
              aria-label="Go to AWEBO home"
              className="flex shrink-0 items-center gap-2.5 no-underline"
            >
              <Image
                src={AWEBO_NAV_ICON}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 object-contain"
                priority
              />
              <span className={logoTextClass}>AWEBO</span>
            </Link>
          </div>

          <nav
            aria-label="Main"
            className="hidden shrink-0 items-center justify-center gap-6 md:flex"
          >
            {LANDING_NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className={linkClass(href)}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-0 shrink-0 items-center justify-end gap-4 pr-4 sm:pr-6">
            <LaunchBrandLogin className="inline-flex items-center justify-center rounded-lg bg-[#6e5dcb] px-5 py-2.5 text-sm font-semibold !text-white transition-colors no-underline hover:bg-[#5e4db8]">
              LAUNCH BRAND
            </LaunchBrandLogin>
          </div>
        </div>
      </header>
    );
}