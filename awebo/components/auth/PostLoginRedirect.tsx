'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import {
  LANDING_HOME_PATH,
  clearPostLoginRedirect,
  consumePostLoginRedirect,
} from '@/lib/auth-redirect';

/**
 * After OAuth or a full-page return, completes redirect to the creator flow
 * when a post-login path was stored before sign-in.
 */
export default function PostLoginRedirect() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authenticated } = usePrivy();
  const handledRef = useRef(false);
  const wasAuthenticatedRef = useRef(authenticated);

  useEffect(() => {
    if (!ready) return;

    if (pathname === LANDING_HOME_PATH) {
      clearPostLoginRedirect();
      handledRef.current = true;
      wasAuthenticatedRef.current = authenticated;
      return;
    }

    const justLoggedIn = authenticated && !wasAuthenticatedRef.current;
    wasAuthenticatedRef.current = authenticated;

    if (!authenticated) {
      handledRef.current = false;
      return;
    }

    if (!justLoggedIn || handledRef.current) return;

    const pending = consumePostLoginRedirect();
    if (!pending || pathname === pending || pending === LANDING_HOME_PATH) {
      if (pending) handledRef.current = true;
      return;
    }

    handledRef.current = true;
    router.replace(pending);
  }, [authenticated, pathname, ready, router]);

  return null;
}
