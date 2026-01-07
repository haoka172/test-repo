import NavbarWrapper from "@/components/NavbarWrapper";
import HeroSection from "@/components/HeroSection";
import MangaInfo from "@/components/MangaInfo";
import ChapterList from "@/components/ChapterList";
import Footer from "@/components/Footer";
import { SchemaOrg } from "@/lib/seo";
import fs from 'fs/promises';
import path from 'path';
import { getAllChaptersMetadata } from '@/utils/getChapterData';
import SeoContent from "@/components/SeoContent";
import CalloutSection from "@/components/CalloutSection";
import WhatSection from "@/components/WhatSection";
import YouTubeSection from "@/components/YouTubeSection";
import validateSiteinfo from '@/utils/validateSiteinfo';
import { processConfigWithGlobalVariables } from '@/lib/templateProcessor';

export default async function Home() {
  // 优先尝试读取站点根目录的 siteInfo.json（用于整个站点的首页信息），不存在则回退到单漫画目录的 info.json
  const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');
  let mangaInfo: any;
  try {
    if (await fs.stat(siteInfoPath).then(() => true).catch(() => false)) {
      const content = await fs.readFile(siteInfoPath, 'utf8');
      const rawConfig = JSON.parse(content);
      mangaInfo = processConfigWithGlobalVariables(rawConfig);
      // Validate siteinfo strictly (will throw if missing required fields)
      validateSiteinfo(mangaInfo);
    } else {
      // 简化后不再需要fallback逻辑
      throw new Error('siteinfo.json not found');
    }
  } catch (e) {
    // 最后兜底：构造一个最小信息体，避免页面崩溃
    console.warn('读取 siteInfo 或 info.json 失败，使用占位信息：', e.message);
    mangaInfo = { 
      title: 'Manga', 
      synopsis: '', 
      genre: [], 
      coverImage: '', 
      seo: { pageTitle: 'Manga', mainHeading: 'Manga', globalPhenomenonText: '' },
      faq: [],
      hero: { title: 'Manga' },
      whatSection: { title: '', subtitle: '', items: [] },
      youtubeSection: null,
      callout: { title: '', description: '', buttons: { startText: '', latestText: '' } }
    };
  }

  const allChaptersMetadata = await getAllChaptersMetadata(); // 不再需要baseSlug参数

  // Dynamically generate paths (support chapter ids like '205-5')
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

  const sortedChapters = [...allChaptersMetadata].sort((a, b) => parseChapterForSort(a.id) - parseChapterForSort(b.id));
  const firstChapterId = sortedChapters.length > 0 ? sortedChapters[0].id : '1';
  const startReadingPath = `/chapters/${firstChapterId}`; // 简化的URL结构

  // 直接从实际的章节文件中获取最新章节，不再依赖 siteinfo.json 中的 completed 字段
  const latestChapterId = sortedChapters.length > 0 ? sortedChapters[sortedChapters.length - 1].id : '1';
  const latestChapterPath = `/chapters/${latestChapterId}`; // 简化的URL结构

  // 只传递 ChapterList 需要的字段（id 和 title），不传递 keywords 以减少数据量
  const chaptersMetadataForClient = allChaptersMetadata.map(ch => ({
    id: ch.id,
    title: ch.title,
    // keywords 字段被移除，因为 ChapterList 不使用它
  }));

  // Add dynamic paths to mangaInfo object
  mangaInfo.startReadingPath = startReadingPath;
  mangaInfo.latestChapterPath = latestChapterPath;

  // 只提取组件真正需要的字段，避免暴露完整配置到客户端
  const mangaInfoForClient = {
    title: mangaInfo.title,
    synopsis: mangaInfo.synopsis,
    genre: mangaInfo.genre || [],
    coverImage: mangaInfo.coverImage,
    totalChapters: mangaInfo.totalChapters,
    startReadingPath,
    latestChapterPath,
    status: mangaInfo.status,
    hero: mangaInfo.hero ? {
      title: mangaInfo.hero.title,
      description: mangaInfo.hero.description,
      coverImage: mangaInfo.hero.coverImage,
    } : undefined,
    callout: mangaInfo.callout ? {
      title: mangaInfo.callout.title,
      description: mangaInfo.callout.description,
      coverImage: mangaInfo.callout.coverImage,
      buttons: mangaInfo.callout.buttons ? {
        startText: mangaInfo.callout.buttons.startText,
        latestText: mangaInfo.callout.buttons.latestText,
      } : undefined,
      stats: mangaInfo.callout.stats ? {
        label: mangaInfo.callout.stats.label,
        line: mangaInfo.callout.stats.line,
      } : undefined,
    } : undefined,
    seo: mangaInfo.seo ? {
      globalPhenomenonText: mangaInfo.seo.globalPhenomenonText,
    } : undefined,
  };

  // 只传递章节列表配置需要的字段
  const chapterListConfig = mangaInfo.chapterList ? {
    title: mangaInfo.chapterList.title,
    subtitleTemplate: mangaInfo.chapterList.subtitleTemplate,
    cta: mangaInfo.chapterList.cta ? {
      readNowText: mangaInfo.chapterList.cta.readNowText,
      readNowPathTemplate: mangaInfo.chapterList.cta.readNowPathTemplate,
    } : undefined,
    sortDefault: mangaInfo.chapterList.sortDefault,
    newLabelCount: mangaInfo.chapterList.newLabelCount,
  } : undefined;

  // 只传递 WhatSection 需要的字段
  const whatSectionForClient = mangaInfo.whatSection ? {
    title: mangaInfo.whatSection.title,
    subtitle: mangaInfo.whatSection.subtitle,
    items: mangaInfo.whatSection.items?.map((item: any) => ({
      title: item.title,
      description: item.description,
      image: item.image,
      imagePosition: item.imagePosition,
      alt: item.alt,
      button: item.button ? {
        text: item.button.text,
        url: item.button.url,
      } : undefined,
    })) || [],
  } : undefined;

  // 只传递 YouTubeSection 需要的字段
  const youtubeSectionForClient = mangaInfo.youtubeSection ? {
    title: mangaInfo.youtubeSection.title,
    subtitle: mangaInfo.youtubeSection.subtitle,
    videoId: mangaInfo.youtubeSection.videoId,
    embedCode: mangaInfo.youtubeSection.embedCode,
    videoTitle: mangaInfo.youtubeSection.videoTitle,
    description: mangaInfo.youtubeSection.description,
  } : undefined;

  // 广告配置已移除 Adsterra 支持

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarWrapper latestChapterPath={latestChapterPath} />
      <div className="pt-16"> {/* 添加顶部padding以避免导航栏遮挡内容 */}
        <SchemaOrg
          type="manga"
        />
        <main>
          <MangaInfo mangaInfo={mangaInfoForClient} allChaptersMetadata={chaptersMetadataForClient} />
          <ChapterList allChaptersMetadata={chaptersMetadataForClient} chapterListConfig={chapterListConfig} />
          
          <CalloutSection mangaInfo={mangaInfoForClient} />
          <YouTubeSection youtubeSection={youtubeSectionForClient} />
          <WhatSection whatSection={whatSectionForClient} />
          

          {/* Additional SEO Content Section */}
          <section id="faq" className="py-12 bg-surface-primary">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6">{mangaInfo.headerLogo} FAQ</h2>

              <div className="space-y-6">
                {(mangaInfo.faq || []).map((item, index) => (
                  <div key={index} className="bg-surface-elevated p-6 rounded-lg shadow-sm border border-border-default">
                    <h3 className="text-xl font-bold text-text-primary">{item.question}</h3>
                    <p className="mt-2 text-text-secondary whitespace-pre-line" dangerouslySetInnerHTML={{ __html: item.answer }}></p>
                  </div>
                ))}
              </div>

              <div className="mt-10 bg-surface-elevated p-6 rounded-lg shadow-sm border border-border-default">
                <h2 className="text-xl font-bold text-text-primary">Global Cultural Phenomenon</h2>
                <p className="mt-2 text-text-secondary" dangerouslySetInnerHTML={{ __html: mangaInfo.seo.globalPhenomenonText }}></p>
              </div>
            </div>
          </section>
        </main>

        <Footer contactEmail={mangaInfo.globalVariables?.contactEmail} headerLogo={mangaInfo.headerLogo} />
      </div>
    </div>
  );
}
