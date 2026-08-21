/**
 * Persistent PDF Caching Layer (CacheStorage + IndexedDB Fallback + Memory)
 *
 * Ensures PDFs viewed once remain available OFFLINE permanently
 * without requiring refetching from NCERT servers.
 */

const CACHE_NAME = 'byteprep-pdf-cache-v1';
const memoryCache = new Map<string, ArrayBuffer>();

// 1. Get cached ArrayBuffer (Memory -> CacheStorage -> IndexedDB)
export async function isPdfCached(url: string): Promise<boolean> {
  if (memoryCache.has(url)) return true;

  try {
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      const match = await cache.match(url);
      if (match) return true;
    }
  } catch (err) {
    console.warn('CacheStorage isPdfCached check warning:', err);
  }

  try {
    const dbBuffer = await getFromIndexedDB(url);
    if (dbBuffer && dbBuffer.byteLength > 100) return true;
  } catch (err) {
    console.warn('IndexedDB isPdfCached check warning:', err);
  }

  return false;
}

export async function getCachedPdf(url: string): Promise<ArrayBuffer | null> {
  // Check Memory Cache
  if (memoryCache.has(url)) {
    return memoryCache.get(url)!;
  }

  // Check CacheStorage API
  try {
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      const match = await cache.match(url);
      if (match) {
        const buffer = await match.arrayBuffer();
        if (buffer && buffer.byteLength > 100) {
          memoryCache.set(url, buffer);
          return buffer;
        }
      }
    }
  } catch (err) {
    console.warn('CacheStorage read warning:', err);
  }

  // Check IndexedDB Fallback
  try {
    const dbBuffer = await getFromIndexedDB(url);
    if (dbBuffer && dbBuffer.byteLength > 100) {
      memoryCache.set(url, dbBuffer);
      return dbBuffer;
    }
  } catch (err) {
    console.warn('IndexedDB read warning:', err);
  }

  return null;
}

// 2. Save ArrayBuffer to persistent storage
export async function saveCachedPdf(url: string, buffer: ArrayBuffer): Promise<void> {
  if (!buffer || buffer.byteLength < 100) return;

  // Save in Memory
  memoryCache.set(url, buffer);

  // Save in CacheStorage
  try {
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      const response = new Response(buffer.slice(0), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Length': buffer.byteLength.toString(),
          'X-BytePrep-Cached': 'true',
        },
      });
      await cache.put(url, response);
    }
  } catch (err) {
    console.warn('CacheStorage write warning:', err);
  }

  // Save in IndexedDB as fallback
  try {
    await saveToIndexedDB(url, buffer);
  } catch (err) {
    console.warn('IndexedDB write warning:', err);
  }
}

// IndexedDB Helper functions for persistent fallback
const DB_NAME = 'byteprep_pdf_db';
const STORE_NAME = 'pdf_files';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getFromIndexedDB(url: string): Promise<ArrayBuffer | null> {
  if (!('indexedDB' in window)) return null;
  const db = await openDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const getReq = store.get(url);
    getReq.onsuccess = () => {
      resolve(getReq.result || null);
    };
    getReq.onerror = () => resolve(null);
  });
}

async function saveToIndexedDB(url: string, buffer: ArrayBuffer): Promise<void> {
  if (!('indexedDB' in window)) return;
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const putReq = store.put(buffer, url);
    putReq.onsuccess = () => resolve();
    putReq.onerror = () => reject(putReq.error);
  });
}
