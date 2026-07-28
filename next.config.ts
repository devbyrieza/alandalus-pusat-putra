import type { NextConfig } from "next";

const nextConfig: any = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // output: "standalone",

  // Hapus generateBuildId yang menggunakan random
  // Biarkan Next.js handle build ID secara otomatis

  // Optimize for faster builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    scrollRestoration: false,
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
  },
  // Rewrite khusus untuk subdomain MOSA CUP
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: 'mosacup.pesantren-alimam.com',
            },
          ],
          destination: '/mosa_cup.html',
        },
      ],
    };
  },
};

export default nextConfig;
