import type { SeoConfig, SchemaOrgData, SchemaType } from './types';

// 生成Schema.org数据
export function generateSchemaData(
  config: SeoConfig,
  type: SchemaType,
  params: {
    title?: string;
    description?: string;
    url?: string;
    imageUrl?: string;
    datePublished?: string;
    dateModified?: string;
    chapterNumber?: string | number;
  } = {}
): any {
  const {
    title = config.title,
    description = config.description,
    url = config.baseUrl,
    imageUrl = config.logoImage.startsWith('http') ? config.logoImage : `${config.baseUrl}${config.logoImage}`,
    datePublished = new Date().toISOString(),
    dateModified = new Date().toISOString(),
    chapterNumber,
  } = params;

  switch (type) {
    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: config.siteName,
        url: config.baseUrl,
        description: config.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${config.baseUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };

    case 'manga':
      return {
        '@context': 'https://schema.org',
        '@type': 'ComicSeries',
        name: config.mangaTitle || config.hero?.title,
        alternateName: config.mangaTitle,
        url: config.baseUrl,
        description: config.description,
        image: imageUrl,
        author: {
          '@type': 'Person',
          name: config.author,
        },
        genre: config.genre,
        inLanguage: 'en',
        publisher: {
          '@type': 'Organization',
          name: config.siteName,
          url: config.baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: imageUrl,
          },
        },
        mainEntity: {
          '@type': 'CreativeWork',
          name: config.mangaTitle || config.hero?.title,
          author: {
            '@type': 'Person',
            name: config.author,
          },
          genre: config.genre,
          workExample: {
            '@type': 'WebPage',
            url: config.baseUrl,
            name: `Read ${config.mangaTitle || config.hero?.title} Online Free`,
          },
        },
        keywords: `${config.mangaTitle || config.hero?.title}, manga, read online, free, ${config.genre?.join(', ')}`,
        audience: {
          '@type': 'Audience',
          audienceType: 'Manga Readers',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          description: 'Read manga online for free',
        },
      };

    case 'chapter':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        alternativeHeadline: `${config.mangaTitle || config.hero?.title} Chapter ${chapterNumber}`,
        description: description,
        image: imageUrl,
        datePublished: datePublished,
        dateModified: dateModified,
        url: url,
        author: {
          '@type': 'Person',
          name: config.author,
        },
        publisher: {
          '@type': 'Organization',
          name: config.siteName,
          url: config.baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: imageUrl,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
        articleSection: 'Manga Chapter',
        genre: config.genre,
        inLanguage: 'en',
        isPartOf: {
          '@type': 'ComicSeries',
          name: config.mangaTitle || config.hero?.title,
          url: config.baseUrl,
          author: {
            '@type': 'Person',
            name: config.author,
          },
          genre: config.genre,
        },
        position: chapterNumber ? parseInt(String(chapterNumber).split('-')[0], 10) : undefined,
        keywords: `${config.mangaTitle || config.hero?.title}, chapter ${chapterNumber}, manga, read online, free`,
      };

    case 'imagegallery':
      return {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: title,
        description: description,
        url: url,
        image: params.images || [],
        isPartOf: {
          '@type': 'Article',
          headline: title,
          url: url,
        },
        author: {
          '@type': 'Person',
          name: config.author,
        },
        publisher: {
          '@type': 'Organization',
          name: config.siteName,
          url: config.baseUrl,
        },
      };

    case 'article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: description,
        image: imageUrl,
        datePublished: datePublished,
        dateModified: dateModified,
        url: url,
        author: {
          '@type': 'Person',
          name: config.author,
        },
        publisher: {
          '@type': 'Organization',
          name: config.siteName,
          url: config.baseUrl,
          logo: {
            '@type': 'ImageObject',
            url: imageUrl,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url,
        },
      };

    default:
      return generateSchemaData(config, 'website', params);
  }
}