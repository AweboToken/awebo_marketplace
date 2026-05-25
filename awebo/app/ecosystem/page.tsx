import Navigation from '@/components/Navigation';
import EcosystemCreatorBrands from '@/components/ecosystem/EcosystemCreatorBrands';
import EcosystemGallery from '@/components/ecosystem/EcosystemGallery';
import EcosystemReturnHome from '@/components/ecosystem/EcosystemReturnHome';
import { listEcosystemCreatorBrands } from '@/lib/ecosystem-creator-brands';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Ecosystem — AWEBO',
  description: 'Explore the AWEBO ecosystem gallery and creators building on the platform.',
};

export default async function EcosystemPage() {
  const creatorBrands = await listEcosystemCreatorBrands();

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a]">
      <EcosystemReturnHome />
      <Navigation variant="landing" landingTheme="overlay" landingChromeVisible />
      <main className="w-full pt-[72px] md:pt-[80px]">
        <EcosystemGallery />
        <EcosystemCreatorBrands brands={creatorBrands} />
      </main>
    </div>
  );
}
