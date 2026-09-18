import React, { useState } from 'react';
import { GLOSSARY_DATA } from '../data/glossaryData';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { GlossaryTerm, Chapter } from '../types';
import {
  ArrowLeft,
  Search,
  X,
  BookMarked,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  FlaskConical,
  Dna,
  Zap,
  BookOpen,
  Filter,
  Lightbulb,
  ListFilter
} from 'lucide-react';
import { useLanguage } from '../utils/languageContext';

interface GlossaryViewProps {
  onBack: () => void;
  isDarkMode: boolean;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onBack, isDarkMode }) => {
  const { language } = useLanguage();
  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'physics' | 'biology'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'chapter' | 'all'>('chapter');
  const [tagFilter, setTagFilter] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Chapters matching the active subject filter
  const subjectChapters = CHAPTERS_DATA.filter((ch) => ch.subject === subjectFilter);

  // Active Selected Chapter object
  const activeChapter = selectedChapterId ? CHAPTERS_DATA.find((c) => c.id === selectedChapterId) : null;

  // Terms for active chapter
  const chapterTerms = activeChapter
    ? GLOSSARY_DATA.filter((item) => item.chapterNumber === activeChapter.chapterNumber && item.subject === activeChapter.subject)
    : [];

  // Filtered terms for chapter view based on tag filter
  const filteredChapterTerms = chapterTerms.filter((term) => {
    if (tagFilter === 'ALL') return true;
    if (tagFilter === 'SPECIAL') return term.keyTag === 'बोर्ड स्पेशल';
    if (tagFilter === 'FORMULA') return !!term.exampleOrFormula;
    if (tagFilter === 'IMPORTANT') return term.keyTag === 'महत्वपूर्ण' || term.keyTag === 'बार-बार पूछा गया';
    return true;
  });

  // Global search filtering across terms
  const searchResults = GLOSSARY_DATA.filter((item) => {
    const matchesSubject = searchQuery.trim() !== '' ? true : item.subject === subjectFilter;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchesSubject;

    const matchesSearch =
      item.termHindi.toLowerCase().includes(q) ||
      item.termEnglish.toLowerCase().includes(q) ||
      item.definitionHindi.toLowerCase().includes(q) ||
      (item.chapterNameHindi && item.chapterNameHindi.toLowerCase().includes(q)) ||
      (item.exampleOrFormula && item.exampleOrFormula.toLowerCase().includes(q));

    return matchesSearch;
  });

  // Navigation: prev & next chapter
  const currentChapterIndex = activeChapter ? subjectChapters.findIndex((c) => c.id === activeChapter.id) : -1;
  const prevChapter = currentChapterIndex > 0 ? subjectChapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex >= 0 && currentChapterIndex < subjectChapters.length - 1 ? subjectChapters[currentChapterIndex + 1] : null;

  const handleCopyTerm = (term: GlossaryTerm) => {
    const textToCopy = `${term.termHindi} (${term.termEnglish})\nपरिभाषा: ${term.definitionHindi}${
      term.exampleOrFormula ? `\nसूत्र/उदाहरण: ${term.exampleOrFormula}` : ''
    }\n- Science 10th RBSE`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(term.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSubjectIcon = (subject: string, size = "w-5 h-5") => {
    if (subject === 'chemistry') return <FlaskConical className={`${size} text-sky-500 stroke-[2.2]`} />;
    if (subject === 'biology') return <Dna className={`${size} text-emerald-500 stroke-[2.2]`} />;
    return <Zap className={`${size} text-purple-500 stroke-[2.2]`} />;
  };

  /* -------------------------------------------------------------------------- */
  /* LEVEL 2: ACTIVE CHAPTER TERMS VIEWER                                      */
  /* -------------------------------------------------------------------------- */
  if (activeChapter && !searchQuery.trim()) {
    return (
      <div className="space-y-3.5 animate-fadeIn pb-8">
        {/* Top Sticky Header */}
        <div
          className={`sticky top-0 z-20 flex items-center justify-between p-3 rounded-3xl border shadow-md backdrop-blur-xl gap-2 transition-all ${
            isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
          }`}
        >
          <button
            onClick={() => {
              setSelectedChapterId(null);
              setTagFilter('ALL');
            }}
            className={`p-2 px-3 rounded-2xl border text-xs font-black transition-all flex items-center gap-1.5 shrink-0 active:scale-95 ${
              isDarkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="अध्याय सूची पर लौटें"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-500" />
            <span>अध्याय सूची</span>
          </button>

          <div className="min-w-0 flex-1 text-center">
            <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider block">
              अध्याय {activeChapter.chapterNumber} • शब्दावली
            </span>
            <h2 className={`text-xs sm:text-sm font-black truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {activeChapter.titleHindi}
            </h2>
          </div>

          <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shrink-0">
            {chapterTerms.length} शब्द
          </span>
        </div>

        {/* Chapter Overview Card */}
        <div
          className={`p-4 rounded-3xl border transition-all ${
            isDarkMode ? 'card-3d-dark border-amber-500/30' : 'card-3d-light border-amber-200/80'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              {getSubjectIcon(activeChapter.subject, "w-6 h-6")}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase text-amber-500 block">
                {activeChapter.unit}
              </span>
              <h1 className={`text-base sm:text-lg font-black leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {activeChapter.titleHindi}
              </h1>
              <p className="text-xs text-slate-400 font-bold mt-0.5">
                {activeChapter.titleEnglish} • {activeChapter.weightage} अंक बोर्ड परीक्षा
              </p>
            </div>
          </div>
        </div>

        {/* Chapter Sub-Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'ALL', label: `सभी परिभाषाएं (${chapterTerms.length})` },
            { id: 'SPECIAL', label: 'बोर्ड स्पेशल' },
            { id: 'FORMULA', label: 'सूत्र व समीकरण' },
            { id: 'IMPORTANT', label: 'महत्वपूर्ण' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTagFilter(tab.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-2xl font-black transition-all active:scale-95 border ${
                tagFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                  : isDarkMode
                  ? 'card-3d-dark text-slate-300 hover:text-white'
                  : 'card-3d-light text-slate-700 hover:text-amber-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chapter Terms List */}
        <div className="space-y-3">
          {filteredChapterTerms.length === 0 ? (
            <div className="text-center py-10 space-y-2 rounded-3xl border border-dashed p-6 bg-slate-50/50 dark:bg-slate-900/30">
              <p className="text-xs font-bold text-slate-400">
                इस श्रेणी में कोई परिभाषा उपलब्ध नहीं है।
              </p>
            </div>
          ) : (
            filteredChapterTerms.map((term) => {
              const isCopied = copiedId === term.id;
              return (
                <div
                  key={term.id}
                  className={`p-4 rounded-3xl border transition-all space-y-2.5 ${
                    isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
                  }`}
                >
                  {/* Top Row: Term Name & Copy Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-black tracking-tight text-amber-500 dark:text-amber-400">
                          {term.termHindi}
                        </h3>
                        {term.keyTag && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                            <span>{term.keyTag}</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] font-bold text-slate-400 italic">
                        {term.termEnglish}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyTerm(term)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center shrink-0 active:scale-95 ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                      title="परिभाषा कॉपी करें"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Definition Box */}
                  <div
                    className={`text-xs font-medium leading-relaxed p-3 rounded-2xl border ${
                      isDarkMode
                        ? 'bg-slate-900/70 border-slate-800 text-slate-200'
                        : 'bg-slate-50 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    {term.definitionHindi}
                  </div>

                  {/* Formula / Example Box */}
                  {term.exampleOrFormula && (
                    <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-mono text-xs">{term.exampleOrFormula}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Chapter Navigation Bar */}
        <div className="pt-2 flex items-center justify-between gap-2">
          {prevChapter ? (
            <button
              onClick={() => {
                setSelectedChapterId(prevChapter.id);
                setTagFilter('ALL');
              }}
              className={`p-3 px-4 rounded-2xl border text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 ${
                isDarkMode ? 'card-3d-dark text-slate-200 hover:text-white' : 'card-3d-light text-slate-700 hover:text-amber-600'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>अध्याय {prevChapter.chapterNumber}</span>
            </button>
          ) : (
            <div />
          )}

          {nextChapter ? (
            <button
              onClick={() => {
                setSelectedChapterId(nextChapter.id);
                setTagFilter('ALL');
              }}
              className="p-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <span>अध्याय {nextChapter.chapterNumber}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /* LEVEL 1: CHAPTERS & OVERVIEW LIST                                          */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="space-y-3.5 animate-fadeIn pb-8">
      {/* Centered Top Header Navigation */}
      <div
        className={`relative flex items-center justify-between p-3.5 rounded-3xl border transition-all ${
          isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
        }`}
      >
        <button
          onClick={onBack}
          className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center active:scale-95 ${
            isDarkMode
              ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title="वापस जाएँ"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center min-w-0 px-2">
          <h2
            className={`text-sm sm:text-base font-black flex items-center justify-center gap-2 truncate ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            <BookMarked className="w-5 h-5 text-amber-500 shrink-0 stroke-[2.2]" />
            <span>विज्ञान शब्दावली एवं परिभाषाएं</span>
          </h2>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold truncate">
            अध्याय-वार 100% बोर्ड परीक्षा मुख्य वैज्ञानिक परिभाषाएं
          </p>
        </div>

        <div className="w-9" />
      </div>

      {/* Universal Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="खोजें: उपचयन, ओम का नियम, नेफ्रॉन, pH पैमाना, प्रतिरोधकता..."
          className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-bold transition-all shadow-sm focus:outline-none ${
            isDarkMode
              ? 'input-3d-dark text-slate-100 placeholder-slate-400 focus:border-amber-400'
              : 'input-3d-light text-slate-900 placeholder-slate-500 focus:border-indigo-600'
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

      {/* Subject Filter Category Tabs (Chemistry, Physics, Biology) */}
      {!searchQuery && (
        <div className="flex items-center gap-2">
          {[
            { id: 'chemistry', label: 'रसायन विज्ञान', icon: FlaskConical },
            { id: 'physics', label: 'भौतिक विज्ञान', icon: Zap },
            { id: 'biology', label: 'जीव विज्ञान', icon: Dna },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSubjectFilter(tab.id as any);
                  setSelectedChapterId(null);
                }}
                className={`flex-1 py-2 rounded-2xl font-black text-xs transition-all active:scale-95 border flex items-center justify-center gap-1.5 ${
                  subjectFilter === tab.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* View Mode Toggle: Chapter-wise vs All Terms (when not searching) */}
      {!searchQuery && (
        <div className="flex items-center justify-between px-1 text-xs">
          <span className="font-bold text-slate-400 text-[11px] flex items-center gap-1">
            <Filter className="w-3 h-3 text-amber-500" />
            <span>{subjectChapters.length} अध्याय उपलब्ध</span>
          </span>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('chapter')}
              className={`px-2.5 py-1 rounded-lg font-black text-[10px] transition-all ${
                viewMode === 'chapter'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              अध्याय-वार
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`px-2.5 py-1 rounded-lg font-black text-[10px] transition-all ${
                viewMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              सभी शब्द
            </button>
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-400">
            <span>खोज परिणाम: "{searchQuery}"</span>
            <span className="text-amber-500">{searchResults.length} शब्द मिले</span>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-10 space-y-2 rounded-3xl border border-dashed p-6 bg-slate-50/50 dark:bg-slate-900/30">
              <p className="text-xs font-bold text-slate-400">
                कोई शब्द नहीं मिला। कृपया खोज शब्द बदलें।
              </p>
            </div>
          ) : (
            searchResults.map((term) => {
              const isCopied = copiedId === term.id;
              return (
                <div
                  key={term.id}
                  className={`p-4 rounded-3xl border transition-all space-y-2.5 ${
                    isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-black text-amber-500 dark:text-amber-400">
                          {term.termHindi}
                        </h3>
                        {term.keyTag && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                            <span>{term.keyTag}</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 italic">
                        {term.termEnglish} • अध्याय {term.chapterNumber}: {term.chapterNameHindi}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyTerm(term)}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center shrink-0 active:scale-95 ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                      title="परिभाषा कॉपी करें"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div
                    className={`text-xs font-medium leading-relaxed p-3 rounded-2xl border ${
                      isDarkMode
                        ? 'bg-slate-900/70 border-slate-800 text-slate-200'
                        : 'bg-slate-50 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    {term.definitionHindi}
                  </div>

                  {term.exampleOrFormula && (
                    <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-mono text-xs">{term.exampleOrFormula}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Chapter Cards List (Default Mode, Matching Video Classes & Notes) */}
      {!searchQuery && viewMode === 'chapter' && (
        <div className="space-y-2.5">
          {subjectChapters.map((ch) => {
            const count = GLOSSARY_DATA.filter(
              (item) => item.chapterNumber === ch.chapterNumber && item.subject === ch.subject
            ).length;

            return (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedChapterId(ch.id);
                  setTagFilter('ALL');
                }}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between gap-3 group ${
                  isDarkMode
                    ? 'card-3d-dark hover:border-amber-400/40'
                    : 'card-3d-light hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Left Vector Icon Badge */}
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    {getSubjectIcon(ch.subject)}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 block">
                      अध्याय {ch.chapterNumber} • {ch.weightage} अंक
                    </span>
                    <h3 className={`text-xs sm:text-sm font-black truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {ch.titleHindi}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate">
                      {ch.titleEnglish}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-black px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1 transition-transform active:scale-95">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{count} शब्द</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All Terms in Selected Subject View Mode */}
      {!searchQuery && viewMode === 'all' && (
        <div className="space-y-3">
          {GLOSSARY_DATA.filter((item) => item.subject === subjectFilter).map((term) => {
            const isCopied = copiedId === term.id;
            return (
              <div
                key={term.id}
                className={`p-4 rounded-3xl border transition-all space-y-2.5 ${
                  isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-black text-amber-500 dark:text-amber-400">
                        {term.termHindi}
                      </h3>
                      {term.keyTag && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                          <span>{term.keyTag}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 italic">
                      {term.termEnglish} • अध्याय {term.chapterNumber}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyTerm(term)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center shrink-0 active:scale-95 ${
                      isCopied
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                    title="परिभाषा कॉपी करें"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div
                  className={`text-xs font-medium leading-relaxed p-3 rounded-2xl border ${
                    isDarkMode
                      ? 'bg-slate-900/70 border-slate-800 text-slate-200'
                      : 'bg-slate-50 border-slate-200/80 text-slate-800'
                  }`}
                >
                  {term.definitionHindi}
                </div>

                {term.exampleOrFormula && (
                  <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-mono text-xs">{term.exampleOrFormula}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
