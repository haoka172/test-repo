'use client';

import { useEffect } from 'react';

interface RedirectPageProps {
  newUrl: string;
  title?: string;
  description?: string;
}

export default function RedirectPage({ 
  newUrl, 
  title = 'Page Moved', 
  description = 'This page has moved to a new location.' 
}: RedirectPageProps) {
  useEffect(() => {
    // 立即重定向到新URL
    if (typeof window !== 'undefined') {
      // 使用replace而不是href来避免在浏览器历史中留下记录
      window.location.replace(newUrl);
    }
  }, [newUrl]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-primary">
      <div className="max-w-md mx-auto text-center p-6">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 7l5 5m0 0l-5 5m5-5H6" 
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Page Moved
          </h1>
          <p className="text-text-secondary mb-4">
            This page has moved to a new location. Redirecting automatically...
          </p>
        </div>
        
        <div className="space-y-3">
          <p className="text-sm text-text-secondary">
            If you are not redirected automatically, please click the link below:
          </p>
          <a
            href={newUrl}
            className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-colors duration-200"
          >
            Go to New Page
          </a>
        </div>
        
        <div className="mt-6 pt-4 border-t border-surface-secondary">
          <p className="text-xs text-text-secondary">
            New URL: <code className="bg-surface-secondary px-2 py-1 rounded">{newUrl}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
