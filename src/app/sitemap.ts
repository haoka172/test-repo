import { MetadataRoute } from 'next';
import { loadSeoConfig } from '@/lib/seo';
import { getAllChaptersMetadata } from '@/utils/getChapterData';
import { getAllBlogMetadata } from '@/utils/getBlogData';
import { staticSiteConfig } from '@/lib/staticConfig';

export const dynamic = "force-static"; // Ensure SSG compatibility

// Dynamic sitemap generation based on actual chapter and blog data
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteConfig = await loadSeoConfig();
  const baseUrl = siteConfig.baseUrl;

  // Get actual chapter data - 英文版本不传 slug 参数
  const allChaptersMetadata = await getAllChaptersMetadata();
  
  // Check if blog feature is enabled in sitemap
  const isBlogEnabledInSitemap = staticSiteConfig.features?.blog?.enabled && staticSiteConfig.features?.blog?.showInSitemap;
  
  // Get blog data only if enabled
  const allBlogPosts = isBlogEnabledInSitemap ? await getAllBlogMetadata() : [];

  const currentDate = new Date().toISOString();

  // Build sitemap entries
  const sitemapEntries: MetadataRoute.Sitemap = [
    // Homepage
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Chapters list page
    {
      url: `${baseUrl}/chapters/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    // Legal pages
    {
      url: `${baseUrl}/dmca/`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy/`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions/`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Add blog list page only if blog is enabled
  if (isBlogEnabledInSitemap) {
    sitemapEntries.push({
      url: `${baseUrl}/blog/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Add chapter pages
  for (const chapter of allChaptersMetadata) {
    sitemapEntries.push({
      url: `${baseUrl}/chapters/${chapter.id}/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Add blog post pages only if blog is enabled
  if (isBlogEnabledInSitemap) {
    for (const post of allBlogPosts) {
      if (post.published) {
        sitemapEntries.push({
          url: `${baseUrl}/blog/${post.slug}/`,
          lastModified: post.date,
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
  }

  return sitemapEntries;
}
