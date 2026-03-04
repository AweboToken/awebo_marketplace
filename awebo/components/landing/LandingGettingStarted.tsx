import Link from 'next/link';

export default function LandingGettingStarted() {
  return (
    <section id="getting-started" aria-label="Getting started">
      <h2>Getting started</h2>
      <p>
        AWEBO works with a limited number of brands at a time.
      </p>
      <p>
        If you&apos;re building something you want to stand behind for years, you can request access.
      </p>
      <p>
        <Link href="/request-access">Request access</Link>
      </p>
    </section>
  );
}
