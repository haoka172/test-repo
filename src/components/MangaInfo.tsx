'use client';
// import { dataMetadata, availableChapters } from '@/data/chapterData'; // Removed old import

interface MangaInfoProps {
  mangaInfo: {
    title: string;
    synopsis: string;
    genre: string[];
    coverImage: string;
    totalChapters?: number; // 从实际章节数量计算
    startReadingPath: string;
    latestChapterPath: string;
    status?: string; // 添加status属性
    // optional hero override for top callout
    hero?: {
      title?: string;
      description?: string;
      coverImage?: string;
    };
  };
  // 新增：直接传入章节数据（只包含必要的字段）
  allChaptersMetadata: Array<{
    id: string;
    title: string;
    keywords?: string[]; // 可选，因为实际不使用
  }>;
}

export default function MangaInfo({ mangaInfo, allChaptersMetadata }: MangaInfoProps) {
  // 兼容 string 或 number 的章节 id，按主编号选择最大已完成章节
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

  // 从实际章节数据中获取最新章节
  const sortedChapters = [...allChaptersMetadata].sort((a, b) => parseChapterForSort(b.id) - parseChapterForSort(a.id));
  const latestCompletedChapter = sortedChapters.length > 0 ? String(sortedChapters[0].id) : String(1);
  
  // If siteinfo defines a hero block, prefer those values for the main display
  const hero = mangaInfo.hero;
  
  // 使用实际的章节数量来判断状态
  const actualChapterCount = allChaptersMetadata.length;
  const isCompleted = mangaInfo.totalChapters 
    ? actualChapterCount >= mangaInfo.totalChapters
    : false; // 默认为连载中，除非明确指定

  // 处理描述文本，移动端只显示第一段和第三段
  const fullDescription = hero?.description || mangaInfo.synopsis;
  const paragraphs = fullDescription.split('\n\n');
  const mobileDescription = paragraphs.length >= 3 
    ? `${paragraphs[0]}\n\n${paragraphs[paragraphs.length - 1]}`
    : fullDescription;

  const displayMangaData = {
    title: hero?.title || mangaInfo.title,
    description: fullDescription,
    mobileDescription: mobileDescription,
    status: mangaInfo.status || (isCompleted ? "Completed" : "Ongoing"),
    type: "Shōnen Manga",
    genres: mangaInfo.genre,
    rating: 9.8,
    followers: 15847,
    latestChapter: latestCompletedChapter,
    coverImage: hero?.coverImage || mangaInfo.coverImage,
    startReadingPath: mangaInfo.startReadingPath,
    latestChapterPath: mangaInfo.latestChapterPath
  };

  return (
    <>
      {/* 移动端和桌面端的主要hero区域 */}
      <section className="bg-surface-primary">
        {/* 移动端首屏 - 优化 LCP 性能 */}
        <div className="md:hidden flex items-center justify-center px-4 py-8">
          <div className="flex flex-col items-center text-center space-y-4 max-w-sm mx-auto">
            {/* 简单的封面图片 */}
            <div className="relative w-72 h-96 rounded-xl overflow-hidden shadow-2xl">
              <img
                src={displayMangaData.coverImage || "/default-hero.jpg"}
                alt={displayMangaData.title}
                width={288}
                height={384}
                className="w-full h-full object-cover object-top"
                loading="eager"
                fetchPriority="high"
              />
            </div>

            {/* 评分区域 - 更小更精致 */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span className="ml-1 font-bold text-yellow-700 text-sm">{displayMangaData.rating}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                displayMangaData.status === 'Completed'
                  ? 'bg-primary-50 text-primary-700'
                  : 'bg-green-50 text-green-700'
              }`}>
                {displayMangaData.status}
              </span>
            </div>

            {/* 类型标签 - 更小更精致 */}
            <div className="flex flex-wrap gap-1 justify-center max-w-xs">
              {displayMangaData.genres.map((genre, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs font-medium px-1.5 py-0.5 rounded-full">
                  {genre}
                </span>
              ))}
            </div>

            {/* 优雅按钮组 */}
            <div className="w-full space-y-3 max-w-xs">
              <a
                href={displayMangaData.startReadingPath}
                className="w-full block text-center px-6 py-3 text-white rounded-xl font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-primary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                }}
              >
                Start Reading Chapter 1
              </a>
              <a
                href={displayMangaData.latestChapterPath}
                className="w-full block text-center px-6 py-3 text-white rounded-xl font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-secondary)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
                }}
              >
                Read Latest Chapter
              </a>
            </div>
          </div>
        </div>

        {/* 桌面端布局 */}
        <div className="hidden md:block py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-row gap-8">
              {/* 左栏 */}
              <div className="w-1/3">
                <div className="flex flex-col items-start">
                  <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={displayMangaData.coverImage || "/default-hero.jpg"}
                      alt={displayMangaData.title}
                      width={380}
                      height={384}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                      fetchPriority="high"
                    />
                  </div>

                  <div className="mt-3 w-full flex items-center justify-between gap-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                      <span className="ml-1 font-bold text-text-primary text-lg">{displayMangaData.rating}</span>
                    </div>
                    <span className={`text-sm font-medium px-3 py-1 rounded ${
                      displayMangaData.status === 'Completed'
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {displayMangaData.status}
                    </span>
                  </div>

                  <div className="mt-3 w-full flex flex-wrap gap-1.5">
                    {displayMangaData.genres.map((genre, index) => (
                      <span key={index} className="bg-surface-secondary text-text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 w-full space-y-3">
                    <a
                      href={displayMangaData.startReadingPath}
                      className="w-full block text-center px-4 py-3 text-white rounded-md font-medium text-base transition-all"
                      style={{
                        backgroundColor: 'var(--color-primary)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                      }}
                    >
                      Start Reading Chapter 1
                    </a>
                    <a
                      href={displayMangaData.latestChapterPath}
                      className="w-full block text-center px-4 py-3 text-white rounded-md font-medium text-base transition-all"
                      style={{
                        backgroundColor: 'var(--color-secondary)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--color-secondary)';
                      }}
                    >
                      Read Latest Chapter
                    </a>
                  </div>
                </div>
              </div>

              {/* 右栏 */}
              <div className="w-2/3">
                <h1 className="text-3xl font-bold text-text-primary">{displayMangaData.title}</h1>
                <div className="mt-3">
                  <h2 className="text-xl font-semibold text-text-primary">Synopsis</h2>
                  <p className="mt-1 text-base text-text-secondary whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: displayMangaData.description }}>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 移动端独立文案区域 */}
      <section className="md:hidden bg-surface-primary py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-2xl font-bold text-text-primary text-center mb-4">{displayMangaData.title}</div>
          <div className="bg-surface-secondary rounded-lg p-6">
            <div className="text-lg font-semibold text-text-primary mb-3">Synopsis</div>
            <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed" dangerouslySetInnerHTML={{ __html: displayMangaData.mobileDescription }}>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
