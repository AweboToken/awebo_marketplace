import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';
import FloatingSupportStub from '@/components/marketplace/FloatingSupportStub';

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-seashell text-gray-900">
      <a
        href="#marketplace-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-air-force-blue focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to marketplace content
      </a>
      <MarketplaceHeader />
      <div id="marketplace-main" className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
      <MarketplaceFooter />
      <FloatingSupportStub />
    </div>
  );
}
