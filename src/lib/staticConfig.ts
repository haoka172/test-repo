import siteInfo from '@/data/siteinfo.json';
import { processConfigWithGlobalVariables } from '@/lib/templateProcessor';
import fs from 'fs/promises';
import path from 'path';

export const getStaticSiteConfig = () => {
  const startReadingPath = `/chapters/1`; // 简化的URL结构
  
  // 处理全局变量替换
  const processedSiteInfo = processConfigWithGlobalVariables(siteInfo);
  
  return {
    ...processedSiteInfo,
    startReadingPath
  };
};

// 服务端完整配置（包含所有数据，包括敏感信息）
export const staticSiteConfig = getStaticSiteConfig();

// 获取服务端最小配置（只包含 layout.tsx 等需要的最小数据，避免暴露完整配置）
export async function getMinimalServerConfig(): Promise<{
  heroImage?: string;
  googleAdsenseId?: string;
  googleAnalyticsId?: string;
}> {
  const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');
  
  try {
    const content = await fs.readFile(siteInfoPath, 'utf8');
    const rawConfig = JSON.parse(content);
    
    // 处理模板变量
    const processedConfig = rawConfig.globalVariables 
      ? processConfigWithGlobalVariables(rawConfig)
      : rawConfig;
    
    return {
      heroImage: processedConfig.globalVariables?.heroImage || processedConfig.hero?.coverImage,
      googleAdsenseId: processedConfig.globalVariables?.googleAdsenseId,
      googleAnalyticsId: processedConfig.globalVariables?.googleAnalyticsId,
    };
  } catch (error) {
    console.warn('Failed to load minimal server config:', error);
    return {};
  }
}

// 客户端精简配置（只包含客户端组件需要的数据，排除敏感信息）
// 注意：不包含敏感信息如 googleAnalyticsId、contactEmail、advertising 等
export const clientSiteConfig = {
  colorScheme: staticSiteConfig.colorScheme,
  navigation: staticSiteConfig.navigation,
  features: {
    blog: staticSiteConfig.features?.blog ? {
      enabled: staticSiteConfig.features.blog.enabled,
      showInNavigation: staticSiteConfig.features.blog.showInNavigation,
      showInSitemap: staticSiteConfig.features.blog.showInSitemap,
    } : undefined,
  },
  globalVariables: {
    logoImg: staticSiteConfig.globalVariables?.logoImg,
    mangaTitleLower: staticSiteConfig.globalVariables?.mangaTitleLower,
    mangaTitle: staticSiteConfig.globalVariables?.mangaTitle,
  },
  headerLogo: staticSiteConfig.headerLogo,
  mangaTitle: staticSiteConfig.mangaTitle,
  title: staticSiteConfig.title,
  logoImg: staticSiteConfig.logoImg, // 兼容旧字段
  hero: {
    title: staticSiteConfig.hero?.title,
    coverImage: staticSiteConfig.hero?.coverImage,
  },
  startReadingPath: staticSiteConfig.startReadingPath,
};