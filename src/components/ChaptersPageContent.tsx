'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Sidebar from './Sidebar';
import { MangaIcons } from './icons/MangaIcons';

// CSS-in-JS styles for pseudo-elements
const styles = `
  .loading-chapters-text::before {
    content: "Loading chapters...";
  }
`;

interface ChapterMetadata {
  id: string;
  title: string;
  description?: string;
  keywords?: string[];
  images?: string[];
}

interface ChaptersPageContentProps {
  allChapters: ChapterMetadata[];
  config: any;
  mangaTitle: string;
  totalChapters: number;
  latestChapterPath: string;
  adConfig?: any;
}

type SortOrder = 'latest' | 'oldest';

// Mini Sort Component - 响应式设计
function MiniSortControl({ sortOrder, onSortChange }: { 
  sortOrder: SortOrder; 
  onSortChange: (order: SortOrder) => void;
}) {
  return (
    <>
      {/* 桌面端版本 - 垂直布局 */}
      <div className="hidden lg:block sticky top-24 bg-surface-secondary rounded-lg p-4 border border-border-default shadow-sm">
        <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
          <MangaIcons.Chapters className="w-4 h-4" />
          Sort Chapters
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onSortChange('latest')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              sortOrder === 'latest'
                ? 'bg-primary text-white'
                : 'bg-surface-tertiary hover:bg-surface-elevated text-text-primary'
            }`}
          >
            <span className="w-4 h-4 bg-current rounded-full flex items-center justify-center text-xs font-bold opacity-70">
              N
            </span>
            Latest First
          </button>
          <button
            onClick={() => onSortChange('oldest')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
              sortOrder === 'oldest'
                ? 'bg-primary text-white'
                : 'bg-surface-tertiary hover:bg-surface-elevated text-text-primary'
            }`}
          >
            <span className="w-4 h-4 bg-current rounded-full flex items-center justify-center text-xs font-bold opacity-70">
              O
            </span>
            Oldest First
          </button>
        </div>
      </div>

      {/* 移动端版本 - 右下角浮动按钮 */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <div className="bg-surface-secondary rounded-full p-1.5 border border-border-default shadow-lg">
          <div className="flex flex-col gap-0.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile button clicked: latest');
                onSortChange('latest');
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 text-xs font-bold touch-manipulation ${
                sortOrder === 'latest'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-tertiary hover:bg-surface-elevated text-text-primary'
              }`}
              title="Latest First"
              type="button"
            >
              NEW
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile button clicked: oldest');
                onSortChange('oldest');
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 text-xs font-bold touch-manipulation ${
                sortOrder === 'oldest'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-tertiary hover:bg-surface-elevated text-text-primary'
              }`}
              title="Oldest First"
              type="button"
            >
              OLD
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Chapter Card Component - 响应式设计
function ChapterCard({ 
  chapter, 
  mangaTitle, 
  baseUrl 
}: { 
  chapter: ChapterMetadata; 
  mangaTitle: string;
  baseUrl: string;
}) {
  const chapterNumber = chapter.id.split('-')[0];
  
  return (
    <Link 
      href={`/chapters/${chapter.id}`}
      className="group block bg-surface-secondary rounded-lg border border-border-default hover:bg-surface-elevated hover:border-primary/20 transition-all duration-200 
                 p-3 sm:p-4 
                 hover:shadow-sm active:scale-[0.98]"
    >
      {/* 桌面端布局 */}
      <div className="hidden sm:block text-center">
        <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors">
          Chapter {chapterNumber}
        </h3>
      </div>

      {/* 移动端布局 - 更紧凑 */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors truncate">
              Ch. {chapterNumber}
            </h3>
          </div>
          <div className="ml-2 flex-shrink-0">
            <div className="w-6 h-6 bg-primary/10 group-hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors">
              <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ChaptersPageContent({ 
  allChapters, 
  config, 
  mangaTitle, 
  totalChapters, 
  latestChapterPath,
  adConfig
}: ChaptersPageContentProps) {
  const [sortOrder, setSortOrder] = useState<SortOrder>('latest');

  const handleSortChange = (newOrder: SortOrder) => {
    console.log('Sort order changing from', sortOrder, 'to', newOrder);
    setSortOrder(newOrder);
  };

  // 排序逻辑
  const sortedChapters = useMemo(() => {
    console.log('Sorting chapters with order:', sortOrder);
    console.log('Total chapters:', allChapters.length);
    
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

    const sorted = [...allChapters].sort((a, b) => {
      const aNum = parseChapterForSort(a.id);
      const bNum = parseChapterForSort(b.id);
      return sortOrder === 'latest' ? bNum - aNum : aNum - bNum;
    });

    console.log('First 5 chapters after sorting:', sorted.slice(0, 5).map(c => c.id));
    return sorted;
  }, [allChapters, sortOrder]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {/* 桌面端布局 */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8">
        {/* Left Side - Sidebar (3/12 width) */}
        <div className="lg:col-span-3">
          <div className="sticky top-24">
            <Sidebar latestChapterPath={latestChapterPath} />
          </div>
        </div>

        {/* Middle - Chapters Grid (7/12 width) */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Suspense fallback={<div className="loading-chapters-text"></div>}>
              {sortedChapters.map((chapter) => (
                <ChapterCard 
                  key={chapter.id} 
                  chapter={chapter} 
                  mangaTitle={mangaTitle}
                  baseUrl={config.baseUrl}
                />
              ))}
            </Suspense>
          </div>
        </div>

        {/* Right Side - Mini Sort Control (2/12 width) */}
        <div className="lg:col-span-2">
          <MiniSortControl 
            sortOrder={sortOrder} 
            onSortChange={handleSortChange} 
          />
        </div>
      </div>

      {/* 移动端布局 */}
      <div className="lg:hidden">
        {/* 章节网格 - 移动端一行两个 */}
        <div className="grid grid-cols-2 gap-2 mb-8 px-2">
          <Suspense fallback={<div className="col-span-2 text-center py-8 loading-chapters-text"></div>}>
            {sortedChapters.map((chapter) => (
              <ChapterCard 
                key={chapter.id} 
                chapter={chapter} 
                mangaTitle={mangaTitle}
                baseUrl={config.baseUrl}
              />
            ))}
          </Suspense>
        </div>

        {/* 侧边栏内容 - 移动端放在章节列表下面 */}
        <div className="mt-12">
          <Sidebar latestChapterPath={latestChapterPath} />
        </div>

        {/* 浮动排序控制 - 移动端右下角 */}
        <MiniSortControl 
          sortOrder={sortOrder} 
          onSortChange={handleSortChange} 
        />
      </div>
    </>
  );
}
