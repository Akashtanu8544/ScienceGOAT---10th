import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
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
  Maximize2,
  Minimize2,
  Clock,
} from 'lucide-react';

// Configure pdfjs worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version || '4.10.38'}/build/pdf.worker.min.mjs`;

export interface PDFViewerComponentProps {
  title: string;
  pdfUrl: string;
  onClose: () => void;
  isDarkMode?: boolean;
  chapterId?: number;
}

export const PDFViewerComponent: React.FC<PDFViewerComponentProps> = ({
  title,
  pdfUrl,
  onClose,
  isDarkMode = false,
  chapterId,
}) => {
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('NCERT सर्वर से कनेक्ट हो रहा है...');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isOfflineCached, setIsOfflineCached] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Pinch to zoom state
  const [touchDistance, setTouchDistance] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reading Session Timer State
  const [readingTimeSeconds, setReadingTimeSeconds] = useState<number>(0);
  const activeSecondsRef = useRef<number>(0);
  const lastSavedTimeRef = useRef<number>(0);

  // Active Reading Session Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      activeSecondsRef.current += 1;
      setReadingTimeSeconds((prev) => prev + 1);

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

  // Handle back button / history navigation
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

  // Load PDF Data (Memory -> CacheStorage -> Server Proxy)
  useEffect(() => {
    let active = true;

    const loadBuffer = async () => {
      setLoading(true);
      setErrorMsg(null);
      setDownloadProgress(10);
      setStatusMessage('NCERT सर्वर से कनेक्ट हो रहा है...');

      try {
        // Step 1: Check cache
        let buf = await getCachedPdf(pdfUrl);

        if (buf) {
          setDownloadProgress(100);
          setIsOfflineCached(true);
          setStatusMessage('ऑफ़लाइन कैश से प्राप्त किया गया');
        } else {
          // Step 2: Fetch via proxy with progress and status updates
          buf = await fetchPdfArrayBufferWithFallback(pdfUrl, {
            onProgress: (p) => setDownloadProgress(p),
            onStatusUpdate: (msg) => setStatusMessage(msg),
          });
          if (buf) {
            await saveCachedPdf(pdfUrl, buf);
            setIsOfflineCached(true);
          }
          setDownloadProgress(100);
        }

        if (!active || !buf) return;

        setPdfData(buf);
        setLoading(false);
      } catch (err: any) {
        console.error('PDFViewerComponent error:', err);
        if (active) {
          setErrorMsg(err.message || 'Server Connection Error: NCERT सर्वर से PDF प्राप्त करने में विफल।');
          setLoading(false);
        }
      }
    };

    loadBuffer();

    return () => {
      active = false;
    };
  }, [pdfUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('react-pdf document load error:', error);
    setErrorMsg('PDF दस्तावेज़ पार्स करने में समस्या हुई।');
    setLoading(false);
  };

  // Zoom controls
  const zoomIn = () => setScale((s) => Math.min(2.5, +(s + 0.2).toFixed(2)));
  const zoomOut = () => setScale((s) => Math.max(0.6, +(s - 0.2).toFixed(2)));
  const resetZoom = () => setScale(1.0);
  const toggleRotation = () => setRotation((r) => (r + 90) % 360);

  // Page navigation
  const prevPage = () => setPageNumber((p) => Math.max(1, p - 1));
  const nextPage = () => setPageNumber((p) => Math.min(numPages, p + 1));

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

  // Download PDF
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Format reading timer
  const formatTimer = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
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
          onRetry={() => window.location.reload()}
          onCancel={onClose}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Header Toolbar */}
      <header
        className={`shrink-0 border-b p-2.5 z-10 shadow-md space-y-2 ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
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

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-xl border ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="फुल स्क्रीन"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-extrabold text-xs shadow-sm flex items-center gap-1"
              title="PDF डाउनलोड करें"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">डाउनलोड</span>
            </button>
          </div>
        </div>

        {/* Navigation & Zoom Bar */}
        <div
          className={`flex items-center justify-between gap-1 p-1.5 rounded-xl border text-xs ${
            isDarkMode
              ? 'bg-slate-950/80 border-slate-800'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          {numPages > 0 ? (
            <div
              className={`flex items-center gap-1 border px-2 py-1 rounded-lg font-black ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200'
                  : 'bg-white border-slate-200 text-slate-800 shadow-sm'
              }`}
            >
              <button
                onClick={prevPage}
                disabled={pageNumber <= 1}
                className="p-0.5 disabled:opacity-30 hover:opacity-100"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] px-1">
                {pageNumber} / {numPages}
              </span>
              <button
                onClick={nextPage}
                disabled={pageNumber >= numPages}
                className="p-0.5 disabled:opacity-30 hover:opacity-100"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 font-bold px-1">लोड हो रहा है...</div>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={zoomOut}
              disabled={scale <= 0.6}
              className={`p-1.5 rounded-lg border active:scale-95 disabled:opacity-40 ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-sm'
              }`}
              title="ज़ूम कम करें"
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
              title="ज़ूम बढ़ाएं"
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
              title="घूमाएं"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Document Render Area */}
      <main
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 w-full overflow-y-auto p-2 sm:p-4 flex flex-col items-center justify-start custom-scrollbar relative ${
          isDarkMode ? 'bg-slate-900/90' : 'bg-slate-200/90'
        }`}
      >
        {pdfData && (
          <Document
            file={pdfData}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={null}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <div
              className={`relative shadow-2xl rounded-md overflow-hidden border bg-white my-2 ${
                isDarkMode ? 'border-slate-700' : 'border-slate-300'
              }`}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="bg-white"
              />
            </div>
          </Document>
        )}
      </main>

      {/* Bottom Quick Scale Bar */}
      {numPages > 0 && (
        <div
          className={`shrink-0 h-9 border-t px-4 flex items-center justify-between text-[11px] font-bold ${
            isDarkMode
              ? 'bg-slate-900/95 border-slate-800 text-slate-400'
              : 'bg-white/95 border-slate-200 text-slate-600 shadow-sm'
          }`}
        >
          <span>पृष्ठ {pageNumber} / {numPages}</span>
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
