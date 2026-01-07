'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const ChapterSidebar = dynamic(() => import('./ChapterSidebar'), {
  ssr: false,
  loading: () => null
});

interface ChapterSidebarWrapperProps {
  currentChapter: string | number;
  availableChapters?: string[];
  totalChapters?: number;
  showRange?: number;
}

export default function ChapterSidebarWrapper(props: ChapterSidebarWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render on client after hydration to prevent SSR issues
  if (typeof window === 'undefined' || !mounted) {
    return null;
  }

  return <ChapterSidebar {...props} />;
}