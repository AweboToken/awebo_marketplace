'use client';

import Link from 'next/link';
import Image from 'next/image';

/** Top performing creator account – matches Figma card 264×203, rounded-[20px] */
export type TopCreator = {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  imageUrl: string;
  stats?: { label: string; value: string };
};

/** Placeholder when CMS returns no image URL – keeps layout consistent with main branch */
const PLACEHOLDER_CREATOR_IMAGE = 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=528&q=80';

const DEFAULT_TOP_CREATORS: TopCreator[] = [
  { id: '1', slug: 'genesis-cyber', name: 'Genesis Cyber', tagline: 'Streetwear × Digital', imageUrl: PLACEHOLDER_CREATOR_IMAGE, stats: { label: 'Volume', value: '12.4 ETH' } },
  { id: '2', slug: 'street-protocol', name: 'Street Protocol', tagline: 'Culture-backed tokens', imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=528&q=80', stats: { label: 'Volume', value: '8.2 ETH' } },
  { id: '3', slug: 'phygital-labs', name: 'Phygital Labs', tagline: 'Physical meets digital', imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=528&q=80', stats: { label: 'Volume', value: '6.1 ETH' } },
  { id: '4', slug: 'culture-coin', name: 'Culture Coin', tagline: 'Community first', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=528&q=80', stats: { label: 'Volume', value: '5.8 ETH' } },
  { id: '5', slug: 'velocity-x', name: 'Velocity X', tagline: 'Next-gen drops', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=528&q=80', stats: { label: 'Volume', value: '4.9 ETH' } },
  { id: '6', slug: 'awebo-hood', name: 'Awebo Hood', tagline: 'Limited editions', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=528&q=80', stats: { label: 'Volume', value: '4.2 ETH' } },
];

export type TopCreatorFromCMS = {
  _id: string;
  name?: string | null;
  slug?: string | null;
  tagline?: string | null;
  imageUrl?: string | null;
  statsLabel?: string | null;
  statsValue?: string | null;
};

function CreatorCard({ creator }: { creator: TopCreator }) {
  return (
    <Link
      href={`/creator/${creator.slug}`}
      className="group flex h-[203px] w-[264px] shrink-0 flex-col overflow-hidden rounded-[20px] bg-white/90 shadow-md transition-shadow hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-air-force-blue focus:ring-offset-2 focus:ring-offset-white"
    >
      <div className="relative h-full w-full">
        <Image
          src={creator.imageUrl}
          alt=""
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="264px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-4">
          <span className="text-sm font-medium text-white/90">{creator.name}</span>
          {creator.tagline && (
            <span className="text-xs text-white/80">{creator.tagline}</span>
          )}
          {creator.stats && (
            <span className="mt-1 text-xs font-semibold text-air-force-blue">
              {creator.stats.label} {creator.stats.value}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function cmsToTopCreator(c: TopCreatorFromCMS): TopCreator {
  return {
    id: c._id,
    slug: c.slug || c._id,
    name: c.name || 'Creator',
    tagline: c.tagline ?? undefined,
    imageUrl: c.imageUrl?.trim() || PLACEHOLDER_CREATOR_IMAGE,
    stats: c.statsLabel && c.statsValue ? { label: c.statsLabel, value: c.statsValue } : undefined,
  };
}

export default function LandingTopCreators({ creators }: { creators?: TopCreatorFromCMS[] | null }) {
  const list = creators?.length ? creators.map(cmsToTopCreator) : DEFAULT_TOP_CREATORS;
  return (
    <section
      className="w-full border-y border-gray-200/80 py-10 md:py-12"
      aria-label="Top creators"
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm font-medium uppercase tracking-widest text-gray-500">
          Top creators
        </p>
        <div className="flex justify-start gap-4 overflow-x-auto pb-2 scroll-smooth md:gap-6">
          {list.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </div>
    </section>
  );
}
