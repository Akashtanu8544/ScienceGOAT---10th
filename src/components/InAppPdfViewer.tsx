import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { getCachedPdf, saveCachedPdf } from '../utils/pdfStorageCache';
import { fetchPdfArrayBufferWithFallback } from '../services/pdfFetchService';
import { StorageService } from '../services/db';
import { PdfLoadingOverlay } from './PdfLoadingOverlay';
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Download,
  BookOpen,
  CheckCircle,
  Clock,
} from 'lucide-react';

// Initialize PDF.js worker
const PDFJS_VERSION = pdfjsLib.version || '4.10.38';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

// Memory cache for downloaded PDF ArrayBuffers
const pdfCache = new Map<string, ArrayBuffer>();

// Dedicated individual page canvas component
interface PdfPageCanvasProps {
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  scale: number;
  rotation: number;
  isDarkMode?: boolean;
}

const PdfPageCanvas: React.FC<PdfPageCanvasProps> = ({
  pdfDoc,
  pageNumber,
  scale,
  rotation,
  isDarkMode = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const renderTaskRef = useRef<any>(null);

  useEffect(() => {
    let active = true;

    const render = async () => {
      try {
        const page = await pdfDoc.getPage(pageNumber);
        if (!active) return;

        // Intrinsic page dimensions
        const baseViewport = page.getViewport({ scale: 1.0, rotation });
        setDimensions({
          width: baseViewport.width,
          height: baseViewport.height,
        });

        const canvas = canvasRef.current;
        if (!canvas) return;

        // High resolution viewport for crisp rendering
        const renderScale = Math.max(window.devicePixelRatio || 1, 2.0);
        const viewport = page.getViewport({ scale: renderScale, rotation });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Cancel existing render task if any
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {}
        }

        const task = page.render({
          canvasContext: ctx,
          viewport: viewport,
        });
        renderTaskRef.current = task;

        await task.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn(`Error rendering page ${pageNumber}:`, err);
        }
      }
    };

    render();

    return () => {
      active = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [pdfDoc, pageNumber, rotation]);

  return (
    <div
      ref={containerRef}
      data-page-number={pageNumber}
      className={`relative shadow-2xl rounded-md overflow-hidden border transition-all duration-200 my-2 mx-auto shrink-0 bg-white ${
        isDarkMode ? 'border-slate-700' : 'border-slate-300'
      }`}
      style={{
        width: scale === 1.0 ? '100%' : `${Math.round(100 * scale)}%`,
        maxWidth: scale === 1.0 ? '100%' : 'none',
        aspectRatio: dimensions ? `${dimensions.width} / ${dimensions.height}` : '1 / 1.414',
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-white object-contain"
      />
      <div
        className={`absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold backdrop-blur-sm pointer-events-none z-10 ${
          isDarkMode
            ? 'bg-slate-900/80 text-slate-300'
            : 'bg-slate-800/80 text-white'
        }`}
      >
        Page {pageNumber}
      </div>
    </div>
  );
};

interface InAppPdfViewerProps {
  title: string;
  pdfUrl: string;
  onClose: () => void;
  isDarkMode?: boolean;
  chapterId?: number;
}

export const InAppPdfViewer: React.FC<InAppPdfViewerProps> = ({
  title,
  pdfUrl,
  onClose,
  isDarkMode = false,
  chapterId,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('NCERT सर्वर से कनेक्ट हो रहा है...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Zoom scale state
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);

  // Pinch-to-zoom tracking
  const [touchDistance, setTouchDistance] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isOfflineCached, setIsOfflineCached] = useState<boolean>(false);

  // Reading Session Timer State
  const [readingTimeSeconds, setReadingTimeSeconds] = useState<number>(0);
  const activeSecondsRef = useRef<number>(0);
  const lastSavedTimeRef = useRef<number>(0);

  // Active Reading Session Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      activeSecondsRef.current += 1;
      setReadingTimeSeconds((prev) => prev + 1);

      // Log reading progress every 10 seconds to storage
      if (activeSecondsRef.current - lastSavedTimeRef.current >= 10) {
        const elapsed = activeSecondsRef.current - lastSavedTimeRef.current;
        lastSavedTimeRef.current = activeSecondsRef.current;
        const key = chapterId || title;
        StorageService.logReadingTime(key, elapsed);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      const remaining = activeSecondsRef.current - lastSavedTimeRef.current;
      if (remaining > 0) {
        const key = chapterId || title;
        StorageService.logReadingTime(key, remaining);
      }
    };
  }, [chapterId, title]);

  // Intercept Android Back Button & browser back state
  useEffect(() => {
    window.history.pushState({ pdfOpen: true }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose]);

  // Load PDF document
  useEffect(() => {
    let isCancelled = false;

    const loadPdf = async () => {
      setLoading(true);
      setErrorMsg(null);
      setDownloadProgress(10);
      setStatusMessage('NCERT सर्वर से कनेक्ट हो रहा है...');

      try {
        let arrayBuffer: ArrayBuffer | null = null;

        if (pdfUrl.startsWith('data:') || pdfUrl.startsWith('blob:')) {
          setDownloadProgress(70);
          setStatusMessage('PDF दस्तावेज़ तैयार किया जा रहा है...');
          const res = await fetch(pdfUrl);
          arrayBuffer = await res.arrayBuffer();
          setDownloadProgress(100);
          setIsOfflineCached(true);
        } else {
          // Step 1: Check Memory & Persistent Cache
          arrayBuffer = await getCachedPdf(pdfUrl);

          if (arrayBuffer) {
            setDownloadProgress(100);
            setIsOfflineCached(true);
            setStatusMessage('ऑफ़लाइन कैश से प्राप्त किया गया');
          } else {
            // Step 2: Fetch remote PDF with fallback & proxy polling
            arrayBuffer = await fetchPdfArrayBufferWithFallback(pdfUrl, {
              onProgress: (p) => setDownloadProgress(p),
              onStatusUpdate: (msg) => setStatusMessage(msg),
            });

            if (arrayBuffer) {
              await saveCachedPdf(pdfUrl, arrayBuffer);
              setIsOfflineCached(true);
            }
            setDownloadProgress(100);
          }
        }

        if (isCancelled || !arrayBuffer) return;

        // Step 3: Load document into PDF.js
        const loadingTask = pdfjsLib.getDocument({
          data: arrayBuffer,
          cMapUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`,
          verbosity: 0,
        });
        const doc = await loadingTask.promise;

        if (isCancelled) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (err: any) {
        console.error('InAppPdfViewer error:', err);
        if (!isCancelled) {
          setErrorMsg(
            err.message || 'Server Connection Error: NCERT सर्वर से PDF प्राप्त करने में विफल।'
          );
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl]);

  // Handle scroll to track active page number
  const handleScroll = () => {
    if (!containerRef.current || numPages === 0) return;

    const container = containerRef.current;
    const pageElements = container.querySelectorAll('[data-page-number]');

    pageElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const parentRect = container.getBoundingClientRect();
      if (rect.top <= parentRect.top + 250 && rect.bottom >= parentRect.top + 50) {
        const pageNum = parseInt(el.getAttribute('data-page-number') || '1', 10);
        setCurrentPage(pageNum);
      }
    });
  };

  // Jump to specific page
  const scrollToPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum > numPages || !containerRef.current) return;
    setCurrentPage(pageNum);

    const targetEl = containerRef.current.querySelector(`[data-page-number="${pageNum}"]`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Zoom controls
  const zoomIn = () => setScale((s) => Math.min(2.5, +(s + 0.2).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(0.6, +(s - 0.2).toFixed(2)));
  const resetZoom = () => setScale(1.0);
  const toggleRotation = () => setRotation((r) => (r + 90) % 360);

  // Touch Pinch-to-Zoom handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDistance(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistance !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = dist - touchDistance;
      if (Math.abs(diff) > 20) {
        if (diff > 0) zoomIn();
        else zoomOut();
        setTouchDistance(dist);
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchDistance(null);
  };

  // Download PDF locally
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to format reading session timer
  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col overflow-hidden select-none animate-native-slide-in ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Global Loading Overlay */}
      {loading && (
        <PdfLoadingOverlay
          title={title}
          progress={downloadProgress}
          statusMessage={statusMessage}
          errorMsg={errorMsg}
          onRetry={() => {
            pdfCache.delete(pdfUrl);
            window.location.reload();
          }}
          onCancel={onClose}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Header Toolbar */}
      <header
        className={`shrink-0 p-2.5 z-10 shadow-md space-y-2 border-b ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        {/* Tier 1: Title, Back, Timer Badge, Offline Badge & Download */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-all shrink-0 active:scale-95 ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
              }`}
              title="वापस जाएँ (Back)"
            >
              <ArrowLeft className="w-5 h-5 text-amber-500" />
            </button>

            <div className="min-w-0 flex-1">
              <h1
                className={`text-xs sm:text-sm font-black truncate ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {title}
              </h1>
              <div className="text-[10px] font-bold flex items-center gap-1.5 flex-wrap">
                <span
                  className={`flex items-center gap-1 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  <BookOpen className="w-3 h-3 text-amber-500" />
                  <span>BytePrep Reader</span>
                </span>

                {/* Reading Session Live Timer Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md border text-[9px] font-black ${
                    isDarkMode
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-amber-50 text-amber-700 border-amber-300'
                  }`}
                  title="अध्ययन सत्र समय (Reading Session Time)"
                >
                  <Clock className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
                  <span>{formatTimer(readingTimeSeconds)}</span>
                </span>

                {isOfflineCached && (
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20 px-1.5 py-0.2 rounded-md flex items-center gap-1 text-[9px] font-extrabold">
                    <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />
                    <span>ऑफ़लाइन सुरक्षित</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="p-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-extrabold text-xs shadow-sm flex items-center gap-1 shrink-0"
            title="PDF डाउनलोड करें"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">डाउनलोड</span>
          </button>
        </div>

        {/* Tier 2: Page Jump Controls & Zoom Controls */}
        <div
          className={`flex items-center justify-between gap-1 p-1.5 rounded-xl border text-xs ${
            isDarkMode
              ? 'bg-slate-950/80 border-slate-800'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          {/* Page Counter */}
          {numPages > 0 ? (
            <div
              className={`flex items-center gap-1 border px-2 py-1 rounded-lg font-black ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-800 shadow-sm'
              }`}
            >
              <button
                onClick={() => scrollToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="p-0.5 disabled:opacity-30 hover:opacity-100"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] px-1">
                {currentPage} / {numPages}
              </span>
              <button
                onClick={() => scrollToPage(currentPage + 1)}
                disabled={currentPage >= numPages}
                className="p-0.5 disabled:opacity-30 hover:opacity-100"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 font-bold px-1">लोड हो रहा है...</div>
          )}

          {/* Zoom & Rotation Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.6}
              className={`p-1.5 rounded-lg border active:scale-95 disabled:opacity-40 ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-sm'
              }`}
              title="ज़ूम कम करें (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={resetZoom}
              className={`px-2 py-1 rounded-lg border text-[10px] font-black ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-amber-600 border-slate-200 shadow-sm'
              }`}
              title="रीसेट ज़ूम (100%)"
            >
              {Math.round(scale * 100)}%
            </button>

            <button
              onClick={zoomIn}
              disabled={scale >= 2.5}
              className={`p-1.5 rounded-lg border active:scale-95 disabled:opacity-40 ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-sm'
              }`}
              title="ज़ूम बढ़ाएं (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleRotation}
              className={`p-1.5 rounded-lg border active:scale-95 ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-sm'
              }`}
              title="घूमाएं (Rotate)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Scrollable PDF Pages Container */}
      <main
        ref={containerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 w-full overflow-y-auto p-2 sm:p-4 flex flex-col items-center custom-scrollbar relative ${
          isDarkMode ? 'bg-slate-900/90' : 'bg-slate-200/90'
        }`}
      >
        {/* Render Canvas Pages with aspect-ratio containers */}
        {!loading &&
          !errorMsg &&
          pdfDoc &&
          Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
            <PdfPageCanvas
              key={pageNum}
              pdfDoc={pdfDoc}
              pageNumber={pageNum}
              scale={scale}
              rotation={rotation}
              isDarkMode={isDarkMode}
            />
          ))}
      </main>

      {/* Floating Bottom Quick Zoom Bar */}
      {!loading && !errorMsg && (
        <div
          className={`shrink-0 h-9 border-t px-4 flex items-center justify-between text-[11px] font-bold ${
            isDarkMode
              ? 'bg-slate-900/95 border-slate-800 text-slate-400'
              : 'bg-white/95 border-slate-200 text-slate-600 shadow-sm'
          }`}
        >
          <span>पिंच ज़ूम (Pinch to Zoom)</span>
          <div
            className={`flex items-center gap-3 font-black ${
              isDarkMode ? 'text-amber-400' : 'text-amber-600'
            }`}
          >
            <button
              onClick={() => setScale(1.0)}
              className={scale === 1.0 ? 'underline font-black' : ''}
            >
              100%
            </button>
            <button
              onClick={() => setScale(1.4)}
              className={scale === 1.4 ? 'underline font-black' : ''}
            >
              140%
            </button>
            <button
              onClick={() => setScale(1.8)}
              className={scale === 1.8 ? 'underline font-black' : ''}
            >
              180%
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
