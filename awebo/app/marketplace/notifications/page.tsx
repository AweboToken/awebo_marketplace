export const metadata = {
  title: 'Notifications — Marketplace',
  description: 'AWEBO platform announcements and updates.',
};

export default function NotificationsPage() {
  return (
    <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
      <p className="text-sm text-gray-600 mb-8">Platform announcements, new features, drops, and policy updates.</p>
      <ul className="space-y-3">
        <li className="rounded-xl border border-silver bg-white p-4">
          <p className="text-xs font-semibold uppercase text-gray-500">AWEBO</p>
          <p className="mt-1 text-sm text-gray-800">Welcome to the marketplace shell — connect your feed source here.</p>
        </li>
      </ul>
    </main>
  );
}
