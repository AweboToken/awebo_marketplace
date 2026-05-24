export const POST_LOGIN_REDIRECT_KEY = 'awebo-post-login-redirect';

export const LANDING_HOME_PATH = '/';

/** Brand Studio wizard — only from explicit Launch Brand CTAs. */
export const LAUNCH_BRAND_PATH = '/launch';

/** Default after generic sign-in: stay on the page where login started. */
export function getDefaultPostLoginPath(): string {
  if (typeof window === 'undefined') return LANDING_HOME_PATH;
  return `${window.location.pathname}${window.location.search}`;
}

export function setPostLoginRedirect(path: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, path);
}

export function clearPostLoginRedirect() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
}

import { navigateWithRoomLaunchTransition } from '@/lib/launch-preloader-nav';

/** Navigate to marketing home without post-login redirect hijacking. */
export function navigateToLandingHome(router: { push: (path: string) => void }) {
  clearPostLoginRedirect();
  navigateWithRoomLaunchTransition(router, LANDING_HOME_PATH);
}

export function consumePostLoginRedirect(): string | null {
  if (typeof window === 'undefined') return null;
  const path = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
  if (!path) return null;
  sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
  return path;
}

export function peekPostLoginRedirect(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
}
