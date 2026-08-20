import React, { useState } from 'react';
import { PYQPaper } from '../types';
import { Download, ArrowLeft, Check, ChevronRight } from 'lucide-react';

interface PYQViewProps {
  papers: PYQPaper[];
  onBack: () => void;
  customPyqUrl?: string;
  isDarkMode: boolean;
}

export const PYQView: React.FC<PYQViewProps> = ({
  papers,
  onBack,
  isDarkMode,
}) => {
  const [selectedPaper, setSelectedPaper] = useState<PYQPaper | null>(null);
  const [downloadedPapers, setDownloadedPapers] = useState<Record<string, boolean>>({});

  const handleDownload = (e: React.MouseEvent, paperId: string) => {
    e.stopPropagation();
    setDownloadedPapers((prev) => ({ ...prev, [paperId]: true }));
  };

  /* LEVEL 1: PAST PAPERS LIST */
  if (!selectedPaper) {
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
            <span className="text-xl">📜</span> Board Past Papers
          </h2>
        </div>

        {/* Numbered Papers List */}
        <div className="space-y-2.5">
          {papers.map((paper, idx) => {
            const isDownloaded = downloadedPapers[paper.id];
            return (
              <div
                key={paper.id}
                onClick={() => setSelectedPaper(paper)}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between gap-3 shadow-sm backdrop-blur-md ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50'
                    : 'bg-white/90 border-slate-200 hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* 3D Scroll Badge */}
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-xl flex items-center justify-center shrink-0 shadow-inner">
                    📜
                  </div>

                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                      RBSE Year {paper.year} • {paper.totalMarks || 80} Marks
                    </div>
                    <h3 className={`text-xs sm:text-sm font-black truncate ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {paper.title}
                    </h3>
                  </div>
                </div>

                {/* Right Download / Open Icon */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDownload(e, paper.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      isDownloaded
                        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40'
                        : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800'
                    }`}
                    title={isDownloaded ? 'डाउनलोड पूरा हुआ' : 'पेपर डाउनलोड करें'}
                  >
                    {isDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* LEVEL 2: PAPER DETAIL SOLVED VIEWER */
  return (
    <div className="space-y-3.5 animate-fadeIn">
      <div className={`p-3.5 rounded-3xl border shadow-sm flex items-center justify-between gap-2 backdrop-blur-md ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setSelectedPaper(null)}
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
              {selectedPaper.title}
            </h2>
            <p className="text-[10px] text-emerald-600 font-bold">RBSE Solved Paper ({selectedPaper.year})</p>
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-3xl border shadow-md space-y-4 backdrop-blur-md ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-800'
      }`}>
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            वर्ष: {selectedPaper.year} • संपूर्ण बोर्ड उत्तर-पुस्तिका
          </span>
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-2">
            {selectedPaper.title}
          </h1>
        </div>

        {/* Paper Solved Questions */}
        <div className="space-y-3">
          {selectedPaper.questions && selectedPaper.questions.length > 0 ? (
            selectedPaper.questions.map((q, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="font-black text-slate-900 dark:text-white">प्रश्न {i + 1}: {q.question}</div>
                <div className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  उत्तर: {q.answer}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-center">
              इस पेपर का संपूर्ण बोर्ड हल उपलब्ध है।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
