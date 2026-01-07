'use client';

import Link from 'next/link';
import { Home, BookOpen, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404图标 */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">404</div>
          <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto"></div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, the page you are looking for does not exist.
          It might be a broken chapter link or the page has been removed.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Browse All Chapters
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full px-6 py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Common Suggestions */}
        <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Suggestions:
          </h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
            <li>• Check the URL for typos</li>
            <li>• Navigate to the chapter from the homepage</li>
            <li>• If it's a bookmark, the link might be outdated</li>
          </ul>
        </div>
      </div>
    </div>
  );
}