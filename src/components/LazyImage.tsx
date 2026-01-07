'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { useImageCache } from '@/utils/imageCache';

// CSS-in-JS styles for pseudo-elements
const styles = `
  .loading-text::before {
    content: "Loading...";
  }
  .failed-to-load-text::before {
    content: "Failed to load";
  }
`;

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  errorPlaceholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean;
  aspectRatio?: string; // 例如 "3/4" 或 "16/9"
}

export default function LazyImage({
  src,
  alt,
  className = "",
  placeholder,
  errorPlaceholder,
  onLoad,
  onError,
  priority = false,
  aspectRatio = "3/4"
}: LazyImageProps) {
  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [inView, setInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isCached, preloadImage } = useImageCache();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // 如果是优先级图片，跳过懒加载

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px 0px 100px 0px', // 提前50px开始加载
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // 检查缓存并加载图片
  useEffect(() => {
    if (inView && imageState === 'loading') {
      // 如果图片已缓存，直接设置为已加载
      if (isCached(src)) {
        setImageState('loaded');
        onLoad?.();
      } else if (priority) {
        // 优先级图片立即预加载
        preloadImage(src)
          .then(() => {
            setImageState('loaded');
            onLoad?.();
          })
          .catch(() => {
            setImageState('error');
            onError?.();
          });
      }
    }
  }, [inView, imageState, src, isCached, preloadImage, priority, onLoad, onError]);

  // 处理图片加载
  const handleImageLoad = () => {
    setImageState('loaded');
    onLoad?.();
  };

  const handleImageError = () => {
    setImageState('error');
    onError?.();
  };

  // 重试加载
  const retryLoad = () => {
    setImageState('loading');
    if (imgRef.current) {
      imgRef.current.src = src;
    }
  };

  // 默认占位符 - 不使用固定宽高比，让实际图片决定尺寸
  const defaultPlaceholder = (
    <div className="w-full bg-surface-secondary rounded flex items-center justify-center min-h-96">
      <div className="flex flex-col items-center gap-2 text-text-secondary">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-xs loading-text"></span>
      </div>
    </div>
  );

  // 默认错误占位符 - 不使用固定宽高比
  const defaultErrorPlaceholder = (
    <div className="w-full bg-red-50 border border-red-200 rounded flex items-center justify-center min-h-96">
      <div className="flex flex-col items-center gap-2 text-red-500">
        <AlertCircle className="w-6 h-6" />
        <span className="text-xs text-center failed-to-load-text"></span>
        <button
          onClick={retryLoad}
          className="flex items-center gap-1 text-xs px-2 py-1 bg-red-100 hover:bg-red-200 rounded transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div ref={containerRef} className="relative w-full">
      {/* 显示占位符当图片未开始加载或正在加载时 */}
      {(!inView || imageState === 'loading') && (
        <div className="w-full">
          {placeholder || defaultPlaceholder}
        </div>
      )}

      {/* 显示错误占位符 */}
      {imageState === 'error' && (
        <div className="w-full">
          {errorPlaceholder || defaultErrorPlaceholder}
        </div>
      )}

      {/* 实际图片 */}
      {inView && imageState !== 'error' && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className={`w-full h-auto transition-opacity duration-300 ${
            imageState === 'loaded' ? 'opacity-100' : 'opacity-0 absolute top-0'
          } ${className}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
        />
      )}
      </div>
    </>
  );
}
