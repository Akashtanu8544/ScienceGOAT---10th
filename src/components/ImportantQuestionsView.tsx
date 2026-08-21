import React, { useState } from 'react';
import { ImportantQuestion, Chapter } from '../types';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { IMPORTANT_QUESTIONS_DATA } from '../data/importantQuestionsData';
import {
  ArrowLeft,
  Search,
  X,
  Star,
  CheckCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles
} from 'lucide-react';

interface ImportantQuestionsViewProps {
  questions?: ImportantQuestion[];
  onBack: () => void;
  isDarkMode: boolean;
}

export const ImportantQuestionsView: React.FC<ImportantQuestionsViewProps> = ({
  questions = IMPORTANT_QUESTIONS_DATA,
  onBack,
  isDarkMode,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'biology' | 'physics'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Selected Chapter ID for chapter-wise view
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  // Active question type filter inside active chapter detail view ('ALL' | 'EQUATION' | 'DIAGRAM' | 'SA' | 'LA')
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Filter chapters for Level 1 list
  const filteredChapters = CHAPTERS_DATA.filter((ch) => {
    const matchesSubject = ch.subject === subjectFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      ch.titleHindi.includes(searchQuery) ||
      ch.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  // Active Chapter & Questions
  const activeChapter = selectedChapterId ? CHAPTERS_DATA.find((c) => c.id === selectedChapterId) : null;
  const activeQuestions = selectedChapterId
    ? questions.filter((q) => q.chapterId === selectedChapterId)
    : [];

  const filteredActiveQuestions = activeQuestions.filter((q) => {
    if (typeFilter === 'ALL') return true;
    return q.type === typeFilter;
  });

  // Navigation Chapter Index
  const currentChapterIndex = activeChapter ? CHAPTERS_DATA.findIndex((c) => c.id === activeChapter.id) : -1;
  const prevChapter = currentChapterIndex > 0 ? CHAPTERS_DATA[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex >= 0 && currentChapterIndex < CHAPTERS_DATA.length - 1 ? CHAPTERS_DATA[currentChapterIndex + 1] : null;

  /* LEVEL 2: CHAPTER-WISE DETAILED QUESTIONS VIEW */
  if (activeChapter) {
    return (
      <div className="space-y-3.5 animate-fadeIn pb-6">
        {/* Top Sticky Header Controls Bar */}
        <div
          className={`sticky top-0 z-20 flex items-center justify-between p-3 rounded-2xl border shadow-md backdrop-blur-xl gap-2 ${
            isDarkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
          }`}
        >
          <button
            onClick={() => setSelectedChapterId(null)}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="अध्याय सूची पर लौटें"
          >
            <ArrowLeft className="w-4 h-4 text-rose-500" />
            <span className="hidden sm:inline">सूची</span>
          </button>

          <div className="min-w-0 flex-1 text-center">
            <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider block">
              अध्याय {activeChapter.chapterNumber} • अति-महत्वपूर्ण प्रश्न
            </span>
            <h2
              className={`text-xs sm:text-sm font-black truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {activeChapter.titleHindi}
            </h2>
          </div>

          <div className="w-8 shrink-0" />
        </div>

        {/* Chapter Overview Hero Card */}
        <div
          className={`p-4 rounded-3xl border shadow-md relative overflow-hidden backdrop-blur-md ${
            isDarkMode
              ? 'bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-900/90 border-rose-500/30'
              : 'bg-gradient-to-br from-rose-50/90 via-orange-50/50 to-white border-rose-200/80'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30 text-2xl flex items-center justify-center shrink-0 shadow-inner">
              {activeChapter.icon3D || '🔥'}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className={`text-base sm:text-lg font-black leading-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                अध्याय {activeChapter.chapterNumber}: {activeChapter.titleHindi}
              </h1>
              <p className="text-xs text-rose-500 dark:text-rose-400 font-bold mt-0.5">
                {activeChapter.titleEnglish}
              </p>
            </div>
          </div>
        </div>

        {/* Question Type Filter Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { key: 'ALL', label: 'सभी प्रश्न' },
            { key: 'EQUATION', label: 'समीकरण व सूत्र' },
            { key: 'DIAGRAM', label: 'चित्र प्रश्न' },
            { key: 'SA', label: 'लघुउत्तरीय' },
            { key: 'LA', label: 'दीर्घउत्तरीय' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTypeFilter(tab.key)}
              className={`shrink-0 px-3 py-1.5 rounded-2xl text-xs font-extrabold transition-all active:scale-95 ${
                typeFilter === tab.key
                  ? 'bg-rose-600 text-white shadow-md'
                  : isDarkMode
                  ? 'bg-slate-900/80 text-slate-300 border border-slate-800'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {filteredActiveQuestions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-bold">
              इस श्रेणी में कोई प्रश्न उपलब्ध नहीं है
            </div>
          ) : (
            filteredActiveQuestions.map((q, idx) => (
              <div
                key={q.id}
                className={`p-4 rounded-3xl border shadow-sm space-y-3 backdrop-blur-md ${
                  isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    प्रश्न #{idx + 1} • {q.marks} अंक
                  </span>

                  {q.repeatedYears && q.repeatedYears.length > 0 && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>राजस्थान बोर्ड: {q.repeatedYears.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className={`text-xs sm:text-sm font-black leading-relaxed ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {q.question}
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-1">
                  <div className="font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>आदर्श उत्तर / हल:</span>
                  </div>
                  <p className="whitespace-pre-line pt-0.5 font-medium leading-relaxed">
                    {q.answer}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Chapter Switcher Navigation Footer */}
        <div
          className={`p-3.5 rounded-3xl border shadow-md space-y-3 backdrop-blur-md ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            {prevChapter ? (
              <button
                onClick={() => setSelectedChapterId(prevChapter.id)}
                className={`p-2 px-3 rounded-2xl border text-xs font-black transition-all flex items-center gap-1 text-left min-w-0 flex-1 max-w-[48%] active:scale-95 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4 shrink-0 text-rose-500" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">पिछला अध्याय</div>
                  <div className="truncate">अध्याय {prevChapter.chapterNumber}</div>
                </div>
              </button>
            ) : (
              <div className="flex-1" />
            )}

            {nextChapter ? (
              <button
                onClick={() => setSelectedChapterId(nextChapter.id)}
                className={`p-2 px-3 rounded-2xl border text-xs font-black transition-all flex items-center gap-1 text-right justify-end min-w-0 flex-1 max-w-[48%] active:scale-95 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">अगला अध्याय</div>
                  <div className="truncate">अध्याय {nextChapter.chapterNumber}</div>
                </div>
                <ChevronRight className="w-4 h-4 shrink-0 text-rose-500" />
              </button>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </div>
    );
  }

  /* LEVEL 1: CHAPTER SELECTION LIST VIEW (FOLLOWING NOTES VIEW) */
  return (
    <div className="space-y-3.5 animate-fadeIn">
      {/* Header Bar */}
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

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl">🔥</span>
          <div className="min-w-0">
            <h2
              className={`text-sm sm:text-base font-black truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              महत्वपूर्ण प्रश्न (Important Q&A)
            </h2>
            <p className="text-[10px] text-rose-500 font-bold truncate">
              अध्याय-वार 100% बोर्ड स्पेशल प्रश्न व मॉडल उत्तर
            </p>
          </div>
        </div>

        <div className="w-8 shrink-0" />
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
                ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
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

      {/* Search Bar */}
      <div className="relative">
        <Search
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-rose-400' : 'text-rose-600'
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="प्रश्न खोजें: अध्याय का नाम, विषय..."
          className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-black transition-all backdrop-blur-2xl shadow-sm focus:outline-none ${
            isDarkMode
              ? 'bg-slate-900/80 text-slate-100 placeholder-slate-400 border border-slate-700/80 focus:border-rose-400'
              : 'bg-white/90 text-slate-900 placeholder-slate-400 border border-rose-200 focus:border-rose-600'
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

      {/* Chapter Cards List following Notes View */}
      <div className="space-y-2.5">
        {filteredChapters.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-bold">
            कोई अध्याय उपलब्ध नहीं हैं
          </div>
        ) : (
          filteredChapters.map((ch) => {
            const chQuestions = questions.filter((q) => q.chapterId === ch.id);

            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChapterId(ch.id)}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between group shadow-sm backdrop-blur-md ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-slate-800 hover:border-rose-500/50 hover:bg-slate-900'
                    : 'bg-white/90 border-slate-200 hover:border-rose-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500/10 to-orange-500/10 border border-rose-500/20 text-2xl flex items-center justify-center shrink-0 shadow-inner">
                    {ch.icon3D || '🔥'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400">
                        अध्याय {ch.chapterNumber}
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[9px] font-black">
                        {chQuestions.length} अति-महत्वपूर्ण प्रश्न
                      </span>
                    </div>

                    <h3
                      className={`text-xs sm:text-sm font-black truncate ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {ch.titleHindi}
                    </h3>
                  </div>
                </div>

                {/* Right Action Button */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => setSelectedChapterId(ch.id)}
                    className="p-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>प्रश्न देखें</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
