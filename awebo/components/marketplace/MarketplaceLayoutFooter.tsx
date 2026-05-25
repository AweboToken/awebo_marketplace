'use client';

import { usePathname } from 'next/navigation';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';

/** Hide footer on product and brand detail pages. */
export function shouldHideMarketplaceFooter(pathname: string): boolean {
  if (pathname.startsWith('/marketplace/product/')) return true;
  if (/^\/marketplace\/brand\/[^/]+(\/fundraising)?$/.test(pathname)) return true;
  return false;
}

export default function MarketplaceLayoutFooter() {
  const pathname = usePathname() ?? '';
  if (shouldHideMarketplaceFooter(pathname)) return null;
  return <MarketplaceFooter />;
}
