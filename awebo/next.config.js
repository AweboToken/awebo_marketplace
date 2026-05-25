/** @type {import('next').NextConfig} */
const evershopUrl = process.env.EVERSHOP_URL || 'http://127.0.0.1:3001';

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['geist'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'ik.imagekit.io', pathname: '/**' },
      { protocol: 'https', hostname: 'ext.same-assets.com', pathname: '/**' },
    ],
  },
  async redirects() {
    return [
      { source: '/about', destination: '/hq/room-14', permanent: true },
      { source: '/awebo-marketplace', destination: '/marketplace', permanent: true },
    ];
  },
  async rewrites() {
    return [
      // EverShop admin + legacy product URLs (AWEBO owns `/drops` listing page)
      { source: '/drops/admin', destination: `${evershopUrl}/admin` },
      { source: '/drops/admin/:path*', destination: `${evershopUrl}/admin/:path*` },
      { source: '/drops/product/:path*', destination: `${evershopUrl}/product/:path*` },
      // EverShop admin redirects/assets use root paths — proxy them when entering via /drops/admin
      { source: '/admin', destination: `${evershopUrl}/admin` },
      { source: '/admin/:path*', destination: `${evershopUrl}/admin/:path*` },
      { source: '/backend/:path*', destination: `${evershopUrl}/backend/:path*` },
      { source: '/graphql', destination: `${evershopUrl}/graphql` },
      // EverShop admin API (AWEBO owns /api/contact, /api/evershop/*, /api/launch/*)
      { source: '/api/user/:path*', destination: `${evershopUrl}/api/user/:path*` },
      { source: '/api/products', destination: `${evershopUrl}/api/products` },
      { source: '/api/products/:path*', destination: `${evershopUrl}/api/products/:path*` },
      { source: '/api/orders/:path*', destination: `${evershopUrl}/api/orders/:path*` },
      { source: '/api/categories/:path*', destination: `${evershopUrl}/api/categories/:path*` },
      { source: '/api/collections/:path*', destination: `${evershopUrl}/api/collections/:path*` },
      { source: '/api/customers/:path*', destination: `${evershopUrl}/api/customers/:path*` },
    ];
  },
}

module.exports = nextConfig
