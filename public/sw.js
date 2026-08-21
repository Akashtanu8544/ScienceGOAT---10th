// Service Worker for Science GOAT 10th RBSE - PWABuilder Fully Compliant
const CACHE_NAME = 'sciencegoat-pwa-v3';
const PDF_CACHE_NAME = 'sciencegoat-pdf-v3';

// Pre-cache all essential static assets, icons, manifest, and screenshots
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/icon-192.png',
  '/icon-512.png',
  '/maskable-icon-512x512.png',
  '/apple-touch-icon.png',
  '/screenshot-1.png',
  '/screenshot-2.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('App shell pre-cache warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME && key !== PDF_CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      ),
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // 1. Intercept PDF requests or /api/pdf-proxy
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
          return match;
        }

        try {
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
          if (match) return match;
          return new Response('PDF unavailable offline. Connect to internet to download.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        }
      })()
    );
    return;
  }

  // 2. Intercept Navigation Requests (HTML Page load / reload offline)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          const indexFallback = await caches.match('/index.html');
          if (indexFallback) return indexFallback;
          const rootFallback = await caches.match('/');
          if (rootFallback) return rootFallback;
          return Response.error();
        })
    );
    return;
  }

  // 3. Static Assets (Icons, Screenshots, PNGs, Manifest, Scripts, CSS):
  // Cache First with Network Fallback & Cache Updating
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update for cache freshness if online
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && url.origin === location.origin) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            url.origin === location.origin
          ) {
            const copy = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return networkResponse;
        })
        .catch(() => {
          return Response.error();
        });
    })
  );
});
