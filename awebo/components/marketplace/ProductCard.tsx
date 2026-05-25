import Image from 'next/image';
import Link from 'next/link';

export type ProductCardProps = {
  id: string;
  name: string;
  brandSlug: string;
  brandName: string;
  priceUsd: number;
  imageTone: string;
  imageUrl?: string | null;
  href?: string;
};

function formatUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}

export default function ProductCard({
  id,
  name,
  brandSlug,
  brandName,
  priceUsd,
  imageTone,
  imageUrl,
  href,
}: ProductCardProps) {
  const to = href ?? `/marketplace/product/${id}`;
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-silver/60 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={to}
        className="block rounded-t-xl no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue focus-visible:ring-offset-2"
      >
        <div
          className={`relative aspect-[4/5] bg-gradient-to-br ${imageTone}`}
          aria-hidden
        >
          {imageUrl ? (
            <Image src={imageUrl} alt="" fill unoptimized className="object-cover" />
          ) : null}
        </div>
        <div className="min-w-0 p-4 pb-2">
          <h2 className="line-clamp-2 text-balance text-sm font-semibold text-gray-900 transition-colors group-hover:text-air-force-blue">
            {name}
          </h2>
          <p className="mt-2 text-sm font-medium tabular-nums text-gray-900">{formatUsd(priceUsd)}</p>
        </div>
      </Link>
      <div className="min-w-0 px-4 pb-2">
        <Link
          href={`/marketplace/brand/${brandSlug}`}
          className="block truncate text-xs font-medium text-air-force-blue no-underline hover:underline"
        >
          {brandName}
        </Link>
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <Link
          href={to}
          className="flex-1 rounded-lg border border-gray-300 py-2 text-center text-xs font-semibold text-gray-800 no-underline hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
        >
          View product
        </Link>
      </div>
    </article>
  );
}
