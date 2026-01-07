// 统一的SEO类型定义
export interface SeoConfig {
  // 基础站点信息
  slug: string;
  title: string;
  baseUrl: string;
  siteName: string;
  description: string;
  keywords: string;
  mangaTitle?: string;

  // 作者和发布信息
  author: string;
  genre: string[];
  japaneseTitle?: string;

  // 图片资源
  logoImage: string;
  coverImage?: string;
  ogImage?: string;

  // 社交媒体
  twitter?: string;

  // 内容配置
  hero: {
    title: string;
    description: string;
    coverImage?: string;
  };

  // 章节配置
  chapterList?: {
    cta?: {
      readNowPathTemplate: string;
    };
  };
}

// 页面SEO参数
export interface PageSeoParams {
  type: 'homepage' | 'chapter' | 'category' | 'custom';
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  chapterId?: string;
  chapterTitle?: string;
  chapterContent?: string;
}

// 生成的SEO数据
export interface GeneratedSeoData {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

// Schema.org类型
export type SchemaType = 'website' | 'manga' | 'chapter' | 'article' | 'imagegallery';

export interface SchemaOrgData {
  type: SchemaType;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  dateModified?: string;
  chapterNumber?: string | number;
}