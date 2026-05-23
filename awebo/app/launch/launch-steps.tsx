'use client';

import Link from 'next/link';
import { useState, type ChangeEvent } from 'react';
import type {
  LaunchWizardValues,
  LaunchWizardValuesPatch,
} from '@/lib/launch-wizard-types';

export type LaunchStepProps = {
  values: LaunchWizardValues;
  onChange: (patch: LaunchWizardValuesPatch) => void;
};

export const STEPS = [
  {
    id: 'brand-setup',
    label: 'Brand setup',
    description: 'Visual identity, narrative, social links, and live profile preview.',
  },
  {
    id: 'catalog-products',
    label: 'Catalog & products',
    description: 'Browse bases, design placements, variants, and manage drafts.',
  },
  {
    id: 'brand-contract',
    label: 'Brand contract',
    description: 'Chain, supply split, self-funded vs community funding, contract creation.',
  },
  {
    id: 'review-publish',
    label: 'Review & publish',
    description: 'Final checklist, sale prices, optional sample order, publish.',
  },
] as const;

function uploadPreview(
  e: ChangeEvent<HTMLInputElement>,
  key: 'bannerUrl' | 'logoUrl',
  onChange: (patch: LaunchWizardValuesPatch) => void
) {
  const file = e.target.files?.[0];
  if (!file) return;
  onChange({ [key]: URL.createObjectURL(file) });
}

export function BrandSetupStep({
  values,
  onChange,
  onNext,
  onCancel,
}: LaunchStepProps & { onNext: () => void; onCancel: () => void }) {
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Visual identity and story</h2>
      <p className="text-gray-600 mb-6 text-sm text-pretty">
        Set brand name, uploads, symbol, narrative, and socials. Your preview updates on the right.
      </p>
      <div className="space-y-4 max-w-xl">
        <div>
          <label htmlFor="bs-name" className="block text-xs font-medium uppercase text-gray-500 mb-1">
            Brand name
          </label>
          <input
            id="bs-name"
            name="brandName"
            type="text"
            placeholder="Your brand name…"
            value={values.brandName}
            onChange={(e) => onChange({ brandName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 text-sm"
          />
        </div>
        <div>
          <label htmlFor="bs-banner" className="block text-xs font-medium uppercase text-gray-500 mb-1">
            Banner
          </label>
          <label
            htmlFor="bs-banner"
            className="border-2 border-dashed border-gray-300 rounded-xl h-28 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:border-air-force-blue/50 hover:bg-gray-50"
          >
            {values.bannerUrl ? 'Banner uploaded — click to replace' : 'Upload banner (recommended wide ratio)'}
          </label>
          <input
            id="bs-banner"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => uploadPreview(e, 'bannerUrl', onChange)}
          />
        </div>
        <div>
          <label htmlFor="bs-logo" className="block text-xs font-medium uppercase text-gray-500 mb-1">
            Logo
          </label>
          <label
            htmlFor="bs-logo"
            className="border-2 border-dashed border-gray-300 rounded-xl h-24 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:border-air-force-blue/50 hover:bg-gray-50"
          >
            {values.logoUrl ? 'Logo uploaded — click to replace' : 'Upload logo'}
          </label>
          <input
            id="bs-logo"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => uploadPreview(e, 'logoUrl', onChange)}
          />
        </div>
        <div>
          <label htmlFor="bs-symbol" className="block text-xs font-medium uppercase text-gray-500 mb-1">
            Brand symbol / ticker
          </label>
          <input
            id="bs-symbol"
            name="symbol"
            type="text"
            placeholder="e.g. BRND…"
            maxLength={10}
            spellCheck={false}
            value={values.symbol}
            onChange={(e) => onChange({ symbol: e.target.value.toUpperCase() })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-sm uppercase"
          />
        </div>
        <div>
          <label htmlFor="bs-story" className="block text-xs font-medium uppercase text-gray-500 mb-1">
            Narrative / story
          </label>
          <textarea
            id="bs-story"
            name="story"
            placeholder="Tell your story…"
            value={values.story}
            onChange={(e) => onChange({ story: e.target.value })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 placeholder:text-gray-400 resize-none text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">{values.story.length} characters</p>
        </div>
        <div>
          <span className="block text-xs font-medium uppercase text-gray-500 mb-2">Social links</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="url"
              name="twitter"
              placeholder="X / Twitter URL…"
              value={values.twitter}
              onChange={(e) => onChange({ twitter: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="url"
              name="instagram"
              placeholder="Instagram URL…"
              value={values.instagram}
              onChange={(e) => onChange({ instagram: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-8 max-w-xl">
        <button type="button" onClick={onCancel} className="text-gray-600 hover:text-gray-900 font-medium text-sm">
          Cancel
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-air-force-blue text-white font-semibold px-5 py-2.5 text-sm hover:bg-air-force-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
        >
          Continue
        </button>
      </div>
    </>
  );
}

export function CatalogProductsStep({
  values,
  onChange: _onChange,
  onNext,
  onPrev,
}: LaunchStepProps & { onNext: () => void; onPrev: () => void }) {
  const [editorOpen, setEditorOpen] = useState(false);
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Catalog and products</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Mega categories, listing, filters, PDP with base cost, then product editor overlay.
      </p>

      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-6">
        <p className="text-xs font-semibold uppercase text-gray-500 mb-2">Catalog home (mock)</p>
        <label htmlFor="cat-search" className="sr-only">
          Search catalog
        </label>
        <input
          id="cat-search"
          type="search"
          placeholder="Search bases…"
          className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm mb-3"
        />
        <div className="flex flex-wrap gap-2">
          {['Men', 'Women', 'Kids', 'Home', 'Misc'].map((c) => (
            <span key={c} className="rounded-full bg-white border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
              {c}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Topics: Bestsellers, New arrivals, Seasonal (rotating 6–8).</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <button
          type="button"
          onClick={() => setEditorOpen(true)}
          className="rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
        >
          Start designing (overlay)
        </button>
        <Link href="/marketplace/category/ropa-zapatos" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 no-underline hover:bg-white">
          Open marketplace category (reference)
        </Link>
      </div>

      {editorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 overscroll-contain"
          role="dialog"
          aria-modal="true"
          aria-labelledby="editor-title"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white border border-gray-200 shadow-xl p-6 max-h-[85vh] overflow-y-auto">
            <h3 id="editor-title" className="text-lg font-bold text-gray-900 mb-2">
              Product editor
            </h3>
            <p className="text-sm text-gray-600 mb-4">Upload artwork · Front / Back / Label · Colors / sizes · Mockups · Save or discard.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex items-center justify-center text-sm text-gray-500 mb-4">
              Artwork upload area
            </div>
            <div className="flex gap-2 mb-4">
              {['Front', 'Back', 'Label'].map((v) => (
                <button key={v} type="button" className="flex-1 rounded-lg border border-gray-300 py-2 text-xs font-semibold hover:bg-gray-50">
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditorOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700">
                Discard
              </button>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="rounded-lg bg-air-force-blue text-white px-4 py-2 text-sm font-semibold"
              >
                Save product
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-900">My products / collections</p>
          <p className="text-xs text-gray-500">Statuses: Draft · Pricing · Ready</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-100">
              <th className="px-4 py-2 font-medium">Product</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {values.products.map((product, index) => (
              <tr
                key={product.id}
                className={index < values.products.length - 1 ? 'border-b border-gray-50' : undefined}
              >
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.status === 'Draft'
                        ? 'bg-amber-100 text-amber-900'
                        : product.status === 'Pricing'
                          ? 'bg-sky-100 text-sky-900'
                          : 'bg-green-100 text-green-900'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-8">
        <button type="button" onClick={onPrev} className="text-gray-600 hover:text-gray-900 font-medium text-sm">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="rounded-lg bg-air-force-blue text-white font-semibold px-5 py-2.5 text-sm">
          Continue
        </button>
      </div>
    </>
  );
}

export function BrandContractStep({
  values,
  onChange,
  onNext,
  onPrev,
}: LaunchStepProps & { onNext: () => void; onPrev: () => void }) {
  const communityPct = 100 - values.ownerPct;
  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Brand contract</h2>
      <p className="text-gray-600 mb-6 text-sm text-pretty">
        Self-funded: no shares, no whitelist, no crowdfunding. Community path: holder mechanics, optional whitelist, max per wallet, then wallet sign.
      </p>

      <fieldset className="space-y-3 mb-6">
        <legend className="text-sm font-semibold text-gray-800 mb-2">Launch mode</legend>
        <label className="flex gap-3 rounded-xl border-2 border-gray-200 p-4 cursor-pointer has-[:checked]:border-air-force-blue has-[:checked]:bg-air-force-blue/5">
          <input type="radio" name="launchMode" checked={values.launchMode === 'self'} onChange={() => onChange({ launchMode: 'self' })} className="mt-1" />
          <span>
            <span className="font-medium text-gray-900">Sell directly to marketplace</span>
            <span className="block text-xs text-gray-600 mt-1">Self-funded — not required: shares, whitelist, or crowdfunding.</span>
          </span>
        </label>
        <label className="flex gap-3 rounded-xl border-2 border-gray-200 p-4 cursor-pointer has-[:checked]:border-air-force-blue has-[:checked]:bg-air-force-blue/5">
          <input type="radio" name="launchMode" checked={values.launchMode === 'crowdfund'} onChange={() => onChange({ launchMode: 'crowdfund' })} className="mt-1" />
          <span>
            <span className="font-medium text-gray-900">Launch with community funding</span>
            <span className="block text-xs text-gray-600 mt-1">Crowdfunding path with progress, supporters, and share mechanics.</span>
          </span>
        </label>
      </fieldset>

      <div className="space-y-4 max-w-xl mb-6">
        <div>
          <span className="block text-xs font-semibold uppercase text-gray-700 mb-2">Chain</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Base', 'Ethereum', 'Polygon', 'Arbitrum'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ chain: c })}
                className={`rounded-lg border-2 py-2 text-xs font-medium ${
                  c === values.chain
                    ? 'border-air-force-blue bg-air-force-blue/5 text-gray-900'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="supply" className="block text-xs font-semibold uppercase text-gray-700 mb-1">
            Fixed supply
          </label>
          <input id="supply" type="text" value={values.supply} readOnly className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-gray-50 text-gray-700" />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Owner %</span>
            <span className="font-medium tabular-nums">{values.ownerPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={values.ownerPct}
            onChange={(e) => onChange({ ownerPct: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm mt-2 text-gray-600">
            <span>Community %</span>
            <span className="font-medium tabular-nums">{communityPct}%</span>
          </div>
        </div>
        <div>
          <label htmlFor="max-wallet" className="block text-xs font-semibold uppercase text-gray-700 mb-1">
            Max % per wallet
          </label>
          <input
            id="max-wallet"
            type="number"
            value={values.maxWalletPct}
            min={1}
            max={100}
            onChange={(e) => onChange({ maxWalletPct: Number(e.target.value) || 0 })}
            className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm tabular-nums"
          />
        </div>
        {values.launchMode === 'crowdfund' && (
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              name="whitelist"
              checked={values.whitelist}
              onChange={(e) => onChange({ whitelist: e.target.checked })}
              className="rounded border-gray-300"
            />
            Enable whitelist option
          </label>
        )}
      </div>

      <button
        type="button"
        className="rounded-lg border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 mb-8"
      >
        Create contract (wallet sign)
      </button>
      <p className="text-xs text-gray-500 mb-8">After deploy: show contract address · live on marketplace when self-funded, or fundraising page when raising.</p>

      <div className="flex items-center justify-between">
        <button type="button" onClick={onPrev} className="text-gray-600 hover:text-gray-900 font-medium text-sm">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="rounded-lg bg-air-force-blue text-white font-semibold px-5 py-2.5 text-sm">
          Continue
        </button>
      </div>
    </>
  );
}

export function ReviewPublishStep({
  values,
  onPrev,
}: LaunchStepProps & { onPrev: () => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [published, setPublished] = useState(false);
  const fundraising = values.launchMode === 'crowdfund';

  return (
    <>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Review and publish</h2>
      <p className="text-gray-600 mb-6 text-sm">Checklist, mandatory final sale price for every product, optional sample order (does not block publish).</p>

      <ul className="space-y-2 mb-6 text-sm">
        <li className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="rounded border-gray-300" id="c1" />
          <label htmlFor="c1">Brand setup completed</label>
        </li>
        <li className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="rounded border-gray-300" id="c2" />
          <label htmlFor="c2">Products ready</label>
        </li>
        <li className="flex items-center gap-2">
          <input type="checkbox" className="rounded border-gray-300" id="c3" />
          <label htmlFor="c3">Pricing set for all products (required)</label>
        </li>
        <li className="flex items-center gap-2">
          <input type="checkbox" className="rounded border-gray-300" id="c4" />
          <label htmlFor="c4">Public vs private (whitelist) if applicable</label>
        </li>
      </ul>

      <div className="rounded-xl border border-gray-200 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase text-gray-500 bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-2 font-medium">Product</th>
              <th className="px-4 py-2 font-medium">Final sale price (required)</th>
            </tr>
          </thead>
          <tbody>
            {values.products.map((product, index) => (
              <tr
                key={product.id}
                className={index < values.products.length - 1 ? 'border-b border-gray-100' : undefined}
              >
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">
                  <input
                    type="number"
                    placeholder="USD…"
                    className="w-28 rounded border border-gray-300 px-2 py-1 text-sm tabular-nums"
                    aria-label={`Final price ${product.name}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-600 mb-6">
        Optional: order sample from My products / Review — optional and does not block publishing.
      </p>

      {published ? (
        <div className="rounded-xl border border-air-force-blue/30 bg-air-force-blue/5 p-6 mb-6">
          <p className="font-semibold text-gray-900 mb-2">Published</p>
          <p className="text-sm text-gray-700 mb-4">
            {fundraising
              ? 'Fundraising is active — send creators to the fundraising page.'
              : 'Brand and products are live in the marketplace.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={fundraising ? '/marketplace/brand/lumen-atelier/fundraising' : '/marketplace'}
              className="rounded-lg bg-air-force-blue px-4 py-2 text-sm font-semibold text-gray-900 no-underline hover:bg-air-force-blue/90"
            >
              {fundraising ? 'Open fundraising page' : 'View marketplace'}
            </Link>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        <button type="button" onClick={onPrev} className="text-gray-600 hover:text-gray-900 font-medium text-sm">
          ← Back
        </button>
        {!published && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-air-force-blue text-white font-semibold px-6 py-2.5 text-sm"
          >
            Publish
          </button>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overscroll-contain" role="alertdialog" aria-labelledby="pub-title" aria-describedby="pub-desc">
          <div className="max-w-md w-full rounded-2xl bg-white border border-gray-200 p-6 shadow-xl">
            <h3 id="pub-title" className="text-lg font-bold text-gray-900 mb-2">
              Confirm publish
            </h3>
            <p id="pub-desc" className="text-sm text-gray-600 mb-6">
              Publishing locks editing if fundraising. You can still adjust copy later for self-funded launches depending on policy — confirm to proceed.
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setPublished(true);
                }}
                className="rounded-lg bg-air-force-blue text-white px-4 py-2 text-sm font-semibold"
              >
                Confirm publish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
