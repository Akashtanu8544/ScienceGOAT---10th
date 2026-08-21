/**
 * PDF Fetch Service with Proxy Polling, Fallbacks, and Offline Caching
 */

export interface FetchPdfOptions {
  onProgress?: (percent: number) => void;
  onStatusUpdate?: (statusMsg: string) => void;
}

export function notifyPdfProxyStart(msg = 'NCERT सामग्री डाउनलोड हो रही है...') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pdf-proxy-start', { detail: { message: msg } }));
  }
}

export function notifyPdfProxyStatus(msg: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pdf-proxy-status', { detail: { message: msg } }));
  }
}

export function notifyPdfProxyEnd() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pdf-proxy-end'));
  }
}

export async function fetchPdfArrayBufferWithFallback(
  url: string,
  options?: FetchPdfOptions
): Promise<ArrayBuffer> {
  const onProgress = options?.onProgress || (() => {});
  const userStatusUpdate = options?.onStatusUpdate || (() => {});

  const onStatusUpdate = (msg: string) => {
    userStatusUpdate(msg);
    notifyPdfProxyStatus(msg);
  };

  notifyPdfProxyStart('NCERT सामग्री डाउनलोड हो रही है...');

  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  let pollInterval: any = null;

  // Start polling proxy status endpoint for real-time progress & error reporting
  pollInterval = setInterval(async () => {
    try {
      const res = await fetch(`/api/pdf-proxy-status?jobId=${jobId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          onStatusUpdate(data.message);
        }
        if (data.status === 'error') {
          clearInterval(pollInterval);
        }
      }
    } catch {
      // Ignore polling hiccups
    }
  }, 400);

  const tryFetch = async (targetUrl: string, isProxy = false): Promise<ArrayBuffer | null> => {
    try {
      const response = await fetch(targetUrl);

      // Check if proxy returned explicit 502/504 error response
      if (isProxy && response.status >= 400) {
        try {
          const errJson = await response.json();
          if (errJson.error) {
            console.warn('[PDF Fetch] Proxy returned error:', errJson);
            onStatusUpdate(`Server Connection Error: ${errJson.message || 'NCERT server error'}`);
          }
        } catch {}
        return null;
      }

      if (!response.ok) return null;

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      if (response.body && total > 0) {
        const reader = response.body.getReader();
        let receivedLength = 0;
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
          onProgress(Math.min(95, Math.round((receivedLength / total) * 100)));
        }

        const concatenated = new Uint8Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
          concatenated.set(chunk, position);
          position += chunk.length;
        }
        return concatenated.buffer;
      } else {
        const buf = await response.arrayBuffer();
        if (buf && buf.byteLength > 100) {
          onProgress(90);
          return buf;
        }
        return null;
      }
    } catch (e: any) {
      console.warn('Fetch attempt failed for targetUrl:', targetUrl, e);
      return null;
    }
  };

  try {
    // Attempt 1: In-App Server Proxy with Job ID
    onStatusUpdate('NCERT सर्वर से कनेक्ट हो रहा है (Server Proxy)...');
    let buf = await tryFetch(`/api/pdf-proxy?url=${encodeURIComponent(url)}&jobId=${jobId}`, true);
    if (buf) {
      if (pollInterval) clearInterval(pollInterval);
      return buf;
    }

    // Attempt 2: Direct Fetch
    onStatusUpdate('Direct NCERT Server Attempting...');
    buf = await tryFetch(url);
    if (buf) {
      if (pollInterval) clearInterval(pollInterval);
      return buf;
    }

    // Attempt 3: Public CORS Gateways
    onStatusUpdate('Fallback Proxy Gateways Attempting...');
    buf = await tryFetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
    if (buf) {
      if (pollInterval) clearInterval(pollInterval);
      return buf;
    }

    buf = await tryFetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    if (buf) {
      if (pollInterval) clearInterval(pollInterval);
      return buf;
    }

    buf = await tryFetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`);
    if (buf) {
      if (pollInterval) clearInterval(pollInterval);
      return buf;
    }

    throw new Error('Server Connection Error: NCERT सर्वर से जुड़ने में असमर्थ। कृपया नेटवर्क कनेक्शन जांचें।');
  } finally {
    if (pollInterval) clearInterval(pollInterval);
    notifyPdfProxyEnd();
  }
}
