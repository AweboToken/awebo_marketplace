/** @type {import('next').NextConfig} */
const evershopUrl = process.env.EVERSHOP_URL || 'http://127.0.0.1:3001';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['geist'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' },
      { protocol: 'https', hostname: 'cdn.sanity.io', pathname: '/**' },
      { protocol: 'https', hostname: 'ext.same-assets.com', pathname: '/**' },
    ],
  },
  async rewrites() {
    return [
      // Proxy /drops and /drops/* to EverShop (drops & merch storefront + admin)
      { source: '/drops', destination: `${evershopUrl}/` },
      { source: '/drops/:path*', destination: `${evershopUrl}/:path*` },
    ];
  },
}

module.exports = nextConfig
