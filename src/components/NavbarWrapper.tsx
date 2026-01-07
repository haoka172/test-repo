'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// 立即显示的loading navbar
function LoadingNavbar() {
  return (
    <nav className="bg-surface-primary border-b border-border-default fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-24 bg-surface-tertiary rounded animate-pulse"></div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <div className="h-6 w-16 bg-surface-tertiary rounded animate-pulse"></div>
              <div className="h-6 w-16 bg-surface-tertiary rounded animate-pulse"></div>
            </div>
          </div>
          <div className="md:hidden">
            <div className="h-6 w-6 bg-surface-tertiary rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}

const Navbar = dynamic(() => import('./Navbar'), {
  ssr: true,
  loading: () => <LoadingNavbar />
});

interface NavbarWrapperProps {
  latestChapterPath?: string;
}

export default function NavbarWrapper({ latestChapterPath }: NavbarWrapperProps) {
  return (
    <Suspense fallback={<LoadingNavbar />}>
      <Navbar latestChapterPath={latestChapterPath} />
    </Suspense>
  );
}