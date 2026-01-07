'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, List } from 'lucide-react';
import { clientSiteConfig } from '@/lib/staticConfig';

interface ChapterSidebarProps {
  currentChapter: string | number;
  availableChapters?: string[]; // 从props接收可用章节
  totalChapters?: number;
  showRange?: number; // 显示前后多少章节，默认5
}

export default function ChapterSidebar({
  currentChapter,
  availableChapters = [],
  totalChapters,
  showRange = 5
}: ChapterSidebarProps) {
  const currentChapterStr = String(currentChapter);
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 使用最后一个章节的编号作为总章节数（而不是文件数量）
  // 这样可以正确处理有小数点的章节（如 29.5）
  const getLastChapterNumber = () => {
    if (availableChapters.length === 0) return totalChapters || 0;
    const lastChapter = availableChapters[availableChapters.length - 1];
    // 提取章节号（去掉小数部分）
    const match = lastChapter.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : totalChapters || availableChapters.length;
  };
  
  const actualTotalChapters = getLastChapterNumber();

  // 找到当前章节在可用章节列表中的位置
  const currentIndex = availableChapters.findIndex(ch => ch === currentChapterStr);

  // 计算显示的章节范围（基于实际可用章节）
  const startIndex = Math.max(0, currentIndex - showRange);
  const endIndex = Math.min(availableChapters.length - 1, currentIndex + showRange);

  // 获取要显示的章节列表
  const chapters = availableChapters.slice(startIndex, endIndex + 1);

  // 滚动时自动隐藏/显示侧边栏
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < 10) {
        ticking = false;
        return;
      }

      setIsVisible(scrollY < lastScrollY || scrollY < 100);
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 计算上一章和下一章（基于实际可用章节）
  const previousChapter = currentIndex > 0 ? availableChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < availableChapters.length - 1 ? availableChapters[currentIndex + 1] : null;

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* 桌面端固定侧边栏 */}
      <div className={`fixed right-4 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 hidden lg:block ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}>
        <div className="bg-surface-secondary/95 backdrop-blur-sm border border-border-default rounded-xl shadow-xl p-4 w-[280px] overflow-x-hidden">
          {/* 侧边栏标题 - 使用div而不是h3，避免影响SEO标题层级 */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border-default">
            <div className="text-sm font-semibold text-text-primary flex items-center" role="heading" aria-level={4}>
              <List className="w-4 h-4 mr-1" />
              <span>Chapter Navigation</span>
            </div>
            <span className="text-xs text-text-tertiary">
              {currentIndex + 1}/{actualTotalChapters}
            </span>
          </div>

          {/* 快速导航按钮 */}
          <div className="flex gap-2 mb-4">
            {previousChapter && (
              <a
                href={`/chapters/${previousChapter}`}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-surface-tertiary hover:bg-primary text-text-primary hover:text-text-inverse rounded-lg text-xs transition-all duration-200 active:scale-95"
                title={`Previous Chapter (${previousChapter})`}
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                Previous
              </a>
            )}
            {nextChapter && (
              <a
                href={`/chapters/${nextChapter}`}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-primary hover:bg-primary-hover text-text-inverse rounded-lg text-xs transition-all duration-200 active:scale-95"
                title={`Next Chapter (${nextChapter})`}
              >
                Next
                <ChevronRight className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>

          {/* 章节列表 */}
          <div className="space-y-1.5">
            <div className="text-xs text-text-tertiary mb-2 font-medium">Nearby Chapters:</div>
            <div className="max-h-48 overflow-y-auto overflow-x-hidden space-y-1">
              {chapters.map((chapter) => (
                <a
                  key={chapter}
                  href={`/chapters/${chapter}`}
                  className={`block px-3 py-2 rounded-lg text-xs transition-all duration-200 ${
                    chapter === currentChapterStr
                      ? 'bg-primary text-text-inverse font-medium shadow-md scale-105'
                      : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary hover:scale-102 active:scale-95'
                  }`}
                >
                  Chapter {chapter}
                  {chapter === currentChapterStr && ' (Current)'}
                </a>
              ))}
            </div>
          </div>

          {/* 跳转到首/末章节 */}
          <div className="mt-4 pt-3 border-t border-border-default flex gap-2">
            {currentIndex > 0 && (
              <a
                href={`/chapters/${availableChapters[0]}`}
                className="flex-1 text-center px-3 py-2 bg-surface-tertiary hover:bg-surface-elevated text-text-secondary hover:text-text-primary rounded-lg text-xs transition-all duration-200 active:scale-95 font-medium"
              >
                First ({availableChapters[0]})
              </a>
            )}
            {currentIndex < availableChapters.length - 1 && (
              <a
                href={`/chapters/${availableChapters[availableChapters.length - 1]}`}
                className="flex-1 text-center px-3 py-2 bg-surface-tertiary hover:bg-surface-elevated text-text-secondary hover:text-text-primary rounded-lg text-xs transition-all duration-200 active:scale-95 font-medium"
              >
                Latest ({availableChapters[availableChapters.length - 1]})
              </a>
            )}
          </div>

          {/* Blog文章推荐 - 仅在启用blog功能时显示 */}
          {clientSiteConfig.features?.blog?.enabled && (
            <div className="mt-4 pt-3 border-t border-border-default">
              <div className="text-xs text-text-tertiary mb-2 font-medium">📖 Related Articles:</div>
              <a
                href="/blog"
                className="block px-3 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 rounded-lg text-xs transition-all duration-200 active:scale-95"
              >
                <div className="font-medium text-text-primary mb-1">Blog Articles</div>
                <div className="text-text-tertiary line-clamp-2">Read our latest manga analysis and guides</div>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 移动端底部固定导航 */}
      <div className="fixed bottom-2 left-2 right-2 z-40 lg:hidden">
        <div className={`bg-surface-secondary/95 backdrop-blur-sm border border-border-default rounded-xl shadow-xl transition-all duration-300 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          {/* 可展开的章节列表 - 显示所有章节 */}
          {isExpanded && (
            <div className="p-3 border-b border-border-default max-h-64 overflow-y-auto overflow-x-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-text-tertiary">All Chapters</div>
                <div className="text-xs text-text-tertiary">{actualTotalChapters} chapters</div>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {availableChapters.map((chapter) => (
                  <a
                    key={chapter}
                    href={`/chapters/${chapter}`}
                    className={`px-2 py-2 rounded-lg text-xs text-center transition-all duration-200 ${
                      chapter === currentChapterStr
                        ? 'bg-primary text-text-inverse font-medium shadow-md'
                        : 'bg-surface-tertiary text-text-secondary hover:bg-primary/20 hover:text-text-primary'
                    }`}
                  >
                    {chapter}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 主要导航按钮 */}
          <div className="flex items-center p-3 gap-2">
            {previousChapter && (
              <a
                href={`/chapters/${previousChapter}`}
                className="flex items-center justify-center px-3 py-2.5 bg-surface-tertiary hover:bg-primary text-text-primary hover:text-text-inverse rounded-lg text-sm transition-all duration-200 active:scale-95 min-w-0 flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="hidden xs:inline">Previous</span>
                <span className="xs:hidden">Prev</span>
              </a>
            )}

            {/* 中间的章节信息和展开按钮 */}
            <div className="flex-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center px-3 py-2.5 bg-surface-tertiary hover:bg-surface-elevated text-text-primary rounded-lg text-sm transition-all duration-200 active:scale-95"
              >
                <List className="w-4 h-4 mr-1" />
                <span className="font-medium">Chapter {currentChapter}</span>
                <span className="ml-1 text-xs text-text-tertiary">
                  ({currentIndex + 1}/{actualTotalChapters})
                </span>
              </button>
            </div>

            {nextChapter && (
              <a
                href={`/chapters/${nextChapter}`}
                className="flex items-center justify-center px-3 py-2.5 bg-primary hover:bg-primary-hover text-text-inverse rounded-lg text-sm transition-all duration-200 active:scale-95 min-w-0 flex-shrink-0"
              >
                <span className="hidden xs:inline">Next</span>
                <span className="xs:hidden">Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}