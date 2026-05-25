import Link from 'next/link';
import type { ReactNode } from 'react';
import Navigation from '@/components/Navigation';

function normalizeParams(searchParams: { [key: string]: string | string[] | undefined }) {
  return Object.entries(searchParams).filter(([, v]) => v !== undefined && v !== '');
}

export function DiscoveryListingPageLayout({
  title,
  description,
  searchParams,
  emptyMessage,
}: {
  title: string;
  description: ReactNode;
  searchParams: { [key: string]: string | string[] | undefined };
  emptyMessage: string;
}) {
  const pairs = normalizeParams(searchParams);

  return (
    <div className="flex min-h-screen flex-col bg-[#f1f5f5] font-sans text-gray-900">
      <Navigation variant="landing" landingTheme="surface" />
      <main className="mx-auto max-w-3xl flex-1 px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        <div className="mt-2 text-sm text-gray-600">{description}</div>
        {pairs.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Active filters">
            {pairs.map(([key, raw]) => {
              const val = Array.isArray(raw) ? raw.join(', ') : raw;
              return (
                <li
                  key={key}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700"
                >
                  <span className="text-gray-500">{key}</span>
                  <span className="mx-1 text-gray-300">:</span>
                  {val}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-6 text-sm text-gray-500">{emptyMessage}</p>
        )}
        <Link
          href="/marketplace"
          className="mt-8 inline-block text-sm font-medium text-air-force-blue no-underline hover:underline underline-offset-2"
        >
          ← Back to marketplace
        </Link>
      </main>
    </div>
  );
}
