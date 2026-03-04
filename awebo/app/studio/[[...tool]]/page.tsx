'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';
import { isSanityConfigured } from '@/sanity/env';

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 p-8 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Sanity Studio not configured</h1>
        <p className="max-w-md text-gray-600">
          Add <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{' '}
          <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm">NEXT_PUBLIC_SANITY_DATASET</code> to your{' '}
          <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm">.env.local</code> and restart the dev server.
        </p>
        <a href="/" className="text-air-force-blue hover:underline">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <NextStudio config={config} />
    </div>
  );
}
