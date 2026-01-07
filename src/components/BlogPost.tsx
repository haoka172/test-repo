'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogPost as BlogPostType } from '@/utils/getBlogData';
import { useState } from 'react';
import { Share, Copy, CheckCircle, Linkedin } from 'lucide-react';
import ResponsiveHeading from './ResponsiveHeading';
import ResponsiveText from './ResponsiveText';
import Breadcrumb from './Breadcrumb';

interface BlogPostProps {
  post: BlogPostType;
  children: React.ReactNode;
}

export default function BlogPost({ post, children }: BlogPostProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  // 获取当前页面URL
  const getCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  // 分享到 X (Twitter)
  const shareToX = () => {
    const url = getCurrentUrl();
    // 简洁的分享格式，只有标题和链接加emoji
    const text = `🌟 ${post.title}

🔗 ${url}`;
    
    // 从post的keywords和tags动态生成hashtags
    const tagsList = [...(post.keywords || []), ...(post.tags || [])]
      .filter(tag => tag && typeof tag === 'string')
      .map(tag => tag.replace(/\s+/g, '').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, ''))
      .filter(tag => tag.length > 0)
      .slice(0, 3); // 限制最多3个标签
    
    const hashtags = tagsList.join(',');
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(shareUrl, '_blank', 'width=550,height=420');
  };

  // 分享到 LinkedIn
  const shareToLinkedIn = () => {
    const url = getCurrentUrl();
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=550,height=420');
  };

  // 复制链接
  const copyLink = async () => {
    try {
      const url = getCurrentUrl();
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // 备用方案：创建临时输入框
      const textArea = document.createElement('textarea');
      textArea.value = getCurrentUrl();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // 分享更多平台（通用分享）
  const shareMore = () => {
    const url = getCurrentUrl();
    const title = `🌟 ${post.title}`;
    
    if (navigator.share) {
      // 使用原生分享 API（移动设备）
      navigator.share({
        title: title,
        text: `🔗`,
        url: url,
      }).catch(console.error);
    } else {
      // 备用方案：复制链接
      copyLink();
    }
  };
  
  // 面包屑数据
  const breadcrumbItems = [
    {
      label: 'Home',
      href: '/',
      icon: (
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      label: 'Blog',
      href: '/blog',
      icon: (
        <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      )
    },
    {
      label: post.title
    }
  ];

  return (
    <div className="max-w-none">
      {/* Header */}
      <header className="mb-6 md:mb-12">
        {/* 统一面包屑组件 */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Article Header Card - 使用封面图作为背景 */}
        <div 
          className="relative border border-border-default rounded-lg md:rounded-xl px-3 py-3 md:px-6 md:py-4 lg:px-8 lg:py-6 mb-4 md:mb-8 overflow-hidden"
          style={{
            backgroundImage: post.coverImage ? `url(${post.coverImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* 半透明遮罩层 - 降低透明度和模糊度 */}
          <div className="absolute inset-0 bg-surface-secondary/93"></div>
          
          {/* 内容层 */}
          <div className="relative z-10">
          {/* Tags - 移动端更小 */}
          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <ResponsiveHeading level={1} className="mb-3 md:mb-4 leading-tight">
            {post.title}
          </ResponsiveHeading>

          {/* Meta Info - 移动端更紧凑 */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 lg:gap-6 text-text-tertiary text-xs md:text-sm">
            <div className="flex items-center space-x-1.5 md:space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="font-medium">By {post.author}</span>
            </div>
            
            <div className="flex items-center space-x-1.5 md:space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <time dateTime={post.date} className="font-medium">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
            
            {/* Share Section - 移动端隐藏文字 */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <span className="hidden md:inline text-sm text-text-tertiary font-medium">Share:</span>
              <div className="flex items-center space-x-1.5 md:space-x-2 relative">
                {/* X (Twitter) Share */}
                <button 
                  onClick={shareToX}
                  title="Share on X (Twitter)"
                  className="w-8 h-8 bg-surface-secondary hover:bg-primary/10 border border-border-default hover:border-primary/20 rounded-lg flex items-center justify-center transition-colors duration-200 group cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-text-tertiary group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                  </svg>
                </button>
                
                {/* LinkedIn Share */}
                <button 
                  onClick={shareToLinkedIn}
                  title="Share on LinkedIn"
                  className="w-7 h-7 md:w-8 md:h-8 bg-surface-secondary hover:bg-primary/10 border border-border-default hover:border-primary/20 rounded-md md:rounded-lg flex items-center justify-center transition-colors duration-200 group cursor-pointer"
                >
                  <Linkedin className="w-3.5 h-3.5 md:w-4 md:h-4 text-text-tertiary group-hover:text-primary transition-colors" />
                </button>
                
                {/* Copy Link */}
                <button 
                  onClick={copyLink}
                  title={copySuccess ? "Link copied!" : "Copy link"}
                  className={`w-7 h-7 md:w-8 md:h-8 ${copySuccess ? 'bg-success/10 border-success/20' : 'bg-surface-secondary hover:bg-primary/10 border-border-default hover:border-primary/20'} border rounded-md md:rounded-lg flex items-center justify-center transition-colors duration-200 group relative cursor-pointer`}
                >
                  {copySuccess ? (
                    <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-success transition-colors" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 md:w-4 md:h-4 text-text-tertiary group-hover:text-primary transition-colors" />
                  )}
                </button>
                
                {/* More Share Options */}
                <button 
                  onClick={shareMore}
                  title="More sharing options"
                  className="w-7 h-7 md:w-8 md:h-8 bg-surface-secondary hover:bg-secondary/10 border border-border-default hover:border-secondary/20 rounded-md md:rounded-lg flex items-center justify-center transition-colors duration-200 group cursor-pointer"
                >
                  <Share className="w-3.5 h-3.5 md:w-4 md:h-4 text-text-tertiary group-hover:text-secondary transition-colors" />
                </button>

                {/* Copy Success Tooltip */}
                {copySuccess && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-success text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10 animate-bounce">
                    Link copied!
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Excerpt - 移动端更紧凑，减少内间距 */}
        {post.excerpt && (
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 rounded-lg md:rounded-xl px-3 py-3 md:px-5 md:py-4 lg:px-6 lg:py-5 mb-4 md:mb-8">
            <div className="flex items-start space-x-2 md:space-x-3">
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <div className="flex-1">
                <ResponsiveHeading level={3} className="mb-1.5 md:mb-2">Article Summary</ResponsiveHeading>
                <ResponsiveText variant="body" className="text-text-secondary leading-relaxed italic">
                  {post.excerpt}
                </ResponsiveText>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Content - 移动端减少内间距，增加可读空间 */}
      <div className="blog-content bg-surface-primary rounded-lg md:rounded-xl border border-border-default px-3 py-4 md:px-5 md:py-5 lg:px-8 lg:py-6 mb-4 md:mb-8">
        {children}
      </div>

      {/* Footer Actions - 移动端更紧凑 */}
      <footer className="mt-6 md:mt-12 pt-4 md:pt-8 border-t border-border-default">
        <div className="flex items-center justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover transition-colors duration-200 font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Blog</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
