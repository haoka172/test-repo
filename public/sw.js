// Service Worker for caching static assets
const CACHE_NAME = 'jjk-modulo-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  // 字体文件会被自动缓存
  // 图片会按需缓存
];

// 安装Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// 激活Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// 拦截网络请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }

  // 对于静态资源使用缓存优先策略
  if (
    request.method === 'GET' && (
      url.pathname.startsWith('/_next/static/') ||
      url.pathname.startsWith('/images/') ||
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|avif|svg|ico|woff|woff2)$/)
    )
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // 在后台更新缓存
            fetch(request).then((fetchResponse) => {
              if (fetchResponse.status === 200) {
                cache.put(request, fetchResponse.clone());
              }
            }).catch(() => {
              // 网络请求失败，忽略
            });
            return cachedResponse;
          }

          // 缓存中没有，从网络获取
          return fetch(request).then((fetchResponse) => {
            if (fetchResponse.status === 200) {
              cache.put(request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      })
    );
  }

  // 对于HTML页面使用网络优先策略
  else if (
    request.method === 'GET' && 
    request.headers.get('accept')?.includes('text/html')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // 网络失败，尝试从缓存获取
          return caches.match(request);
        })
    );
  }
});

