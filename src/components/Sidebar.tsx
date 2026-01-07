'use client';

import Link from 'next/link';
import { MangaIcons } from './icons/MangaIcons';
import { clientSiteConfig } from '@/lib/staticConfig';
import { useEffect, useState } from 'react';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage?: string;
}

interface SidebarProps {
  className?: string;
  latestChapterPath?: string;
}

export default function Sidebar({ className = '', latestChapterPath = '/chapters/1' }: SidebarProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const siteInfo = clientSiteConfig;
  
  // 检查 blog 功能是否启用
  const isBlogEnabled = siteInfo.features?.blog?.enabled;
  
  // 获取 blog 文章列表
  useEffect(() => {
    if (!isBlogEnabled) {
      setIsLoading(false);
      return;
    }
    
    // 尝试获取 blog 文章
    fetch('/api/blog-posts')
      .then(res => res.json())
      .then(data => {
        setBlogPosts(data.posts || []);
        setIsLoading(false);
      })
      .catch(() => {
        // 如果获取失败，设置为空数组
        setBlogPosts([]);
        setIsLoading(false);
      });
  }, [isBlogEnabled]);

  // 构建快速链接列表（根据 blog 是否启用）
  const quickLinks = [
    { name: 'Latest Chapter', href: latestChapterPath, icon: MangaIcons.Lightning },
    { name: 'Chapter 1', href: '/chapters/1', icon: MangaIcons.Book },
    { name: 'All Chapters', href: '/chapters', icon: MangaIcons.Chapters },
    ...(isBlogEnabled ? [{ name: 'Blog Articles', href: '/blog', icon: MangaIcons.Bookmark }] : [])
  ];

  // 只显示前3篇文章
  const featuredPosts = blogPosts.slice(0, 3);
  
  // 是否显示 blog 区块：blog 启用 且 有文章
  const showBlogSection = isBlogEnabled && featuredPosts.length > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Featured Blog Posts - 只在有文章时显示 */}
      {showBlogSection && (
        <div className="bg-surface-secondary rounded-lg p-6 border border-border-default">
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <MangaIcons.Award className="w-5 h-5 text-primary" />
            Latest Articles
          </h3>
          <div className="space-y-6">
            {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <div className="space-y-3">
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="w-full h-32 rounded-lg overflow-hidden bg-surface-tertiary">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Title and description */}
                <div>
                  <h4 className="text-sm font-medium text-text-primary line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-text-tertiary line-clamp-3 mb-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-text-tertiary">
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mt-4"
        >
          View All Articles
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
        </div>
      )}

      {/* Quick Navigation */}
      <div className="bg-surface-secondary rounded-lg p-6 border border-border-default">
        <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
          <MangaIcons.Bookmark className="w-5 h-5 text-primary" />
          Quick Navigation
        </h3>
        <div className="space-y-2">
          {quickLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-tertiary transition-colors group"
            >
              <link.icon className="w-4 h-4 text-text-tertiary group-hover:text-primary transition-colors" />
              <span className="text-sm text-text-primary group-hover:text-primary transition-colors">
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
