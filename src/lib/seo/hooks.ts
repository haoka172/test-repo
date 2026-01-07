import { useMemo } from 'react';
import { useSeoConfig } from './provider';
import { generateSeoData, generateMetadata } from './metadata';
import type { PageSeoParams, GeneratedSeoData } from './types';
import type { Metadata } from 'next';

// 生成页面SEO数据的Hook
export function usePageSeo(params: PageSeoParams): {
  seoData: GeneratedSeoData;
  metadata: Metadata;
} {
  const config = useSeoConfig();

  const seoData = useMemo(() => generateSeoData(config, params), [config, params]);
  const metadata = useMemo(() => generateMetadata(config, params), [config, params]);

  return { seoData, metadata };
}

// 快速获取章节SEO的Hook
export function useChapterSeo(chapterId: string, chapterTitle?: string, chapterContent?: string) {
  return usePageSeo({
    type: 'chapter',
    chapterId,
    chapterTitle,
    chapterContent
  });
}

// 快速获取首页SEO的Hook
export function useHomepageSeo() {
  return usePageSeo({
    type: 'homepage'
  });
}