import React, { useState } from 'react';
import { Chapter } from '../types';
import { ArrowLeft, ChevronRight, Search, X, ExternalLink, RefreshCw, FileText } from 'lucide-react';

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
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(() => {
    if (initialChapterId) {
      return chapters.find((c) => c.id === initialChapterId) || null;
    }
    return null;
  });

  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'biology' | 'physics'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');
  const [useGoogleDocs, setUseGoogleDocs] = useState<boolean>(true);

  const filteredChapters = chapters.filter((ch) => {
    const matchesSubject = ch.subject === subjectFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      ch.titleHindi.includes(searchQuery) ||
      ch.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.includes(searchQuery);
    return matchesSubject && matchesSearch;
  });

  /* LEVEL 1: CHAPTER LIST WITH 3D ICONS */
  if (!selectedChapter) {
    return (
      <div className="space-y-3.5 animate-fadeIn">
        {/* Centered Header Bar */}
        <div className={`relative flex items-center justify-center p-3.5 rounded-3xl border shadow-sm backdrop-blur-md ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}>
          <button
            onClick={onBack}
            className={`absolute left-3.5 p-2 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="वापस जाएँ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className={`text-sm sm:text-base font-black flex items-center gap-2 text-center ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <span className="text-xl">📖</span> NCERT Books
          </h2>
        </div>

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
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
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
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Numbered Chapters List */}
        <div className="space-y-2.5">
          {filteredChapters.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">कोई अध्याय नहीं मिला</div>
          ) : (
            filteredChapters.map((ch) => {
              return (
                <div
                  key={ch.id}
                  onClick={() => setSelectedChapter(ch)}
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

                    <div className="min-w-0">
                      <div className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                        अध्याय {ch.chapterNumber} • {ch.weightage} अंक
                      </div>
                      <h3 className={`text-xs sm:text-sm font-black truncate ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {ch.titleHindi}
                      </h3>
                    </div>
                  </div>

                  {/* Right Arrow / Action Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-xl bg-blue-600 text-white shadow-sm flex items-center gap-1">
                      <span>पढ़ें</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  /* LEVEL 2: FULL PAGE SCROLLABLE NCERT PDF VIEWER */
  const pdfEmbedUrl = useGoogleDocs
    ? `https://docs.google.com/gview?url=${encodeURIComponent(selectedChapter.pdfUrl)}&embedded=true`
    : selectedChapter.pdfUrl;

  return (
    <div className="flex flex-col h-[calc(100vh-135px)] space-y-2 animate-fadeIn -mx-1">
      {/* Chapter Reader Control Header */}
      <div className={`p-2.5 rounded-2xl border shadow-sm flex items-center justify-between gap-2 shrink-0 backdrop-blur-md ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'
      }`}>
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={() => setSelectedChapter(null)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center shrink-0 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="अध्याय सूची पर वापस जाएँ"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className={`text-xs font-black truncate ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              अध्याय {selectedChapter.chapterNumber}: {selectedChapter.titleHindi}
            </h2>
            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">NCERT Class 10th PDF Reader</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onSelectChapterNotes(selectedChapter.id)}
            className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] shadow-sm flex items-center gap-1 transition-transform active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>नोट्स</span>
          </button>

          <button
            onClick={() => setUseGoogleDocs((prev) => !prev)}
            className={`p-1.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title="पीडीएफ व्युअर बदलें (Switch PDF Server)"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">{useGoogleDocs ? 'गूगल' : 'डायरेक्ट'}</span>
          </button>

          <a
            href={selectedChapter.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}
            title="पीडीएफ नए टैब में खोलें"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Full Page PDF Iframe Viewer between Sticky Header and Footer */}
      <div className="flex-1 w-full rounded-2xl overflow-hidden border shadow-inner relative bg-slate-200 dark:bg-slate-900 flex flex-col min-h-0">
        <iframe
          src={pdfEmbedUrl}
          title={`NCERT Chapter ${selectedChapter.chapterNumber} PDF`}
          className="w-full h-full border-none flex-1"
          allow="fullscreen"
        />
      </div>
    </div>
  );
};
