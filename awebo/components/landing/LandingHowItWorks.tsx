'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Card } from '@/components/ui/hero-preview-walls';

/** Placeholder when CMS returns no image – keeps design consistent with main branch */
const PLACEHOLDER_HOW_IT_WORKS_IMAGE = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80';

const DEFAULT_CARDS: Card[] = [
  { id: 0, name: 'Profile & brand', designation: 'Your creator identity', content: <p>Set up your creator profile and brand identity in AWEBO Creator Studio. Add banner, avatar, tagline, and social links so your community recognizes you everywhere.</p>, image: PLACEHOLDER_HOW_IT_WORKS_IMAGE },
  { id: 1, name: 'Token', designation: 'Brand token in ETH', content: <p>Configure your brand token: choose network, token purpose, total supply, and allocation. All pricing in ETH, with clear economics from day one.</p>, image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80' },
  { id: 2, name: 'NFT & merch', designation: 'Digital collectibles & phygital', content: <p>Build your digital collectibles and link phygital merch. Set mint price in ETH, upload artwork, and enable token-gated access for holders.</p>, image: 'https://images.unsplash.com/photo-1644361566691-2f023f2d3436?w=800&q=80' },
  { id: 3, name: 'Launch', designation: 'Deploy and fulfill globally', content: <p>Review and deploy. AWEBO handles smart contract deployment, drop mechanics, and global fulfillment for physical orders — one flow, all in ETH.</p>, image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80' },
];

export type HowItWorksCardFromCMS = {
  _id: string;
  name?: string | null;
  designation?: string | null;
  content?: string | null;
  imageUrl?: string | null;
};

function cmsToCard(c: HowItWorksCardFromCMS, index: number): Card {
  return {
    id: index,
    name: c.name || 'Step',
    designation: c.designation ?? '',
    content: <p>{c.content || ''}</p>,
    image: c.imageUrl?.trim() || PLACEHOLDER_HOW_IT_WORKS_IMAGE,
  };
}

export interface LandingHowItWorksProps {
  sectionLabel?: string | null;
  title?: string | null;
  description?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  cards?: HowItWorksCardFromCMS[] | null;
}

export default function LandingHowItWorks({
  sectionLabel,
  title,
  description,
  ctaText,
  ctaLink,
  cards,
}: LandingHowItWorksProps) {
  const cardList = cards?.length ? cards.map((c, i) => cmsToCard(c, i)) : DEFAULT_CARDS;
  const label = sectionLabel ?? 'How it works';
  const sectionTitle = title ?? 'Launch token, NFT & merch in one flow';
  const sectionDescription = description ?? 'From creator profile to live drop: configure your token economics, build your NFT collection, add phygital merch, and launch. All in ETH.';
  const cta = { text: ctaText ?? 'Start with AWEBO', link: ctaLink ?? '/launch' };

  return (
    <section
      id="how-it-works"
      className="relative w-full overflow-hidden bg-white py-16 text-gray-900 dark:bg-neutral-950 dark:text-white md:py-24"
      aria-label="How it works"
    >
      <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 md:grid-cols-3 md:gap-8 lg:gap-16">
        <div className="flex flex-col items-start justify-center text-center md:col-span-1 md:text-left">
          <span className="mb-2 text-sm font-medium uppercase tracking-widest text-air-force-blue">
            {label}
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            {sectionTitle}
          </h2>
          <p className="mb-6 text-base text-gray-600 dark:text-neutral-400">
            {sectionDescription}
          </p>
          <Link
            href={cta.link}
            className="inline-flex items-center justify-center rounded-lg bg-air-force-blue px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-air-force-blue/90"
          >
            {cta.text}
            <ArrowUpRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {cardList.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-white/[0.08] dark:bg-neutral-900"
              >
                <div className="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
                  {card.name}
                </div>
                <div className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {card.content}
                </div>
                <div className="mt-4">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="h-44 w-full rounded-lg border border-neutral-200 object-cover shadow-sm dark:border-neutral-800"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 border-t border-neutral-200 pt-3 dark:border-neutral-800">
                  <p className="text-sm font-medium text-neutral-700 dark:text-white">
                    {card.designation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
