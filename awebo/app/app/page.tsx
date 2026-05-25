import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import WelcomeModal from '@/components/WelcomeModal';
import Hero from '@/components/Hero';
import HorizontalGrid from '@/components/HorizontalGrid';
import ContentGrid from '@/components/ContentGrid';
import Banner from '@/components/Banner';
import FeaturedContent from '@/components/FeaturedContent';
import CallToAction from '@/components/CallToAction';

export default function AppHome() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <Navigation variant="landing" landingTheme="surface" />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <Hero />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <HorizontalGrid items={7} />

        <ContentGrid items={7} rows={2} />

        <Banner height="h-40" />

        <ContentGrid items={6} rows={2} offset={14} />

        <FeaturedContent />

        <CallToAction />
      </main>

      <Footer />
      <WelcomeModal />
    </div>
  );
}
