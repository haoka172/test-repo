'use client';

import OptimizedChapterReader from './OptimizedChapterReader';

interface ChapterReaderWithAdsProps {
  images: string[];
  chapterTitle: string;
  chapterId: string;
  mangaTitle: string;
  adConfig?: {
    enabled?: boolean;
    placements?: {
      chapterDetail?: {
        betweenImages?: any;
      };
    };
  };
}

export default function ChapterReaderWithAds({
  images,
  chapterTitle,
  chapterId,
  mangaTitle,
  adConfig
}: ChapterReaderWithAdsProps) {
  // Adsterra 广告支持已移除，直接显示所有图片
  return (
    <div>
      <OptimizedChapterReader 
        images={images}
        chapterTitle={chapterTitle}
        chapterId={chapterId}
        mangaTitle={mangaTitle}
      />
    </div>
  );
}
