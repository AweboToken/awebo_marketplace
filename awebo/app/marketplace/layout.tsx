import Navigation from '@/components/Navigation';
import MarketplaceFooter from '@/components/marketplace/MarketplaceFooter';
import MarketplaceRoomBackground from '@/components/marketplace/MarketplaceRoomBackground';
import FloatingSupportStub from '@/components/marketplace/FloatingSupportStub';

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col font-sans text-gray-900">
      <MarketplaceRoomBackground />
      <a
        href="#marketplace-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-air-force-blue focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to marketplace content
      </a>
      <Navigation variant="landing" landingTheme="overlay" />
      <div id="marketplace-main" className="relative z-10 flex min-w-0 flex-1 flex-col pt-16 md:pt-20">
        {children}
      </div>
      <div className="relative z-10">
        <MarketplaceFooter />
      </div>
      <FloatingSupportStub />
    </div>
  );
}
