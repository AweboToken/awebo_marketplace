import { LandingAboveFold, LandingDropsSections } from '@/components/landing';
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
      <LandingDropsSections />
      <Footer variant="landing" />
    </>
  );
}
