'use client';

import { useState, useRef, useEffect } from 'react';
import { Loader2, AlertCircle, RotateCcw } from 'lucide-react';

// CSS-in-JS styles for pseudo-elements
const styles = `
  .loading-text::before {
    content: "Loading...";
  }
`;

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export default function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = "", 
  priority = false,
  sizes = "100vw",
  quality = 75,
  fetchPriority = 'auto'
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // 生成优化的图片URL - 直接使用原始链接，避免不兼容的CDN参数
  const generateImageUrls = (originalSrc: string) => {
    // 直接返回原始链接，不添加可能不被支持的CDN参数
    // 这样可以避免URL被截断或CDN不识别参数的问题
    return [originalSrc];
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // 提前50px开始加载
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, inView]);

  // 加载图片
  useEffect(() => {
    if (!inView) return;

    const imageUrls = generateImageUrls(src);
    let isCancelled = false;

    const tryLoadImage = async (urls: string[]): Promise<string> => {
      for (const url of urls) {
        try {
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = url;
          });
          return url;
        } catch {
          continue; // 尝试下一个格式
        }
      }
      throw new Error('All image formats failed to load');
    };

    tryLoadImage(imageUrls)
      .then((successUrl) => {
        if (!isCancelled) {
          setImageSrc(successUrl);
          setIsLoading(false);
          setHasError(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setHasError(true);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [inView, src]);

  const handleRetry = () => {
    setHasError(false);
    setIsLoading(true);
    setInView(true);
  };

  const aspectRatio = width && height ? `${width}/${height}` : 'auto';

  if (hasError) {
    return (
      <div 
        ref={imgRef}
        className={`flex items-center justify-center bg-gray-100 border border-gray-200 rounded ${className}`}
        style={{ aspectRatio }}
      >
        <div className="flex flex-col items-center gap-2 text-gray-500 p-4">
          <AlertCircle className="w-6 h-6" />
          <span className="text-xs text-center">图片加载失败</span>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1 text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            重试
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !imageSrc) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
        <div 
          ref={imgRef}
          className={`flex items-center justify-center bg-gray-100 ${className}`}
          style={{ aspectRatio }}
        >
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs loading-text"></span>
          </div>
        </div>
      </>
    );
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={`transition-opacity duration-300 ${className}`}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      sizes={sizes}
      fetchPriority={fetchPriority}
      style={{ 
        aspectRatio,
        objectFit: 'cover'
      }}
      // 添加关键图片的优化属性
      {...(priority && {
        'data-lcp-candidate': 'true'
      })}
    />
  );
}
