import Link from 'next/link';
import type { ReactNode } from 'react';

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
    <div className="min-h-screen bg-[#f1f5f5] text-gray-900">
      <header className="border-b border-gray-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4">
          <Link
            href="/awebo-marketplace"
            className="text-sm font-medium text-air-force-blue no-underline hover:underline underline-offset-2"
          >
            ← Marketplace preview
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
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
      </main>
    </div>
  );
}
