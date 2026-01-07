'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface YouTubeFacadeProps {
  videoId: string;
  title?: string;
  className?: string;
}

export default function YouTubeFacade({ videoId, title = "YouTube video player", className = "" }: YouTubeFacadeProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<'maxresdefault' | 'hqdefault' | 'mqdefault' | 'sddefault'>('maxresdefault');

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // 尝试多个缩略图质量选项
  const getThumbnailUrl = (quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' | 'sddefault') => {
    return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
  };

  const handleImageError = () => {
    // 按质量递减顺序尝试
    if (currentQuality === 'maxresdefault') {
      setCurrentQuality('hqdefault');
    } else if (currentQuality === 'hqdefault') {
      setCurrentQuality('mqdefault');
    } else if (currentQuality === 'mqdefault') {
      setCurrentQuality('sddefault');
    } else {
      setImageError(true);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (isLoaded) {
    return (
      <div className={`relative pb-[56.25%] h-0 overflow-hidden ${className}`}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div 
      className={`relative pb-[56.25%] h-0 overflow-hidden bg-black cursor-pointer ${className}`}
      onClick={handleLoad}
    >
      {/* YouTube缩略图 - 多重备选方案 */}
      {!imageError && (
        <img
          src={getThumbnailUrl(currentQuality)}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}
      
      {/* 加载状态指示器 */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* 图片加载失败时的占位符 */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-gray-400">
            <Play className="w-16 h-16 mx-auto mb-2" />
            <p className="text-sm">YouTube Video</p>
          </div>
        </div>
      )}

      {/* 播放按钮覆盖层 */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors z-10">
        <div className="bg-red-600 hover:bg-red-700 rounded-full p-4 transition-colors">
          <Play className="w-8 h-8 text-white fill-white ml-1" />
        </div>
      </div>

      {/* YouTube标识 */}
      <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-1 rounded text-white text-xs font-semibold z-10">
        YouTube
      </div>
    </div>
  );
}

