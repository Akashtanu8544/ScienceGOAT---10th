import React, { useState } from 'react';
import { Chapter } from '../types';
import { Download, ArrowLeft, ChevronRight, Check, Search, X } from 'lucide-react';

interface BookViewerProps {
  chapters: Chapter[];
  onBack: () => void;
  onSelectChapterNotes: (chapterId: number) => void;
  customBooksUrl?: string;
  isDarkMode: boolean;
}

export const BookViewer: React.FC<BookViewerProps> = ({
  chapters,
  onBack,
  onSelectChapterNotes,
  isDarkMode,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [downloadedChapters, setDownloadedChapters] = useState<Record<number, boolean>>({});
  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'biology' | 'physics'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');

  const handleDownload = (e: React.MouseEvent, chId: number) => {
    e.stopPropagation();
    setDownloadedChapters((prev) => ({ ...prev, [chId]: true }));
  };

  const filteredChapters = chapters.filter((ch) => {
    const matchesSubject = ch.subject === subjectFilter;
    const matchesSearch = searchQuery.trim() === '' ||
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
              const isDownloaded = downloadedChapters[ch.id];
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

                  {/* Right Download / Open Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleDownload(e, ch.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isDownloaded
                          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                          : 'text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800'
                      }`}
                      title={isDownloaded ? 'डाउनलोड पूरा हुआ' : 'अध्याय डाउनलोड करें'}
                    >
                      {isDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  /* LEVEL 2: CHAPTER BOOK READER PAGE */
  return (
    <div className="space-y-3.5 animate-fadeIn">
      {/* Header Bar */}
      <div className={`p-3.5 rounded-3xl border shadow-sm flex items-center justify-between gap-2 backdrop-blur-md ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setSelectedChapter(null)}
            className={`p-2 rounded-2xl border text-xs font-bold transition-all flex items-center ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className={`text-xs sm:text-sm font-black truncate ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              अध्याय {selectedChapter.chapterNumber} : {selectedChapter.titleHindi}
            </h2>
            <p className="text-[10px] text-blue-600 font-bold">NCERT / RBSE पाठ्यपुस्तक</p>
          </div>
        </div>

        <button
          onClick={() => onSelectChapterNotes(selectedChapter.id)}
          className="px-3.5 py-2 rounded-2xl bg-blue-600 text-white font-black text-xs shadow-md hover:bg-blue-700 shrink-0 transition-transform active:scale-95"
        >
          नोट्स देखें
        </button>
      </div>

      {/* Book Reader Card */}
      <div className={`p-5 rounded-3xl border shadow-md space-y-4 backdrop-blur-md ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-800'
      }`}>
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-start gap-3">
          <div className="text-3xl shrink-0 p-2 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
            {selectedChapter.icon3D}
          </div>
          <div>
            <span className="text-[11px] font-black text-blue-600 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
              इकाई: {selectedChapter.unit} • कुल भार: {selectedChapter.weightage} अंक
            </span>
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1.5">
              {selectedChapter.titleHindi}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {selectedChapter.description}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm font-medium leading-relaxed">
          <p>
            राजस्थान माध्यमिक शिक्षा बोर्ड (RBSE) अजमेर द्वारा कक्षा 10 विज्ञान हेतु स्वीकृत नवीन NCERT पाठ्यक्रम के अनुसार इस अध्याय का अध्ययन नीचे दिया गया है।
          </p>
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 font-semibold space-y-1">
            <div className="font-extrabold text-blue-700 dark:text-blue-300 text-xs">📖 ई-बुक विशेष हस्तलिखित नोट्स</div>
            <p className="text-slate-700 dark:text-slate-300">
              इस अध्याय के प्रत्येक टॉपिक के हस्तलिखित नोट्स तथा प्रश्नोत्तर देखने के लिए "नोट्स देखें" बटन दबाएं।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
