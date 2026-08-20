import React, { useState } from 'react';
import { Chapter, ChapterNotes } from '../types';
import { generateNotesPDF } from '../services/pdfGenerator';
import { StorageService } from '../services/db';
import { Download, CheckCircle, ArrowLeft, Zap, BookOpen, Check, RefreshCw, ChevronRight, Search, X } from 'lucide-react';

interface NotesViewerProps {
  chapters: Chapter[];
  notesData: Record<number, ChapterNotes>;
  initialChapterId?: number;
  onBack: () => void;
  onProgressUpdate: () => void;
  isDarkMode: boolean;
}

export const NotesViewer: React.FC<NotesViewerProps> = ({
  chapters,
  notesData,
  initialChapterId,
  onBack,
  onProgressUpdate,
  isDarkMode,
}) => {
  // Navigation level state: 'CHAPTER_LIST' -> 'TOPICS_LIST' -> 'READER'
  const [viewLevel, setViewLevel] = useState<'CHAPTER_LIST' | 'TOPICS_LIST' | 'READER'>(
    initialChapterId ? 'TOPICS_LIST' : 'CHAPTER_LIST'
  );

  const [selectedChapterId, setSelectedChapterId] = useState<number>(initialChapterId || 1);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number>(0);
  const [fontSize, setFontSize] = useState<number>(14); // default text size in px
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'biology' | 'physics'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];
  const notes = notesData[selectedChapterId];

  const filteredChapters = chapters.filter((ch) => {
    const matchesSubject = ch.subject === subjectFilter;
    const matchesSearch = searchQuery.trim() === '' ||
      ch.titleHindi.includes(searchQuery) ||
      ch.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.includes(searchQuery);
    return matchesSubject && matchesSearch;
  });

  // Helper topic list generated from notes
  const topics = notes?.keyPoints ? notes.keyPoints.map((point, idx) => {
    const titleParts = point.split(':');
    const title = titleParts.length > 1 ? titleParts[0] : `विषय ${idx + 1}`;
    const desc = titleParts.length > 1 ? titleParts.slice(1).join(':') : point;
    return { id: idx, title, desc, point };
  }) : [
    { id: 0, title: 'परिचय एवं मूलभूत सिद्धान्त', desc: 'रासायनिक अभिक्रियाएँ और समीकरण की परिभाषा', point: 'परिचय एवं मूलभूत सिद्धान्त' }
  ];

  const handleDownloadPDF = () => {
    generateNotesPDF(selectedChapter, notes);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleMarkTopicDone = (idx: number) => {
    StorageService.markChapterComplete(selectedChapter.id);
    onProgressUpdate();
  };

  /* LEVEL 1: CHAPTER SELECTION PAGE */
  if (viewLevel === 'CHAPTER_LIST') {
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
            <span className="text-xl">📝</span> Study Notes
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
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
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
            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नोट्स में खोजें: अध्याय नाम, विषय..."
            className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-black transition-all backdrop-blur-2xl shadow-sm focus:outline-none ${
              isDarkMode
                ? 'bg-slate-900/80 text-slate-100 placeholder-slate-400 border border-slate-700/80 focus:border-indigo-400'
                : 'bg-white/90 text-slate-900 placeholder-slate-400 border border-indigo-200 focus:border-indigo-600'
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

        {/* List of Filtered Chapters */}
        <div className="space-y-2.5">
          {filteredChapters.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">कोई अध्याय नहीं मिला</div>
          ) : (
            filteredChapters.map((ch) => {
              const isCompleted = StorageService.getProgress().completedChapters.includes(ch.id);
              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    setSelectedChapterId(ch.id);
                    setViewLevel('TOPICS_LIST');
                  }}
                  className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between group shadow-sm backdrop-blur-md ${
                    isDarkMode
                      ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50'
                      : 'bg-white/90 border-slate-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-xl flex items-center justify-center shrink-0 shadow-inner">
                      {ch.icon3D || '📝'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                          अध्याय {ch.chapterNumber} • {ch.weightage} अंक
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            ✓ पूर्ण
                          </span>
                        )}
                      </div>
                      <h3 className={`text-xs sm:text-sm font-black truncate mt-0.5 ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {ch.titleHindi}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-black text-indigo-600 dark:text-indigo-400 shrink-0">
                    <span>विषय</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  /* LEVEL 2: CHAPTER TOPICS LIST PAGE (Matching Image 4 Layout) */
  if (viewLevel === 'TOPICS_LIST') {
    const completedCount = topics.filter((_, idx) => idx < 2).length; // demo progress count
    const totalTopics = topics.length;
    const progressPercent = Math.round((completedCount / totalTopics) * 100);

    return (
      <div className="space-y-4">
        {/* Top Header Card */}
        <div className={`p-4 rounded-3xl border shadow-sm space-y-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewLevel('CHAPTER_LIST')}
              className={`p-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1 ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> अध्याय सूची
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? '✓ डाउनलोड हुआ' : 'PDF नोट्स'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-2xl font-bold shrink-0">
              🧪
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`text-sm sm:text-base font-black truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {selectedChapter.titleHindi}
              </h2>
              <p className={`text-[11px] font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {topics.length} विषय (Topics)
              </p>
            </div>
          </div>

          {/* Study Progress Bar (Image 4 Design) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>अध्ययन प्रगति (Study Progress)</span>
              <span className="text-rose-500">{completedCount}/{totalTopics} पूर्ण ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Topics List Items (Matching Image 4 Cards) */}
        <div className="space-y-2.5">
          {topics.map((t, idx) => {
            const isDone = idx < 2; // demo done status
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 shadow-sm transition-all ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Status Badge Icon */}
                  {isDone ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-rose-500/10 text-rose-500 font-extrabold flex items-center justify-center text-xs shrink-0">
                      {idx + 1}
                    </div>
                  )}

                  <div className="min-w-0">
                    {/* Status Pill */}
                    {isDone ? (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                        पढ़ा गया (Done)
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-[10px]">
                        शेष है (Pending)
                      </span>
                    )}
                    <h4 className={`text-xs font-black truncate mt-0.5 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {t.title}
                    </h4>
                  </div>
                </div>

                {/* Read / Review Action Button */}
                <button
                  onClick={() => {
                    setSelectedTopicIndex(idx);
                    setViewLevel('READER');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 shrink-0 transition-all ${
                    isDone
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-200 hover:opacity-90'
                      : 'bg-rose-500 hover:bg-rose-600 text-white'
                  }`}
                >
                  {isDone ? <RefreshCw className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                  <span>{isDone ? 'दोहराएं' : 'पढ़ें'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* LEVEL 3: DETAIL NOTES READER PAGE (Matching Image 5 Layout) */
  const activeTopic = topics[selectedTopicIndex] || topics[0];

  return (
    <div className="space-y-4">
      {/* Top Controls Header (Matching Image 5 Top Bar) */}
      <div className={`p-3.5 rounded-2xl border shadow-sm flex items-center justify-between gap-2 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setViewLevel('TOPICS_LIST')}
            className={`p-1.5 rounded-xl border text-xs font-bold transition-all flex items-center ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className={`text-xs sm:text-sm font-black truncate ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {activeTopic.title}
            </h2>
            <p className="text-[10px] text-emerald-600 font-bold">
              अध्ययन नोट्स (Markdown)
            </p>
          </div>
        </div>

        {/* Text Font Resizers [A-] [A+] */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setFontSize((prev) => Math.max(12, prev - 1))}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-black text-xs border border-emerald-500/30"
            title="अक्षर छोटा करें"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize((prev) => Math.min(22, prev + 1))}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-black text-xs border border-emerald-500/30"
            title="अक्षर बड़ा करें"
          >
            A+
          </button>
        </div>
      </div>

      {/* Main Formatted Article Reader Sheet (Matching Image 5 Body) */}
      <div className={`p-5 rounded-3xl border shadow-md space-y-4 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Title Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 space-y-1">
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            कक्षा 10 विज्ञान
          </h1>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-300">
            अध्याय {selectedChapter.chapterNumber} : {selectedChapter.titleHindi}
          </h2>
          <h3 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 pt-1">
            Topic {selectedChapter.chapterNumber}.{selectedTopicIndex + 1} : {activeTopic.title}
          </h3>
        </div>

        {/* Dynamic Font Sized Article Body */}
        <div className="space-y-4 leading-relaxed" style={{ fontSize: `${fontSize}px` }}>
          {/* Green Subtitle */}
          <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400">
            अवधारणा व विस्तृत अध्ययन
          </h4>

          <div className="h-0.5 bg-slate-200 dark:bg-slate-800 my-2" />

          {/* Intro Section */}
          <div className="space-y-1.5">
            <h5 className="font-black text-slate-900 dark:text-white">परिचय</h5>
            <p className="font-medium text-slate-700 dark:text-slate-300">
              {activeTopic.desc || `${activeTopic.title} के अंतर्गत रासायनिक प्रक्रियाओं और समीकरण के मूलभूत सिद्धांतों को समझा जाता है।`}
            </p>
          </div>

          <p className="font-medium text-slate-700 dark:text-slate-300">
            मुख्य बिंदु निम्नलिखित प्रकार से समझे जा सकते हैं:
          </p>

          <ul className="space-y-2 list-none pl-1">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>कोण-कोण से पदार्थ अभिक्रिया में भाग लेते हैं (अभिकारक)।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>अभिक्रिया के पश्चात बनने वाले नए पदार्थ (उत्पाद)।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>अभिक्रिया के दौरान आवश्यक तापमान, दाब या उत्प्रेरक परिस्थितियां।</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
              <span>द्रव्यमान संरक्षण का नियम - अभिकारक और उत्पाद का द्रव्यमान सदैव समान रहता है।</span>
            </li>
          </ul>

          <div className="h-0.5 bg-slate-200 dark:bg-slate-800 my-2" />

          {/* Definition Callout Box */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
            <h5 className="font-bold text-emerald-700 dark:text-emerald-300 text-xs">परिभाषा (Definition)</h5>
            <p className="font-semibold text-slate-800 dark:text-slate-200 italic">
              "{activeTopic.point}"
            </p>
          </div>

          {/* Important Equations if available */}
          {notes?.formulas && notes.formulas.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 space-y-2">
              <h5 className="font-bold text-blue-700 dark:text-blue-300 text-xs flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> रासायनिक सूत्र व समीकरण:
              </h5>
              <div className="space-y-2">
                {notes.formulas.map((f, i) => {
                  if (typeof f === 'string') {
                    return (
                      <div key={i} className="font-mono font-bold text-blue-900 dark:text-blue-200 text-xs bg-white dark:bg-slate-900 p-2 rounded-xl border border-blue-100 dark:border-slate-800">
                        {f}
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="font-mono text-blue-900 dark:text-blue-200 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-blue-100 dark:border-slate-800 space-y-1">
                      <div className="font-bold text-blue-700 dark:text-blue-300">{f.name}: <span className="font-extrabold text-blue-900 dark:text-blue-100">{f.formula}</span></div>
                      {f.explanation && <div className="text-[11px] font-normal text-slate-600 dark:text-slate-400">{f.explanation}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() => handleMarkTopicDone(selectedTopicIndex)}
            className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow flex items-center gap-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>पढ़ा हुआ चिह्नित करें (+50 अंक)</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className={`py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center gap-1.5 ${
              isDarkMode ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>PDF डाउनलोड</span>
          </button>
        </div>
      </div>
    </div>
  );
};
