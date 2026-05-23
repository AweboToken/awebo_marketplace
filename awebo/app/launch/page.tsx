'use client';

import { useEffect } from 'react';
import LaunchWizard from './LaunchWizard';
import { initReferralFromUrl } from '@/lib/referral';

export default function LaunchPage() {
  useEffect(() => {
    initReferralFromUrl();
  }, []);

  return <LaunchWizard />;
}
