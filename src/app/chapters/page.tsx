import { loadSeoConfig, generateMetadata as generateSeoMetadata, SchemaOrg } from '@/lib/seo';
import NavbarWrapper from '@/components/NavbarWrapper';
import Footer from '@/components/Footer';
import ChaptersPageContent from '@/components/ChaptersPageContent';
import { getAllChaptersMetadata } from '@/utils/getChapterData';
import { Metadata } from 'next';
import Link from 'next/link';
import { MangaIcons } from '@/components/icons/MangaIcons';
import { replaceTemplateVariables } from '@/lib/templateProcessor';
import Breadcrumb from '@/components/Breadcrumb';

export async function generateMetadata(): Promise<Metadata> {
  const config = await loadSeoConfig();
  
  return generateSeoMetadata(config, {
    type: 'custom',
    title: `All ${config.mangaTitle || config.hero?.title || 'Manga'} manga Chapters - Complete Chapter List`,
    description: `Browse all ${config.mangaTitle || config.hero?.title || 'manga'} chapters in one place. Find and read any chapter of this popular manga series with high-quality images and fast loading.`,
    keywords: [
      `${config.mangaTitle?.toLowerCase() || 'manga'} chapters`,
      `${config.mangaTitle?.toLowerCase() || 'manga'} chapter list`,
      `all ${config.mangaTitle?.toLowerCase() || 'manga'} chapters`,
      `${config.mangaTitle?.toLowerCase() || 'manga'} complete`,
      'manga chapters',
      'chapter directory',
      'manga index'
    ],
    canonicalUrl: `${config.baseUrl}/chapters`
  });
}

interface ChapterMetadata {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
  images?: string[];
}

export default async function ChaptersPage() {
  const config = await loadSeoConfig();
  // 加载完整的siteinfo配置用于SEO内容
  const fs = require('fs/promises');
  const path = require('path');
  const { processConfigWithGlobalVariables } = require('@/lib/templateProcessor');
  const siteInfoPath = path.join(process.cwd(), 'src', 'data', 'siteinfo.json');
  const rawSiteInfo = JSON.parse(await fs.readFile(siteInfoPath, 'utf8'));
  // 处理模板变量
  const processedSiteInfo = rawSiteInfo.globalVariables 
    ? processConfigWithGlobalVariables(rawSiteInfo)
    : rawSiteInfo;
  
  const allChapters = await getAllChaptersMetadata();
  
  // 按章节号排序
  const sortedChapters = allChapters.sort((a, b) => {
    const aNum = parseInt(a.id.split('-')[0]);
    const bNum = parseInt(b.id.split('-')[0]);
    return aNum - bNum;
  });

  const totalChapters = sortedChapters.length;
  const mangaTitle = config.mangaTitle || config.hero?.title || 'Manga';
  
  // 使用与新模板相同的排序逻辑
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

  const sortedChaptersForLatest = [...allChapters].sort((a, b) => parseChapterForSort(a.id) - parseChapterForSort(b.id));
  const firstChapterId = sortedChaptersForLatest.length > 0 ? sortedChaptersForLatest[0].id : '1';
  const latestChapterId = sortedChaptersForLatest.length > 0 ? sortedChaptersForLatest[sortedChaptersForLatest.length - 1].id : '1';
  const latestChapterPath = `/chapters/${latestChapterId}`;
  
  // 创建动态模板变量用于SEO内容
  const dynamicTemplateVars = {
    firstChapter: firstChapterId,
    latestChapter: latestChapterId,
    firstChapterUrl: `${config.baseUrl}/chapters/${firstChapterId}`,
    latestChapterUrl: `${config.baseUrl}/chapters/${latestChapterId}`,
    totalChapters: totalChapters.toString()
  };

  // 调试：检查SEO配置
  console.log('SEO Config exists:', !!processedSiteInfo.seo?.chaptersPage?.seoContent);
  console.log('Config structure:', JSON.stringify(processedSiteInfo.seo?.chaptersPage, null, 2));

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: config.baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'All Chapters',
        item: `${config.baseUrl}/chapters`
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Website Schema */}
      <SchemaOrg
        type="website"
        title={`All ${mangaTitle} manga Chapters`}
        description={`Complete collection of ${mangaTitle} chapters. Browse and read all ${totalChapters} chapters of this popular manga series.`}
        url={`${config.baseUrl}/chapters`}
      />

      {/* BreadcrumbList Schema */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <NavbarWrapper latestChapterPath={latestChapterPath} />
      
      <main className="flex-grow pt-16 bg-surface-primary">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <Breadcrumb items={[
            { label: 'Home', href: '/' },
            { label: 'All Chapters' }
          ]} />

           {/* Page Header - Horizontal Layout */}
           <div className="mb-8">
             <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
               All {mangaTitle} manga Chapters
             </h1>
             
             <div className="flex items-center justify-between">
               <p className="text-base text-text-secondary max-w-3xl">
                 Browse and read all chapters of {mangaTitle} with high-quality images and fast loading.
               </p>
               
               {/* Right side features - horizontal layout, hidden on mobile */}
               <div className="hidden md:flex items-center gap-6 ml-8">
                 <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                   <MangaIcons.Chapters className="w-4 h-4" />
                   {totalChapters} Chapters
                 </div>
                 <div className="flex items-center gap-2 text-sm text-text-secondary">
                   <MangaIcons.Free className="w-4 h-4" />
                   Free to Read
                 </div>
                 <div className="flex items-center gap-2 text-sm text-text-secondary">
                   <MangaIcons.Lightning className="w-4 h-4" />
                   Fast Loading
                 </div>
               </div>
             </div>
           </div>

          {/* Main Content Area with Mini Sort Control */}
          <ChaptersPageContent
            allChapters={allChapters}
            config={config}
            mangaTitle={mangaTitle}
            totalChapters={totalChapters}
            latestChapterPath={latestChapterPath}
            adConfig={processedSiteInfo.advertising}
          />

          {/* SEO Content - Simplified */}
          {processedSiteInfo.seo?.chaptersPage?.seoContent && (
            <div className="mt-12 space-y-8">
              {/* Section 1 */}
              <div className="bg-surface-secondary rounded-lg p-4 sm:p-6 lg:p-8 border border-border-default">
                <h2 className="text-2xl font-bold text-text-primary mb-4">
                  {replaceTemplateVariables(processedSiteInfo.seo.chaptersPage.seoContent.section1.title, dynamicTemplateVars)}
                </h2>
                <div 
                  className="text-base leading-relaxed text-text-secondary"
                  dangerouslySetInnerHTML={{ __html: replaceTemplateVariables(processedSiteInfo.seo.chaptersPage.seoContent.section1.content, dynamicTemplateVars) }}
                />
              </div>

              {/* Section 2 with Features */}
              <div className="bg-surface-secondary rounded-lg p-4 sm:p-6 lg:p-8 border border-border-default">
                <h2 className="text-2xl font-bold text-text-primary mb-4">
                  {replaceTemplateVariables(processedSiteInfo.seo.chaptersPage.seoContent.section2.title, dynamicTemplateVars)}
                </h2>
                <div 
                  className="text-base leading-relaxed text-text-secondary mb-6"
                  dangerouslySetInnerHTML={{ __html: replaceTemplateVariables(processedSiteInfo.seo.chaptersPage.seoContent.section2.content, dynamicTemplateVars) }}
                />
                
                {/* Simple Features List */}
                {processedSiteInfo.seo?.chaptersPage?.features && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {processedSiteInfo.seo.chaptersPage.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-text-primary">
                        <span className="text-primary">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer contactEmail={processedSiteInfo.globalVariables?.contactEmail} headerLogo={processedSiteInfo.headerLogo} />
    </div>
  );
}
