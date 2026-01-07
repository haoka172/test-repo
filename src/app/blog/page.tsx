import { Metadata } from 'next';
import { getAllBlogMetadata, getBlogConfig } from '@/utils/getBlogData';
import { loadSeoConfig } from '@/lib/seo';
import NavbarWrapper from '@/components/NavbarWrapper';
import Footer from '@/components/Footer';
import BlogList from '@/components/BlogList';

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await loadSeoConfig();
  const blogConfig = await getBlogConfig();
  
  const title = `${blogConfig.title} | ${siteConfig.title}`;
  const description = blogConfig.description;
  const url = `${siteConfig.baseUrl}/blog`;

  return {
    title,
    description,
    keywords: blogConfig.seo?.keywords?.join(', '),
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.siteName,
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: blogConfig.seo?.ogImage || siteConfig.logoImage || '',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [blogConfig.seo?.ogImage || siteConfig.logoImage || ''],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPage() {
  const blogPosts = await getAllBlogMetadata();
  const blogConfig = await getBlogConfig();
  // 加载完整配置用于Footer
  const fs = require('fs/promises');
  const path = require('path');
  const { processConfigWithGlobalVariables } = require('@/lib/templateProcessor');
  const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');
  const rawSiteInfo = JSON.parse(await fs.readFile(siteInfoPath, 'utf8'));
  const processedSiteInfo = rawSiteInfo.globalVariables 
    ? processConfigWithGlobalVariables(rawSiteInfo)
    : rawSiteInfo;
  const siteConfig = await loadSeoConfig();
  
  // 获取最新章节路径 - 使用与新模板相同的排序逻辑
  const { getAllChaptersMetadata } = await import('@/utils/getChapterData');
  const allChapters = await getAllChaptersMetadata();
  
  const parseChapterForSort = (chapterNumStr: string | number) => {
    const s = String(chapterNumStr).replace(/\./g, '-');
    const parts = s.split('-');
    const main = parseInt(parts[0], 10) || 0;
    let sub = 0;
    if (parts.length > 1) {
      sub = parseInt(parts.slice(1).join(''), 10) / Math.pow(10, parts.slice(1).join('').length + 1);
    }
    return main + sub;
  };

  const sortedChapters = [...allChapters].sort((a, b) => parseChapterForSort(a.id) - parseChapterForSort(b.id));
  const latestChapterId = sortedChapters.length > 0 ? sortedChapters[sortedChapters.length - 1].id : '1';
  const latestChapterPath = `/chapters/${latestChapterId}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: blogConfig.title,
    description: blogConfig.description,
    url: `${siteConfig.baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.siteName || 'Kimi to Koete Koi ni Naru Manga',
      logo: {
        '@type': 'ImageObject',
        url: siteConfig.logoImage,
      },
    },
    blogPost: blogPosts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `${siteConfig.baseUrl}/blog/${post.slug}`,
      datePublished: post.date,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      keywords: post.keywords.join(', '),
    })),
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteConfig.baseUrl}/blog`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="min-h-screen flex flex-col">
        <NavbarWrapper latestChapterPath={latestChapterPath} />
        
        <main className="flex-1 pt-20 bg-surface-primary">
          <div className="container mx-auto px-3 py-4 md:px-4 md:py-6 lg:py-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-6 md:mb-10 lg:mb-12">
                <h1 className="text-4xl font-bold text-text-primary mb-4">
                  {blogConfig.title}
                </h1>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  {blogConfig.description}
                </p>
              </div>

              {/* Blog Posts */}
              <BlogList posts={blogPosts} />
            </div>
          </div>
        </main>

        <Footer contactEmail={processedSiteInfo.globalVariables?.contactEmail} headerLogo={processedSiteInfo.headerLogo} />
      </div>
    </>
  );
}
