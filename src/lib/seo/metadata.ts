import type { Metadata } from 'next';
import type { SeoConfig, PageSeoParams, GeneratedSeoData } from './types';
import { 
  generateChapterMetadata, 
  extractChapterTemplateConfig,
  generateSmartChapterTitle,
  type ChapterTemplateParams 
} from '../template/templateUtils';

// 智能文本截断（在句号处结束）
function truncateAtSentence(text: string, targetLength: number = 160): string {
  const cleanText = text
    .replace(/<[^>]*>/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/&#39;/g, "'")  // 将HTML转义的单引号还原
    .replace(/&quot;/g, '"') // 将HTML转义的双引号还原
    .replace(/&amp;/g, '&')  // 将HTML转义的&符号还原
    .replace(/&lt;/g, '<')   // 将HTML转义的<符号还原
    .replace(/&gt;/g, '>')   // 将HTML转义的>符号还原
    .trim();

  if (cleanText.length <= targetLength) {
    return cleanText;
  }

  const minLength = targetLength - 50;
  const maxLength = targetLength + 50;

  const sentences = cleanText.split(/([.!?]+\s+)/);
  let result = '';

  for (let i = 0; i < sentences.length; i += 2) {
    const sentence = sentences[i] + (sentences[i + 1] || '');
    const newResult = result + sentence;

    if (newResult.length >= minLength && newResult.length <= maxLength) {
      return newResult.trim();
    } else if (newResult.length > maxLength) {
      return result.trim() || cleanText.substring(0, targetLength).trim() + '...';
    }

    result = newResult;
  }

  return result.trim() || cleanText.substring(0, targetLength).trim() + '...';
}

// 生成标准化的SEO数据
export function generateSeoData(config: SeoConfig, params: PageSeoParams): GeneratedSeoData {
  let title = '';
  let description = '';
  let keywords = config.seo?.keywords || config.keywords;
  let canonicalUrl = config.seo?.baseUrl || config.baseUrl;

  // 根据页面类型生成不同的SEO数据
  switch (params.type) {
    case 'homepage':
      title = config.seo?.pageTitle || config.title;
      description = config.seo?.pageDescription || config.description;
      canonicalUrl = config.seo?.baseUrl || config.baseUrl;
      break;

    case 'chapter':
      // 尝试使用模板化配置生成SEO数据
      const templateConfig = extractChapterTemplateConfig(config);
      
      if (templateConfig) {
        // 使用模板生成SEO数据 - 直接从配置中获取漫画标题
        const mangaTitle = config.mangaTitle || 'Manga';
        const mangaTitleLower = mangaTitle.toLowerCase();
        
        const templateParams: ChapterTemplateParams = {
          chapterId: params.chapterId,
          chapterTitle: params.chapterTitle || generateSmartChapterTitle(params.chapterId, undefined, mangaTitle),
          mangaTitle,
          mangaTitleLower,
          author: config.author,
          customVariables: {
            baseUrl: config.baseUrl,
            siteName: config.siteName
          }
        };
        
        const generatedMetadata = generateChapterMetadata(templateConfig, templateParams);
        
        title = generatedMetadata.title;
        description = truncateAtSentence(generatedMetadata.description, 160);
        keywords = generatedMetadata.keywords.join(', ');
      } else {
        // 回退到原有逻辑
        title = params.chapterTitle || params.title || `Chapter ${params.chapterId}`;

        // 直接使用 md 文件的 description，截取到 160 字最近的句号
        if (params.description) {
          description = truncateAtSentence(params.description, 160);
        } else if (params.chapterContent) {
          description = truncateAtSentence(params.chapterContent, 160);
        } else {
          const mangaTitle = config.mangaTitle || 'Manga';
          description = `Read ${mangaTitle} Chapter ${params.chapterId} online for free. High quality manga pages and latest chapters updated daily.`;
        }

        // 使用章节 md 文件里的 keywords，如果没有则使用默认 keywords
        if (params.keywords && params.keywords.length > 0) {
          keywords = params.keywords.join(', ');
        } else {
          // 如果 md 文件没有 keywords，则使用默认 keywords
          const mangaTitle = config.mangaTitle || 'Manga';
          const defaultKeywords = `${mangaTitle}, ${mangaTitle} Chapter ${params.chapterId}, Read ${mangaTitle} Chapter, Japanese Manga, Free Manga Online, High Quality Manga, Latest Manga Updates`;
          keywords = defaultKeywords;
        }
      }
      
      canonicalUrl = `${config.baseUrl}/chapters/${params.chapterId}`;
      break;

    case 'custom':
      title = params.title || config.title;
      description = params.description || config.description;
      keywords = params.keywords?.join(', ') || config.keywords;
      canonicalUrl = params.canonicalUrl || config.baseUrl;
      break;

    default:
      title = config.title;
      description = config.description;
      break;
  }

  // 确保图片URL是完整的
  const getFullImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) return imagePath;
    return `${config.baseUrl}${imagePath}`;
  };

  const ogImage = getFullImageUrl(config.ogImage || config.logoImage);

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage
  };
}

// 生成Next.js Metadata对象
export function generateMetadata(config: SeoConfig, params: PageSeoParams): Metadata {
  const seoData = generateSeoData(config, params);

  const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
      canonical: seoData.canonicalUrl,
    },
    openGraph: {
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      url: seoData.canonicalUrl,
      siteName: config.siteName,
      type: 'website',
      locale: 'en_US',
      images: [
        {
          url: seoData.ogImage,
          width: 512,
          height: 512,
          alt: `${config.siteName} Logo`,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.twitterTitle,
      description: seoData.twitterDescription,
      images: [seoData.twitterImage],
    },
    robots: {
      index: true,
      follow: true,
    },
    metadataBase: new URL(config.baseUrl),
    icons: {
      icon: [
        { url: '/images/favicon.ico', sizes: '48x48' },
        { url: '/images/favicon-16x16.png', sizes: '16x16' },
        { url: '/images/favicon-32x32.png', sizes: '32x32' },
      ],
      apple: [
        { url: '/images/apple-touch-icon.png', sizes: '180x180' },
      ],
      other: [
        {
          rel: 'manifest',
          url: '/manifest.webmanifest',
        },
      ],
    },
    manifest: '/manifest.webmanifest',
    applicationName: config.siteName,
  };

  return metadata;
}