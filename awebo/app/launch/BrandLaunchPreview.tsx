'use client';

import Image from 'next/image';
import { Instagram, Twitter } from 'lucide-react';
import type { LaunchWizardValues } from '@/lib/launch-wizard-types';
import { STEPS } from './launch-steps';

type BrandLaunchPreviewProps = {
  values: LaunchWizardValues;
  stepIndex: number;
};

function PreviewRow({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div className="flex justify-between gap-3 text-xs">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-900 font-medium text-right truncate">{value}</span>
    </div>
  );
}

export default function BrandLaunchPreview({ values, stepIndex }: BrandLaunchPreviewProps) {
  const step = STEPS[stepIndex];
  const displayName = values.brandName.trim() || 'Your brand';
  const displaySymbol = values.symbol.trim().toUpperCase() || 'TICKER';
  const communityPct = 100 - values.ownerPct;

  return (
    <div className="sticky top-24">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
        Live preview
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="relative h-28 sm:h-32 bg-gradient-to-r from-air-force-blue/35 to-steel-blue/45">
          {values.bannerUrl ? (
            <Image
              src={values.bannerUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : null}
        </div>

        <div className="relative px-4 pb-4">
          <div className="-mt-8 mb-3 flex items-end gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-md flex items-center justify-center">
              {values.logoUrl ? (
                <Image
                  src={values.logoUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-air-force-blue">
                  {displayName.slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 pb-1">
              <p className="font-bold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs font-semibold text-air-force-blue tracking-wide">
                ${displaySymbol}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-4 text-pretty min-h-[3.5rem]">
            {values.story.trim() || 'Your narrative appears here as you type…'}
          </p>

          {(values.twitter.trim() || values.instagram.trim()) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {values.twitter.trim() ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700">
                  <Twitter className="h-3 w-3" aria-hidden />
                  X
                </span>
              ) : null}
              {values.instagram.trim() ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700">
                  <Instagram className="h-3 w-3" aria-hidden />
                  IG
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4 space-y-3">
        <p className="text-xs font-semibold uppercase text-gray-500">
          {step.label}
        </p>

        {stepIndex >= 1 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Products</p>
            <ul className="space-y-1.5">
              {values.products.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="text-gray-800 truncate">{p.name}</span>
                  <span className="shrink-0 rounded-full bg-white border border-gray-200 px-2 py-0.5 font-medium text-gray-600">
                    {p.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {stepIndex >= 2 && (
          <div className="space-y-2 border-t border-gray-200 pt-3">
            <PreviewRow label="Mode" value={values.launchMode === 'self' ? 'Self-funded' : 'Community funding'} />
            <PreviewRow label="Chain" value={values.chain} />
            <PreviewRow label="Supply" value={values.supply} />
            <PreviewRow label="Owner / community" value={`${values.ownerPct}% / ${communityPct}%`} />
            <PreviewRow label="Max per wallet" value={`${values.maxWalletPct}%`} />
            {values.launchMode === 'crowdfund' && values.whitelist ? (
              <PreviewRow label="Whitelist" value="Enabled" />
            ) : null}
          </div>
        )}

        {stepIndex === 3 && (
          <p className="text-xs text-gray-600 border-t border-gray-200 pt-3">
            Ready to publish when checklist and pricing are complete.
          </p>
        )}
      </div>
    </div>
  );
}
