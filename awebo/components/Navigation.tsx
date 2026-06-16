'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Search, ChevronDown, LogOut, User, Menu, Heart } from 'lucide-react';
import { isPrivyConfigured } from '@/lib/privy-env';
import { useAuthModal } from '@/components/auth/AuthModalContext';
import { MARKETPLACE_CATEGORIES } from '@/lib/marketplace-data';
import {
  LANDING_HOME_PATH,
  LAUNCH_BRAND_PATH,
  navigateToLandingHome,
  clearPostLoginRedirect,
} from '@/lib/auth-redirect';
import { markLaunchPreloaderIfRoomToLaunch } from '@/lib/launch-preloader-nav';

const AWEBO_NAV_ICON = '/awebo_icon.png';

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

  const { ready, authenticated, user, logout } = usePrivy();
  const { openAuthModal } = useAuthModal();

  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categoriesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!landingChromeVisible) {
    return null;
  }

  const isSurface = theme === 'surface';
  const headerClass = isSurface
    ? 'sticky top-0 z-40 w-full border-b border-silver/80 bg-seashell/95 backdrop-blur-md'
    : 'pointer-events-none absolute inset-x-0 top-0 z-30 w-full bg-transparent';
  const logoTextClass = isSurface
    ? 'text-lg font-bold tracking-tight text-gray-900'
    : 'text-lg font-bold tracking-tight text-white drop-shadow-md';

  // Extract wallet address
  const evmWallet = user?.wallet?.address ?? user?.linkedAccounts?.find((a) => a.type === 'wallet')?.address;
  const shortenedAddress = evmWallet
    ? `${evmWallet.slice(0, 6)}...${evmWallet.slice(-4)}`
    : null;

  const handleLaunchBrandClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPrivyConfigured && !authenticated) {
      openAuthModal({ redirectPath: LAUNCH_BRAND_PATH });
    } else {
      markLaunchPreloaderIfRoomToLaunch(undefined, LAUNCH_BRAND_PATH);
      router.push(LAUNCH_BRAND_PATH);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={headerClass} role="banner">
      <div
        className={`flex min-h-0 w-full items-center justify-between px-4 py-3 md:py-4 sm:px-6 lg:px-8 ${
          isSurface ? '' : 'pointer-events-auto bg-transparent'
        }`}
      >
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2">
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

        {/* Center: Wide Search Bar */}
        <div className="mx-6 flex-1 max-w-xl">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${
              isSurface ? 'text-gray-400' : 'text-white/60'
            }`} />
            <input
              type="text"
              placeholder="Search products, brands, or collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`h-10 w-full rounded-full pl-10 pr-4 text-sm outline-none transition-all ${
                isSurface
                  ? 'border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500'
                  : 'border border-white/15 bg-white/10 text-white placeholder-white/50 focus:border-white/30 focus:bg-white/15'
              }`}
            />
          </form>
        </div>

        {/* Right Side: Navigation & Actions */}
        <div className="flex items-center gap-3">
          {/* Categories Dropdown */}
          <div className="relative" ref={categoriesRef}>
            <button
              type="button"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                isSurface
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white/95 hover:bg-white/10'
              }`}
            >
              <span>Categories</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            {categoriesOpen && (
              <div className={`absolute right-0 mt-2 z-50 w-56 rounded-xl border p-2 shadow-lg ${
                isSurface ? 'border-gray-200 bg-white' : 'border-zinc-800 bg-zinc-900 text-white'
              }`}>
                <div className="py-1">
                  {MARKETPLACE_CATEGORIES.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/marketplace/category/${category.slug}`}
                      onClick={() => setCategoriesOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-xs font-medium no-underline transition-colors ${
                        isSurface
                          ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
                          : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      {category.shortLabel ?? category.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Button */}
          {ready && authenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isSurface
                    ? 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-800'
                    : 'border border-white/15 bg-white/10 hover:bg-white/15 text-white'
                }`}
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-[10px] text-white">
                  {user?.email?.address ? user.email.address[0].toUpperCase() : 'A'}
                </div>
                <span className="hidden sm:inline tabular-nums">{shortenedAddress ?? 'Account'}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-white/70" />
              </button>
              {profileOpen && (
                <div className={`absolute right-0 mt-2 z-50 w-56 rounded-xl border p-2 shadow-lg ${
                  isSurface ? 'border-gray-200 bg-white' : 'border-zinc-800 bg-zinc-900 text-white'
                }`}>
                  <div className="border-b px-3 py-2 text-xs text-gray-500 border-gray-200 dark:border-zinc-800">
                    <span className="block font-semibold">Privy EVM Wallet</span>
                    <span className="block mt-0.5 truncate text-[10px] text-gray-400 font-mono select-all">{evmWallet}</span>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium no-underline transition-colors ${
                        isSurface ? 'text-gray-700 hover:bg-gray-100' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <User className="h-3.5 w-3.5" />
                      My Profile
                    </Link>
                    <Link
                      href="/profile?tab=wishlist"
                      onClick={() => setProfileOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium no-underline transition-colors ${
                        isSurface ? 'text-gray-700 hover:bg-gray-100' : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
                      Wishlist
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        clearPostLoginRedirect();
                        logout();
                        setProfileOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                        isSurface ? 'text-red-600 hover:bg-red-50' : 'text-red-400 hover:bg-red-950/20'
                      }`}
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal()}
              className={`rounded-lg p-2 text-sm transition-colors ${
                isSurface ? 'hover:bg-gray-100 text-gray-700' : 'hover:bg-white/10 text-white'
              }`}
              aria-label="Account Login"
            >
              <User className="h-5 w-5" />
            </button>
          )}

          {/* LAUNCH BRAND button */}
          <Link
            href={LAUNCH_BRAND_PATH}
            onClick={handleLaunchBrandClick}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#6e5dcb] px-4 py-2 text-xs font-semibold !text-white transition-colors no-underline hover:bg-[#5e4db8]"
          >
            LAUNCH BRAND
          </Link>
        </div>
      </div>
    </header>
  );
}