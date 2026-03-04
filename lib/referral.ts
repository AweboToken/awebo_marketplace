/**
 * Referral flow: user connects wallet → profile linked → sharable link.
 * When someone uses the link: referrer gets a payment + product order goes through.
 * Ref hash is stored in URL, localStorage, and cookie for attribution.
 */

const REF_PARAM = 'ref';
const REF_STORAGE_KEY = 'awebo-referral-ref';
const REF_COOKIE_NAME = 'awebo_ref';
const REF_COOKIE_MAX_AGE_DAYS = 30;

export function getRefFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(REF_PARAM);
}

/** Persist referral code to localStorage and cookie (for server/backend attribution). */
export function persistReferralRef(ref: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REF_STORAGE_KEY, ref);
    document.cookie = `${REF_COOKIE_NAME}=${encodeURIComponent(ref)}; path=/; max-age=${REF_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60}; SameSite=Lax`;
  } catch (_) {
    // ignore
  }
}

/** Read stored referral code (localStorage or cookie). */
export function getStoredReferralRef(): string | null {
  if (typeof window === 'undefined') return null;
  const fromStorage = localStorage.getItem(REF_STORAGE_KEY);
  if (fromStorage) return fromStorage;
  const match = document.cookie.match(new RegExp(`(?:^|; )${REF_COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Generate a shareable referral URL for the current user (requires wallet address).
 * Backend will attribute orders to this referrer and pay them when the link is used.
 */
export function buildReferralLink(walletAddress: string, path: string = '/'): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const hash = walletAddress.slice(0, 10) + walletAddress.slice(-8); // simple stub hash; replace with real signing/hash
  const url = new URL(path, origin);
  url.searchParams.set(REF_PARAM, hash);
  return url.toString();
}

/** Initialize referral from current URL: if ?ref=... is present, persist it. Call once on app load or on referral landing. */
export function initReferralFromUrl(): void {
  const ref = getRefFromUrl();
  if (ref) persistReferralRef(ref);
}
