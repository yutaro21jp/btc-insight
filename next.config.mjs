/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    formats: ['image/webp'],
    minimumCacheTTL: 2678400,
    deviceSizes: [640, 768, 1024, 1200],
    imageSizes: [64, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
