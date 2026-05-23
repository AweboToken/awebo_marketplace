export const POST_LOGIN_REDIRECT_KEY = 'awebo-post-login-redirect';

export const LANDING_HOME_PATH = '/';

export const DEFAULT_POST_LOGIN_PATH = '/launch';

export function setPostLoginRedirect(path: string = DEFAULT_POST_LOGIN_PATH) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, path);
}

export function clearPostLoginRedirect() {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
}

/** Navigate to marketing home without post-login redirect hijacking. */
export function navigateToLandingHome(router: { push: (path: string) => void }) {
  clearPostLoginRedirect();
  router.push(LANDING_HOME_PATH);
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
