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
  async redirects() {
    return [
      { source: '/about', destination: '/hq/room-14', permanent: true },
    ];
  },
  async rewrites() {
    return [
      // EverShop admin + legacy product URLs (AWEBO owns `/drops` listing page)
      { source: '/drops/admin', destination: `${evershopUrl}/admin` },
      { source: '/drops/admin/:path*', destination: `${evershopUrl}/admin/:path*` },
      { source: '/drops/product/:path*', destination: `${evershopUrl}/product/:path*` },
    ];
  },
}

module.exports = nextConfig
