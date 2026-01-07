'use client';

import Image from 'next/image';
import { Trophy, BookOpen, Target } from 'lucide-react';

interface CalloutSectionProps {
  mangaInfo: {
    startReadingPath: string;
    latestChapterPath: string;
    title?: string;
    hero?: {
      title?: string;
      description?: string;
      coverImage?: string;
    };
    seo?: { globalPhenomenonText?: string };
    callout?: {
      title?: string;
      description?: string;
      coverImage?: string;
      buttons?: {
        startText?: string;
        latestText?: string;
      };
      stats?: {
        label?: string;
        line?: string;
      };
    };
  };
}

export default function CalloutSection({ mangaInfo }: CalloutSectionProps) {
  const title = mangaInfo.callout?.title || mangaInfo.hero?.title || mangaInfo.title || 'Start Reading';
  const cover = mangaInfo.callout?.coverImage || mangaInfo.hero?.coverImage || '';
  const startText = mangaInfo.callout?.buttons?.startText || 'Start Reading Chapter 1';
  const latestText = mangaInfo.callout?.buttons?.latestText || 'Read Latest Chapter';
  const statsLabel = mangaInfo.callout?.stats?.label || 'GLOBAL PHENOMENON';
  const statsLine = mangaInfo.callout?.stats?.line || 'Highest-Grossing Anime Film | 150+ Million Copies Sold';

  return (
    <div className="bg-surface-primary py-6 hidden md:block">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-900 rounded-lg overflow-hidden relative">
          {/* Background image with blur effect */}
          <div className="absolute inset-0 z-0">
            {cover ? (
              <Image
                src={cover}
                alt={title}
                fill
                className="object-cover blur-sm"
                priority
              />
            ) : (
              <Image
                src="/default-hero.jpg"
                alt={title}
                fill
                className="object-cover blur-sm"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div className="relative z-10 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Left side - Title and buttons */}
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={mangaInfo.startReadingPath}
                    className="inline-block px-4 py-2 bg-white hover:bg-gray-100 text-primary rounded-md font-medium text-sm transition-colors"
                  >
                    {startText}
                  </a>
                  <a
                    href={mangaInfo.latestChapterPath}
                    className="inline-block px-4 py-2 bg-secondary hover:bg-secondary-hover text-white rounded-md font-medium text-sm transition-colors"
                  >
                    {latestText}
                  </a>
                </div>
              </div>

              {/* Right side - Stats */}
              <div className="text-center md:text-right">
                <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium mb-2">
                  {statsLabel}
                </div>
                <p className="text-white/90 text-sm flex items-center justify-center md:justify-end gap-2">
                  <Trophy className="w-4 h-4" />
                  {statsLine}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
