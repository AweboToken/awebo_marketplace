import { LAUNCH_BRAND_PATH } from '@/lib/auth-redirect';

export const LAUNCH_PRELOADER_KEY = 'awebo-launch-preloader';

/** Immersive HQ room routes (not marketplace, map overlay, etc.). */
export function isAweboRoomPath(path: string): boolean {
  if (path === '/') return true;
  if (path.startsWith('/hq/')) return true;
  if (path === '/outdoors') return true;
  return false;
}

export function isLaunchBrandPath(path: string): boolean {
  return path === LAUNCH_BRAND_PATH || path.startsWith(`${LAUNCH_BRAND_PATH}?`);
}

export function shouldUseLaunchPreloader(from: string, to: string): boolean {
  return (
    (isAweboRoomPath(from) && isLaunchBrandPath(to)) ||
    (isLaunchBrandPath(from) && isAweboRoomPath(to))
  );
}

export function markLaunchPreloaderNavigation(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(LAUNCH_PRELOADER_KEY, '1');
}

export function consumeLaunchPreloaderNavigation(): boolean {
  if (typeof window === 'undefined') return false;
  const pending = sessionStorage.getItem(LAUNCH_PRELOADER_KEY);
  if (!pending) return false;
  sessionStorage.removeItem(LAUNCH_PRELOADER_KEY);
  return true;
}

type RouterLike = {
  push: (path: string) => void;
  replace?: (path: string) => void;
};

export function navigateWithRoomLaunchTransition(
  router: RouterLike,
  to: string,
  options?: { replace?: boolean; from?: string }
): void {
  const from =
    options?.from ??
    (typeof window !== 'undefined' ? window.location.pathname : '');

  if (shouldUseLaunchPreloader(from, to)) {
    markLaunchPreloaderNavigation();
  }

  if (options?.replace && router.replace) {
    router.replace(to);
    return;
  }

  router.push(to);
}

export function markLaunchPreloaderIfRoomToLaunch(from?: string, to?: string): void {
  const currentFrom =
    from ?? (typeof window !== 'undefined' ? window.location.pathname : '');
  const target = to ?? LAUNCH_BRAND_PATH;
  if (shouldUseLaunchPreloader(currentFrom, target)) {
    markLaunchPreloaderNavigation();
  }
}
