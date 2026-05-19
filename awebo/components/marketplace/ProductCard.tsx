import Link from 'next/link';

export type ProductCardProps = {
  id: string;
  name: string;
  brandSlug: string;
  brandName: string;
  priceUsd: number;
  imageTone: string;
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
  href,
}: ProductCardProps) {
  const to = href ?? `/marketplace/product/${id}`;
  return (
    <article className="group flex flex-col rounded-xl border border-silver/60 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow min-w-0">
      <Link href={to} className="block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue focus-visible:ring-offset-2 rounded-t-xl">
        <div className={`aspect-[4/5] bg-gradient-to-br ${imageTone} relative`} aria-hidden />
        <div className="p-4 pb-2 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 line-clamp-2 text-balance group-hover:text-air-force-blue transition-colors">
            {name}
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-900 tabular-nums">{formatUsd(priceUsd)}</p>
        </div>
      </Link>
      <div className="px-4 pb-2 min-w-0">
        <Link
          href={`/marketplace/brand/${brandSlug}`}
          className="text-xs text-air-force-blue hover:underline font-medium no-underline truncate block"
        >
          {brandName}
        </Link>
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <Link
          href={`/marketplace/cart?add=${id}`}
          className="flex-1 text-center rounded-lg border border-gray-300 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-50 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue"
        >
          Add to cart
        </Link>
      </div>
    </article>
  );
}
