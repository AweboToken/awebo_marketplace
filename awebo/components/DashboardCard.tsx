'use client';

export default function DashboardCard() {
  const walletAddress = '0xBe76...e5C8';

  const metrics = [
    { label: 'Holdings', value: '0' },
    { label: 'Created', value: '0' },
    { label: 'Referrals', value: '0' },
    { label: 'Gains', value: '0 WL1X' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 space-y-6 border border-gray-200 shadow-sm">
      {/* User Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-lg">👤</span>
          </div>
          <div>
            <div className="text-gray-900 font-medium">{walletAddress}</div>
            <div className="text-gray-500 text-sm">Dashboard</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-gray-50 border border-gray-200 rounded-lg p-3"
          >
            <div className="text-gray-500 text-xs mb-1">{metric.label}</div>
            <div className="text-gray-900 font-semibold">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-accent hover:opacity-90 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
          <span>Claim</span>
          <div className="ml-2 w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </button>
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors">
          Manage token
        </button>
      </div>
    </div>
  );
}
