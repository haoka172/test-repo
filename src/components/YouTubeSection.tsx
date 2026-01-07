'use client';

import { Play } from 'lucide-react';
import YouTubeFacade from './YouTubeFacade';

interface YouTubeSectionProps {
  youtubeSection?: {
    title?: string;
    subtitle?: string;
    videoId?: string;
    embedCode?: string;
    videoTitle?: string;
    description?: string;
  };
}

export default function YouTubeSection({ youtubeSection }: YouTubeSectionProps) {
  if (!youtubeSection || (!youtubeSection.videoId && !youtubeSection.embedCode)) {
    return null;
  }

  const { title, subtitle, videoId, embedCode, videoTitle, description } = youtubeSection;

  // 从embedCode中提取videoId以使用Facade
  let actualVideoId = videoId;
  if (!actualVideoId && embedCode) {
    const match = embedCode.match(/embed\/([a-zA-Z0-9_-]+)/);
    actualVideoId = match ? match[1] : null;
  }

  return (
    <section className="py-12 md:py-16 bg-surface-secondary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-3 md:mb-4">
            {title || 'Watch Now'}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg text-text-secondary max-w-3xl mx-auto px-4">
              {subtitle}
            </p>
          )}
        </div>

        {/* Video Container */}
        <div className="max-w-4xl mx-auto">
        {actualVideoId ? (
          <YouTubeFacade 
            videoId={actualVideoId}
            title={videoTitle || "YouTube video player"}
            className="relative bg-black rounded-lg overflow-hidden shadow-2xl"
          />
        ) : embedCode ? (
          <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
            <div className="relative pb-[56.25%] h-0 overflow-hidden">
              <div
                className="absolute top-0 left-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                dangerouslySetInnerHTML={{ __html: embedCode }}
              />
            </div>
          </div>
        ) : null}

          {/* Video Description */}
          {description && (
            <div className="mt-6 md:mt-8 text-center">
              <div className="bg-surface-elevated p-4 md:p-6 rounded-lg shadow-sm border border-border-default">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Play className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  <h3 className="text-lg md:text-xl font-semibold text-text-primary">
                    {videoTitle || 'Featured Video'}
                  </h3>
                </div>
                <p className="text-sm md:text-base text-text-secondary leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}