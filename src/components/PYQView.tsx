import React, { useState } from 'react';
import { PYQPaper } from '../types';
import { PYQ_PAPERS_DATA } from '../data/pyqData';
import { Download, ArrowLeft, Check, BookOpen, FileText, Sparkles } from 'lucide-react';
import { InAppPdfViewer } from './InAppPdfViewer';

interface PYQViewProps {
  papers?: PYQPaper[];
  onBack: () => void;
  customPyqUrl?: string;
  isDarkMode: boolean;
}

export const PYQView: React.FC<PYQViewProps> = ({
  papers = PYQ_PAPERS_DATA,
  onBack,
  isDarkMode,
}) => {
  const [selectedPaper, setSelectedPaper] = useState<PYQPaper | null>(null);
  const [downloadedPapers, setDownloadedPapers] = useState<Record<string, boolean>>({});
  const [activePdf, setActivePdf] = useState<{ title: string; url: string } | null>(null);

  const handleDownload = (e: React.MouseEvent, paperId: string) => {
    e.stopPropagation();
    setDownloadedPapers((prev) => ({ ...prev, [paperId]: true }));
  };

  const handleOpenPdf = (paper: PYQPaper, pdfType: 'paper' | 'solution' = 'paper') => {
    const url = pdfType === 'solution' && paper.solutionPdfUrl ? paper.solutionPdfUrl : paper.pdfUrl;
    const label = pdfType === 'solution' ? 'समाधान' : 'प्रश्न पत्र';
    setActivePdf({
      title: `${paper.board} ${paper.year} - ${paper.title} (${label})`,
      url: url,
    });
  };

  // Render Full Screen InAppPdfViewer if activePdf is set
  if (activePdf) {
    return (
      <InAppPdfViewer
        title={activePdf.title}
        pdfUrl={activePdf.url}
        onClose={() => setActivePdf(null)}
        isDarkMode={isDarkMode}
      />
    );
  }

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
          {papers.map((paper) => {
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

                  <div className="min-w-0 space-y-0.5">
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

                {/* Right Action Buttons: PDF Open & Download */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenPdf(paper, 'paper');
                    }}
                    className="p-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] shadow-sm flex items-center gap-1 transition-transform active:scale-95"
                    title="बोर्ड पेपर PDF खोलें"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">PDF देखें</span>
                  </button>

                  <button
                    onClick={(e) => handleDownload(e, paper.id)}
                    className={`p-2 rounded-xl transition-colors border ${
                      isDownloaded
                        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                        : isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                    title={isDownloaded ? 'डाउनलोड पूरा हुआ' : 'पेपर डाउनलोड करें'}
                  >
                    {isDownloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
                  </button>
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

        {/* Header Direct PDF Reader Button */}
        <button
          onClick={() => handleOpenPdf(selectedPaper, 'paper')}
          className="p-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
        >
          <BookOpen className="w-4 h-4" />
          <span>PDF खोलें</span>
        </button>
      </div>

      <div className={`p-5 rounded-3xl border shadow-md space-y-4 backdrop-blur-md ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-200' : 'bg-white/90 border-slate-200 text-slate-800'
      }`}>
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-[11px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              वर्ष: {selectedPaper.year} • संपूर्ण बोर्ड उत्तर-पुस्तिका
            </span>

            {/* Direct Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenPdf(selectedPaper, 'paper')}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow flex items-center gap-1.5 active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>प्रश्न-पत्र PDF</span>
              </button>
              {selectedPaper.solutionPdfUrl && (
                <button
                  onClick={() => handleOpenPdf(selectedPaper, 'solution')}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow flex items-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>हल PDF</span>
                </button>
              )}
            </div>
          </div>

          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-2">
            {selectedPaper.title}
          </h1>
        </div>

        {/* Paper Solved Questions */}
        <div className="space-y-3">
          {selectedPaper.sections && selectedPaper.sections.length > 0 ? (
            selectedPaper.sections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-2">
                <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 border-b pb-1 border-slate-100 dark:border-slate-800">
                  {sec.sectionName} ({sec.questionsCount} प्रश्न, {sec.marksPerQuestion} अंक प्रति प्रश्न)
                </div>
                {sec.sampleQuestions.map((sq, sqIdx) => (
                  <div key={sqIdx} className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="font-black text-slate-900 dark:text-white">प्रश्न: {sq}</div>
                    <div className="font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      उत्तर: बोर्ड परीक्षा उत्तर-पुस्तिका के अनुसार उत्तर उपलब्ध है। पूरी व्याख्या के लिए PDF खोलें।
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-center">
              इस बोर्ड प्रश्न-पत्र का संपूर्ण हल PDF रीडर में उपलब्ध है।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
