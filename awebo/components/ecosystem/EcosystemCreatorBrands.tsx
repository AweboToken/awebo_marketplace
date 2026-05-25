import Image from 'next/image';
import Link from 'next/link';
import type { EcosystemCreatorBrandCard } from '@/lib/ecosystem-creator-brands';

type Props = {
  brands: EcosystemCreatorBrandCard[];
};

function BrandCreatorCard({ brand }: { brand: EcosystemCreatorBrandCard }) {
  const tagline = brand.story.trim().slice(0, 100) || brand.collectionName;

  return (
    <Link
      href={brand.href}
      className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl border border-white/15 bg-neutral-950/90 shadow-2xl backdrop-blur-md no-underline transition-colors hover:border-white/30 sm:w-[300px]"
    >
      <div className="relative h-32 bg-gradient-to-br from-violet-900/60 to-air-force-blue/40">
        {brand.bannerUrl ? (
          <Image
            src={brand.bannerUrl}
            alt=""
            fill
            unoptimized
            className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/90">
          Creating
        </span>
        {brand.fundraising ? (
          <span className="absolute right-3 top-3 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-black">
            Fundraising
          </span>
        ) : (
          <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
            ${brand.tokenSymbol}
          </span>
        )}
      </div>

      <div className="relative px-4 pb-4 pt-0">
        <div className="-mt-9 mb-3 flex items-end gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-4 border-neutral-950 bg-neutral-900 shadow-lg">
            {brand.logoUrl ? (
              <Image src={brand.logoUrl} alt="" fill unoptimized className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-bold text-violet-200">
                {brand.name.slice(0, 1)}
              </div>
            )}
          </div>
          <div className="min-w-0 pb-1">
            <p className="truncate text-base font-semibold text-white">{brand.name}</p>
            <p className="truncate text-xs text-white/65">{tagline}</p>
          </div>
        </div>

        <p className="text-xs text-white/55">
          {brand.productCount} {brand.productCount === 1 ? 'item' : 'items'} in{' '}
          <span className="text-white/75">{brand.collectionName}</span>
        </p>

        {brand.products.length > 0 ? (
          <ul className="mt-3 flex gap-2" aria-label={`Products by ${brand.name}`}>
            {brand.products.map((product) => (
              <li
                key={product.id}
                className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-neutral-900"
              >
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    unoptimized
                    sizes="44px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-white/50">
                    {product.name.slice(0, 1)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : null}

        <span className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-air-force-blue py-2.5 text-center text-xs font-semibold text-black transition-colors group-hover:bg-air-force-blue/90">
          View brand
        </span>
      </div>
    </Link>
  );
}

export default function EcosystemCreatorBrands({ brands }: Props) {
  return (
    <section
      className="relative border-t border-white/10 bg-[#0a0a0a] px-4 py-14 sm:px-6 md:py-20 lg:px-8"
      aria-labelledby="ecosystem-creators-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">
            Live on AWEBO
          </p>
          <h2
            id="ecosystem-creators-heading"
            className="mt-2 text-2xl font-bold text-white text-balance md:text-3xl"
          >
            Brands creating right now
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Creators building collections and merch on the platform — explore their drops and
            collections.
          </p>
        </div>

        {brands.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 px-6 py-12 text-center">
            <p className="text-sm text-white/75">No published brands yet.</p>
            <Link
              href="/launch"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-air-force-blue px-5 py-2.5 text-sm font-semibold text-black no-underline hover:bg-air-force-blue/90"
            >
              Launch your brand
            </Link>
          </div>
        ) : (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {brands.map((brand) => (
              <BrandCreatorCard key={brand.slug} brand={brand} />
            ))}
          </div>
        )}

        {brands.length > 0 ? (
          <p className="mt-8 text-center text-sm text-white/55">
            <Link
              href="/marketplace"
              className="font-semibold text-air-force-blue no-underline hover:underline"
            >
              Browse the marketplace
            </Link>
            {' · '}
            <Link href="/launch" className="font-semibold text-white/80 no-underline hover:underline">
              Launch your brand
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}
