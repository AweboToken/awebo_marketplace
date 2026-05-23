import Navigation from '@/components/Navigation';
import EcosystemGallery from '@/components/ecosystem/EcosystemGallery';
import EcosystemReturnHome from '@/components/ecosystem/EcosystemReturnHome';

export const metadata = {
  title: 'Ecosystem — AWEBO',
  description: 'Explore the AWEBO ecosystem gallery.',
};

export default function EcosystemPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a]">
      <EcosystemReturnHome />
      <Navigation variant="landing" landingTheme="overlay" landingChromeVisible />
      <main className="w-full pt-[72px] md:pt-[80px]">
        <EcosystemGallery />
      </main>
    </div>
  );
}
