import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'About — AWEBO',
  description: 'AWEBO is a launchpad for culture-backed brands: tokens, merchandise, and global logistics.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-seashell">
      <Navigation variant="landing" />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About</h1>
        <p className="text-gray-600 max-w-2xl mb-6">
          AWEBO is a launchpad for culture-backed brands: a single, scalable infrastructure that unifies tokens, physical merchandise, and global logistics.
        </p>
        <p className="text-gray-600 max-w-2xl mb-8">
          We enable designers and studios to design once, launch globally, and earn programmatically. Culture compounds.
        </p>
        <div className="border-t border-gray-200 pt-8">
          <h2 className="font-semibold text-gray-900 mb-2">Contact</h2>
          <p className="text-sm text-gray-600">Support, partnerships, and press: reach out via the footer links.</p>
        </div>
      </main>
      <Footer variant="landing" />
    </div>
  );
}
