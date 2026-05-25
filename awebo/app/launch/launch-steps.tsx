'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type ChangeEvent } from 'react';
import {
  LAUNCH_FORM_ROOT,
  LAUNCH_GLASS_BUTTON_PRIMARY,
  LAUNCH_GLASS_BUTTON_SECONDARY,
  LF,
} from '@/lib/launch-wizard-ui';
import {
  getCategoryBySlug,
  getProductsForCategory,
  MARKETPLACE_CATEGORIES,
  TOPIC_RAILS,
  type LaunchCatalogProduct,
} from '@/lib/marketplace-data';
import {
  isProductInCollection,
  removeProductFromCollection,
  toggleProductInCollection,
} from '@/lib/launch-catalog-selection';
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
    <div className={LAUNCH_FORM_ROOT}>
      <h2 className={LF.heading}>Visual identity and story</h2>
      <p className={LF.lead}>
        Set brand name, uploads, symbol, narrative, and socials. Your preview updates on the right.
      </p>
      <div className="space-y-4 max-w-xl">
        <div>
          <label htmlFor="bs-name" className={LF.label}>
            Brand name
          </label>
          <input
            id="bs-name"
            name="brandName"
            type="text"
            placeholder="Your brand name…"
            value={values.brandName}
            onChange={(e) => onChange({ brandName: e.target.value })}
            className={LF.input}
          />
        </div>
        <div>
          <label htmlFor="bs-banner" className={LF.label}>
            Banner
          </label>
          <label htmlFor="bs-banner" className={LF.uploadZone}>
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
          <label htmlFor="bs-logo" className={LF.label}>
            Logo
          </label>
          <label htmlFor="bs-logo" className={LF.uploadZoneSm}>
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
          <label htmlFor="bs-symbol" className={LF.label}>
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
            className={`${LF.input} uppercase`}
          />
        </div>
        <div>
          <label htmlFor="bs-story" className={LF.label}>
            Narrative / story
          </label>
          <textarea
            id="bs-story"
            name="story"
            placeholder="Tell your story…"
            value={values.story}
            onChange={(e) => onChange({ story: e.target.value })}
            rows={4}
            className={LF.textarea}
          />
          <p className={`${LF.muted} mt-1`}>{values.story.length} characters</p>
        </div>
        <div>
          <span className={LF.labelBlock}>Social links</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="url"
              name="twitter"
              placeholder="X / Twitter URL…"
              value={values.twitter}
              onChange={(e) => onChange({ twitter: e.target.value })}
              className={LF.inputSm}
            />
            <input
              type="url"
              name="instagram"
              placeholder="Instagram URL…"
              value={values.instagram}
              onChange={(e) => onChange({ instagram: e.target.value })}
              className={LF.inputSm}
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-8 max-w-xl">
        <button type="button" onClick={onCancel} className={LF.btnGhost}>
          Cancel
        </button>
        <button type="button" onClick={onNext} className={LAUNCH_GLASS_BUTTON_PRIMARY}>
          Continue
        </button>
      </div>
    </div>
  );
}

export function CatalogProductsStep({
  values,
  onChange,
  onNext,
  onPrev,
}: LaunchStepProps & { onNext: () => void; onPrev: () => void }) {
  const [editorOpen, setEditorOpen] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const selectedCategory = values.categorySlug
    ? getCategoryBySlug(values.categorySlug)
    : undefined;
  const categoryProducts = values.categorySlug
    ? getProductsForCategory(values.categorySlug)
    : [];

  const toggleCatalogProduct = (catalogProduct: LaunchCatalogProduct) => {
    onChange({
      products: toggleProductInCollection(values.products, catalogProduct),
    });
    setStepError(null);
  };

  const handleContinue = () => {
    if (!values.collectionName.trim()) {
      setStepError('Add a collection name before continuing.');
      return;
    }
    if (values.products.length === 0) {
      setStepError('Select at least one base product for your collection.');
      return;
    }
    setStepError(null);
    onNext();
  };

  return (
    <>
      <div className={LAUNCH_FORM_ROOT}>
        <h2 className={LF.heading}>Catalog and products</h2>
        <p className={`${LF.lead} text-pretty`}>
          Name your collection, pick a category, add base products, then customize designs before
          publish.
        </p>

        <div className={`${LF.panel} mb-6 space-y-4`}>
          <div>
            <p className={LF.panelTitle}>Collection</p>
            <p className={`${LF.muted} mb-3`}>
              Each brand can have multiple collections. This launch creates one collection under{' '}
              {values.brandName.trim() || 'your brand'}.
            </p>
          </div>
          <div>
            <label htmlFor="collection-name" className={LF.label}>
              Collection name
            </label>
            <input
              id="collection-name"
              type="text"
              placeholder="e.g. Genesis drop, Summer 2026…"
              value={values.collectionName}
              onChange={(event) => onChange({ collectionName: event.target.value })}
              className={LF.input}
            />
          </div>
          <div>
            <label htmlFor="collection-description" className={LF.label}>
              Collection description
            </label>
            <textarea
              id="collection-description"
              placeholder="What makes this drop special?"
              value={values.collectionDescription}
              onChange={(event) => onChange({ collectionDescription: event.target.value })}
              rows={3}
              className={LF.textarea}
            />
          </div>
        </div>

        <div className={`${LF.panel} mb-6`}>
          <p className={LF.panelTitle}>Category</p>
          <label htmlFor="cat-search" className="sr-only">
            Search catalog
          </label>
          <input
            id="cat-search"
            type="search"
            placeholder="Search bases…"
            className={`${LF.inputSm} mb-4 max-w-md`}
          />
          <div className="flex flex-wrap gap-2" aria-label="Marketplace categories">
            {MARKETPLACE_CATEGORIES.map((category) => {
              const isSelected = values.categorySlug === category.slug;
              return (
                <button
                  key={category.slug}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onChange({ categorySlug: category.slug })}
                  className={isSelected ? LF.chipActive : LF.chip}
                >
                  {category.shortLabel ?? category.label}
                </button>
              );
            })}
          </div>
          <p className={`${LF.muted} mt-3`}>
            Topics: {TOPIC_RAILS.map((topic) => topic.title).join(' · ')}.
          </p>
        </div>

        {selectedCategory ? (
          <div className={`${LF.panel} mb-6`}>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={LF.panelTitle}>Select base products</p>
                <h3 className="text-lg font-semibold text-white">{selectedCategory.label}</h3>
                <p className={`${LF.muted} mt-1`}>
                  Click a product to add or remove it from{' '}
                  {values.collectionName.trim() || 'your collection'}.
                </p>
              </div>
            </div>

            {categoryProducts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-white/70">
                No base products in this category yet. Pick another category.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categoryProducts.map((product) => {
                  const selected = isProductInCollection(values.products, product.id);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleCatalogProduct(product)}
                      className={`overflow-hidden rounded-xl border text-left transition-colors ${
                        selected
                          ? 'border-air-force-blue/60 bg-air-force-blue/15 ring-1 ring-air-force-blue/40'
                          : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
                      }`}
                    >
                      <div
                        className={`aspect-[4/5] bg-gradient-to-br ${product.imageTone} relative`}
                        aria-hidden
                      >
                        <Image
                          src={product.imageUrl}
                          alt=""
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        {selected ? (
                          <span className="absolute right-2 top-2 rounded-full bg-air-force-blue px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                            Added
                          </span>
                        ) : null}
                      </div>
                      <div className="space-y-1 p-3">
                        <p className="text-sm font-semibold text-white line-clamp-2">{product.name}</p>
                        <p className="text-xs text-white/60">{product.brandName}</p>
                        <p className="text-sm font-medium tabular-nums text-white/90">
                          ${product.priceUsd.toFixed(2)}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <p className={`${LF.muted} mb-6`}>Select a category above to browse base products.</p>
        )}

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            disabled={values.products.length === 0}
            className={`${LAUNCH_GLASS_BUTTON_PRIMARY} disabled:cursor-not-allowed disabled:opacity-50`}
          >
            Start designing (overlay)
          </button>
        </div>

        <div className={LF.tableWrap}>
          <div className="border-b border-white/15 bg-white/5 px-4 py-3">
            <p className="text-sm font-semibold text-white">
              My products
              {values.collectionName.trim() ? ` · ${values.collectionName.trim()}` : ''}
            </p>
            <p className={LF.muted}>
              {values.products.length}{' '}
              {values.products.length === 1 ? 'product' : 'products'} in this collection · Draft ·
              Pricing · Ready
            </p>
            {values.collectionDescription.trim() ? (
              <p className="mt-2 text-xs text-white/70 line-clamp-2">
                {values.collectionDescription.trim()}
              </p>
            ) : null}
          </div>
          {values.products.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-white/65">
              No products selected yet. Choose bases from a category above.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className={LF.tableHead}>
                  <th className="px-4 py-2 font-medium">Product</th>
                  <th className="px-4 py-2 font-medium">Category</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">
                    <span className="sr-only">Remove</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {values.products.map((product, index) => (
                  <tr
                    key={product.id}
                    className={index < values.products.length - 1 ? LF.tableRowBorder : undefined}
                  >
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3 text-white/70">
                      {getCategoryBySlug(product.categorySlug)?.shortLabel ??
                        getCategoryBySlug(product.categorySlug)?.label ??
                        product.categorySlug}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          product.status === 'Draft'
                            ? LF.statusDraft
                            : product.status === 'Pricing'
                              ? LF.statusPricing
                              : LF.statusReady
                        }
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          onChange({
                            products: removeProductFromCollection(values.products, product.id),
                          })
                        }
                        className={LF.btnGhost}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {stepError ? (
          <p className="mt-4 text-sm text-red-300" role="alert">
            {stepError}
          </p>
        ) : null}

        <div className="flex items-center justify-between mt-8">
          <button type="button" onClick={onPrev} className={LF.btnGhost}>
            ← Back
          </button>
          <button type="button" onClick={handleContinue} className={LAUNCH_GLASS_BUTTON_PRIMARY}>
            Continue
          </button>
        </div>
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
            <p className="text-sm text-gray-600 mb-4">
              Upload artwork · Front / Back / Label · Colors / sizes · Mockups · Save or discard.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-xl h-32 flex items-center justify-center text-sm text-gray-500 mb-4">
              Artwork upload area
            </div>
            <div className="flex gap-2 mb-4">
              {['Front', 'Back', 'Label'].map((v) => (
                <button
                  key={v}
                  type="button"
                  className="flex-1 rounded-lg border border-gray-300 py-2 text-xs font-semibold hover:bg-gray-50"
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700"
              >
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
    <div className={LAUNCH_FORM_ROOT}>
      <h2 className={LF.heading}>Brand contract</h2>
      <p className={LF.lead}>
        Self-funded: no shares, no whitelist, no crowdfunding. Community path: holder mechanics,
        optional whitelist, max per wallet, then wallet sign.
      </p>

      <fieldset className="space-y-3 mb-6">
        <legend className="text-sm font-semibold text-white/90 mb-2">Launch mode</legend>
        <label className={LF.radioCard}>
          <input
            type="radio"
            name="launchMode"
            checked={values.launchMode === 'self'}
            onChange={() => onChange({ launchMode: 'self' })}
            className="mt-1"
          />
          <span>
            <span className="block font-medium text-white">Sell directly to marketplace</span>
            <span className="block text-xs text-white/70 mt-1">
              Self-funded — not required: shares, whitelist, or crowdfunding.
            </span>
          </span>
        </label>
        <label className={LF.radioCard}>
          <input
            type="radio"
            name="launchMode"
            checked={values.launchMode === 'crowdfund'}
            onChange={() => onChange({ launchMode: 'crowdfund' })}
            className="mt-1"
          />
          <span>
            <span className="block font-medium text-white">Launch with community funding</span>
            <span className="block text-xs text-white/70 mt-1">
              Crowdfunding path with progress, supporters, and share mechanics.
            </span>
          </span>
        </label>
      </fieldset>

      <div className="space-y-4 max-w-xl mb-6">
        <div>
          <span className="block text-xs font-semibold uppercase text-white/70 mb-2">Chain</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Base', 'Ethereum', 'Polygon', 'Arbitrum'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ chain: c })}
                className={c === values.chain ? LF.chainBtnActive : LF.chainBtn}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="supply" className={LF.label}>
            Fixed supply
          </label>
          <input
            id="supply"
            type="text"
            value={values.supply}
            readOnly
            className={LF.readOnlyInput}
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1 text-white/70">
            <span>Owner %</span>
            <span className="font-medium tabular-nums text-white">{values.ownerPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={values.ownerPct}
            onChange={(e) => onChange({ ownerPct: Number(e.target.value) })}
            className="w-full accent-air-force-blue"
          />
          <div className="flex justify-between text-sm mt-2 text-white/70">
            <span>Community %</span>
            <span className="font-medium tabular-nums text-white">{communityPct}%</span>
          </div>
        </div>
        <div>
          <label htmlFor="max-wallet" className={LF.label}>
            Max % per wallet
          </label>
          <input
            id="max-wallet"
            type="number"
            value={values.maxWalletPct}
            min={1}
            max={100}
            onChange={(e) => onChange({ maxWalletPct: Number(e.target.value) || 0 })}
            className={`${LF.inputSm} w-32 tabular-nums`}
          />
        </div>
        {values.launchMode === 'crowdfund' && (
          <label className="flex items-center gap-2 text-sm text-white/85">
            <input
              type="checkbox"
              name="whitelist"
              checked={values.whitelist}
              onChange={(e) => onChange({ whitelist: e.target.checked })}
              className="rounded border-white/30 bg-white/10"
            />
            Enable whitelist option
          </label>
        )}
      </div>

      <button type="button" className={`${LAUNCH_GLASS_BUTTON_SECONDARY} mb-8`}>
        Create contract (wallet sign)
      </button>
      <p className={`${LF.muted} mb-8`}>
        After deploy: show contract address · live on marketplace when self-funded, or fundraising
        page when raising.
      </p>

      <div className="flex items-center justify-between">
        <button type="button" onClick={onPrev} className={LF.btnGhost}>
          ← Back
        </button>
        <button type="button" onClick={onNext} className={LAUNCH_GLASS_BUTTON_PRIMARY}>
          Continue
        </button>
      </div>
    </div>
  );
}

export function ReviewPublishStep({
  values,
  onPrev,
  ownerId,
  productPrices,
  onPricesChange,
}: LaunchStepProps & {
  onPrev: () => void;
  ownerId: string;
  productPrices: Record<string, string>;
  onPricesChange: (prices: Record<string, string>) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [published, setPublished] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishWarnings, setPublishWarnings] = useState<string[]>([]);
  const [publishedBrandSlug, setPublishedBrandSlug] = useState<string | null>(null);
  const fundraising = values.launchMode === 'crowdfund';

  const handlePublish = async () => {
    setPublishing(true);
    setPublishError(null);
    setPublishWarnings([]);

    const products = values.products.map((product) => ({
      id: product.id,
      name: product.name,
      priceUsd: Number(productPrices[product.id]),
      imageUrl: product.imageUrl,
    }));

    try {
      const response = await fetch('/api/launch/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ownerId, values, products }),
      });

      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        warnings?: string[];
        brand?: { slug?: string };
      } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? 'Publish failed.');
      }

      setPublishedBrandSlug(payload?.brand?.slug ?? null);
      setPublishWarnings(payload?.warnings ?? []);
      setModalOpen(false);
      setPublished(true);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : 'Publish failed.');
      setModalOpen(false);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      <div className={LAUNCH_FORM_ROOT}>
        <h2 className={LF.heading}>Review and publish</h2>
        <p className={LF.lead}>
          Checklist, mandatory final sale price for every product, optional sample order (does not
          block publish).
        </p>

        <ul className="space-y-2 mb-6 text-sm">
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-white/30 bg-white/10"
              id="c1"
            />
            <label htmlFor="c1">Brand setup completed</label>
          </li>
          <li className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={Boolean(values.collectionName.trim() && values.products.length)}
              className="rounded border-white/30 bg-white/10"
              id="c2"
            />
            <label htmlFor="c2">
              Collection &quot;{values.collectionName.trim() || 'Untitled'}&quot; with{' '}
              {values.products.length} product{values.products.length === 1 ? '' : 's'}
            </label>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-white/30 bg-white/10" id="c3" />
            <label htmlFor="c3">Pricing set for all products (required)</label>
          </li>
          <li className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-white/30 bg-white/10" id="c4" />
            <label htmlFor="c4">Public vs private (whitelist) if applicable</label>
          </li>
        </ul>

        <div className={`${LF.tableWrap} mb-6`}>
          <table className="w-full text-sm">
            <thead>
              <tr className={LF.tableHead}>
                <th className="px-4 py-2 font-medium">Product</th>
                <th className="px-4 py-2 font-medium">Final sale price (required)</th>
              </tr>
            </thead>
            <tbody>
              {values.products.map((product, index) => (
                <tr
                  key={product.id}
                  className={index < values.products.length - 1 ? LF.tableRowBorder : undefined}
                >
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="USD…"
                      value={productPrices[product.id] ?? ''}
                      onChange={(event) =>
                        onPricesChange({
                          ...productPrices,
                          [product.id]: event.target.value,
                        })
                      }
                      className={`${LF.inputSm} w-28 tabular-nums py-1`}
                      aria-label={`Final price ${product.name}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className={`${LF.muted} mb-6`}>
          Optional: order sample from My products / Review — optional and does not block publishing.
        </p>

        {publishError ? (
          <p className="mb-4 text-sm text-red-300" role="alert">
            {publishError}
          </p>
        ) : null}

        {published ? (
          <div className="rounded-xl border border-white/20 bg-white/10 p-6 mb-6">
            <p className="font-semibold text-white mb-2">Published</p>
            <p className="text-sm text-white/80 mb-4">
              {fundraising
                ? 'Fundraising is active — send creators to the fundraising page.'
                : 'Brand and products are live in the marketplace and drops feed.'}
            </p>
            {publishWarnings.length ? (
              <ul className="mb-4 space-y-1 text-xs text-amber-200/90">
                {publishWarnings.map((warning) => (
                  <li key={warning}>• {warning}</li>
                ))}
              </ul>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Link
                href={
                  fundraising
                    ? '/marketplace/brand/lumen-atelier/fundraising'
                    : '/marketplace'
                }
                className={`${LAUNCH_GLASS_BUTTON_PRIMARY} no-underline`}
              >
                {fundraising ? 'Open fundraising page' : 'View marketplace'}
              </Link>
              <Link
                href="/drops"
                className={`${LAUNCH_GLASS_BUTTON_SECONDARY} no-underline`}
              >
                View drops
              </Link>
              {publishedBrandSlug ? (
                <Link
                  href={`/marketplace/brand/${publishedBrandSlug}`}
                  className={`${LAUNCH_GLASS_BUTTON_SECONDARY} no-underline`}
                >
                  View brand page
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <button type="button" onClick={onPrev} className={LF.btnGhost}>
            ← Back
          </button>
          {!published && (
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              disabled={publishing}
              className={`${LAUNCH_GLASS_BUTTON_PRIMARY} px-6 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {publishing ? 'Publishing…' : 'Publish'}
            </button>
          )}
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overscroll-contain"
          role="alertdialog"
          aria-labelledby="pub-title"
          aria-describedby="pub-desc"
        >
          <div className="max-w-md w-full rounded-2xl bg-white border border-gray-200 p-6 shadow-xl">
            <h3 id="pub-title" className="text-lg font-bold text-gray-900 mb-2">
              Confirm publish
            </h3>
            <p id="pub-desc" className="text-sm text-gray-600 mb-6">
              Publishing locks editing if fundraising. You can still adjust copy later for
              self-funded launches depending on policy — confirm to proceed.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handlePublish()}
                disabled={publishing}
                className="rounded-lg bg-[#6e5dcb] text-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#5e4db8] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {publishing ? 'Publishing…' : 'Confirm publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
