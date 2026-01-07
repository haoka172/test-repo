'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

interface ReadingToolbarProps {
  chapterId: string | number;
  totalPages: number;
}

export default function ReadingToolbar({ chapterId, totalPages }: ReadingToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAutoScroll, setIsAutoScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 显示工具栏当向下滚动超过100px时
      setIsVisible(window.scrollY > 100);
      
      // 计算当前阅读的页面
      const pageElements = document.querySelectorAll('[data-page]');
      for (let i = pageElements.length - 1; i >= 0; i--) {
        const element = pageElements[i];
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2) {
          setCurrentPage(parseInt(element.getAttribute('data-page') || '1'));
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };

  const scrollToPage = (pageNumber: number) => {
    const pageElement = document.querySelector(`[data-page="${pageNumber}"]`);
    if (pageElement) {
      pageElement.scrollIntoView({ block: 'start' });
    }
  };

  const toggleAutoScroll = () => {
    setIsAutoScroll(!isAutoScroll);
    // 这里可以实现自动滚动逻辑
  };

  if (!isVisible) return null;

  const chapterIdStr = String(chapterId);
  const isNumericId = /^\d+$/.test(chapterIdStr);
  const numericId = isNumericId ? parseInt(chapterIdStr, 10) : NaN;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-surface-elevated border border-border-default rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          {/* 页面计数器 */}
          <div className="text-xs text-text-secondary">
            Page {currentPage} / {totalPages}
          </div>
          
          {/* 分隔线 */}
          <div className="w-px h-6 bg-border-default"></div>
          
          {/* 主题切换 */}
          <ThemeToggle />
          
          {/* 回到顶部 */}
          <button
            onClick={scrollToTop}
            className="p-2 hover:bg-surface-tertiary rounded"
            title="回到顶部"
          >
            <svg className="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
          
          {/* 上一章 */}
          <a
            href={isNumericId && numericId > 1 ? `/blue-lock-chapter-${numericId - 1}` : '#'}
            className={`p-2 rounded ${
              isNumericId && numericId > 1
                ? 'hover:bg-surface-tertiary text-text-primary' 
                : 'text-text-tertiary cursor-not-allowed'
            }`}
            title="上一章"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          
          {/* 下一章 */}
          <a
            href={isNumericId ? `/blue-lock-chapter-${numericId + 1}` : '#'}
            className="p-2 hover:bg-surface-tertiary text-text-primary rounded"
            title="下一章"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}