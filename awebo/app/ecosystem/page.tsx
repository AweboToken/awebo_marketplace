import Navigation from '@/components/Navigation';
import EcosystemGallery from '@/components/ecosystem/EcosystemGallery';

export const metadata = {
  title: 'Ecosystem — AWEBO',
  description: 'Explore the AWEBO ecosystem gallery.',
};

export default function EcosystemPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a]">
      <Navigation variant="landing" landingChromeVisible />
      <main className="w-full pt-[72px] md:pt-[80px]">
        <EcosystemGallery />
      </main>
    </div>
  );
}
