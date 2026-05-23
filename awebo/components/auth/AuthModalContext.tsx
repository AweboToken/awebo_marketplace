'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePrivy } from '@privy-io/react-auth';
import AweboLoginModal from '@/components/auth/AweboLoginModal';
import PostLoginRedirect from '@/components/auth/PostLoginRedirect';
import {
  DEFAULT_POST_LOGIN_PATH,
  clearPostLoginRedirect,
  setPostLoginRedirect,
} from '@/lib/auth-redirect';

type AuthModalContextValue = {
  openAuthModal: (options?: { redirectPath?: string }) => void;
  closeAuthModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy();
  const [isOpen, setIsOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState(DEFAULT_POST_LOGIN_PATH);
  const autoOpenedRef = useRef(false);

  useEffect(() => {
    if (!authenticated) {
      autoOpenedRef.current = false;
    }
  }, [authenticated]);

  /** Show login by default once per signed-out visit when Privy is ready. */
  useEffect(() => {
    if (!ready) return;

    if (authenticated) {
      setIsOpen(false);
      clearPostLoginRedirect();
      return;
    }

    if (autoOpenedRef.current) return;

    autoOpenedRef.current = true;
    setIsOpen(true);
  }, [authenticated, ready]);

  const openAuthModal = useCallback((options?: { redirectPath?: string }) => {
    const nextPath = options?.redirectPath ?? DEFAULT_POST_LOGIN_PATH;
    setRedirectPath(nextPath);
    setPostLoginRedirect(nextPath);
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ openAuthModal, closeAuthModal }),
    [openAuthModal, closeAuthModal]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <PostLoginRedirect />
      <AweboLoginModal
        isOpen={isOpen}
        onClose={closeAuthModal}
        redirectPath={redirectPath}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
}
