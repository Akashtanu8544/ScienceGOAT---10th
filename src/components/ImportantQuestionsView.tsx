import React, { useState } from 'react';
import { ImportantQuestion } from '../types';
import { ArrowLeft, Star, CheckCircle } from 'lucide-react';

interface ImportantQuestionsViewProps {
  questions: ImportantQuestion[];
  onBack: () => void;
  isDarkMode: boolean;
}

export const ImportantQuestionsView: React.FC<ImportantQuestionsViewProps> = ({
  questions,
  onBack,
  isDarkMode,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const filteredQuestions = questions.filter((q) => {
    if (activeFilter === 'ALL') return true;
    return q.type === activeFilter;
  });

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
          <span className="text-xl">🔥</span> Imp Q&A (अति-महत्वपूर्ण प्रश्न)
        </h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'ALL', label: 'सभी महत्वपूर्ण' },
          { key: 'EQUATION', label: 'समीकरण व सूत्र' },
          { key: 'DIAGRAM', label: 'चित्र प्रश्न' },
          { key: 'SA', label: 'लघुउत्तरीय' },
          { key: 'LA', label: 'दीर्घउत्तरीय' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`shrink-0 px-3 py-1.5 rounded-2xl text-xs font-extrabold transition-all active:scale-95 ${
              activeFilter === tab.key
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q, idx) => (
          <div
            key={q.id}
            className={`p-4.5 rounded-3xl border shadow-sm space-y-3 backdrop-blur-md ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                प्रश्न #{idx + 1} • {q.marks} अंक
              </span>

              {q.repeatedYears && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>बोर्ड: {q.repeatedYears.join(', ')}</span>
                </div>
              )}
            </div>

            <div className={`text-xs sm:text-sm font-black leading-relaxed ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {q.question}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-1">
              <div className="font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> आदर्श उत्तर / हल:
              </div>
              <p className="whitespace-pre-line pt-0.5 font-medium">
                {q.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
