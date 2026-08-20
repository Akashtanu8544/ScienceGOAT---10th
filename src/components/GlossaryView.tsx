import React, { useState } from 'react';
import { GLOSSARY_DATA } from '../data/glossaryData';
import { SubjectType } from '../types';
import { ArrowLeft, Search, X, BookMarked, Copy, Check, Sparkles, Filter } from 'lucide-react';

interface GlossaryViewProps {
  onBack: () => void;
  isDarkMode: boolean;
}

export const GlossaryView: React.FC<GlossaryViewProps> = ({ onBack, isDarkMode }) => {
  const [subjectFilter, setSubjectFilter] = useState<'all' | SubjectType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTerms = GLOSSARY_DATA.filter((item) => {
    const matchesSubject = subjectFilter === 'all' || item.subject === subjectFilter;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === '' ||
      item.termHindi.toLowerCase().includes(query) ||
      item.termEnglish.toLowerCase().includes(query) ||
      item.definitionHindi.toLowerCase().includes(query) ||
      (item.chapterNameHindi && item.chapterNameHindi.toLowerCase().includes(query)) ||
      (item.exampleOrFormula && item.exampleOrFormula.toLowerCase().includes(query));

    return matchesSubject && matchesSearch;
  });

  const handleCopyTerm = (term: typeof GLOSSARY_DATA[0]) => {
    const textToCopy = `${term.termHindi} (${term.termEnglish})\nपरिभाषा: ${term.definitionHindi}${
      term.exampleOrFormula ? `\nसूत्र/उदाहरण: ${term.exampleOrFormula}` : ''
    }\n- Science GOAT 10th App`;

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(term.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-3.5 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className={`relative flex items-center justify-between p-3.5 rounded-3xl border shadow-sm backdrop-blur-md ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <button
          onClick={onBack}
          className={`p-2 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center ${
            isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title="वापस जाएँ"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center min-w-0 px-2">
          <h2 className={`text-sm sm:text-base font-black flex items-center justify-center gap-1.5 truncate ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <BookMarked className="w-4 h-4 text-amber-500" />
            <span>विज्ञान शब्दावली</span>
          </h2>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
            कक्षा 10वीं मुख्य वैज्ञानिक परिभाषाएं
          </p>
        </div>

        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Search Input Bar */}
      <div className="relative z-10">
        <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
          isDarkMode ? 'text-amber-400' : 'text-blue-600'
        }`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="खोजें: उपचयन, ओम का नियम, नेफ्रॉन, pH पैमाना..."
          className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-black transition-all backdrop-blur-2xl shadow-sm focus:outline-none ${
            isDarkMode
              ? 'bg-slate-900/80 text-slate-100 placeholder-slate-400 border border-slate-700/80 focus:border-amber-400'
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

      {/* Subject Filter Category Tabs */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { id: 'all', label: 'सभी', icon: '📚' },
          { id: 'chemistry', label: 'रसायन', icon: '🧪' },
          { id: 'physics', label: 'भौतिकी', icon: '⚡' },
          { id: 'biology', label: 'जीव विज्ञान', icon: '🧬' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubjectFilter(tab.id as any)}
            className={`py-2 px-1 rounded-2xl text-[11px] font-black transition-all flex items-center justify-center gap-1 active:scale-95 ${
              subjectFilter === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
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

      {/* Results Count Banner */}
      <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Filter className="w-3 h-3 text-amber-500" />
          <span>कुल शब्द: {filteredTerms.length}</span>
        </span>
        {searchQuery && <span>खोज परिणाम: "{searchQuery}"</span>}
      </div>

      {/* Glossary Term Cards List */}
      <div className="space-y-3">
        {filteredTerms.length === 0 ? (
          <div className="text-center py-10 space-y-2 rounded-3xl border border-dashed p-6 bg-slate-50/50 dark:bg-slate-900/30">
            <p className="text-2xl">🔍</p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
              कोई शब्द नहीं मिला। कृपया खोज शब्द बदलें।
            </p>
          </div>
        ) : (
          filteredTerms.map((term) => {
            const isCopied = copiedId === term.id;
            const subjectColors = {
              chemistry: {
                badge: 'bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-400/30',
                icon: '🧪',
                border: 'hover:border-sky-400/60',
              },
              physics: {
                badge: 'bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-400/30',
                icon: '⚡',
                border: 'hover:border-purple-400/60',
              },
              biology: {
                badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-400/30',
                icon: '🧬',
                border: 'hover:border-emerald-400/60',
              },
            }[term.subject];

            return (
              <div
                key={term.id}
                className={`p-4 rounded-3xl border shadow-sm transition-all relative overflow-hidden backdrop-blur-md ${subjectColors.border} ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-slate-800/80 text-white'
                    : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-100'
                }`}
              >
                {/* Header Row of Term Card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-black tracking-tight text-amber-500 dark:text-amber-400">
                        {term.termHindi}
                      </h3>
                      {term.keyTag && (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-400/30 flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{term.keyTag}</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] font-bold text-slate-400 dark:text-slate-400">
                      English: <span className="italic">{term.termEnglish}</span>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyTerm(term)}
                    className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                      isCopied
                        ? 'bg-green-500 text-white border-green-600'
                        : isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                    title="परिभाषा कॉपी करें"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Chapter & Subject Tag Line */}
                <div className="mt-2 flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${subjectColors.badge}`}>
                    {subjectColors.icon} {term.subject === 'chemistry' ? 'रसायन' : term.subject === 'physics' ? 'भौतिकी' : 'जीव विज्ञान'}
                  </span>

                  {term.chapterNumber && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      अध्याय {term.chapterNumber}
                    </span>
                  )}
                </div>

                {/* Main Definition Text */}
                <div className="mt-2.5 text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-200 bg-slate-50/70 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                  {term.definitionHindi}
                </div>

                {/* Formula or Example Pill */}
                {term.exampleOrFormula && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-blue-700 dark:text-cyan-300 bg-blue-500/10 dark:bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-blue-400/20 dark:border-cyan-400/20">
                    <span className="text-xs">💡</span>
                    <span>सूत्र/उदाहरण: {term.exampleOrFormula}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
