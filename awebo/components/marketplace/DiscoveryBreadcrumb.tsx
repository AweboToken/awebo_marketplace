"use client";

import Link from "next/link";
import type { DiscoveryCrumb } from "@/lib/discovery-home-mixes";

type DiscoveryBreadcrumbProps = {
  items: DiscoveryCrumb[];
  className?: string;
  /** Accessible name; defaults to "Discovery path". */
  ariaLabel?: string;
};

export function DiscoveryBreadcrumb({
  items,
  className = "",
  ariaLabel = "Discovery path",
}: DiscoveryBreadcrumbProps) {
  if (!items.length) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className={`w-full min-w-0 ${className}`}
    >
      <ol
        className="flex list-none flex-nowrap items-center gap-x-1 sm:gap-x-1.5 overflow-x-auto overscroll-x-contain scrollbar-hide py-0.5 -mx-0.5 px-0.5 text-xs leading-tight"
      >
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex flex-none items-center gap-x-1 sm:gap-x-1.5">
            {i > 0 ? (
              <span className="text-gray-300 select-none" aria-hidden>
                ›
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex max-w-[min(100%,12rem)] truncate rounded-full border border-gray-200/90 bg-white px-2.5 py-1 font-medium text-gray-600 no-underline transition-colors hover:border-air-force-blue hover:text-air-force-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-air-force-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#f1f5f5] sm:max-w-none"
              >
                {item.label}
              </Link>
            ) : (
              <span className="inline-flex max-w-[min(100%,12rem)] truncate px-1.5 py-1 font-bold text-gray-900 sm:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
