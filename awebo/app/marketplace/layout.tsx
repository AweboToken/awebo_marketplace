import Navigation from '@/components/Navigation';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';
import FloatingSupportStub from '@/components/marketplace/FloatingSupportStub';

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f1f5f5] font-sans text-gray-900">
      <a
        href="#marketplace-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-air-force-blue focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to marketplace content
      </a>
      <Navigation variant="landing" landingTheme="surface" />
      <div id="marketplace-main" className="flex min-w-0 flex-1 flex-col">
        {children}
      </div>
      <MarketplaceFooter />
      <FloatingSupportStub />
    </div>
  );
}
