'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Box } from 'lucide-react';

export type LiveCatalogProduct = {
  id: string;
  brandSlug: string;
  brandName: string;
  collectionName: string;
  tokenSymbol: string;
  name: string;
  priceUsd: number;
  href: string;
  image: string | null;
  cardTone: string;
  source: 'awebo' | 'evershop';
};

export function LiveProductCard({ product }: { product: LiveCatalogProduct }) {
  return (
    <article
      className={`group relative flex flex-col rounded-2xl p-5 transition-shadow hover:shadow-md ${product.cardTone}`}
    >
      <Link href={product.href} className="flex flex-col no-underline">
        <div className="mb-5 flex justify-center pt-2">
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-white p-1 shadow-sm sm:h-40 sm:w-40">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
              {product.image ? (
                <Image
                  src={product.image}
                  alt=""
                  fill
                  sizes="160px"
                  className="object-contain p-3"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {product.tokenSymbol}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-air-force-blue">
          {product.brandName}
        </p>
        <h3 className="mt-1 text-lg font-bold text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-600">{product.collectionName}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="rounded-md border border-air-force-blue/40 px-2.5 py-1 text-xs font-medium text-air-force-blue">
            ${product.priceUsd.toFixed(2)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
            <Box className="h-3.5 w-3.5" aria-hidden />
            {product.source === 'evershop' ? 'EverShop inventory' : 'Creator drop'}
          </span>
        </div>
      </Link>
    </article>
  );
}
