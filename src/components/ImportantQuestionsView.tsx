import React, { useState } from 'react';
import { ImportantQuestion } from '../types';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { IMPORTANT_QUESTIONS_DATA } from '../data/importantQuestionsData';
import {
  ArrowLeft,
  Search,
  X,
  Star,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  FlaskConical,
  Dna,
  Zap,
} from 'lucide-react';
import { useLanguage } from '../utils/languageContext';

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
  const { language, t } = useLanguage();
  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'biology' | 'physics'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Selected Chapter ID for chapter-wise view
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  // Active question type filter inside active chapter detail view ('ALL' | 'GOLDEN' | 'EQUATION' | 'DIAGRAM' | 'SA' | 'LA')
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
    if (typeFilter === 'GOLDEN') {
      return q.repeatedYears?.some((yr) => String(yr).includes('2026') || String(yr).includes('2025'));
    }
    return q.type === typeFilter;
  });

  // Navigation Chapter Index
  const currentChapterIndex = activeChapter ? CHAPTERS_DATA.findIndex((c) => c.id === activeChapter.id) : -1;
  const prevChapter = currentChapterIndex > 0 ? CHAPTERS_DATA[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex >= 0 && currentChapterIndex < CHAPTERS_DATA.length - 1 ? CHAPTERS_DATA[currentChapterIndex + 1] : null;

  /* LEVEL 2: CHAPTER-WISE DETAILED QUESTIONS VIEW */
  if (activeChapter) {
    return (
      <div className="space-y-3.5 animate-fadeIn pb-8">
        {/* Top Sticky Header Controls Bar */}
        <div
          className={`sticky top-0 z-20 flex items-center justify-between p-3 rounded-3xl border shadow-md backdrop-blur-xl gap-2 transition-all ${
            isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
          }`}
        >
          <button
            onClick={() => setSelectedChapterId(null)}
            className={`p-2 px-3 rounded-2xl border text-xs font-black transition-all flex items-center gap-1.5 shrink-0 active:scale-95 ${
              isDarkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={language === 'hi' ? 'अध्याय सूची पर लौटें' : 'Back to Chapters'}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-rose-500" />
            <span>{language === 'hi' ? 'सूची' : 'List'}</span>
          </button>

          <div className="min-w-0 flex-1 text-center">
            <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider block">
              {language === 'hi'
                ? `अध्याय ${activeChapter.chapterNumber} • अति-महत्वपूर्ण प्रश्न`
                : `Chapter ${activeChapter.chapterNumber} • Most Important Questions`}
            </span>
            <h2
              className={`text-xs sm:text-sm font-black truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {language === 'hi' ? activeChapter.titleHindi : activeChapter.titleEnglish}
            </h2>
          </div>

          <div className="w-8 shrink-0" />
        </div>

        {/* Chapter Overview Hero Card */}
        <div
          className={`p-4 rounded-3xl border transition-all ${
            isDarkMode
              ? 'card-3d-dark border-rose-500/30'
              : 'card-3d-light border-rose-200/80'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              {activeChapter.subject === 'chemistry' ? (
                <FlaskConical className="w-6 h-6 text-sky-500 stroke-[2.2]" />
              ) : activeChapter.subject === 'biology' ? (
                <Dna className="w-6 h-6 text-emerald-500 stroke-[2.2]" />
              ) : (
                <Zap className="w-6 h-6 text-purple-500 stroke-[2.2]" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className={`text-base sm:text-lg font-black leading-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {language === 'hi'
                  ? `अध्याय ${activeChapter.chapterNumber}: ${activeChapter.titleHindi}`
                  : `Chapter ${activeChapter.chapterNumber}: ${activeChapter.titleEnglish}`}
              </h1>
              <p className="text-xs text-rose-500 dark:text-rose-400 font-bold mt-0.5">
                {language === 'hi' ? activeChapter.titleEnglish : activeChapter.titleHindi}
              </p>
            </div>
          </div>
        </div>

        {/* Question Type Filter Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {[
            { key: 'ALL', labelHi: 'सभी प्रश्न', labelEn: 'All Questions' },
            { key: 'GOLDEN', labelHi: '2026/2025 बोर्ड स्पेशल', labelEn: '2026/2025 Board Special' },
            { key: 'EQUATION', labelHi: 'समीकरण व सूत्र', labelEn: 'Equations & Formulas' },
            { key: 'DIAGRAM', labelHi: 'चित्र प्रश्न', labelEn: 'Diagram Questions' },
            { key: 'SA', labelHi: 'लघुउत्तरीय (SA)', labelEn: 'Short Answer' },
            { key: 'LA', labelHi: 'दीर्घउत्तरीय (LA)', labelEn: 'Long Answer' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTypeFilter(tab.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-2xl text-xs font-black transition-all active:scale-95 ${
                typeFilter === tab.key
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md shadow-rose-500/25'
                  : isDarkMode
                  ? 'card-3d-dark text-slate-300 hover:text-white'
                  : 'card-3d-light text-slate-700 hover:text-rose-600'
              }`}
            >
              {language === 'hi' ? tab.labelHi : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {filteredActiveQuestions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 font-bold">
              {language === 'hi' ? 'इस श्रेणी में कोई प्रश्न उपलब्ध नहीं है' : 'No questions available in this category'}
            </div>
          ) : (
            filteredActiveQuestions.map((q, idx) => {
              const qText = language === 'en' && q.questionEnglish ? q.questionEnglish : q.question;
              const aText = language === 'en' && q.answerEnglish ? q.answerEnglish : q.answer;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-3xl border space-y-3 transition-all ${
                    isDarkMode ? 'card-3d-dark' : 'card-3d-light'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      {language === 'hi' ? `प्रश्न #${idx + 1}` : `Q #${idx + 1}`} • {q.marks} {language === 'hi' ? 'अंक' : 'Marks'}
                    </span>

                    {q.repeatedYears && q.repeatedYears.length > 0 && (
                      <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>RBSE Board: {q.repeatedYears.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className={`text-xs sm:text-sm font-black leading-relaxed ${
                    isDarkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {qText}
                  </div>

                  <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                    isDarkMode
                      ? 'bg-slate-900/60 border-slate-800 text-slate-200'
                      : 'bg-slate-50 border-slate-200/80 text-slate-800'
                  }`}>
                    <div className="font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-rose-500" />
                      <span>{language === 'hi' ? 'आदर्श उत्तर / हल:' : 'Model Solution / Answer:'}</span>
                    </div>
                    <p className="whitespace-pre-line pt-0.5 font-semibold leading-relaxed">
                      {aText}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Chapter Switcher Navigation Footer */}
        <div
          className={`p-3.5 rounded-3xl border space-y-3 transition-all ${
            isDarkMode ? 'card-3d-dark' : 'card-3d-light'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            {prevChapter ? (
              <button
                onClick={() => setSelectedChapterId(prevChapter.id)}
                className={`p-2 px-3 rounded-2xl border text-xs font-black transition-all flex items-center gap-1.5 text-left min-w-0 flex-1 max-w-[48%] active:scale-95 ${
                  isDarkMode
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4 shrink-0 text-rose-500" />
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">
                    {language === 'hi' ? 'पिछला अध्याय' : 'Previous'}
                  </div>
                  <div className="truncate">
                    {language === 'hi' ? `अध्याय ${prevChapter.chapterNumber}` : `Ch ${prevChapter.chapterNumber}`}
                  </div>
                </div>
              </button>
            ) : (
              <div className="flex-1" />
            )}

            {nextChapter ? (
              <button
                onClick={() => setSelectedChapterId(nextChapter.id)}
                className={`p-2 px-3 rounded-2xl border text-xs font-black transition-all flex items-center gap-1.5 text-right justify-end min-w-0 flex-1 max-w-[48%] active:scale-95 ${
                  isDarkMode
                    ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-[9px] text-slate-400 font-bold uppercase">
                    {language === 'hi' ? 'अगला अध्याय' : 'Next'}
                  </div>
                  <div className="truncate">
                    {language === 'hi' ? `अध्याय ${nextChapter.chapterNumber}` : `Ch ${nextChapter.chapterNumber}`}
                  </div>
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

  /* LEVEL 1: CHAPTER SELECTION LIST VIEW */
  return (
    <div className="space-y-3.5 animate-fadeIn pb-8">
      {/* Header Bar */}
      <div
        className={`relative flex items-center justify-between p-3.5 rounded-3xl border transition-all ${
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

        <div className="flex items-center gap-2 min-w-0">
          <Flame className="w-5 h-5 text-rose-500 shrink-0 stroke-[2.2]" />
          <div className="min-w-0">
            <h2
              className={`text-xs sm:text-base font-black truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {t('impQuestionsTitle', 'महत्वपूर्ण प्रश्न (Important Q&A)')}
            </h2>
            <p className="text-[10px] text-rose-500 font-bold truncate">
              {language === 'hi' ? 'अध्याय-वार 100% बोर्ड स्पेशल प्रश्न व मॉडल उत्तर' : 'Chapter-wise 100% Board Special Q&A with Model Solutions'}
            </p>
          </div>
        </div>

        <div className="w-8 shrink-0" />
      </div>

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
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md shadow-rose-500/25'
                  : isDarkMode
                  ? 'card-3d-dark text-slate-300 hover:text-white'
                  : 'card-3d-light text-slate-700 hover:text-rose-600'
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span className="truncate">{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
            </button>
          );
        })}
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
          placeholder={
            language === 'hi'
              ? 'प्रश्न खोजें: अध्याय का नाम, विषय...'
              : 'Search questions: Chapter name, topic...'
          }
          className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-bold transition-all shadow-sm focus:outline-none ${
            isDarkMode
              ? 'bg-slate-900/90 text-slate-100 placeholder-slate-400 border border-slate-700/80 focus:border-rose-400'
              : 'bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-rose-600'
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

      {/* Chapter Cards List */}
      <div className="space-y-2.5">
        {filteredChapters.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-bold">
            {language === 'hi' ? 'कोई अध्याय उपलब्ध नहीं हैं' : 'No chapters available'}
          </div>
        ) : (
          filteredChapters.map((ch) => {
            const chapterQuestions = questions.filter((q) => q.chapterId === ch.id);
            const goldenCount = chapterQuestions.filter((q) =>
              q.repeatedYears?.some((yr) => String(yr).includes('2026') || String(yr).includes('2025'))
            ).length;

            return (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedChapterId(ch.id);
                  setTypeFilter('ALL');
                }}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between gap-3 ${
                  isDarkMode
                    ? 'card-3d-dark hover:border-rose-500/50'
                    : 'card-3d-light hover:border-rose-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
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
                      <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400">
                        {language === 'hi'
                          ? `अध्याय ${ch.chapterNumber} • ${ch.weightage} अंक`
                          : `Chapter ${ch.chapterNumber} • ${ch.weightage} Marks`}
                      </span>

                      {goldenCount > 0 && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-black">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{goldenCount} {language === 'hi' ? 'गोल्डन प्रश्न' : 'Golden Qs'}</span>
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-xs sm:text-sm font-black truncate ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {language === 'hi' ? ch.titleHindi : ch.titleEnglish}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-black px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-sm flex items-center gap-1 transition-transform active:scale-95">
                    <Flame className="w-3.5 h-3.5" />
                    <span>{chapterQuestions.length} {language === 'hi' ? 'प्रश्न' : 'Qs'}</span>
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
