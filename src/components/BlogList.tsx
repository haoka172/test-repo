'use client';

import Link from 'next/link';
import Image from 'next/image';
import { BlogMetadata } from '@/utils/getBlogData';

interface BlogListProps {
  posts: BlogMetadata[];
}

export default function BlogList({ posts }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-secondary flex items-center justify-center">
            <svg className="w-10 h-10 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No blog posts yet</h3>
          <p className="text-text-secondary">
            Check back soon for exciting content about Mojuro manga!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <article
          key={post.slug}
          className="group bg-surface-primary border border-border-default rounded-xl shadow-sm hover:shadow-lg hover:border-border-strong transition-all duration-300 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* Cover Image */}
            {post.coverImage && (
              <div className="lg:w-1/3">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="aspect-video lg:aspect-square bg-surface-secondary overflow-hidden relative">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      priority={index < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </div>
            )}

            {/* Content */}
            <div className={`p-6 lg:p-8 ${post.coverImage ? 'lg:w-2/3' : 'w-full'} flex flex-col justify-between`}>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <Link href={`/blog/${post.slug}`} className="block mb-4">
                <h2 className="text-xl lg:text-2xl font-bold text-text-primary group-hover:text-primary transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h2>
              </Link>

              {/* Excerpt */}
              <p className="text-text-secondary mb-6 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Meta & Actions */}
              <div className="space-y-4">
                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-text-tertiary">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>By {post.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>

                {/* Read More Button */}
                <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center space-x-2 text-primary hover:text-primary-hover transition-colors duration-200 font-medium"
                  >
                    <span>Read More</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  
                  {/* New Badge for recent posts */}
                  {index < 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                      </svg>
                      New
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
