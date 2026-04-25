import Link from 'next/link';

export default function MarketplaceFooter() {
  return (
    <footer className="mt-auto border-t border-silver/80 bg-powder-petal/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row gap-6 sm:items-center sm:justify-between text-sm text-gray-600">
        <p className="text-balance">Cart memory is limited-time (TBD). Prices shown are mock USD for UI scaffolding.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/" className="text-air-force-blue font-medium no-underline hover:underline">
            Marketing home
          </Link>
          <Link href="/about" className="text-air-force-blue font-medium no-underline hover:underline">
            About
          </Link>
          <Link href="/launch" className="text-air-force-blue font-medium no-underline hover:underline">
            Creator Studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
