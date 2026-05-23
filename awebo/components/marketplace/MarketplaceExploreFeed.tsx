'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box, Heart, Star } from 'lucide-react';
import {
  MARKETPLACE_FILTERS,
  MOCK_EXPLORE_BRANDS,
  type ExploreBrand,
} from '@/lib/marketplace-data';

function ExploreBrandCard({ brand }: { brand: ExploreBrand }) {
  return (
    <article
      className={`group relative flex flex-col rounded-2xl p-5 transition-shadow hover:shadow-md ${brand.cardTone}`}
    >
      <button
        type="button"
        aria-label={brand.favorited ? 'Remove from favorites' : 'Add to favorites'}
        className="absolute right-4 top-4 z-10 rounded-full p-1 transition-transform hover:scale-110"
      >
        <Heart
          className={`h-5 w-5 ${
            brand.favorited
              ? 'fill-red-500 text-red-500'
              : 'text-gray-900 group-hover:text-red-500'
          }`}
          strokeWidth={brand.favorited ? 0 : 2}
        />
      </button>

      <Link
        href={`/marketplace/brand/${brand.slug.replace(/-\d+$/, '')}`}
        className="flex flex-col no-underline"
      >
        <div className="mb-5 flex justify-center pt-2">
          <div
            className={`relative flex h-36 w-36 items-center justify-center rounded-full bg-white p-1 shadow-sm sm:h-40 sm:w-40 ${
              brand.featured ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-transparent' : ''
            }`}
          >
            <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
              <Image
                src={brand.image}
                alt=""
                fill
                sizes="160px"
                className="object-contain p-3"
              />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900">{brand.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-600">{brand.description}</p>

        <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-800">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
          <span className="font-semibold">{brand.rating.toFixed(1)}</span>
          <span className="text-gray-500">({brand.reviews} reseñas)</span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-md border border-air-force-blue/40 px-2.5 py-1 text-xs font-medium text-air-force-blue">
            {brand.category}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <Box className="h-3.5 w-3.5" aria-hidden />
            {brand.itemCount} artículos
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function MarketplaceExploreFeed() {
  const [activeFilter, setActiveFilter] = useState<string>('NEW');

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 md:py-10">
      <div className="mb-8 flex flex-wrap gap-3">
        {MARKETPLACE_FILTERS.map((filter) => {
          const active = activeFilter === filter;
          return (
            <button
              type="button"
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-air-force-blue text-white'
                  : 'border border-air-force-blue bg-white text-air-force-blue hover:bg-powder-petal/60'
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MOCK_EXPLORE_BRANDS.map((brand) => (
          <ExploreBrandCard key={brand.slug} brand={brand} />
        ))}
      </div>
    </div>
  );
}
