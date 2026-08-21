// Service Worker for BytePrep Offline PDF & Asset Caching
const CACHE_NAME = 'byteprep-app-cache-v1';
const PDF_CACHE_NAME = 'byteprep-pdf-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Intercept PDF requests, .pdf downloads, or /api/pdf-proxy
  if (
    url.pathname.endsWith('.pdf') ||
    url.pathname.includes('/api/pdf-proxy') ||
    url.searchParams.has('url')
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(PDF_CACHE_NAME);

        // Extract target PDF URL if proxying
        const targetPdfUrl = url.searchParams.get('url') || event.request.url;

        // 1. Check if direct request or target URL exists in CacheStorage
        let match = await cache.match(event.request);
        if (!match && targetPdfUrl) {
          match = await cache.match(targetPdfUrl);
        }

        if (match) {
          console.log('[SW Cache Hit] Serving PDF offline:', targetPdfUrl);
          return match;
        }

        // 2. Fetch from network
        try {
          console.log('[SW Cache Miss] Fetching PDF network:', targetPdfUrl);
          const networkResponse = await fetch(event.request);

          if (networkResponse.ok && networkResponse.status === 200) {
            // Clone and store in PDF_CACHE_NAME
            const responseToCache = networkResponse.clone();
            await cache.put(event.request, responseToCache.clone());
            if (targetPdfUrl !== event.request.url) {
              await cache.put(targetPdfUrl, responseToCache);
            }
          }
          return networkResponse;
        } catch (error) {
          console.warn('[SW Network Failure] Checking fallback cache:', error);
          if (match) {
            return match;
          }
          return new Response('PDF is not available offline yet. Please connect to internet once to download.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          });
        }
      })()
    );
    return;
  }

  // Bypass Service Worker for images, icons, and manifest.json (browser handles natively)
  if (
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('manifest.json') ||
    url.pathname.includes('/pwa-') ||
    url.pathname.includes('/icon-') ||
    url.pathname.includes('/apple-touch-icon') ||
    url.pathname.includes('/maskable-icon')
  ) {
    return;
  }

  // General static asset fetch strategy: Cache First, Network Fallback for JS/CSS
  if (
    event.request.method === 'GET' &&
    (url.origin === location.origin || url.hostname.includes('unpkg.com') || url.hostname.includes('cdnjs'))
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request)
          .then((response) => {
            if (response.ok && response.status === 200) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            }
            return response;
          })
          .catch(() => cached || Response.error());
      })
    );
  }
});
