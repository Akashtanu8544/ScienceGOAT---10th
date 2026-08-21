import React, { useState, useEffect, useRef } from 'react';
import { Chapter, ChapterNotes } from '../types';
import { generateNotesPDF } from '../services/pdfGenerator';
import { StorageService } from '../services/db';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { NOTES_DATA } from '../data/notesData';
import {
  ArrowLeft,
  Search,
  X,
  FileText,
  BookOpen,
  Download,
  CheckCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Flame,
  Bookmark,
  Share2,
  CheckCircle2,
  Circle,
  Lightbulb,
  Zap,
  HelpCircle
} from 'lucide-react';

interface NotesViewerProps {
  chapters?: Chapter[];
  notesData?: Record<number, ChapterNotes>;
  initialChapterId?: number;
  onBack: () => void;
  onProgressUpdate: () => void;
  isDarkMode: boolean;
}

// Clean text helper to strip any internal citation tags e.g. [cite: 2]
const cleanText = (str: string) => {
  if (!str) return '';
  return str.replace(/\[cite:\s*\d+\]/g, '').trim();
};

export const NotesViewer: React.FC<NotesViewerProps> = ({
  chapters = CHAPTERS_DATA,
  notesData = NOTES_DATA,
  initialChapterId,
  onBack,
  onProgressUpdate,
  isDarkMode,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'biology' | 'physics'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Selected Chapter ID for displaying rich Code-Added Notes
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(initialChapterId || null);

  // Active Sub-Tab inside Chapter Notes Detail View ('all' | 'summary' | 'keyPoints' | 'formulas' | 'sections')
  const [activeTab, setActiveTab] = useState<'all' | 'summary' | 'keyPoints' | 'formulas' | 'sections'>('all');

  // Copy state for feedback
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Search within current active chapter notes
  const [chapterSearchQuery, setChapterSearchQuery] = useState('');

  // Chapter completion status state
  const [completedChapters, setCompletedChapters] = useState<number[]>(() => {
    return StorageService.getProgress().completedChapters || [];
  });

  // Handle initial chapter selection if passed or updated
  useEffect(() => {
    if (initialChapterId) {
      setSelectedChapterId(initialChapterId);
      const ch = chapters.find((c) => c.id === initialChapterId);
      if (ch) {
        setSubjectFilter(ch.subject);
      }
    }
  }, [initialChapterId, chapters]);

  // Sync completion status on mount/change
  useEffect(() => {
    const prog = StorageService.getProgress();
    setCompletedChapters(prog.completedChapters || []);
  }, [selectedChapterId]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(cleanText(text));
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleToggleComplete = (chapterId: number) => {
    const isCompleted = completedChapters.includes(chapterId);
    if (isCompleted) {
      StorageService.unmarkChapterComplete(chapterId);
    } else {
      StorageService.markChapterComplete(chapterId);
    }
    const updated = StorageService.getProgress().completedChapters || [];
    setCompletedChapters(updated);
    onProgressUpdate();
  };

  // Filtered chapters for chapter list view
  const filteredChapters = chapters.filter((ch) => {
    const matchesSubject = ch.subject === subjectFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      ch.titleHindi.includes(searchQuery) ||
      ch.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.includes(searchQuery);
    return matchesSubject && matchesSearch;
  });

  // Active Chapter Object & Notes Data
  const activeChapter = selectedChapterId ? chapters.find((c) => c.id === selectedChapterId) : null;
  const activeNotes = selectedChapterId ? notesData[selectedChapterId] : null;

  // Previous & Next Chapter IDs for navigation bar
  const currentChapterIndex = activeChapter ? chapters.findIndex((c) => c.id === activeChapter.id) : -1;
  const prevChapter = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex >= 0 && currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1] : null;

  // Render Full Interactive Code-Added Chapter Notes View
  if (activeChapter && activeNotes) {
    const isCompleted = completedChapters.includes(activeChapter.id);

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
            <ArrowLeft className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">सूची</span>
          </button>

          <div className="min-w-0 flex-1 text-center">
            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider block">
              अध्याय {activeChapter.chapterNumber} • {activeChapter.weightage} अंक
            </span>
            <h2
              className={`text-xs sm:text-sm font-black truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {activeChapter.titleHindi}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Mark Complete Toggle Button */}
            <button
              onClick={() => handleToggleComplete(activeChapter.id)}
              className={`p-2 px-2.5 rounded-xl border text-xs font-black transition-all flex items-center gap-1 active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40 dark:text-emerald-400'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
              title={isCompleted ? 'पूर्ण चिह्नित' : 'अपूर्ण चिह्नित करें'}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="hidden sm:inline">पूर्ण</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-slate-400" />
                  <span className="hidden sm:inline">अपूर्ण</span>
                </>
              )}
            </button>

            {/* Export / Download PDF Button */}
            <button
              onClick={() => generateNotesPDF(activeChapter, activeNotes)}
              className="p-2 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1 transition-transform active:scale-95"
              title="PDF फाइल सेव करें"
            >
              <Download className="w-4 h-4" />
              <span className="hidden xs:inline">PDF</span>
            </button>
          </div>
        </div>

        {/* Chapter Overview Hero Card */}
        <div
          className={`p-4 rounded-3xl border shadow-md relative overflow-hidden backdrop-blur-md ${
            isDarkMode
              ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900/90 border-indigo-500/30'
              : 'bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-white border-indigo-200/80'
          }`}
        >
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-3xl flex items-center justify-center shrink-0 shadow-inner">
              {activeChapter.icon3D || '📝'}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className={`text-base sm:text-lg font-black leading-tight ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                अध्याय {activeChapter.chapterNumber}: {activeChapter.titleHindi}
              </h1>

              <p className="text-xs text-indigo-500 dark:text-indigo-400 font-bold mt-0.5">
                {activeChapter.titleEnglish}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Quick Jump Filter Sub-Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-2xl border bg-slate-200/50 dark:bg-slate-900/60 border-slate-300/60 dark:border-slate-800 text-xs font-black">
          {[
            { id: 'all', label: 'सभी', icon: '📚' },
            { id: 'summary', label: 'सारांश', icon: '📌' },
            { id: 'keyPoints', label: 'मुख्य बिंदु', icon: '✨' },
            { id: 'formulas', label: 'सूत्र', icon: '🧮' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : isDarkMode
                  ? 'text-slate-300 hover:bg-slate-800/80'
                  : 'text-slate-700 hover:bg-white/80'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 1. SECTION: CHAPTER SUMMARY */}
        {(activeTab === 'all' || activeTab === 'summary') && activeNotes.summaryHindi && (
          <div
            className={`p-4 rounded-3xl border shadow-sm space-y-2.5 transition-all ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-amber-500 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>📌 अध्याय सारांश (Chapter Summary)</span>
              </h3>
              <button
                onClick={() => handleCopy(activeNotes.summaryHindi, 'summary')}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-500 text-[10px] font-bold flex items-center gap-1"
                title="सारांश कॉपी करें"
              >
                {copiedText === 'summary' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-500">कॉपी हुआ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>कॉपी</span>
                  </>
                )}
              </button>
            </div>

            <p className={`text-xs sm:text-sm leading-relaxed font-medium ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>
              {cleanText(activeNotes.summaryHindi)}
            </p>
          </div>
        )}

        {/* 2. SECTION: KEY POINTS */}
        {(activeTab === 'all' || activeTab === 'keyPoints') && activeNotes.keyPoints && activeNotes.keyPoints.length > 0 && (
          <div
            className={`p-4 rounded-3xl border shadow-sm space-y-3 ${
              isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black text-indigo-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>✨ मुख्य बोर्ड अवधारणाएं व बिंदु (Key Concepts)</span>
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
                {activeNotes.keyPoints.length} मुख्य बिंदु
              </span>
            </div>

            <div className="space-y-2.5">
              {activeNotes.keyPoints.map((point, index) => {
                const text = cleanText(point);
                const titlePart = text.split(':')[0];
                const descPart = text.includes(':') ? text.slice(text.indexOf(':') + 1) : null;

                return (
                  <div
                    key={index}
                    className={`p-3 rounded-2xl border flex items-start gap-2.5 transition-all ${
                      isDarkMode
                        ? 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-50 border-slate-200/80 hover:border-indigo-200'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>

                    <div className="flex-1 text-xs leading-relaxed font-medium">
                      {descPart ? (
                        <>
                          <strong className="font-extrabold text-indigo-600 dark:text-indigo-400 mr-1">
                            {titlePart}:
                          </strong>
                          <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                            {descPart}
                          </span>
                        </>
                      ) : (
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                          {text}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. SECTION: FORMULAS & CHEMICAL REACTIONS */}
        {(activeTab === 'all' || activeTab === 'formulas') && (
          <>
            {/* Formulas List */}
            {activeNotes.formulas && activeNotes.formulas.length > 0 && (
              <div
                className={`p-4 rounded-3xl border shadow-sm space-y-3 ${
                  isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-black text-purple-500 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" />
                    <span>🧮 महत्वपूर्ण सूत्र व रासायनिक समीकरण</span>
                  </h3>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-300">
                    {activeNotes.formulas.length} समीकरण
                  </span>
                </div>

                <div className="space-y-3">
                  {activeNotes.formulas.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border space-y-2 ${
                        isDarkMode
                          ? 'bg-slate-950/70 border-purple-500/20'
                          : 'bg-purple-50/40 border-purple-200/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                          <span>📌</span>
                          <span>{cleanText(item.name)}</span>
                        </h4>
                        <button
                          onClick={() => handleCopy(item.formula, `f_${idx}`)}
                          className="text-[10px] font-bold text-slate-500 hover:text-purple-600 flex items-center gap-1 p-1 rounded bg-slate-200/50 dark:bg-slate-800"
                        >
                          {copiedText === `f_${idx}` ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>सूत्र कॉपी</span>
                        </button>
                      </div>

                      {/* Formula Code Box */}
                      <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs sm:text-sm font-bold overflow-x-auto tracking-wide shadow-inner border border-slate-800">
                        {cleanText(item.formula)}
                      </div>

                      <p className={`text-[11px] font-medium leading-relaxed ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        <strong>व्याख्या:</strong> {cleanText(item.explanation)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reactions List if present */}
            {activeNotes.reactions && activeNotes.reactions.length > 0 && (
              <div
                className={`p-4 rounded-3xl border shadow-sm space-y-3 ${
                  isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h3 className="text-xs sm:text-sm font-black text-teal-500 flex items-center gap-1.5">
                  🧪 प्रमुख रासायनिक अभिक्रियाएं
                </h3>

                <div className="space-y-3">
                  {activeNotes.reactions.map((rx, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border space-y-2 ${
                        isDarkMode
                          ? 'bg-slate-950/70 border-teal-500/20'
                          : 'bg-teal-50/40 border-teal-200/80'
                      }`}
                    >
                      <h4 className="text-xs font-black text-teal-700 dark:text-teal-300">
                        {cleanText(rx.name)}
                      </h4>

                      <div className="p-2.5 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs sm:text-sm font-bold overflow-x-auto tracking-wide border border-slate-800">
                        {cleanText(rx.equation)}
                      </div>

                      <p className={`text-[11px] font-medium ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {cleanText(rx.note)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* 4. SECTION: DETAILED CHAPTER SECTIONS */}
        {(activeTab === 'all' || activeTab === 'sections') && activeNotes.sections && activeNotes.sections.length > 0 && (
          <div className="space-y-3.5">
            <h3 className="text-xs sm:text-sm font-black text-indigo-500 flex items-center gap-1.5 px-1">
              <BookOpen className="w-4 h-4" />
              <span>📖 विस्तृत अध्याय पाठ्य (Detailed Chapter Sections)</span>
            </h3>

            {activeNotes.sections.map((sec, secIdx) => (
              <div
                key={secIdx}
                className={`p-4 rounded-3xl border shadow-sm space-y-3 ${
                  isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <h4 className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400 border-b border-slate-200 dark:border-slate-800 pb-2">
                  {cleanText(sec.heading)}
                </h4>

                {sec.content && (
                  <p className={`text-xs leading-relaxed font-medium ${
                    isDarkMode ? 'text-slate-200' : 'text-slate-800'
                  }`}>
                    {cleanText(sec.content)}
                  </p>
                )}

                {/* Section Formula / Reaction Equation Box */}
                {(sec.formula || sec.reaction) && (
                  <div className="p-2.5 rounded-xl bg-slate-900 text-amber-400 font-mono text-xs font-bold overflow-x-auto border border-slate-800">
                    {cleanText(sec.formula || sec.reaction || '')}
                  </div>
                )}

                {/* Section Bullet Points */}
                {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                  <ul className="space-y-1.5">
                    {sec.bulletPoints.map((bp, bpIdx) => (
                      <li key={bpIdx} className="flex items-start gap-2 text-xs font-medium">
                        <span className="text-indigo-500 shrink-0 mt-0.5">•</span>
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                          {cleanText(bp)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Important Board Tip Banner */}
                {sec.importantTip && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 space-y-1">
                    <div className="flex items-center gap-1.5 font-black text-xs text-amber-600 dark:text-amber-400">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>🔥 महत्वपूर्ण बोर्ड परीक्षा टिप (Board Exam Tip)</span>
                    </div>
                    <p className="text-xs font-semibold leading-relaxed">
                      {cleanText(sec.importantTip)}
                    </p>
                  </div>
                )}

                {/* Diagram Guide Banner */}
                {sec.diagramTitle && (
                  <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-900 dark:text-cyan-200 space-y-1">
                    <div className="font-black text-xs text-cyan-600 dark:text-cyan-400">
                      🎨 नामांकित चित्र: {cleanText(sec.diagramTitle)}
                    </div>
                    {sec.diagramDescription && (
                      <p className="text-xs font-medium">
                        {cleanText(sec.diagramDescription)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
                <ChevronLeft className="w-4 h-4 shrink-0 text-indigo-500" />
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
                <ChevronRight className="w-4 h-4 shrink-0 text-indigo-500" />
              </button>
            ) : (
              <div className="flex-1" />
            )}
          </div>

          <button
            onClick={() => handleToggleComplete(activeChapter.id)}
            className={`w-full py-2.5 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
              isCompleted
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-600'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>यह अध्याय पूर्ण चिह्नित है</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>इस अध्याय को पूर्ण चिह्नित करें</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Render Chapter Selection List View (when no chapter is selected)
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
          <span className="text-xl">📝</span>
          <div className="min-w-0">
            <h2
              className={`text-sm sm:text-base font-black truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              NCERT अध्ययन नोट्स (Class 10 Notes)
            </h2>
            <p className="text-[10px] text-indigo-500 font-bold truncate">
              कक्षा 10 विज्ञान - हस्तलिखित एवं त्वरित रिविजन नोट्स
            </p>
          </div>
        </div>

        <div className="w-8 shrink-0" />
      </div>

      {/* Subject Filter Category Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: 'chemistry', label: 'रसायन शास्त्र', icon: '🧪' },
          { id: 'biology', label: 'जीव विज्ञान', icon: '🫀' },
          { id: 'physics', label: 'भौतिक शास्त्र', icon: '⚡' },
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

      {/* Search Input Bar */}
      <div className="relative">
        <Search
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="नोट्स में खोजें: अध्याय का नाम, विषय..."
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

      {/* Chapter Notes Cards List */}
      <div className="grid grid-cols-1 landscape:grid-cols-2 gap-2.5 space-y-0">
        {filteredChapters.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 font-bold">कोई नोट्स उपलब्ध नहीं हैं</div>
        ) : (
          filteredChapters.map((ch) => {
            const isCompleted = completedChapters.includes(ch.id);
            const notesObj = notesData[ch.id];

            return (
              <div
                key={ch.id}
                onClick={() => setSelectedChapterId(ch.id)}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between group shadow-sm backdrop-blur-md ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900'
                    : 'bg-white/90 border-slate-200 hover:border-indigo-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-2xl flex items-center justify-center shrink-0 shadow-inner">
                    {ch.icon3D || '📝'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400">
                        अध्याय {ch.chapterNumber} • {ch.weightage} अंक
                      </span>

                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-black">
                          <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>पूर्ण</span>
                        </span>
                      )}
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

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      generateNotesPDF(ch, notesObj);
                    }}
                    className={`p-2 rounded-xl border transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                    title="PDF डाउनलोड करें"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setSelectedChapterId(ch.id)}
                    className="p-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>पढ़ें</span>
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
