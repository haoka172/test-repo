'use client';

import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { clientSiteConfig } from '@/lib/staticConfig';

interface NavbarProps {
  latestChapterPath?: string;
}

export default function Navbar({ latestChapterPath: propLatestChapterPath }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const siteInfo = clientSiteConfig;
  const showDesktopTextLogo = siteInfo?.navigation?.desktopShowTextLogo ?? true;
  
  // Use the prop if available, otherwise fallback to chapter 1
  const latestChapterPath = propLatestChapterPath || `/chapters/1`;
  
  // Check if blog feature is enabled
  const isBlogEnabled = siteInfo.features?.blog?.enabled && siteInfo.features?.blog?.showInNavigation;

  return (
    <nav className="bg-surface-primary border-b border-border-default shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2">
              {/* 移动端和平板端显示图片 logo + 小字漫画名 */}
              <div className="lg:hidden flex items-center gap-2">
                <img 
                  src={siteInfo?.globalVariables?.logoImg || siteInfo?.logoImg || `/images/${siteInfo?.globalVariables?.mangaTitleLower?.replace(/\s+/g, '-') || 'logo'}.png`}
                  alt={siteInfo?.headerLogo || siteInfo?.mangaTitle}
                  className="h-8 w-auto flex-shrink-0"
                />
                <span className="text-xs font-semibold text-text-primary line-clamp-2 max-w-[120px] leading-tight">
                  {siteInfo?.headerLogo || siteInfo?.mangaTitle}
                </span>
              </div>
              
              {/* 大屏桌面端 logo 显示模式 */}
              {!showDesktopTextLogo ? (
                <div className="hidden lg:flex items-center">
                  <img
                    src={siteInfo?.globalVariables?.logoImg || siteInfo?.logoImg || `/images/${siteInfo?.globalVariables?.mangaTitleLower?.replace(/\s+/g, '-') || 'logo'}.png`}
                    alt={siteInfo?.headerLogo || siteInfo?.mangaTitle}
                    className="h-10 w-auto max-w-[220px]"
                  />
                </div>
              ) : (
                <div className="hidden lg:block relative group">
                  {/* 简洁的边框背景 */}
                  <div className="absolute inset-0 bg-text-primary/10 dark:bg-text-primary/20 border-2 border-text-primary/20 dark:border-text-primary/30 rounded-md transform rotate-1 transition-transform group-hover:rotate-0"></div>
                  <div className="absolute inset-0 bg-surface-elevated border border-text-primary/30 dark:border-text-primary/40 rounded-md shadow-sm"></div>
                  
                  {/* 文字内容 */}
                  <span className="relative text-sm sm:text-lg md:text-xl font-bold text-text-primary px-2 sm:px-3 py-1.5 tracking-wide transition-colors">
                    {siteInfo?.headerLogo || siteInfo?.mangaTitle || 'Manga'}
                  </span>
                  
                  {/* 简洁装饰点 */}
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-text-primary/60 rounded-full"></div>
                  <div className="absolute -bottom-0.5 -left-0.5 w-1 h-1 bg-text-primary/40 rounded-full"></div>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-text-primary hover:bg-surface-secondary">
              Home
            </Link>
            <Link href={siteInfo?.startReadingPath || '/chapters/1'} className="px-3 py-2 rounded-md text-sm font-medium text-text-primary hover:bg-surface-secondary">
              Chapter 1
            </Link>
            <Link href="/chapters" className="px-3 py-2 rounded-md text-sm font-medium text-text-primary hover:bg-surface-secondary">
              All Chapters
            </Link>
            <Link href={latestChapterPath} className="px-3 py-2 rounded-md text-sm font-medium text-text-primary hover:bg-surface-secondary flex items-center">
              Latest Chapters
              <span className="ml-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            </Link>
            {isBlogEnabled && (
              <Link href="/blog" className="px-3 py-2 rounded-md text-sm font-medium text-text-primary hover:bg-surface-secondary">
                Blog
              </Link>
            )}
            <Link href="/dmca" className="px-3 py-2 rounded-md text-sm font-medium text-text-primary hover:bg-surface-secondary">
            DMCA
            </Link>
            <ThemeToggle />
            {/* # Temporary disabled until implementation
            <Link href="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
              About
            </Link>
            */}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-secondary focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-border-default bg-surface-primary`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface-secondary">
            Home
          </Link>
          <Link href={siteInfo?.startReadingPath || '/chapters/1'} className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface-secondary">
            Chapter 1
          </Link>
          <Link href="/chapters" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface-secondary">
            All Chapters
          </Link>
          <div className="flex items-center">
            <Link href={latestChapterPath} className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface-secondary">
              Latest Chapters
            </Link>
            <span className="ml-1 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full">
              NEW
            </span>
          </div>
          {isBlogEnabled && (
            <Link href="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface-secondary">
              Blog
            </Link>
          )}
         <Link href="/dmca" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-surface-secondary">
            DMCA
            </Link>
            {/* # Temporary disabled until implementation
          <Link href="/about" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800">
            About
          </Link>
          */}
        </div>
      </div>
    </nav>
  );
}
