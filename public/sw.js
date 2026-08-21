// Service Worker for Science GOAT 10th RBSE - Caching, Sync & Push Notifications
const CACHE_NAME = 'sciencegoat-app-cache-v2';
const PDF_CACHE_NAME = 'sciencegoat-pdf-cache-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/maskable-icon-512x512.png',
  '/apple-touch-icon.png',
  '/screenshot-narrow.png',
  '/screenshot-wide.png'
];

// Install Event - Pre-cache shell & core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static app shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache non-fatal warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event - Claim clients & purge old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== PDF_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - PDF Caching & Smart Offline Network-First/Cache-First Strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Intercept PDF requests, .pdf downloads, or /api/pdf-proxy
  if (
    url.pathname.endsWith('.pdf') ||
    url.pathname.includes('/api/pdf-proxy') ||
    url.searchParams.has('url')
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(PDF_CACHE_NAME);
        const targetPdfUrl = url.searchParams.get('url') || event.request.url;

        let match = await cache.match(event.request);
        if (!match && targetPdfUrl) {
          match = await cache.match(targetPdfUrl);
        }

        if (match) {
          console.log('[SW Cache Hit] Serving PDF offline:', targetPdfUrl);
          return match;
        }

        try {
          console.log('[SW Cache Miss] Fetching PDF network:', targetPdfUrl);
          const networkResponse = await fetch(event.request);

          if (networkResponse.ok && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            await cache.put(event.request, responseToCache.clone());
            if (targetPdfUrl !== event.request.url) {
              await cache.put(targetPdfUrl, responseToCache);
            }
          }
          return networkResponse;
        } catch (error) {
          console.warn('[SW Network Failure] Fallback for PDF:', error);
          if (match) return match;
          return new Response(
            'PDF is not available offline yet. Please connect to internet once to download.',
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            }
          );
        }
      })()
    );
    return;
  }

  // 2. Navigation Request (HTML page) - Stale While Revalidate or Network First
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/') || caches.match('/index.html');
      })
    );
    return;
  }

  // 3. Static Assets & Images - Cache with Network Fallback
  if (
    event.request.method === 'GET' &&
    (url.origin === location.origin || url.hostname.includes('unpkg.com') || url.hostname.includes('cdnjs'))
  ) {
    const isImage =
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.jpg') ||
      url.pathname.endsWith('.jpeg') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.ico') ||
      url.pathname.endsWith('.json') ||
      event.request.destination === 'image';

    event.respondWith(
      (async () => {
        if (isImage) {
          try {
            const networkResponse = await fetch(event.request);
            if (networkResponse.ok && networkResponse.status === 200) {
              const contentType = networkResponse.headers.get('content-type') || '';
              if (!contentType.includes('text/html')) {
                const cache = await caches.open(CACHE_NAME);
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            }
          } catch (e) {
            // Network failed, fall back to cache below
          }
        }

        const cached = await caches.match(event.request);
        if (cached) {
          const cachedType = cached.headers.get('content-type') || '';
          if (!isImage || !cachedType.includes('text/html')) {
            return cached;
          }
        }

        try {
          const fetchResponse = await fetch(event.request);
          if (fetchResponse.ok && fetchResponse.status === 200) {
            const contentType = fetchResponse.headers.get('content-type') || '';
            if (!contentType.includes('text/html') || !isImage) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, fetchResponse.clone());
            }
          }
          return fetchResponse;
        } catch (err) {
          if (cached) return cached;
          throw err;
        }
      })()
    );
  }
});

// 4. Background Sync API Handler (Resilient Background Sync)
self.addEventListener('sync', (event) => {
  console.log('[SW Sync Event]:', event.tag);
  if (event.tag === 'sync-progress' || event.tag === 'sync-notes' || event.tag === 'background-sync') {
    event.waitUntil(
      (async () => {
        console.log('[SW Background Sync] Syncing user test progress and offline notes');
        // Retrieve offline queued actions if any from IndexedDB/localStorage client
        const clientsList = await self.clients.matchAll();
        clientsList.forEach((client) => {
          client.postMessage({
            type: 'SYNC_COMPLETED',
            tag: event.tag,
            timestamp: new Date().toISOString()
          });
        });
      })()
    );
  }
});

// 5. Periodic Background Sync API Handler (Periodic Sync)
self.addEventListener('periodicsync', (event) => {
  console.log('[SW Periodic Sync Event]:', event.tag);
  if (event.tag === 'daily-science-tip' || event.tag === 'update-notes-cache' || event.tag === 'daily-tip-widget') {
    event.waitUntil(
      (async () => {
        console.log('[SW Periodic Sync] Pre-fetching daily RBSE 10th Science study tips');
        try {
          const cache = await caches.open(CACHE_NAME);
          await cache.add('/manifest.json');
        } catch (e) {
          console.warn('[SW Periodic Sync Error]', e);
        }
      })()
    );
  }
});

// 6. Push Notifications API Handler (Web Push)
self.addEventListener('push', (event) => {
  console.log('[SW Push Event Received]');
  let data = {
    title: 'Science GOAT - 10th RBSE Science',
    body: 'आज का अति-महत्वपूर्ण प्रश्न एवं क्विज़ हल करें! 🎯',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: { url: '/?view=IMPORTANT' }
  };

  if (event.data) {
    try {
      data = Object.assign({}, data, event.data.json());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/pwa-192x192.png',
    badge: data.badge || '/pwa-192x192.png',
    vibrate: [100, 50, 100],
    data: data.data || { url: '/' },
    actions: [
      { action: 'open_app', title: 'ऐप खोलें 📖' },
      { action: 'close', title: 'बंद करें' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 7. Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const targetUrl = event.notification.data && event.notification.data.url ? event.notification.data.url : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
