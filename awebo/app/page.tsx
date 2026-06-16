import { LandingAboveFold } from '@/components/landing';
import ExploreSection from '@/components/landing/ExploreSection';
import CrowdfundingSection from '@/components/landing/CrowdfundingSection';
import LandingCtaBanner from '@/components/landing/LandingCtaBanner';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'AWEBO — Launch and trade tokens on L1X',
  description:
    'AWEBO is a launchpad for culture-backed brands: tokens, merchandise, and global logistics. Design once, launch globally.',
};

export default function LandingPage() {
  return (
    <>
      <LandingAboveFold />
      <ExploreSection />
      <CrowdfundingSection />
      <LandingCtaBanner />
      <Footer variant="landing" />
    </>
  );
}
