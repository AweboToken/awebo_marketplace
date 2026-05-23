'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  useConnectWallet,
  useLoginWithEmail,
  useLoginWithOAuth,
  usePrivy,
} from '@privy-io/react-auth';
import type { OAuthProviderID } from '@privy-io/api-types';
import { ChevronLeft, ChevronRight, Mail, Wallet } from 'lucide-react';
import OtpCodeInput from '@/components/auth/OtpCodeInput';
import {
  DEFAULT_POST_LOGIN_PATH,
  setPostLoginRedirect,
} from '@/lib/auth-redirect';
import {
  AppleIcon,
  GitHubIcon,
  GoogleIcon,
  InstagramIcon,
  MetaMaskIcon,
  PhantomIcon,
} from '@/components/auth/ProviderIcons';

const RESEND_SECONDS = 15;
const AWEBO_BIRD = '/awebo_bird2.webp';

type LoginView = 'welcome' | 'otp';

type AweboLoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
};

function SocialButton({
  label,
  icon,
  onClick,
  disabled,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function AweboLoginModal({
  isOpen,
  onClose,
  redirectPath = DEFAULT_POST_LOGIN_PATH,
}: AweboLoginModalProps) {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  const [view, setView] = useState<LoginView>('welcome');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(RESEND_SECONDS);

  const handleAuthComplete = useCallback(() => {
    setPostLoginRedirect(redirectPath);
    onClose();
    router.replace(redirectPath);
  }, [onClose, redirectPath, router]);

  const { initOAuth, loading: oauthLoading } = useLoginWithOAuth({
    onComplete: handleAuthComplete,
    onError: (error) => console.error('OAuth login failed', error),
  });

  const { sendCode, loginWithCode, state: emailState } = useLoginWithEmail({
    onComplete: handleAuthComplete,
    onError: (error) => console.error('Email login failed', error),
  });

  const { connectWallet } = useConnectWallet({
    onSuccess: handleAuthComplete,
    onError: (error) => console.error('Wallet connect failed', error),
  });

  useEffect(() => {
    if (!isOpen) {
      setView('welcome');
      setEmail('');
      setOtp('');
      setOtpError(false);
      setEmailError(null);
      setBusy(false);
      setResendSeconds(RESEND_SECONDS);
    }
  }, [isOpen]);

  useEffect(() => {
    if (view !== 'otp' || resendSeconds <= 0) return;
    const timer = window.setInterval(() => {
      setResendSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [view, resendSeconds]);

  useEffect(() => {
    if (view !== 'otp' || otp.length !== 6 || busy) return;

    let cancelled = false;
    const verify = async () => {
      setBusy(true);
      setOtpError(false);
      try {
        await loginWithCode({ code: otp });
      } catch {
        if (!cancelled) {
          setOtpError(true);
          setOtp('');
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    };

    void verify();
    return () => {
      cancelled = true;
    };
  }, [busy, loginWithCode, otp, view]);

  const handleOAuth = async (provider: OAuthProviderID) => {
    if (!ready || oauthLoading || busy) return;
    setPostLoginRedirect(redirectPath);
    setBusy(true);
    try {
      await initOAuth({ provider });
    } catch (error) {
      console.error(`${provider} login failed`, error);
    } finally {
      setBusy(false);
    }
  };

  const handleEmailSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!ready || busy) return;

    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Enter a valid email address.');
      return;
    }

    setEmailError(null);
    setBusy(true);
    setPostLoginRedirect(redirectPath);
    try {
      await sendCode({ email: trimmed });
      setView('otp');
      setResendSeconds(RESEND_SECONDS);
      setOtp('');
    } catch (error) {
      console.error('Failed to send code', error);
      setEmailError('Could not send the code. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleResend = async () => {
    if (resendSeconds > 0 || busy || !email) return;
    setBusy(true);
    try {
      await sendCode({ email });
      setResendSeconds(RESEND_SECONDS);
      setOtp('');
      setOtpError(false);
    } catch (error) {
      console.error('Failed to resend code', error);
    } finally {
      setBusy(false);
    }
  };

  const handleWallet = () => {
    if (!ready || busy) return;
    setPostLoginRedirect(redirectPath);
    connectWallet();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#ececec] p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="awebo-login-title"
    >
      {view === 'welcome' ? (
        <div className="my-auto w-full max-w-[420px]">
          <div className="mb-8 flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0 pt-0.5">
              <h1
                id="awebo-login-title"
                className="font-helvetica text-[2rem] font-medium leading-[1.05] tracking-tight text-[#1a2744] sm:text-[2.25rem]"
              >
                WELCOME BACK.
              </h1>
              <p className="mt-2.5 text-sm text-gray-500 sm:text-base">
                Sign in to continue to AWEBO
              </p>
            </div>
            <Image
              src={AWEBO_BIRD}
              alt=""
              width={96}
              height={96}
              className="h-[4.25rem] w-[4.25rem] shrink-0 object-contain sm:h-24 sm:w-24"
              priority
            />
          </div>

          <div className="space-y-3">
            <SocialButton
              label="Continue with Google"
              icon={<GoogleIcon />}
              onClick={() => void handleOAuth('google')}
              disabled={!ready || busy || oauthLoading}
            />
            <SocialButton
              label="Continue with Apple"
              icon={<AppleIcon />}
              onClick={() => void handleOAuth('apple')}
              disabled={!ready || busy || oauthLoading}
            />
            <SocialButton
              label="Continue with GitHub"
              icon={<GitHubIcon />}
              onClick={() => void handleOAuth('github')}
              disabled={!ready || busy || oauthLoading}
            />
            <SocialButton
              label="Continue with Instagram"
              icon={<InstagramIcon />}
              onClick={() => void handleOAuth('instagram')}
              disabled={!ready || busy || oauthLoading}
            />
          </div>

          <form onSubmit={handleEmailSubmit} className="mt-4 flex gap-2">
            <div className="relative min-w-0 flex-1">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-900"
                aria-hidden="true"
              />
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailError(null);
                }}
                placeholder="name@example.com"
                autoComplete="email"
                className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={!ready || busy}
              aria-label="Continue with email"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
          {emailError ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {emailError}
            </p>
          ) : null}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">
              Or connect wallet
            </span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="space-y-3">
            <SocialButton
              label="Continue with Metamask"
              icon={<MetaMaskIcon />}
              onClick={handleWallet}
              disabled={!ready || busy}
            />
            <SocialButton
              label="Continue with Phantom"
              icon={<PhantomIcon />}
              onClick={handleWallet}
              disabled={!ready || busy}
            />
            <SocialButton
              label="Use other wallets"
              icon={<Wallet className="h-5 w-5 text-gray-900" />}
              onClick={handleWallet}
              disabled={!ready || busy}
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-8 w-full text-center text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            Cancel
          </button>

          <p className="mt-10 text-center text-xs text-gray-400">
            © 2026 AWEBO. All rights reserved.
          </p>
        </div>
      ) : (
        <div className="my-auto w-full max-w-[420px] rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <button
            type="button"
            onClick={() => {
              setView('welcome');
              setOtp('');
              setOtpError(false);
            }}
            aria-label="Back to sign in"
            className="mb-6 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white transition-colors hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
            <Mail className="h-5 w-5 text-gray-900" aria-hidden="true" />
          </div>

          <h2 className="text-center text-2xl font-bold text-[#1a2744] sm:text-3xl">
            Check your inbox
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-gray-700">{email}</span>
          </p>

          <div className="mt-8">
            <OtpCodeInput
              value={otp}
              onChange={setOtp}
              disabled={busy || emailState.status === 'submitting-code'}
              error={otpError}
            />
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Enter the code to sign in.
          </p>

          <p className="mt-4 text-center text-sm text-gray-400">
            {resendSeconds > 0 ? (
              <>Resend code in {resendSeconds}s</>
            ) : (
              <button
                type="button"
                onClick={() => void handleResend()}
                disabled={busy}
                className="font-medium text-gray-600 transition-colors hover:text-gray-900 disabled:opacity-60"
              >
                Resend code
              </button>
            )}
          </p>

          {otpError ? (
            <p className="mt-3 text-center text-sm text-red-600" role="alert">
              Invalid code. Try again.
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => {
              setView('welcome');
              setOtp('');
              setOtpError(false);
            }}
            className="mt-8 flex w-full items-center justify-center gap-1 text-sm text-gray-400 transition-colors hover:text-gray-600"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Use a different email
          </button>
        </div>
      )}
    </div>
  );
}
