import React, { useState, useEffect, useRef } from 'react';
import { Chapter } from '../types';
import { InAppPdfViewer } from './InAppPdfViewer';
import { getCachedPdf, saveCachedPdf, isPdfCached } from '../utils/pdfStorageCache';
import { fetchPdfArrayBufferWithFallback } from '../services/pdfFetchService';
import { prefetchPdfFileSizes } from '../services/pdfMetadataService';
import { useLanguage } from '../utils/languageContext';
import {
  ArrowLeft,
  Search,
  X,
  FileText,
  BookOpen,
  DownloadCloud,
  CheckCircle,
  Loader2,
  HardDrive,
  Clock,
  FlaskConical,
  Zap,
  Dna,
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
  initialChapterId,
}) => {
  const { language, t } = useLanguage();
  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'biology' | 'physics'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to get effective PDF URL according to current language
  const getEffectivePdfUrl = (ch: Chapter): string => {
    if (language === 'en' && ch.pdfUrlEn) {
      return ch.pdfUrlEn;
    }
    return ch.pdfUrl || (ch.pdfUrlEn as string);
  };

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

  // Auto-open chapter if initialChapterId provided
  useEffect(() => {
    if (initialChapterId) {
      const ch = chapters.find((c) => c.id === initialChapterId);
      if (ch) {
        setSubjectFilter(ch.subject);
        handleOpenChapterPdf(ch);
      }
    }
  }, [initialChapterId, chapters]);

  // Check offline cache & pre-fetch file sizes on mount or language switch
  useEffect(() => {
    let isMounted = true;

    // Check which chapters are already cached in CacheStorage API
    const checkCacheStatus = async () => {
      const cachedSet = new Set<number>();
      for (const ch of chapters) {
        const url = getEffectivePdfUrl(ch);
        const cached = await isPdfCached(url);
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
  }, [chapters, language]);

  const filteredChapters = chapters.filter((ch) => {
    const matchesSubject = ch.subject === subjectFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      ch.titleHindi.includes(searchQuery) ||
      ch.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.includes(searchQuery) ||
      (ch.descriptionEnglish && ch.descriptionEnglish.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const handleOpenChapterPdf = (ch: Chapter) => {
    const pdfUrl = getEffectivePdfUrl(ch);
    const title =
      language === 'en'
        ? `Chapter ${ch.chapterNumber}: ${ch.titleEnglish} (NCERT English PDF)`
        : `अध्याय ${ch.chapterNumber}: ${ch.titleHindi} (NCERT हिंदी PDF)`;

    setActivePdf({
      title,
      url: pdfUrl,
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
      const targetUrl = getEffectivePdfUrl(ch);
      const title =
        language === 'en'
          ? `Chapter ${ch.chapterNumber}: ${ch.titleEnglish}`
          : `अध्याय ${ch.chapterNumber}: ${ch.titleHindi}`;

      setDownloadProgress({
        current: i + 1,
        total,
        currentChapterTitle: title,
        percent: Math.round(((i + 1) / total) * 100),
        failed: failedCount,
      });

      // Skip if already in cache
      const existing = await getCachedPdf(targetUrl);
      if (existing && existing.byteLength > 100) {
        setCachedChapterIds((prev) => new Set([...prev, ch.id]));
        completedCount++;
        continue;
      }

      try {
        const buffer = await fetchPdfArrayBufferWithFallback(targetUrl);
        if (buffer && buffer.byteLength > 100) {
          await saveCachedPdf(targetUrl, buffer);
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
    <div className="space-y-3.5 animate-fadeIn bg-grid-science p-1 rounded-3xl">
      {/* Header Bar with Download All Button */}
      <div
        className={`relative flex items-center justify-between p-3.5 rounded-3xl border gap-2 transition-all ${
          isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
        }`}
      >
        <button
          onClick={onBack}
          className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center shrink-0 active:scale-95 ${
            isDarkMode
              ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title={language === 'hi' ? 'वापस जाएँ' : 'Back'}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <h2
          className={`text-xs sm:text-base font-black flex items-center gap-2 text-center min-w-0 truncate ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          <BookOpen className="w-5 h-5 text-sky-500 shrink-0" />
          <span>{language === 'hi' ? 'NCERT किताबें (RBSE)' : 'NCERT Textbooks (RBSE)'}</span>
        </h2>

        {/* Download All Chapters Button */}
        <button
          onClick={handleDownloadAllChapters}
          disabled={isDownloadingAll}
          className={`p-2 px-3 rounded-2xl border text-xs font-black transition-all flex items-center gap-1.5 shrink-0 shadow-md active:scale-95 ${
            isDownloadingAll
              ? 'bg-amber-500/20 text-amber-500 border-amber-500/30'
              : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-indigo-500/30'
          }`}
          title={language === 'hi' ? 'सभी NCERT अध्याय ऑफ़लाइन डाउनलोड करें' : 'Download All Chapters Offline'}
        >
          {isDownloadingAll ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          ) : (
            <DownloadCloud className="w-4 h-4" />
          )}
          <span className="hidden xs:inline">
            {isDownloadingAll
              ? language === 'hi' ? 'डाउनलोडिंग...' : 'Downloading...'
              : language === 'hi' ? 'सभी डाउनलोड करें' : 'Download All'}
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
                  {language === 'hi' ? 'ऑफ़लाइन डाउनलोड जारी है...' : 'Offline Download in Progress...'} ({downloadProgress.current}/{downloadProgress.total})
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
              {language === 'hi' ? 'रद्द करें' : 'Cancel'}
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
          { id: 'chemistry', labelHi: 'रसायन विज्ञान', labelEn: 'Chemistry', icon: FlaskConical },
          { id: 'biology', labelHi: 'जीव विज्ञान', labelEn: 'Biology', icon: Dna },
          { id: 'physics', labelHi: 'भौतिक विज्ञान', labelEn: 'Physics', icon: Zap },
        ].map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSubjectFilter(tab.id as any)}
              className={`py-2 px-2 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                subjectFilter === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25'
                  : isDarkMode
                  ? 'card-3d-dark text-slate-300 hover:text-white'
                  : 'card-3d-light text-slate-700 hover:text-indigo-600'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span className="truncate">{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Page Inline Search Bar */}
      <div className="relative">
        <Search
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            language === 'hi'
              ? 'अध्याय खोजें: अम्ल, धातु, नियंत्रण, प्रकाश, विद्युत...'
              : 'Search chapters: Acids, Metals, Control, Light, Electricity...'
          }
          className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-bold transition-all focus:outline-none ${
            isDarkMode
              ? 'input-3d-dark text-slate-100 placeholder-slate-400 focus:border-indigo-400'
              : 'input-3d-light text-slate-900 placeholder-slate-500 focus:border-indigo-600 shadow-xs'
          }`}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full ${
              isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-600'
            }`}
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Chapter Cards List */}
      <div className="space-y-2.5">
        {filteredChapters.length === 0 ? (
          <div
            className={`text-center py-8 text-xs font-bold ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {language === 'hi' ? 'कोई अध्याय नहीं मिला' : 'No chapters found'}
          </div>
        ) : (
          filteredChapters.map((ch) => {
            const isCached = cachedChapterIds.has(ch.id);
            const targetUrl = getEffectivePdfUrl(ch);
            const sizeStr = fileSizes[targetUrl] || fileSizes[ch.pdfUrl] || null;

            return (
              <div
                key={ch.id}
                onClick={() => handleOpenChapterPdf(ch)}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between gap-3 ${
                  isDarkMode ? 'card-3d-dark hover:border-indigo-500/50' : 'card-3d-light hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Vector Icon Badge Container */}
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    {ch.subject === 'chemistry' ? (
                      <FlaskConical className="w-5 h-5 text-sky-500 stroke-[2.2]" />
                    ) : ch.subject === 'biology' ? (
                      <Dna className="w-5 h-5 text-emerald-500 stroke-[2.2]" />
                    ) : (
                      <Zap className="w-5 h-5 text-purple-500 stroke-[2.2]" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                        {language === 'hi'
                          ? `अध्याय ${ch.chapterNumber} • ${ch.weightage} अंक`
                          : `Chapter ${ch.chapterNumber} • ${ch.weightage} Marks`}
                      </span>

                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-black">
                        <Clock className="w-2.5 h-2.5" />
                        <span>~{ch.estimatedReadingMinutes || 15} {language === 'hi' ? 'मि' : 'min'}</span>
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
                              title={language === 'hi' ? 'ऑफ़लाइन डाउनलोड पूर्ण' : 'Offline Cached'}
                            />
                          )}
                        </span>
                      )}

                      {!sizeStr && isCached && (
                        <span
                          className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-black"
                          title={language === 'hi' ? 'ऑफ़लाइन डाउनलोड पूर्ण' : 'Offline Cached'}
                        >
                          <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                        </span>
                      )}
                    </div>

                    {/* Chapter Title */}
                    <h3
                      className={`text-xs sm:text-sm font-black leading-snug break-words ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {language === 'hi'
                        ? ch.titleHindi
                        : ch.titleEnglish}
                    </h3>
                    <p
                      className={`text-[11px] font-medium mt-0.5 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      {language === 'hi' ? ch.titleEnglish : ch.titleHindi}
                    </p>
                  </div>
                </div>

                {/* PDF Reader Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChapterNotes(ch.id);
                    }}
                    className={`p-2 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1 active:scale-95 ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                    title={language === 'hi' ? 'अध्याय नोट्स देखें' : 'View Notes'}
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  </button>

                  <span className="text-[11px] font-black px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-sm flex items-center gap-1 transition-transform active:scale-95">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'पढ़ें' : 'Read'}</span>
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
