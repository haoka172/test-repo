'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import LazyImage from './LazyImage';

// CSS-in-JS styles for pseudo-elements
const styles = `
  .loading-page-prefix::before {
    content: "Loading page ";
  }
  .loading-page-suffix::after {
    content: "...";
  }
`;

interface OptimizedChapterReaderProps {
  images: string[];
  chapterTitle: string;
  chapterId: string;
  mangaTitle: string;
}

export default function OptimizedChapterReader({ 
  images, 
  chapterTitle, 
  chapterId, 
  mangaTitle 
}: OptimizedChapterReaderProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="space-y-2 -mx-4 sm:mx-0">

        {/* 图片列表 */}
        {images.map((image: string, index: number) => (
          <React.Fragment key={`${image}-${index}`}>
            <div className="w-full flex justify-center">
              <div className="max-w-4xl w-full">
                <LazyImage
                  src={image}
                  alt={`${mangaTitle} Chapter ${chapterId} - Page ${index + 1} - ${chapterTitle} manga`}
                  className="w-full h-auto sm:rounded sm:shadow-lg"
                  priority={index < 3} // 前3张图片优先加载
                  placeholder={
                    <div className="w-full bg-surface-secondary sm:rounded sm:shadow-lg flex items-center justify-center min-h-96">
                      <div className="flex flex-col items-center gap-2 text-text-secondary">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="text-sm loading-page-prefix loading-page-suffix">{index + 1}</span>
                      </div>
                    </div>
                  }
                />
              </div>
            </div>
          </React.Fragment>
        ))}

      </div>
    </>
  );
}