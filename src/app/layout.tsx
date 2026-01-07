import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LazyAnalytics from "@/components/LazyAnalytics";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import ThemeToggle from "@/components/ThemeToggle";
import ColorSchemeProvider from "@/components/ColorSchemeProvider";
import { loadSeoConfig, generateMetadata as generateSeoMetadata, SeoProvider, SchemaOrg } from '@/lib/seo';
import fs from 'fs/promises';
import path from 'path';
import { processConfigWithGlobalVariables } from '@/lib/templateProcessor';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const viewport: Viewport = {
  themeColor: '#1a202c',
  width: 'device-width',
  initialScale: 1,
};

// Generate metadata dynamically from siteinfo.json
export async function generateMetadata(): Promise<Metadata> {
  const config = await loadSeoConfig();
  return generateSeoMetadata(config, { type: 'homepage' });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const seoConfig = await loadSeoConfig();
  
  // 只提取 layout.tsx 需要的最小数据，避免暴露完整配置到客户端
  let minimalConfig: {
    heroImage?: string;
    googleAdsenseId?: string;
    googleAnalyticsId?: string;
  } = {};
  
  try {
    const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');
    const content = await fs.readFile(siteInfoPath, 'utf8');
    const rawConfig = JSON.parse(content);
    const processedConfig = rawConfig.globalVariables 
      ? processConfigWithGlobalVariables(rawConfig)
      : rawConfig;
    
    minimalConfig = {
      heroImage: processedConfig.globalVariables?.heroImage || processedConfig.hero?.coverImage,
      googleAdsenseId: processedConfig.globalVariables?.googleAdsenseId,
      googleAnalyticsId: processedConfig.globalVariables?.googleAnalyticsId,
    };
  } catch (error) {
    console.warn('Failed to load minimal server config:', error);
  }

  return (
    <html lang="en" data-theme="light">
      <head>
        {/* Next.js 13+ App Router automatically handles favicon from metadata object */}
        {/* Removed redundant <link> tags for favicon, apple-touch-icon, manifest */}
        
        {/* DNS预解析和预连接优化 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        {minimalConfig.heroImage && (() => {
          try {
            const heroImageUrl = new URL(minimalConfig.heroImage);
            const imageDomain = heroImageUrl.hostname;
            return (
              <>
                <link rel="dns-prefetch" href={`//${imageDomain}`} />
                <link rel="preconnect" href={`https://${imageDomain}`} crossOrigin="" />
              </>
            );
          } catch {
            return null;
          }
        })()}
        
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="" />
        
        {/* Google AdSense */}
        {minimalConfig.googleAdsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${minimalConfig.googleAdsenseId}`}
            crossOrigin="anonymous"
          />
        )}

        {/* 预加载关键资源 - Hero图片 (动态从siteinfo获取) */}
        {minimalConfig.heroImage && (
          <link 
            rel="preload" 
            as="image" 
            href={minimalConfig.heroImage}
            fetchPriority="high"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <SeoProvider config={seoConfig}>
          <SchemaOrg
            type="website"
            title={seoConfig.title}
            description={seoConfig.description}
            url={seoConfig.baseUrl}
          />
          <ColorSchemeProvider />
          {minimalConfig.googleAnalyticsId && (
            <LazyAnalytics gaId={minimalConfig.googleAnalyticsId} />
          )}
          <ServiceWorkerRegistration />
          {/* 主题切换按钮 - 固定位置 */}
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          {children}
        </SeoProvider>
      </body>
    </html>
  );
}
