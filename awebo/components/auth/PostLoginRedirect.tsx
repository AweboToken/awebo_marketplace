'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import {
  LANDING_HOME_PATH,
  clearPostLoginRedirect,
  consumePostLoginRedirect,
} from '@/lib/auth-redirect';
import { markLaunchPreloaderIfRoomToLaunch } from '@/lib/launch-preloader-nav';

/**
 * After OAuth or a full-page return, completes redirect when a post-login path
 * was stored before sign-in (e.g. Launch Brand CTA → /launch).
 */
export default function PostLoginRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authenticated } = usePrivy();
  const handledRef = useRef(false);
  const wasAuthenticatedRef = useRef(authenticated);

  useEffect(() => {
    if (!ready) return;

    const justLoggedIn = authenticated && !wasAuthenticatedRef.current;
    wasAuthenticatedRef.current = authenticated;

    if (!authenticated) {
      handledRef.current = false;
      return;
    }

    if (!justLoggedIn || handledRef.current) return;

    const pending = consumePostLoginRedirect();
    if (!pending) return;

    const currentPath = `${pathname}${window.location.search}`;
    if (pending === currentPath) {
      handledRef.current = true;
      return;
    }

    if (pending === LANDING_HOME_PATH && pathname === LANDING_HOME_PATH) {
      handledRef.current = true;
      return;
    }

    handledRef.current = true;
    markLaunchPreloaderIfRoomToLaunch(pathname, pending);
    router.replace(pending);
  }, [authenticated, pathname, ready, router]);

  useEffect(() => {
    if (!ready || authenticated) return;
    clearPostLoginRedirect();
    handledRef.current = false;
  }, [authenticated, ready]);

  return null;
}
