import React, { useState, useEffect } from 'react';
import { PYQPaper } from '../types';
import { PYQ_PAPERS_DATA } from '../data/pyqData';
import { GitHubService } from '../services/githubService';
import { Download, ArrowLeft, Check, BookOpen, Sparkles, Filter, ChevronRight, GraduationCap, FileText, Clock } from 'lucide-react';
import { InAppPdfViewer } from './InAppPdfViewer';
import { ComingSoonModal } from './ComingSoonModal';
import { useLanguage } from '../utils/languageContext';

interface PYQViewProps {
  papers?: PYQPaper[];
  onBack: () => void;
  customPyqUrl?: string;
  isDarkMode: boolean;
}

export const PYQView: React.FC<PYQViewProps> = ({
  papers = PYQ_PAPERS_DATA,
  onBack,
  customPyqUrl,
  isDarkMode,
}) => {
  const { language, t } = useLanguage();
  const [activePapers, setActivePapers] = useState<PYQPaper[]>(papers);
  const [selectedPaper, setSelectedPaper] = useState<PYQPaper | null>(null);
  const [comingSoonPaper, setComingSoonPaper] = useState<PYQPaper | null>(null);
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');
  const [downloadedPapers, setDownloadedPapers] = useState<Record<string, boolean>>({});
  const [activePdf, setActivePdf] = useState<{ title: string; url: string } | null>(null);

  const isPaperAvailable = (paper: PYQPaper) => {
    return paper.isAvailable !== false && !!paper.pdfUrl && paper.pdfUrl.trim() !== '' && paper.pdfUrl !== 'COMING_SOON';
  };

  useEffect(() => {
    if (!customPyqUrl || !customPyqUrl.trim()) return;
    let isMounted = true;
    GitHubService.fetchCustomJson<PYQPaper[] | { papers: PYQPaper[] }>(customPyqUrl).then((res) => {
      if (!isMounted || !res) return;
      const list = Array.isArray(res) ? res : res.papers;
      if (Array.isArray(list) && list.length > 0) {
        setActivePapers(list);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [customPyqUrl]);

  const handleDownload = (e: React.MouseEvent, paper: PYQPaper) => {
    e.stopPropagation();
    if (!isPaperAvailable(paper)) {
      setComingSoonPaper(paper);
      return;
    }
    setDownloadedPapers((prev) => ({ ...prev, [paper.id]: true }));
  };

  const getEffectivePdfUrl = (paper: PYQPaper, type: 'paper' | 'solution' = 'paper') => {
    if (type === 'solution' && paper.solutionPdfUrl) {
      return paper.solutionPdfUrl;
    }
    if (language === 'en' && paper.pdfUrlEn) {
      return paper.pdfUrlEn;
    }
    return paper.pdfUrl;
  };

  const handleOpenPdf = (paper: PYQPaper, pdfType: 'paper' | 'solution' = 'paper') => {
    if (!isPaperAvailable(paper)) {
      setComingSoonPaper(paper);
      return;
    }
    const url = getEffectivePdfUrl(paper, pdfType);
    if (!url) {
      setComingSoonPaper(paper);
      return;
    }
    const paperTitle = language === 'en' ? paper.titleEnglish || paper.title : paper.title;
    const label =
      pdfType === 'solution'
        ? language === 'en' ? 'Solved Solution' : 'समाधान'
        : language === 'en' ? 'Question Paper' : 'प्रश्न पत्र';

    setActivePdf({
      title: `${paper.board} ${paper.year} - ${paperTitle} (${label})`,
      url: url,
    });
  };

  const filteredPapers = activePapers.filter((paper) => {
    if (selectedYearFilter === 'ALL') return true;
    if (selectedYearFilter === '2026') return paper.year === 2026;
    if (selectedYearFilter === '2025') return paper.year === 2025;
    if (selectedYearFilter === '2024') return paper.year === 2024;
    if (selectedYearFilter === '2023') return paper.year === 2023;
    if (selectedYearFilter === '2022') return paper.year === 2022;
    if (selectedYearFilter === 'PREV') return paper.year < 2022;
    return true;
  });

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
      <div className="space-y-3.5 animate-fadeIn pb-8">
        {/* Centered Header Bar */}
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
            title={language === 'hi' ? 'वापस जाएँ' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2
            className={`text-xs sm:text-base font-black flex items-center gap-2 text-center truncate ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            <GraduationCap className="w-5 h-5 text-emerald-500 shrink-0 stroke-[2.2]" />
            <span>{t('pyqTitle', 'बोर्ड पिछले वर्ष के प्रश्न-पत्र (PYQs)')}</span>
          </h2>
          <div className="w-9" />
        </div>

        {/* Year Filter Quick Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs custom-scrollbar">
          {[
            { id: 'ALL', labelHi: 'सभी प्रश्न पत्र', labelEn: 'All Papers' },
            { id: '2026', labelHi: '2026 मॉडल', labelEn: '2026 Model' },
            { id: '2025', labelHi: '2025 बोर्ड', labelEn: '2025 Board' },
            { id: '2024', labelHi: '2024 बोर्ड', labelEn: '2024 Board' },
            { id: '2023', labelHi: '2023 बोर्ड', labelEn: '2023 Board' },
            { id: '2022', labelHi: '2022 बोर्ड', labelEn: '2022 Board' },
            { id: 'PREV', labelHi: '2020-2018', labelEn: '2020-2018' },
          ].map((yf) => (
            <button
              key={yf.id}
              onClick={() => setSelectedYearFilter(yf.id)}
              className={`px-3 py-1.5 rounded-xl border font-bold whitespace-nowrap transition-all active:scale-95 ${
                selectedYearFilter === yf.id
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {language === 'hi' ? yf.labelHi : yf.labelEn}
            </button>
          ))}
        </div>

        {/* Numbered Papers List */}
        <div className="space-y-2.5">
          {filteredPapers.map((paper) => {
            const isDownloaded = downloadedPapers[paper.id];
            const isAvailable = isPaperAvailable(paper);
            const displayTitle = language === 'en' ? paper.titleEnglish || paper.title : paper.title;

            return (
              <div
                key={paper.id}
                onClick={() => {
                  if (!isAvailable) {
                    setComingSoonPaper(paper);
                  } else {
                    setSelectedPaper(paper);
                  }
                }}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between gap-3 ${
                  isDarkMode
                    ? 'card-3d-dark hover:border-emerald-500/50'
                    : 'card-3d-light hover:border-emerald-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Vector Icon Badge */}
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    {!isAvailable ? (
                      <Clock className="w-5 h-5 text-emerald-500 animate-pulse stroke-[2.2]" />
                    ) : (
                      <FileText className="w-5 h-5 text-emerald-500 stroke-[2.2]" />
                    )}
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                        RBSE {language === 'hi' ? `वर्ष ${paper.year}` : `Year ${paper.year}`}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                        {paper.totalMarks || 80} {language === 'hi' ? 'अंक' : 'Marks'}
                      </span>
                      {!isAvailable && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black border border-emerald-500/30 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 animate-pulse" />
                          <span>{language === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon'}</span>
                        </span>
                      )}
                      {isAvailable && paper.year === 2026 && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 text-[9px] font-black">
                          NEW
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-xs sm:text-sm font-black truncate ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {displayTitle}
                    </h3>
                  </div>
                </div>

                {/* Right Action Buttons: PDF Open & Download */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isAvailable) {
                        setComingSoonPaper(paper);
                      } else {
                        handleOpenPdf(paper, 'paper');
                      }
                    }}
                    className={`p-2 px-3 rounded-xl font-black text-xs shadow-sm flex items-center gap-1 transition-transform active:scale-95 ${
                      !isAvailable
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
                    }`}
                    title={!isAvailable ? (language === 'hi' ? 'जल्द आ रहा है - प्रतीक्षा करें' : 'Coming Soon') : (language === 'hi' ? 'बोर्ड पेपर PDF खोलें' : 'Open Board PDF')}
                  >
                    {!isAvailable ? <Clock className="w-3.5 h-3.5 animate-pulse" /> : <BookOpen className="w-3.5 h-3.5" />}
                    <span className="hidden xs:inline">
                      {!isAvailable ? (language === 'hi' ? 'प्रतीक्षा करें' : 'Wait') : 'PDF'}
                    </span>
                  </button>

                  <button
                    onClick={(e) => handleDownload(e, paper)}
                    className={`p-2 rounded-xl transition-all border active:scale-95 ${
                      isDownloaded
                        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                        : isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                    title={
                      isDownloaded
                        ? language === 'hi' ? 'डाउनलोड पूरा हुआ' : 'Downloaded'
                        : language === 'hi' ? 'पेपर डाउनलोड करें' : 'Download Paper'
                    }
                  >
                    {isDownloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coming Soon Modal */}
        <ComingSoonModal
          isOpen={!!comingSoonPaper}
          onClose={() => setComingSoonPaper(null)}
          title={comingSoonPaper ? (language === 'en' ? comingSoonPaper.titleEnglish || comingSoonPaper.title : comingSoonPaper.title) : ''}
          type="pyq"
          chapterName={comingSoonPaper ? `RBSE बोर्ड परीक्षा वर्ष ${comingSoonPaper.year}` : ''}
          subtitle={comingSoonPaper?.comingSoonMessage || 'यह बोर्ड प्रश्न-पत्र एवं आधिकारिक समाधान अभी उपलब्ध नहीं कराया गया है। कृपया प्रतीक्षा करें, यह शीघ्र उपलब्ध होगा।'}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  }

  /* LEVEL 2: PAPER DETAIL SOLVED VIEWER */
  const paperTitle = language === 'en' ? selectedPaper.titleEnglish || selectedPaper.title : selectedPaper.title;
  const isSelectedAvailable = isPaperAvailable(selectedPaper);

  return (
    <div className="space-y-3.5 animate-fadeIn pb-8">
      {/* Top Header */}
      <div
        className={`p-3.5 rounded-3xl border flex items-center justify-between gap-2 transition-all ${
          isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setSelectedPaper(null)}
            className={`p-2 rounded-2xl border text-xs font-bold transition-all flex items-center active:scale-95 ${
              isDarkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-black truncate">
              {paperTitle}
            </h2>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              {selectedPaper.board} • {selectedPaper.year} ({selectedPaper.totalMarks || 80} {language === 'hi' ? 'अंक' : 'Marks'})
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (!isSelectedAvailable) {
              setComingSoonPaper(selectedPaper);
            } else {
              handleOpenPdf(selectedPaper, 'paper');
            }
          }}
          className={`px-3 py-1.5 rounded-xl font-black text-xs shadow-sm flex items-center gap-1 active:scale-95 transition-all shrink-0 ${
            !isSelectedAvailable
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
          }`}
        >
          {!isSelectedAvailable ? <Clock className="w-3.5 h-3.5 animate-pulse" /> : <BookOpen className="w-3.5 h-3.5" />}
          <span>{!isSelectedAvailable ? (language === 'hi' ? 'प्रतीक्षा करें' : 'Please Wait') : (language === 'hi' ? 'PDF खोलें' : 'Open PDF')}</span>
        </button>
      </div>

      {/* Sections Breakdown & Sample Questions */}
      <div className="space-y-3">
        {selectedPaper.sections && selectedPaper.sections.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {selectedPaper.sections.map((sec, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center ${
                  isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">
                  {sec.name}
                </span>
                <span className="text-xs font-black block mt-0.5">{sec.questionCount} {language === 'hi' ? 'प्रश्न' : 'Questions'}</span>
                <span className="text-[10px] text-slate-400">{sec.marksPerQuestion} {language === 'hi' ? 'अंक/प्रश्न' : 'Marks each'}</span>
              </div>
            ))}
          </div>
        )}

        {/* Paper Questions List */}
        {selectedPaper.sampleQuestions && selectedPaper.sampleQuestions.length > 0 ? (
          <div className="space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
              {language === 'hi' ? 'हल सहित मुख्य बोर्ड प्रश्न:' : 'Solved Board Questions:'}
            </h3>
            {selectedPaper.sampleQuestions.map((q, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-3xl border space-y-2 transition-all ${
                  isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black text-[10px]">
                    {language === 'hi' ? `प्रश्न ${idx + 1}` : `Q${idx + 1}`} • {q.marks} {language === 'hi' ? 'अंक' : 'Marks'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{q.type}</span>
                </div>

                <p className="text-xs sm:text-sm font-bold leading-relaxed">
                  {language === 'en' && q.questionEnglish ? q.questionEnglish : q.question}
                </p>

                {q.answer && (
                  <div className={`p-3 rounded-2xl border text-xs leading-relaxed ${isDarkMode ? 'bg-slate-950/80 border-slate-800 text-slate-200' : 'bg-emerald-50/60 border-emerald-200 text-slate-800'}`}>
                    <span className="font-black text-emerald-600 dark:text-emerald-400 block mb-1">
                      {language === 'hi' ? 'आदर्श उत्तर (Model Solution):' : 'Model Solution:'}
                    </span>
                    <p className="whitespace-pre-line">
                      {language === 'en' && q.answerEnglish ? q.answerEnglish : q.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-400">
            {language === 'hi' ? 'पूरा प्रश्न-पत्र देखने के लिए ऊपर "PDF खोलें" पर क्लिक करें।' : 'Click "Open PDF" above to view the full question paper with marking scheme.'}
          </div>
        )}
      </div>

      {/* Level 2 Coming Soon Modal */}
      <ComingSoonModal
        isOpen={!!comingSoonPaper}
        onClose={() => setComingSoonPaper(null)}
        title={comingSoonPaper ? (language === 'en' ? comingSoonPaper.titleEnglish || comingSoonPaper.title : comingSoonPaper.title) : ''}
        type="pyq"
        chapterName={comingSoonPaper ? `RBSE बोर्ड परीक्षा वर्ष ${comingSoonPaper.year}` : ''}
        subtitle={comingSoonPaper?.comingSoonMessage || 'यह बोर्ड प्रश्न-पत्र एवं आधिकारिक समाधान अभी उपलब्ध नहीं कराया गया है। कृपया प्रतीक्षा करें, यह शीघ्र उपलब्ध होगा।'}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
