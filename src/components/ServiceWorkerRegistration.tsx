'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
          });

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 新的Service Worker已安装，但旧的仍在控制页面
                  console.log('New content is available; please refresh.');
                }
              });
            }
          });

          console.log('Service Worker registered successfully');
        } catch (error) {
          console.log('Service Worker registration failed:', error);
        }
      };

      registerSW();
    }
  }, []);

  return null; // 这个组件不渲染任何内容
}

