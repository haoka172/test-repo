import { MetadataRoute } from 'next';
import { loadSeoConfig } from '@/lib/seo';

export const dynamic = "force-static"; // Ensure SSG compatibility

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteConfig = await loadSeoConfig();
  const baseUrl = siteConfig.baseUrl;

  // Extract domain from baseUrl
  const domain = new URL(baseUrl).hostname;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/private/', '/api/', '/_next/', '/temp/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/private/', '/api/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/private/', '/api/'],
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`
    ],
    host: domain,
  };
}
