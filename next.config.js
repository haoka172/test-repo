/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Ensures the project is built as a static site (SSG)
  trailingSlash: true, // 确保所有路由都有尾部斜杠，提高缓存效率
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // 静态导出时禁用 Next.js 图像优化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.returnfromtheabyss.space',
      },
      {
        protocol: 'https',
        hostname: 'sv5.kunsv1.com',
      },
      {
        protocol: 'https',
        hostname: 'gg.asuracomic.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.bluelockmanga.cc',
      },
      {
        protocol: 'https',
        hostname: 'cdn1.mangaclash.com',
      },
      {
        protocol: 'https',
        hostname: 'kimetsu-yaiba.online',
      },
      {
        protocol: 'https',
        hostname: 'toonclash.com',
      },
      {
        protocol: 'https',
        hostname: 'manga.xtdz.top',
      },
    ],
  },
  // Script configuration for external scripts - removed scriptLoader as it's not supported in Next.js 15
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Webpack优化 - 减少客户端JS包大小
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
