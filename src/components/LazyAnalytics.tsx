'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

interface LazyAnalyticsProps {
  gaId: string;
}

export default function LazyAnalytics({ gaId }: LazyAnalyticsProps) {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // 延迟3秒加载Analytics，或者在用户交互时立即加载
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 3000);

    // 用户交互时立即加载Analytics
    const handleUserInteraction = () => {
      setShouldLoad(true);
      clearTimeout(timer);
      // 移除事件监听器
      document.removeEventListener('mousedown', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };

    // 监听用户交互事件
    document.addEventListener('mousedown', handleUserInteraction, { passive: true });
    document.addEventListener('keydown', handleUserInteraction, { passive: true });
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('scroll', handleUserInteraction, { passive: true });

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, []);

  // 只在需要时渲染GoogleAnalytics组件
  return shouldLoad ? <GoogleAnalytics gaId={gaId} /> : null;
}
