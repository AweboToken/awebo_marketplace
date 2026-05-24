'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import AweboLoginModal from '@/components/auth/AweboLoginModal';
import PostLoginRedirect from '@/components/auth/PostLoginRedirect';
import {
  getDefaultPostLoginPath,
  setPostLoginRedirect,
} from '@/lib/auth-redirect';

type AuthModalContextValue = {
  openAuthModal: (options?: { redirectPath?: string }) => void;
  closeAuthModal: () => void;
};

const noopAuthModal: AuthModalContextValue = {
  openAuthModal: () => {},
  closeAuthModal: () => {},
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

function AuthModalProviderActive({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState(getDefaultPostLoginPath);

  const openAuthModal = useCallback((options?: { redirectPath?: string }) => {
    const nextPath = options?.redirectPath ?? getDefaultPostLoginPath();
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

export function AuthModalProvider({
  children,
  enabled = true,
}: {
  children: React.ReactNode;
  enabled?: boolean;
}) {
  if (!enabled) {
    return (
      <AuthModalContext.Provider value={noopAuthModal}>
        {children}
      </AuthModalContext.Provider>
    );
  }

  return <AuthModalProviderActive>{children}</AuthModalProviderActive>;
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return context;
}
