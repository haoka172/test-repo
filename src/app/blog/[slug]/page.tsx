import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllBlogMetadata, getBlogPost, getRelatedPosts } from '@/utils/getBlogData';
import { loadSeoConfig } from '@/lib/seo';
import NavbarWrapper from '@/components/NavbarWrapper';
import Footer from '@/components/Footer';
import BlogPost from '@/components/BlogPost';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllBlogMetadata();
    // 如果没有文章，返回一个占位符以避免构建错误
    if (posts.length === 0) {
      return [{ slug: 'placeholder' }];
    }
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    // 如果读取失败，返回占位符
    return [{ slug: 'placeholder' }];
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const siteConfig = await loadSeoConfig();

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = `${post.title} | ${siteConfig.title}`;
  const description = post.excerpt;
  const url = `${siteConfig.baseUrl}/blog/${slug}`;

  return {
    title,
    description,
    keywords: post.keywords.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.siteName,
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: post.coverImage || siteConfig.logoImage || '',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.coverImage || siteConfig.logoImage || ''],
    },
    alternates: {
      canonical: url,
    },
  };
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight, rehypeSlug],
  },
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  const siteConfig = await loadSeoConfig();
  // 加载完整配置用于Footer
  const fs = require('fs/promises');
  const path = require('path');
  const { processConfigWithGlobalVariables } = require('@/lib/templateProcessor');
  const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');
  const rawSiteInfo = JSON.parse(await fs.readFile(siteInfoPath, 'utf8'));
  const processedSiteInfo = rawSiteInfo.globalVariables 
    ? processConfigWithGlobalVariables(rawSiteInfo)
    : rawSiteInfo;

  if (!post || !post.published) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.tags);
  
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
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${siteConfig.baseUrl}/blog/${slug}`
      }
    ]
  };

  const jsonLd = [
    // BreadcrumbList Schema
    breadcrumbSchema,
    // BlogPosting Schema
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: {
        '@type': 'ImageObject',
        url: post.coverImage || siteConfig.logoImage,
        width: 1200,
        height: 630,
      },
      url: `${siteConfig.baseUrl}/blog/${slug}`,
      datePublished: post.date,
      dateModified: post.date,
      publisher: {
        '@type': 'Organization',
        name: siteConfig.siteName || 'Kimi to Koete Koi ni Naru Manga',
        logo: {
          '@type': 'ImageObject',
          url: siteConfig.logoImage,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${siteConfig.baseUrl}/blog/${slug}`,
      },
      keywords: post.keywords.join(', '),
      wordCount: post.content.length,
      genre: ['Manga', 'Romance', 'Shoujo', 'Drama'],
      about: {
        '@type': 'ComicSeries',
        name: 'Kimi to Koete Koi ni Naru',
        creator: {
          '@type': 'Person',
          name: 'YUZUKI Chihiro',
        },
        genre: ['Romance', 'Shoujo', 'Drama', 'Fantasy'],
        publisher: {
          '@type': 'Organization',
          name: 'Shueisha',
        },
      },
      mentions: [
        {
          '@type': 'Person',
          name: 'Mari Asaka',
          description: 'Character in Kimi to Koete Koi ni Naru manga',
        },
        {
          '@type': 'Person',
          name: 'Tsunagu Hidaka',
          description: 'Character in Kimi to Koete Koi ni Naru manga',
        },
      ],
    },
    // Article Schema for better content understanding
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.excerpt,
      image: post.coverImage || siteConfig.logoImage,
      datePublished: post.date,
      dateModified: post.date,
      publisher: {
        '@type': 'Organization',
        name: siteConfig.siteName || 'Kimi to Koete Koi ni Naru Manga',
      },
      mainEntityOfPage: `${siteConfig.baseUrl}/blog/${slug}`,
      articleSection: 'Manga Analysis',
      articleBody: post.excerpt,
    },
  ];

  return (
    <>
      {jsonLd.map((schema, index) => {
        // 使用稳定的JSON字符串
        const stableJsonString = JSON.stringify(schema);
        return (
          <script
            key={index}
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: stableJsonString }}
          />
        );
      })}
      <div className="min-h-screen flex flex-col">
        <NavbarWrapper latestChapterPath={latestChapterPath} />
        
        <main className="flex-1 pt-20 bg-surface-primary">
          <article className="container mx-auto px-3 py-4 md:px-4 md:py-6 lg:py-8 max-w-4xl">
            <BlogPost post={post}>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <MDXRemote source={post.content} options={mdxOptions} />
              </div>
            </BlogPost>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="container mx-auto px-3 py-4 md:px-4 md:py-6 lg:py-8 max-w-4xl border-t border-border-default">
              <h2 className="text-2xl font-bold text-text-primary mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <a
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="block group bg-surface-secondary border border-border-default rounded-xl p-4 hover:shadow-lg hover:border-border-strong transition-all duration-300"
                  >
                    {relatedPost.coverImage && (
                      <div className="aspect-video bg-surface-tertiary rounded-lg mb-3 overflow-hidden">
                        <img
                          src={relatedPost.coverImage}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer contactEmail={processedSiteInfo.globalVariables?.contactEmail} headerLogo={processedSiteInfo.headerLogo} />
      </div>
    </>
  );
}
