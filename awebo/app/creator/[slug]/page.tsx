import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ');
  return {
    title: `${name} — AWEBO Creator`,
    description: `View ${name} on AWEBO launchpad.`,
  };
}

export default async function CreatorPage({ params }: Props) {
  const { slug } = await params;

  return (
    <div className="flex min-h-screen flex-col bg-seashell font-sans">
      <Navigation variant="landing" landingTheme="surface" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-air-force-blue font-medium text-sm hover:underline mb-8 inline-block"
        >
          ← Back to home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          {slug.replace(/-/g, ' ')}
        </h1>
        <p className="text-gray-600 mt-2">
          Creator account page. Connect to backend to load profile, launches, and stats.
        </p>
      </main>
      <Footer variant="landing" />
    </div>
  );
}
