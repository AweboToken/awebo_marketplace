import Navigation from '@/components/Navigation';
import { TopHeader } from '@/components/marketplace/TopHeader';
import { HeroSection } from '@/components/marketplace/HeroSection';
import { FeaturedBanner } from '@/components/marketplace/FeatureBanner';
import { BrandCardsSlider } from '@/components/marketplace/BrandCardSlider';
import { CategoriesSection } from '@/components/marketplace/CategoriesSection';
import { MaleApparel } from '@/components/marketplace/MaleApparel';
import { ExploreBrands } from '@/components/marketplace/ExploreBrands';
import { TrendingProducts } from '@/components/marketplace/TrendingProducts';
import { CrowdfundingBrands } from '@/components/marketplace/CrowdfundingBrands';
import { LaunchBrandCTA } from '@/components/marketplace/LaunchBrandCTA';
import { Footer } from '@/components/marketplace/Footer';

export const metadata = {
  title: 'AWEBO Marketplace — Preview',
  description: 'Marketplace UI preview built from AWEBO marketplace components.',
};

export default function AweboMarketplacePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f1f5f5] font-sans text-gray-900">
      <a
        href="#awebo-marketplace-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-air-force-blue focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <Navigation variant="landing" landingTheme="surface" />
      <TopHeader />
      <main id="awebo-marketplace-main" className="flex-1 min-w-0">
        <HeroSection />
        <FeaturedBanner />
        <BrandCardsSlider />
        <CategoriesSection />
        <MaleApparel />
        <ExploreBrands />
        <TrendingProducts />
        <CrowdfundingBrands />
        <LaunchBrandCTA />
      </main>
      <Footer />
    </div>
  );
}
