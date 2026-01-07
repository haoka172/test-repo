import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.returnfromtheabyss.space',
      },
      {
        protocol: 'https',
        hostname: 'gg.asuracomic.net',
      },
    ],
  },
};

export default nextConfig;
