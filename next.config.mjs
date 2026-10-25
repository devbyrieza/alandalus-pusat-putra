/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // Turbopack (default di Next 16) memakai CA sistem agar fetch Google Fonts
    // tidak gagal TLS saat build di Docker/CI.
    turbopackUseSystemTlsCerts: true,
  },
  
  // Memaksa Vercel merender ulang tanpa cache statis
  generateBuildId: async () => 'build-' + Date.now(),

  // Optimize for faster builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  async redirects() {
    return [
      {
        source: '/dashboard/pendaftar/ujian-online/:path*',
        destination: '/dashboard/pendaftar/ujian/:path*',
        permanent: false,
      },
    ];
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
