'use client';

import Image from 'next/image';
import { Instagram, Twitter } from 'lucide-react';
import type { LaunchWizardValues } from '@/lib/launch-wizard-types';
import { getCategoryBySlug } from '@/lib/marketplace-data';
import { LAUNCH_GLASS_PANEL } from '@/lib/launch-wizard-ui';
import { STEPS } from './launch-steps';

type BrandLaunchPreviewProps = {
  values: LaunchWizardValues;
  stepIndex: number;
  /** When true, preview sits inside a parent glass panel (no extra sticky shell). */
  embedded?: boolean;
};

function PreviewRow({ label, value }: { label: string; value: string }) {
  if (!value.trim()) return null;
  return (
    <div className="flex justify-between gap-3 text-xs">
      <span className="text-white/55 shrink-0">{label}</span>
      <span className="text-white font-medium text-right truncate">{value}</span>
    </div>
  );
}

export default function BrandLaunchPreview({
  values,
  stepIndex,
  embedded = false,
}: BrandLaunchPreviewProps) {
  const step = STEPS[stepIndex];
  const displayName = values.brandName.trim() || 'Your brand';
  const displaySymbol = values.symbol.trim().toUpperCase() || 'TICKER';
  const communityPct = 100 - values.ownerPct;

  const sectionShell = embedded
    ? 'rounded-xl border border-white/10 bg-white/5'
    : LAUNCH_GLASS_PANEL;

  return (
    <div className={embedded ? 'p-4 sm:p-5' : 'sticky top-28'}>
      <p className="text-xs font-semibold uppercase tracking-wide text-white/60 mb-3">
        Live preview
      </p>

      <div className={`overflow-hidden ${sectionShell}`}>
        <div className="relative h-28 sm:h-32 bg-gradient-to-r from-violet-900/40 to-air-force-blue/30">
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
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-4 border-white/20 bg-black/40 shadow-md flex items-center justify-center">
              {values.logoUrl ? (
                <Image
                  src={values.logoUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-violet-200">
                  {displayName.slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 pb-1">
              <p className="font-bold text-white truncate">{displayName}</p>
              <p className="text-xs font-semibold text-violet-200 tracking-wide">
                ${displaySymbol}
              </p>
            </div>
          </div>

          <p className="text-sm text-white/75 line-clamp-4 text-pretty min-h-[3.5rem]">
            {values.story.trim() || 'Your narrative appears here as you type…'}
          </p>

          {(values.twitter.trim() || values.instagram.trim()) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {values.twitter.trim() ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/85">
                  <Twitter className="h-3 w-3" aria-hidden />
                  X
                </span>
              ) : null}
              {values.instagram.trim() ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/85">
                  <Instagram className="h-3 w-3" aria-hidden />
                  IG
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className={`mt-4 p-4 space-y-3 ${sectionShell}`}>
        <p className="text-xs font-semibold uppercase text-white/60">
          {step.label}
        </p>

        {stepIndex >= 1 && (
          <div className="space-y-2">
            {values.collectionName.trim() ? (
              <PreviewRow label="Collection" value={values.collectionName.trim()} />
            ) : null}
            {values.categorySlug ? (
              <PreviewRow
                label="Category"
                value={getCategoryBySlug(values.categorySlug)?.label ?? values.categorySlug}
              />
            ) : null}
            {values.collectionDescription.trim() ? (
              <p className="text-xs text-white/65 line-clamp-3">{values.collectionDescription.trim()}</p>
            ) : null}
            <p className="text-xs text-white/55">
              Products ({values.products.length})
            </p>
            {values.products.length === 0 ? (
              <p className="text-xs text-white/50">Select base products in step 2.</p>
            ) : (
              <ul className="space-y-1.5">
                {values.products.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="text-white/90 truncate">{p.name}</span>
                    <span className="shrink-0 rounded-full bg-white/10 border border-white/15 px-2 py-0.5 font-medium text-white/75">
                      {p.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {stepIndex >= 2 && (
          <div className="space-y-2 border-t border-white/15 pt-3">
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
          <p className="text-xs text-white/70 border-t border-white/15 pt-3">
            Ready to publish when checklist and pricing are complete.
          </p>
        )}
      </div>
    </div>
  );
}
