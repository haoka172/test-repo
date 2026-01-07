'use client';

import { useState, useMemo } from 'react';
import { clientSiteConfig } from '@/lib/staticConfig';
// CSS-in-JS styles for pseudo-elements
const styles = `
  .read-indicator::before {
    content: "Read";
  }
  .chapter-prefix::before {
    content: "Chapter ";
  }
`;

type SortOrder = 'latest' | 'oldest';

interface ChapterListProps {
  allChaptersMetadata: Array<{ id: string; title: string; keywords?: string[] }>; // keywords 可选，因为实际不使用
  chapterListConfig?: {
    title?: string;
    subtitleTemplate?: string;
    cta?: { readNowText?: string; readNowPathTemplate?: string };
    sortDefault?: 'latest' | 'oldest';
    newLabelCount?: number;
  };
}

export default function ChapterList({ allChaptersMetadata, chapterListConfig }: ChapterListProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>((chapterListConfig?.sortDefault as SortOrder) || 'latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [chaptersPerPage] = useState(20); // 每页显示20章
  const [showAll, setShowAll] = useState(false);

  // 获取清理后的漫画标题（与章节页逻辑一致）
  const siteConfig = clientSiteConfig;
  const mangaTitle = siteConfig.hero?.title || siteConfig.title || 'Manga';
  const cleanMangaTitle = mangaTitle.split(/[—\-–]|Read/)[0].trim();

  const getSortedChapters = () => {
    // 辅助函数：将字符串章节号解析为用于排序的数值
    const parseChapterForSort = (chapterNumStr: string) => {
      if (!chapterNumStr) return 0;
      const s = chapterNumStr.replace(/\./g, '-');
      const parts = s.split('-');
      const main = parseInt(parts[0], 10) || 0;
      let sub = 0;
      if (parts.length > 1) {
        // 把子编号视为较小的增量，保证 205 < 205-5 < 205-6 < 206
        sub = parseInt(parts.slice(1).join(''), 10) / Math.pow(10, parts.slice(1).join('').length + 1);
      }
      return main + sub;
    };

    const chapters = allChaptersMetadata.map(metadata => ({
      id: String(metadata.id),
      title: `${cleanMangaTitle}`, // 移除 Chapter 文本，改用 CSS 生成
      chapterNumber: String(metadata.id), // 单独存储章节号
      releaseDate: '',
      isAvailable: true,
      isExternal: false
    }));

    switch (sortOrder) {
      case 'latest':
        return chapters.sort((a, b) => parseChapterForSort(b.id) - parseChapterForSort(a.id));
      case 'oldest':
        return chapters.sort((a, b) => parseChapterForSort(a.id) - parseChapterForSort(b.id));
      default:
        return chapters.sort((a, b) => parseChapterForSort(b.id) - parseChapterForSort(a.id));
    }
  };

  const chapters = getSortedChapters();

  // 获取实际最新的章节ID列表（用于显示New标识）
  const getLatestChapterIds = () => {
    const parseChapterForSort = (chapterNumStr: string) => {
      if (!chapterNumStr) return 0;
      const s = chapterNumStr.replace(/\./g, '-');
      const parts = s.split('-');
      const main = parseInt(parts[0], 10) || 0;
      let sub = 0;
      if (parts.length > 1) {
        sub = parseInt(parts.slice(1).join(''), 10) / Math.pow(10, parts.slice(1).join('').length + 1);
      }
      return main + sub;
    };

    // 按章节号从新到旧排序，取前3个
    const sortedByLatest = allChaptersMetadata
      .map(metadata => String(metadata.id))
      .sort((a, b) => parseChapterForSort(b) - parseChapterForSort(a))
      .slice(0, 3);
    
    return new Set(sortedByLatest);
  };

  const latestChapterIds = getLatestChapterIds();

  // 分页逻辑
  const { paginatedChapters, totalPages, shouldShowPagination } = useMemo(() => {
    const total = chapters.length;
    const showPag = total > chaptersPerPage && !showAll;

    if (showAll || !showPag) {
      return {
        paginatedChapters: chapters,
        totalPages: 1,
        shouldShowPagination: false
      };
    }

    const startIndex = (currentPage - 1) * chaptersPerPage;
    const endIndex = startIndex + chaptersPerPage;
    const paginated = chapters.slice(startIndex, endIndex);
    const totalPgs = Math.ceil(total / chaptersPerPage);

    return {
      paginatedChapters: paginated,
      totalPages: totalPgs,
      shouldShowPagination: true
    };
  }, [chapters, currentPage, chaptersPerPage, showAll]);

  // 生成分页按钮
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="py-8 bg-surface-primary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3 md:gap-4">
          <div>
            <div className="flex items-center gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-text-primary">Chapter List</h2>
              <a 
                href="/chapters" 
                className="text-sm text-primary hover:text-primary-hover underline transition-colors view-all-chapters-link"
              >
                View All Chapters
              </a>
            </div>
            <p className="text-xs md:text-sm text-text-secondary mt-1">
              {shouldShowPagination ? (
                <>Showing {(currentPage - 1) * chaptersPerPage + 1}-{Math.min(currentPage * chaptersPerPage, chapters.length)} of {chapters.length} chapters</>
              ) : (
                <>{chapters.length} chapters available</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {shouldShowPagination && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm border border-border-default rounded-md bg-surface-primary text-text-primary hover:bg-surface-secondary"
              >
                {showAll ? 'Show Paginated' : 'Show All'}
              </button>
            )}
            <label htmlFor="chapter-sort-select" className="text-xs md:text-sm font-medium text-text-primary">Sort by:</label>
            <select
              id="chapter-sort-select"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as SortOrder);
                setCurrentPage(1); // 重置到第一页
              }}
              className="px-2 py-1.5 md:px-3 md:py-2 border border-border-default rounded-md text-xs md:text-sm bg-surface-primary text-text-primary hover:border-border-strong focus:border-primary"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="bg-surface-primary rounded-lg border border-border-default overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-border-default">
            {paginatedChapters.map((chapter, index) => (
              chapter.isAvailable ? (
                <a
                  key={`${chapter.id}-${index}`}
                  href={(chapterListConfig?.cta?.readNowPathTemplate || `/chapters/{id}`).replace('{id}', chapter.id)}
                  className="group p-3 md:p-4 hover:bg-surface-secondary hover:border-l-4 hover:border-l-primary flex justify-between items-center"
                  {...(chapter.isExternal ? { rel: "nofollow" } : {})}
                >
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-surface-secondary group-hover:bg-primary group-hover:text-text-inverse rounded-lg flex items-center justify-center font-bold text-xs md:text-sm">
                      {chapter.id.replace('-', '.')}
                    </div>
                    
                    <div>
                      <div className="text-sm md:text-lg font-medium text-text-primary group-hover:text-primary flex items-center">
                        <span className="chapter-prefix"></span>
                        <span>{chapter.chapterNumber}</span>
                        {chapter.isExternal && (
                          <span className="ml-1.5 md:ml-2 px-1.5 py-0.5 md:px-2 md:py-1 text-xs text-purple-600 bg-purple-100 rounded-full font-normal">
                            External
                          </span>
                        )}
                        {latestChapterIds.has(chapter.id) && (
                          <span className="ml-1.5 md:ml-2 px-1.5 py-0.5 md:px-2 md:py-1 text-xs text-white bg-secondary rounded-full font-normal">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* 移动端隐藏read图标 */}
                    <div className="hidden md:flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="read-indicator"></span>
                    </div>
                    
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </a>
              ) : (
                <div
                  key={`${chapter.id}-${index}`}
                  className="p-4 hover:bg-surface-secondary flex justify-between items-center cursor-not-allowed opacity-70"
                  title="Coming soon"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center font-bold text-sm text-gray-500">
                      {chapter.id.replace('-', '.')}
                    </div>
                    <div>
                      <div className="text-lg font-medium text-gray-900">
                        <span className="chapter-prefix"></span>
                        <span>{chapter.chapterNumber}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Coming soon</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>

        {/* 分页导航 */}
        {shouldShowPagination && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-text-secondary">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              {/* 上一页按钮 */}
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-border-default rounded-md bg-surface-primary text-text-primary hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* 页码按钮 */}
              <div className="flex items-center gap-1">
                {generatePageNumbers().map((page, idx) => (
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 py-1 text-text-secondary">
                      ...
                    </span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      onClick={() => setCurrentPage(page as number)}
                      className={`px-3 py-2 text-sm border rounded-md ${
                        currentPage === page
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface-primary text-text-primary border-border-default hover:bg-surface-secondary'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              {/* 下一页按钮 */}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-border-default rounded-md bg-surface-primary text-text-primary hover:bg-surface-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            {/* 跳转到页面 */}
            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="page-jump-input" className="text-text-secondary">Go to:</label>
              <input
                id="page-jump-input"
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                  }
                }}
                className="w-16 px-2 py-1 border border-border-default rounded-md text-center bg-surface-primary text-text-primary"
              />
            </div>
          </div>
        )}
      </div>
    </section>
    </>
  );
}
