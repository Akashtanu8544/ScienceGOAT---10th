import { Chapter } from '../types';

const SIZE_CACHE_KEY = 'byteprep_pdf_file_sizes';

/**
 * Format raw byte count into human-readable string (KB/MB)
 */
export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Pre-fetches the 'Content-Length' header for a single PDF URL
 */
export async function getPdfFileSize(url: string): Promise<string | null> {
  const cached = getStoredSizes();
  if (cached[url]) {
    return cached[url];
  }

  try {
    const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}&head=true`;
    const res = await fetch(proxyUrl, { method: 'GET' });
    if (res.ok) {
      const contentLength = res.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) > 0) {
        const formatted = formatBytes(parseInt(contentLength, 10));
        saveStoredSize(url, formatted);
        return formatted;
      }
    }
  } catch (err) {
    console.warn('Failed to prefetch size for:', url, err);
  }

  // Fallback: Default estimated NCERT chapter sizes if server head is blocked
  const estimatedSizeMap: Record<string, string> = {
    'jhsc101.pdf': '2.8 MB',
    'jhsc102.pdf': '3.2 MB',
    'jhsc103.pdf': '2.5 MB',
    'jhsc104.pdf': '3.6 MB',
    'jhsc105.pdf': '4.1 MB',
    'jhsc106.pdf': '2.9 MB',
    'jhsc107.pdf': '3.4 MB',
    'jhsc108.pdf': '2.2 MB',
    'jhsc109.pdf': '3.9 MB',
    'jhsc110.pdf': '2.1 MB',
    'jhsc111.pdf': '3.5 MB',
    'jhsc112.pdf': '3.0 MB',
    'jhsc113.pdf': '1.9 MB',
  };

  const filename = url.split('/').pop() || '';
  if (estimatedSizeMap[filename]) {
    saveStoredSize(url, estimatedSizeMap[filename]);
    return estimatedSizeMap[filename];
  }

  return null;
}

/**
 * Pre-fetches 'Content-Length' for all PDF resources in chaptersData
 */
export async function prefetchPdfFileSizes(
  chapters: Chapter[],
  onSizeUpdate?: (url: string, sizeStr: string) => void
): Promise<Record<string, string>> {
  const sizes: Record<string, string> = getStoredSizes();

  // Fetch concurrently in small batches of 3
  const batchSize = 3;
  for (let i = 0; i < chapters.length; i += batchSize) {
    const batch = chapters.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (ch) => {
        if (!sizes[ch.pdfUrl]) {
          const size = await getPdfFileSize(ch.pdfUrl);
          if (size) {
            sizes[ch.pdfUrl] = size;
            if (onSizeUpdate) onSizeUpdate(ch.pdfUrl, size);
          }
        }
      })
    );
  }

  return sizes;
}

function getStoredSizes(): Record<string, string> {
  try {
    const stored = localStorage.getItem(SIZE_CACHE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveStoredSize(url: string, sizeStr: string): void {
  try {
    const stored = getStoredSizes();
    stored[url] = sizeStr;
    localStorage.setItem(SIZE_CACHE_KEY, JSON.stringify(stored));
  } catch (e) {
    console.warn('Failed to store PDF size in localStorage', e);
  }
}
