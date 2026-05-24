import Link from 'next/link';

export default function MarketplaceFooter() {
  return (
    <footer className="mt-auto border-t border-white/20 bg-black/35 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between text-sm text-gray-600">
        <p className="text-balance text-white/75">Cart memory is limited-time (TBD). Prices shown are mock USD for UI scaffolding.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/" className="font-medium text-white/90 no-underline hover:text-white hover:underline">
            Marketing home
          </Link>
          <Link href="/hq/room-14" className="font-medium text-white/90 no-underline hover:text-white hover:underline">
            About
          </Link>
          <Link href="/launch" className="font-medium text-white/90 no-underline hover:text-white hover:underline">
            Creator Studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
