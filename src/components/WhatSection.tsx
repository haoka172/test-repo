'use client';

import { clientSiteConfig } from '@/lib/staticConfig';

interface WhatSectionProps {
  whatSection?: {
    title?: string;
    subtitle?: string;
    items?: Array<{
      title: string;
      description: string;
      image: string;
      imagePosition: 'left' | 'right';
      alt?: string;
      button?: {
        text: string;
        url: string;
      };
    }>;
  };
}

export default function WhatSection({ whatSection }: WhatSectionProps) {
  if (!whatSection || !whatSection.items || whatSection.items.length === 0) {
    return null;
  }

  const { title, subtitle, items } = whatSection;
  
  // Check if blog feature is enabled
  const isBlogEnabled = clientSiteConfig.features?.blog?.enabled;

  return (
    <section className="py-12 md:py-16 bg-surface-secondary">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-3 md:mb-4">
            {title || 'What Makes This Special'}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg text-text-secondary max-w-3xl mx-auto px-4">
              {subtitle}
            </p>
          )}
        </div>

        {/* Feature Items */}
        <div className="space-y-8 md:space-y-12 lg:space-y-16">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col ${
                item.imagePosition === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } items-center gap-6 md:gap-8 lg:gap-12`}
            >
              {/* Image */}
              <div className="w-full lg:w-1/2">
                <div className="relative w-full h-48 md:h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={item.image}
                    alt={item.alt || item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="w-full lg:w-1/2">
                <div className="text-center lg:text-left px-4 md:px-0">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-text-primary mb-3 md:mb-4">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-text-secondary leading-relaxed mb-4 md:mb-6">
                    {item.description}
                  </p>
                  {item.button && (
                    // Only show button if it's not a blog link or if blog is enabled
                    (item.button.url !== '/blog' || isBlogEnabled) && (
                      <a
                        href={item.button.url}
                        className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-colors duration-200"
                      >
                        {item.button.text}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}