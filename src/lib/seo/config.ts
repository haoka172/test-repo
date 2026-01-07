import fs from 'fs/promises';
import path from 'path';
import type { SeoConfig } from './types';
import { processConfigWithGlobalVariables } from '@/lib/templateProcessor';

// 缓存配置，避免重复读取
let cachedConfig: SeoConfig | null = null;

// 标准化和验证配置
export function normalizeSeoConfig(rawConfig: any): SeoConfig {
  // 提供默认值并标准化配置
  const normalized: SeoConfig = {
    slug: rawConfig.slug || 'manga',
    title: rawConfig.title || 'Manga Reader',
    baseUrl: rawConfig.seo?.baseUrl || rawConfig.hero?.baseUrl || 'https://manga-reader.online',
    siteName: rawConfig.seo?.siteName || rawConfig.title || 'Manga Reader',
    description: rawConfig.seo?.pageDescription || rawConfig.hero?.description || 'Read manga online for free with high quality images.',
    keywords: rawConfig.seo?.keywords || (rawConfig.genre ? rawConfig.genre.join(', ') : 'manga, read online'),
    mangaTitle: rawConfig.mangaTitle || rawConfig.globalVariables?.mangaTitle,

    author: rawConfig.author || 'Unknown',
    genre: rawConfig.genre || ['Action', 'Adventure'],
    japaneseTitle: rawConfig.japaneseTitle,

    logoImage: rawConfig.seo?.logoImage || rawConfig.hero?.coverImage || '/android-chrome-512x512.png',
    coverImage: rawConfig.hero?.coverImage,
    ogImage: rawConfig.seo?.ogImage || rawConfig.hero?.coverImage,

    twitter: rawConfig.seo?.twitter || rawConfig.twitter,

    hero: {
      title: rawConfig.hero?.title || rawConfig.title,
      description: rawConfig.hero?.description || 'Read manga online for free',
      coverImage: rawConfig.hero?.coverImage
    },

    chapterList: rawConfig.chapterList
  };
  
  // Preserve ads config if it exists
  if (rawConfig.ads) {
    (normalized as any).ads = rawConfig.ads;
  }
  
  // Preserve globalVariables if it exists (needed for AdSense, Analytics, etc.)
  if (rawConfig.globalVariables) {
    (normalized as any).globalVariables = rawConfig.globalVariables;
  }
  
  return normalized;
}

// 加载SEO配置（单例模式）
export async function loadSeoConfig(): Promise<SeoConfig> {
  if (cachedConfig) {
    return cachedConfig;
  }

  const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');

  try {
    const content = await fs.readFile(siteInfoPath, 'utf8');
    const rawConfig = JSON.parse(content);
    
    // 处理模板变量
    const processedConfig = rawConfig.globalVariables 
      ? processConfigWithGlobalVariables(rawConfig)
      : rawConfig;
    
    cachedConfig = normalizeSeoConfig(processedConfig);
    return cachedConfig;
  } catch (error) {
    console.warn('Failed to load siteinfo.json, using fallback:', error);

    // 提供fallback配置
    cachedConfig = normalizeSeoConfig({
      title: 'Manga Reader',
      hero: {
        title: 'Manga Reader',
        description: 'Read manga online for free with high quality images.',
      },
      seo: {
        pageTitle: 'Manga Reader - Read Manga Online Free',
        pageDescription: 'Read manga online for free with high quality images. Latest chapters updated daily.',
        keywords: 'manga, read online, free manga',
        baseUrl: 'https://manga-reader.online',
        siteName: 'Manga Reader',
        logoImage: '/android-chrome-512x512.png'
      },
      author: 'Unknown',
      genre: ['Action', 'Adventure']
    });

    return cachedConfig;
  }
}

// 清除缓存（用于开发环境热更新）
export function clearSeoConfigCache() {
  cachedConfig = null;
}