import React, { useState, useEffect, useRef } from 'react';
import { Chapter } from '../types';
import { InAppPdfViewer } from './InAppPdfViewer';
import { getCachedPdf, saveCachedPdf, isPdfCached } from '../utils/pdfStorageCache';
import { fetchPdfArrayBufferWithFallback } from '../services/pdfFetchService';
import { prefetchPdfFileSizes } from '../services/pdfMetadataService';
import {
  ArrowLeft,
  Search,
  X,
  FileText,
  BookOpen,
  DownloadCloud,
  CheckCircle,
  Loader2,
  HardDrive
} from 'lucide-react';

interface BookViewerProps {
  chapters: Chapter[];
  onBack: () => void;
  onSelectChapterNotes: (chapterId: number) => void;
  customBooksUrl?: string;
  isDarkMode: boolean;
  initialChapterId?: number;
}

export const BookViewer: React.FC<BookViewerProps> = ({
  chapters,
  onBack,
  onSelectChapterNotes,
  isDarkMode,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'biology' | 'physics'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');

  // Active PDF State for Full-Screen Reader
  const [activePdf, setActivePdf] = useState<{ title: string; url: string; chapterId?: number } | null>(null);

  // PDF File Size map (url -> formatted string e.g. "2.8 MB")
  const [fileSizes, setFileSizes] = useState<Record<string, string>>({});

  // Offline Cached status map
  const [cachedChapterIds, setCachedChapterIds] = useState<Set<number>>(new Set());

  // Download All Chapters State
  const [isDownloadingAll, setIsDownloadingAll] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<{
    current: number;
    total: number;
    currentChapterTitle: string;
    percent: number;
    failed: number;
  }>({
    current: 0,
    total: 0,
    currentChapterTitle: '',
    percent: 0,
    failed: 0,
  });

  const cancelDownloadRef = useRef<boolean>(false);

  // Check offline cache & pre-fetch file sizes on mount
  useEffect(() => {
    let isMounted = true;

    // Check which chapters are already cached in CacheStorage API
    const checkCacheStatus = async () => {
      const cachedSet = new Set<number>();
      for (const ch of chapters) {
        const cached = await isPdfCached(ch.pdfUrl);
        if (cached) {
          cachedSet.add(ch.id);
        }
      }
      if (isMounted) setCachedChapterIds(cachedSet);
    };

    checkCacheStatus();

    // Pre-fetch file sizes
    prefetchPdfFileSizes(chapters, (url, size) => {
      if (isMounted) {
        setFileSizes((prev) => ({ ...prev, [url]: size }));
      }
    }).then((sizes) => {
      if (isMounted) setFileSizes(sizes);
    });

    return () => {
      isMounted = false;
    };
  }, [chapters]);

  const filteredChapters = chapters.filter((ch) => {
    const matchesSubject = ch.subject === subjectFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      ch.titleHindi.includes(searchQuery) ||
      ch.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.includes(searchQuery);
    return matchesSubject && matchesSearch;
  });

  const handleOpenChapterPdf = (ch: Chapter) => {
    setActivePdf({
      title: `अध्याय ${ch.chapterNumber}: ${ch.titleHindi}`,
      url: ch.pdfUrl,
      chapterId: ch.id,
    });
  };

  // Sequential Download All Chapters for Offline Use
  const handleDownloadAllChapters = async () => {
    if (isDownloadingAll) return;

    cancelDownloadRef.current = false;
    setIsDownloadingAll(true);

    const total = chapters.length;
    let completedCount = 0;
    let failedCount = 0;

    for (let i = 0; i < chapters.length; i++) {
      if (cancelDownloadRef.current) break;

      const ch = chapters[i];
      setDownloadProgress({
        current: i + 1,
        total,
        currentChapterTitle: `अध्याय ${ch.chapterNumber}: ${ch.titleHindi}`,
        percent: Math.round(((i + 1) / total) * 100),
        failed: failedCount,
      });

      // Skip if already in cache
      const existing = await getCachedPdf(ch.pdfUrl);
      if (existing && existing.byteLength > 100) {
        setCachedChapterIds((prev) => new Set([...prev, ch.id]));
        completedCount++;
        continue;
      }

      try {
        const buffer = await fetchPdfArrayBufferWithFallback(ch.pdfUrl);
        if (buffer && buffer.byteLength > 100) {
          await saveCachedPdf(ch.pdfUrl, buffer);
          setCachedChapterIds((prev) => new Set([...prev, ch.id]));
          completedCount++;
        } else {
          failedCount++;
        }
      } catch (err) {
        console.warn(`Failed to cache chapter ${ch.chapterNumber}:`, err);
        failedCount++;
      }
    }

    setIsDownloadingAll(false);
  };

  const handleCancelDownloadAll = () => {
    cancelDownloadRef.current = true;
    setIsDownloadingAll(false);
  };

  // Active Reader Full Screen
  if (activePdf) {
    return (
      <InAppPdfViewer
        title={activePdf.title}
        pdfUrl={activePdf.url}
        chapterId={activePdf.chapterId}
        onClose={() => setActivePdf(null)}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className="space-y-3.5 animate-fadeIn">
      {/* Header Bar with Download All Button */}
      <div
        className={`relative flex items-center justify-between p-3.5 rounded-3xl border shadow-sm backdrop-blur-md gap-2 ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}
      >
        <button
          onClick={onBack}
          className={`p-2 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title="वापस जाएँ"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2
          className={`text-sm sm:text-base font-black flex items-center gap-2 text-center min-w-0 truncate ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          <span className="text-xl">📖</span> NCERT Books
        </h2>

        {/* Download All Chapters Button */}
        <button
          onClick={handleDownloadAllChapters}
          disabled={isDownloadingAll}
          className={`p-2 px-3 rounded-2xl border text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 shadow-sm active:scale-95 ${
            isDownloadingAll
              ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-blue-500/30'
          }`}
          title="सभी NCERT अध्याय ऑफ़लाइन डाउनलोड करें"
        >
          {isDownloadingAll ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          ) : (
            <DownloadCloud className="w-4 h-4" />
          )}
          <span className="hidden xs:inline">
            {isDownloadingAll ? 'डाउनलोड हो रहा है...' : 'सभी डाउनलोड करें'}
          </span>
        </button>
      </div>

      {/* Download All Progress Modal / Banner */}
      {isDownloadingAll && (
        <div
          className={`p-4 rounded-3xl border shadow-xl space-y-3 animate-fadeIn ${
            isDarkMode
              ? 'bg-slate-900 border-amber-500/40 text-slate-100'
              : 'bg-white border-amber-400 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0" />
              <div className="min-w-0">
                <h4
                  className={`text-xs font-black truncate ${
                    isDarkMode ? 'text-amber-300' : 'text-amber-700'
                  }`}
                >
                  ऑफ़लाइन डाउनलोड जारी है... ({downloadProgress.current}/{downloadProgress.total})
                </h4>
                <p
                  className={`text-[11px] truncate ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {downloadProgress.currentChapterTitle}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancelDownloadAll}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border shrink-0 ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              रद्द करें
            </button>
          </div>

          <div
            className={`w-full rounded-full h-2 overflow-hidden border ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${downloadProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {/* Subject Filter Category Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: 'chemistry', label: 'रसायन विज्ञान', icon: '🧪' },
          { id: 'biology', label: 'जीव विज्ञान', icon: '🫀' },
          { id: 'physics', label: 'भौतिक विज्ञान', icon: '⚡' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubjectFilter(tab.id as any)}
            className={`py-2 px-2 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
              subjectFilter === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : isDarkMode
                ? 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Page Inline Search Bar */}
      <div className="relative">
        <Search
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="किताब में खोजें: अध्याय नाम, विषय..."
          className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-black transition-all backdrop-blur-2xl shadow-sm focus:outline-none ${
            isDarkMode
              ? 'bg-slate-900/80 text-slate-100 placeholder-slate-400 border border-slate-700/80 focus:border-blue-400'
              : 'bg-white/90 text-slate-900 placeholder-slate-400 border border-blue-200 focus:border-blue-600'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'
            }`}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Numbered Chapters List */}
      <div className="grid grid-cols-1 landscape:grid-cols-2 gap-2.5 space-y-0">
        {filteredChapters.length === 0 ? (
          <div
            className={`text-center py-8 text-xs font-bold ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            कोई अध्याय नहीं मिला
          </div>
        ) : (
          filteredChapters.map((ch) => {
            const isCached = cachedChapterIds.has(ch.id);
            const sizeStr = fileSizes[ch.pdfUrl] || null;

            return (
              <div
                key={ch.id}
                onClick={() => handleOpenChapterPdf(ch)}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between gap-3 shadow-sm backdrop-blur-md ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/50'
                    : 'bg-white/90 border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* 3D Icon Badge Circle */}
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-xl flex items-center justify-center shrink-0 shadow-inner">
                    {ch.icon3D || '📖'}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                        अध्याय {ch.chapterNumber} • {ch.weightage} अंक
                      </span>

                      {/* File Size Metadata Badge + Downloaded Checkmark Icon */}
                      {sizeStr && (
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md border text-[9px] font-bold ${
                            isDarkMode
                              ? 'bg-slate-800/80 text-slate-300 border-slate-700'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          <HardDrive className="w-2.5 h-2.5 text-amber-500" />
                          <span>{sizeStr}</span>
                          {isCached && (
                            <CheckCircle
                              className="w-3 h-3 text-emerald-500 shrink-0"
                              title="ऑफ़लाइन डाउनलोड पूर्ण"
                            />
                          )}
                        </span>
                      )}

                      {!sizeStr && isCached && (
                        <span
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-black"
                          title="ऑफ़लाइन डाउनलोड पूर्ण"
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                        </span>
                      )}
                    </div>

                    {/* Chapter Title */}
                    <h3
                      className={`text-xs sm:text-sm font-black truncate ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {ch.titleHindi}
                    </h3>
                  </div>
                </div>

                {/* PDF Reader Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChapterNotes(ch.id);
                    }}
                    className={`p-2 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1 ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                    title="अध्याय नोट्स देखें"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                  </button>

                  <span className="text-[11px] font-black px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1 transition-transform active:scale-95">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>पढ़ें</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
