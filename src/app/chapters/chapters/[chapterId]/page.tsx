import { loadSeoConfig, generateMetadata as generateSeoMetadata, SchemaOrg } from '@/lib/seo';
import NavbarWrapper from '@/components/NavbarWrapper';
import Footer from '@/components/Footer';
import SeoContent from '@/components/SeoContent';
import { MangaIcons } from '@/components/icons/MangaIcons';
import ChapterSidebarWrapper from '@/components/ChapterSidebarWrapper';
import OptimizedChapterReader from '@/components/OptimizedChapterReader';
import { getChapterData, getAllChaptersMetadata } from '@/utils/getChapterData';
import Breadcrumb from '@/components/Breadcrumb';
import ChapterNavButton from '@/components/ChapterNavButton';

interface ChapterPageProps {
  params: Promise<{ chapterId: string }>;
}

export async function generateStaticParams() {
  // 直接从chapters文件夹获取所有章节
  const allChaptersMetadata = await getAllChaptersMetadata();
  return allChaptersMetadata.map((chapter) => ({
    chapterId: chapter.id.toString(),
  }));
}

export async function generateMetadata({ params }: ChapterPageProps) {
  const { chapterId } = await params;
  const chapterData = await getChapterData(chapterId);
  const config = await loadSeoConfig();

  if (!chapterData) {
    return {};
  }

  return generateSeoMetadata(config, {
    type: 'chapter',
    chapterId,
    title: chapterData.title,
    description: chapterData.description,
    keywords: chapterData.keywords
  });
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { chapterId } = await params;
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
  
  const chapterData = await getChapterData(chapterId);

  if (!chapterData) {
    return <div className="min-h-screen flex items-center justify-center">Chapter Not Found</div>;
  }

  const { title: chapterTitle, imagePaths: images, description: chapterDescription } = chapterData;
  const allChaptersMetadata = await getAllChaptersMetadata();
  const chapterIds = allChaptersMetadata.map(ch => String(ch.id));

  const currentChapterIndex = chapterIds.indexOf(String(chapterId));
  const prevChapter = currentChapterIndex > 0 ? chapterIds[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < chapterIds.length - 1 ? chapterIds[currentChapterIndex + 1] : null;

  const TOTAL_CHAPTERS_COUNT = allChaptersMetadata.length;
  const LATEST_CHAPTER_ID = chapterIds.length > 0 ? chapterIds[chapterIds.length - 1] : String(TOTAL_CHAPTERS_COUNT);

  // Dynamic values from config - use the pure manga title
  const cleanMangaTitle = siteConfig.mangaTitle || 'Manga';
  const chapterPathTemplate = siteConfig.chapterList?.cta?.readNowPathTemplate || `/chapters/{id}`;
  const chapterPath = chapterPathTemplate.replace('{id}', '');

  const buildChapterUrl = (id: string) => chapterPath + id;

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
        name: 'All Chapters',
        item: `${siteConfig.baseUrl}/chapters`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `Chapter ${chapterId}`,
        item: `${siteConfig.baseUrl}/chapters/${chapterId}`
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 章节结构化数据 */}
      <SchemaOrg
        type="chapter"
        title={chapterTitle}
        description={chapterDescription}
        url={`${siteConfig.baseUrl}/chapters/${chapterId}`}
        imageUrl={images.length > 0 ? images[0] : undefined}
        chapterNumber={chapterId}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <NavbarWrapper />
      <ChapterSidebarWrapper
        currentChapter={chapterId}
        availableChapters={chapterIds}
        totalChapters={TOTAL_CHAPTERS_COUNT}
      />
      <main className="flex-grow pt-16 bg-surface-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'All Chapters', href: '/chapters' },
            { label: `Chapter ${chapterId}` }
          ]} />

          <div className="bg-surface-secondary rounded-lg p-4 md:p-6 mb-6">
            {/* 标题区域 */}
            <div className="mb-4">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-text-primary text-center md:text-left">
                {cleanMangaTitle} Chapter {chapterId}
              </h1>
            </div>

            {/* 导航按钮和章节信息区域 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              {/* 章节信息 */}
              <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                <span className="flex items-center">
                  <MangaIcons.Page className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="whitespace-nowrap">Pages: {images.length}</span>
                </span>
                <span className="flex items-center">
                  <MangaIcons.Free className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="whitespace-nowrap">Status: Free to Read</span>
                </span>
              </div>

              {/* 导航按钮 - Mini版本 */}
              <div className="flex gap-1.5 justify-center sm:justify-end items-center">
                {prevChapter ? (
                  <a
                    href={buildChapterUrl(prevChapter)}
                    className="px-2.5 py-1.5 bg-surface-tertiary hover:bg-surface-elevated text-text-primary rounded text-xs font-medium transition-colors"
                    title="Previous Chapter"
                  >
                    ← Prev
                  </a>
                ) : (
                  <span className="px-2.5 py-1.5 bg-surface-tertiary/50 text-text-secondary rounded text-xs cursor-not-allowed">
                    ← Prev
                  </span>
                )}

                {/* All Chapters 按钮 */}
                <a
                  href="/chapters"
                  className="px-2.5 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 rounded text-xs font-medium transition-colors"
                  title="View All Chapters"
                >
                  All
                </a>

                {nextChapter ? (
                  <ChapterNavButton 
                    href={buildChapterUrl(nextChapter)} 
                    variant="primary"
                    title="Next Chapter"
                  >
                    Next →
                  </ChapterNavButton>
                ) : (
                  <span className="px-2.5 py-1.5 bg-surface-tertiary/50 text-text-secondary rounded text-xs cursor-not-allowed">
                    Next →
                  </span>
                )}
              </div>
            </div>
          </div>

          <OptimizedChapterReader 
            images={images}
            chapterTitle={chapterTitle}
            chapterId={chapterId}
            mangaTitle={cleanMangaTitle}
          />

          <div className="mt-8 bg-surface-secondary rounded-lg p-4">
            <h2 className="text-base font-semibold text-text-primary mb-3 text-center">
              Continue Reading {cleanMangaTitle}
            </h2>
            <div className="flex justify-center items-center gap-2">
              {prevChapter ? (
                <a
                  href={buildChapterUrl(prevChapter)}
                  className="px-3 py-2 bg-surface-tertiary hover:bg-surface-elevated text-text-primary rounded text-sm font-medium transition-colors"
                >
                  ← Prev
                </a>
              ) : (
                <span className="px-3 py-2 bg-surface-tertiary/50 text-text-secondary rounded text-sm cursor-not-allowed">
                  ← Prev
                </span>
              )}

              <a
                href="/chapters"
                className="px-3 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 rounded text-sm font-medium transition-colors"
              >
                All Chapters
              </a>

              <ChapterNavButton 
                href={buildChapterUrl(LATEST_CHAPTER_ID)}
                variant="secondary"
                className="px-3 py-2 text-sm"
              >
                Latest
              </ChapterNavButton>

              {nextChapter ? (
                <ChapterNavButton 
                  href={buildChapterUrl(nextChapter)}
                  variant="primary"
                  className="px-3 py-2 text-sm"
                >
                  Next →
                </ChapterNavButton>
              ) : (
                <span className="px-3 py-2 bg-surface-tertiary/50 text-text-secondary rounded text-sm cursor-not-allowed">
                  Next →
                </span>
              )}
            </div>
          </div>

          <div className="mt-8">
            <SeoContent
              chapterId={chapterId}
              chapterTitle={chapterTitle}
              keywords={chapterData.keywords}
              aboutSection={[chapterDescription]}
              mangaTitle={cleanMangaTitle}
            />
          </div>
        </div>
      </main>
      <Footer contactEmail={processedSiteInfo.globalVariables?.contactEmail} headerLogo={processedSiteInfo.headerLogo} />
    </div>
  );
}
