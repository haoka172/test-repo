import { MetadataRoute } from 'next';
import { loadSeoConfig } from '@/lib/seo';

export const dynamic = "force-static"; // Ensure SSG compatibility

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const config = await loadSeoConfig();
  
  return {
    name: config.siteName,
    short_name: config.mangaTitle || config.siteName.split(' ')[0],
    description: config.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1a1a1a',
    icons: [
      {
        src: '/images/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/images/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/images/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        src: '/images/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['entertainment', 'books', 'manga'],
    lang: 'en',
    orientation: 'portrait-primary',
    scope: '/',
  };
}
