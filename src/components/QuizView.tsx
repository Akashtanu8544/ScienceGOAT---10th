import React, { useState, useEffect } from 'react';
import { Chapter, MockExam, QuizQuestion, UserProgress } from '../types';
import { AdMobRewardedModal } from './AdMobRewardedModal';
import { StorageService } from '../services/db';
import { GitHubService } from '../services/githubService';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { QUIZ_QUESTIONS_DATA, MOCK_EXAMS_DATA } from '../data/quizData';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  X,
  Check,
  Sparkles,
  RefreshCw,
  Trophy,
  ChevronRight,
  Play,
  Search,
  CheckSquare,
  FlaskConical,
  Dna,
  Zap
} from 'lucide-react';

interface QuizViewProps {
  chapters?: Chapter[];
  questionsData?: QuizQuestion[];
  mockExamsData?: MockExam[];
  progress: UserProgress;
  onBack: () => void;
  onProgressUpdate: () => void;
  customQuizUrl?: string;
  isDarkMode: boolean;
}

export const QuizView: React.FC<QuizViewProps> = ({
  chapters = CHAPTERS_DATA,
  questionsData = QUIZ_QUESTIONS_DATA,
  mockExamsData = MOCK_EXAMS_DATA,
  progress,
  onBack,
  onProgressUpdate,
  customQuizUrl,
  isDarkMode,
}) => {
  // Navigation level state: 'CHAPTER_LIST' -> 'TOPICS_LIST' -> 'QUIZ_TEST'
  const [viewLevel, setViewLevel] = useState<'CHAPTER_LIST' | 'TOPICS_LIST' | 'QUIZ_TEST'>('CHAPTER_LIST');

  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);
  const [activeExam, setActiveExam] = useState<MockExam | null>(null);
  const [pendingAdExam, setPendingAdExam] = useState<MockExam | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'biology' | 'physics'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeQuestionsData, setActiveQuestionsData] = useState<QuizQuestion[]>(questionsData);

  // Fetch custom quiz questions from GitHub URL if provided
  useEffect(() => {
    if (!customQuizUrl || !customQuizUrl.trim()) return;
    let isMounted = true;
    GitHubService.fetchCustomJson<QuizQuestion[] | { questions: QuizQuestion[] }>(customQuizUrl).then((res) => {
      if (!isMounted || !res) return;
      const customList = Array.isArray(res) ? res : res.questions;
      if (Array.isArray(customList) && customList.length > 0) {
        setActiveQuestionsData(customList);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [customQuizUrl]);

  // Active Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Timer State (e.g. 15 minutes)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(900);

  const filteredChapters = (chapters || []).filter((ch) => {
    const matchesSubject = ch.subject === subjectFilter;
    const matchesSearch = searchQuery.trim() === '' ||
      ch.titleHindi.includes(searchQuery) ||
      ch.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.description.includes(searchQuery);
    return matchesSubject && matchesSearch;
  });

  useEffect(() => {
    if (viewLevel !== 'QUIZ_TEST' || isQuizSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [viewLevel, isQuizSubmitted]);

  const selectedChapter = (chapters || []).find((c) => c.id === selectedChapterId) || chapters?.[0] || { id: 1, titleHindi: 'रसायन शास्त्र', subject: 'chemistry' as const };

  // Mock exams / dynamic exams for current chapter
  const chapterQuestions = (activeQuestionsData || []).filter((q) => q?.chapterId === selectedChapter.id);

  // Generate dynamic test sets so ALL chapter questions are accessible
  const generateExamsForChapter = (): MockExam[] => {
    if (chapterQuestions.length === 0) {
      return [
        {
          id: `ch-${selectedChapter.id}-exam-1`,
          title: `अभ्यास टेस्ट 1 (15 प्रश्न)`,
          unit: 'unit' in selectedChapter ? selectedChapter.unit : '',
          chapterIds: [selectedChapter.id],
          totalQuestions: 0,
          durationMinutes: 15,
          rewardedAdRequired: false,
          questions: [],
        }
      ];
    }

    const exams: MockExam[] = [];

    // Chunked Practice Sets of 15-20 questions each (Practice tests ONLY)
    const CHUNK_SIZE = 15;
    const totalChunks = Math.max(1, Math.ceil(chapterQuestions.length / CHUNK_SIZE));

    for (let i = 0; i < totalChunks; i++) {
      const startIdx = i * CHUNK_SIZE;
      const chunkQuestions = chapterQuestions.slice(startIdx, startIdx + CHUNK_SIZE);

      exams.push({
        id: `ch-${selectedChapter.id}-set-${i + 1}`,
        title: `अभ्यास टेस्ट ${i + 1} (${chunkQuestions.length} वस्तुनिष्ठ प्रश्न)`,
        unit: 'unit' in selectedChapter ? selectedChapter.unit : '',
        chapterIds: [selectedChapter.id],
        totalQuestions: chunkQuestions.length,
        durationMinutes: 15,
        rewardedAdRequired: false,
        questions: chunkQuestions,
      });
    }

    return exams;
  };

  const defaultExams = generateExamsForChapter();

  const handleStartExamClick = (exam: MockExam) => {
    startExamNow(exam);
  };

  const startExamNow = (exam: MockExam) => {
    setActiveExam(exam);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setScore(0);
    setSecondsRemaining(exam.durationMinutes ? exam.durationMinutes * 60 : 900);
    setViewLevel('QUIZ_TEST');
  };

  const handleAdCompleted = () => {
    if (pendingAdExam) {
      StorageService.unlockMockExam(pendingAdExam.id);
      startExamNow(pendingAdExam);
      setPendingAdExam(null);
      onProgressUpdate();
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isQuizSubmitted) return;
    setUserAnswers({ ...userAnswers, [currentQuestionIndex]: optionIndex });
  };

  const handleSubmitQuiz = () => {
    if (!activeExam) return;
    let totalScore = 0;
    activeExam.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        totalScore += 1;
      }
    });
    setScore(totalScore);
    setIsQuizSubmitted(true);

    StorageService.recordQuizScore(activeExam.id, totalScore, activeExam.questions.length);
    onProgressUpdate();

    if (totalScore / (activeExam.questions.length || 1) >= 0.7) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  /* LEVEL 1: CHAPTER SELECTION LIST */
  if (viewLevel === 'CHAPTER_LIST') {
    return (
      <div className="space-y-3.5 animate-fadeIn bg-grid-science p-1 rounded-3xl">
        {/* Centered Header Bar */}
        <div className={`relative flex items-center justify-between p-3.5 rounded-3xl border transition-all ${
          isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
        }`}>
          <button
            onClick={onBack}
            className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center active:scale-95 ${
              isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="वापस जाएँ"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className={`text-sm sm:text-base font-black flex items-center gap-2 text-center truncate ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <CheckSquare className="w-5 h-5 text-purple-500 shrink-0 stroke-[2.2]" />
            <span>अभ्यास क्विज़ (MCQs)</span>
          </h2>
          <div className="w-9" />
        </div>

        {/* Subject Filter Category Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'chemistry', label: 'रसायन विज्ञान', icon: FlaskConical },
            { id: 'biology', label: 'जीव विज्ञान', icon: Dna },
            { id: 'physics', label: 'भौतिक विज्ञान', icon: Zap },
          ].map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSubjectFilter(tab.id as any)}
                className={`py-2 px-2 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                  subjectFilter === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                    : isDarkMode
                    ? 'card-3d-dark text-slate-300 hover:text-white'
                    : 'card-3d-light text-slate-700 hover:text-purple-600'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Page Inline Search Bar */}
        <div className="relative">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-purple-400' : 'text-purple-600'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="क्विज़ में खोजें: अध्याय नाम, विषय..."
            className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-bold transition-all shadow-sm focus:outline-none ${
              isDarkMode
                ? 'bg-slate-900/90 text-slate-100 placeholder-slate-400 border border-slate-700/80 focus:border-purple-400'
                : 'bg-white text-slate-900 placeholder-slate-400 border border-slate-200 focus:border-purple-600'
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
              const chQCount = (questionsData || []).filter((q) => q?.chapterId === ch.id).length;
              const hasScore = progress?.quizScores?.[`ch-${ch.id}-exam-1`]?.score !== undefined;
              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    setSelectedChapterId(ch.id);
                    setViewLevel('TOPICS_LIST');
                  }}
                  className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between group ${
                    isDarkMode
                      ? 'card-3d-dark hover:border-purple-500/50'
                      : 'card-3d-light hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                      {ch.subject === 'chemistry' ? (
                        <FlaskConical className="w-5 h-5 text-sky-500 stroke-[2.2]" />
                      ) : ch.subject === 'biology' ? (
                        <Dna className="w-5 h-5 text-emerald-500 stroke-[2.2]" />
                      ) : (
                        <Zap className="w-5 h-5 text-purple-500 stroke-[2.2]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">
                          अध्याय {ch.chapterNumber} • {ch.weightage} अंक
                        </span>
                        {chQCount > 0 && (
                          <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                            {chQCount} MCQs
                          </span>
                        )}
                        {hasScore && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            ✓ टेस्ट दिया
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

                  <div className="flex items-center gap-1 text-xs font-black text-purple-600 dark:text-purple-400 shrink-0">
                    <span>टेस्ट</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  /* LEVEL 2: CHAPTER MOCK TESTS LIST (Matching Image 4 Layout) */
  if (viewLevel === 'TOPICS_LIST') {
    return (
      <div className="space-y-4 bg-grid-science p-1 rounded-3xl animate-fadeIn">
        {/* Top Header Card */}
        <div className={`p-4 rounded-3xl border space-y-3 transition-all ${
          isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
        }`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewLevel('CHAPTER_LIST')}
              className={`p-2 px-3 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" /> अध्याय सूची
            </button>

            <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              {defaultExams.length} अभ्यास टेस्ट उपलब्ध
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              {selectedChapter.subject === 'chemistry' ? (
                <FlaskConical className="w-6 h-6 text-sky-500 stroke-[2.2]" />
              ) : selectedChapter.subject === 'biology' ? (
                <Dna className="w-6 h-6 text-emerald-500 stroke-[2.2]" />
              ) : (
                <Zap className="w-6 h-6 text-purple-500 stroke-[2.2]" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">
                {'chapterNumber' in selectedChapter ? `अध्याय ${selectedChapter.chapterNumber} • ` : ''}{'weightage' in selectedChapter ? `${selectedChapter.weightage} अंक` : ''}
              </span>
              <h2 className={`text-sm sm:text-base font-black truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {'chapterNumber' in selectedChapter ? `अध्याय ${selectedChapter.chapterNumber}: ` : ''}{selectedChapter.titleHindi}
              </h2>
              <p className={`text-[11px] font-bold ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {'titleEnglish' in selectedChapter ? selectedChapter.titleEnglish : 'Class 10 Science Practice MCQs'}
              </p>
            </div>
          </div>

          {/* Study Progress Bar */}
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>अभ्यास टेस्ट प्रगति</span>
              <span className="text-purple-600 dark:text-purple-400 font-black">
                {Object.keys(progress?.quizScores || {}).filter((k) => k.startsWith(`ch-${selectedChapter.id}`)).length}/{defaultExams.length} पूर्ण
              </span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(10, (Object.keys(progress?.quizScores || {}).filter((k) => k.startsWith(`ch-${selectedChapter.id}`)).length / Math.max(1, defaultExams.length)) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>

        {/* Exams List - Icon-Only Start and Retake Buttons without Text */}
        <div className="space-y-2.5">
          {defaultExams.map((exam, idx) => {
            const hasCompleted = !!progress?.quizScores?.[exam.id];

            return (
              <div
                key={exam.id}
                className={`p-3.5 rounded-3xl border flex items-center justify-between gap-2 transition-all ${
                  isDarkMode ? 'card-3d-dark' : 'card-3d-light'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {hasCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-black flex items-center justify-center text-xs shrink-0">
                      {idx + 1}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {hasCompleted ? (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-[9px] border border-emerald-500/20">
                          पूर्ण (Done)
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-black text-[9px] border border-amber-500/20">
                          अभ्यास (Practice)
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-400">
                        {exam.totalQuestions} प्रश्न • 15 मिनट
                      </span>
                    </div>
                    <h4 className={`text-xs font-black truncate mt-0.5 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {exam.title}
                    </h4>
                  </div>
                </div>

                {/* Icon Only Action Button: Play for Start, RefreshCw for Retake - NO TEXT */}
                <button
                  type="button"
                  onClick={() => handleStartExamClick(exam)}
                  title={hasCompleted ? 'पुनः टेस्ट दें (Retake Test)' : 'टेस्ट शुरू करें (Start Test)'}
                  aria-label={hasCompleted ? 'Retake Test' : 'Start Test'}
                  className={`w-10 h-10 rounded-2xl shadow-sm flex items-center justify-center shrink-0 transition-all active:scale-90 hover:scale-105 ${
                    hasCompleted
                      ? 'bg-slate-900 text-slate-100 dark:bg-slate-800 dark:text-slate-200 border border-slate-700 hover:bg-slate-800'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-500/25'
                  }`}
                >
                  {hasCompleted ? (
                    <RefreshCw className="w-4 h-4 stroke-[2.2]" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* LEVEL 3: LIVE MCQ QUIZ SCREEN (Matching Image 7 Layout) */
  const questionsList = activeExam?.questions || [];
  const rawQ = questionsList[currentQuestionIndex];
  const currentQ = rawQ || {
    question: 'आवर्त में बाएँ से दाएँ जाने पर संयोजक इलेक्ट्रॉनों की संख्या मुख्य समूह तत्वों के लिए सामान्यतः कैसे बदलती है?',
    options: ['8 से 1 तक घटती है', '1 से 8 तक क्रमशः बढ़ती है', 'सदैव 2 रहती है', 'कोई नियमितता नहीं होती'],
    correctAnswer: 1,
    explanation: 'मुख्य समूह तत्वों में किसी आवर्त में बाएँ से दाएँ जाने पर बाह्यतम कोश के इलेक्ट्रॉनों की संख्या सामान्यतः 1 से 8 तक बढ़ती है।',
  };

  const displayQuestion = currentQ.question || (currentQ as any).questionHindi || 'प्रश्न अनुपलब्ध है';
  const displayOptions = currentQ.options || (currentQ as any).optionsHindi || [];
  const displayExplanation = currentQ.explanation || (currentQ as any).explanationHindi || 'उपरोक्त प्रश्न में मुख्य सिद्धांतों के अनुसार सही उत्तर का चयन किया गया है।';

  const selectedAnswer = userAnswers[currentQuestionIndex];
  const hasAnsweredCurrent = selectedAnswer !== undefined;

  return (
    <div className="space-y-4 bg-grid-science p-1 rounded-3xl animate-fadeIn">
      {/* Top Bar with Clear Chapter Name */}
      <div className={`p-3.5 rounded-2xl border shadow-sm flex items-center justify-between gap-2 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        {/* Left Close Button */}
        <button
          onClick={() => setViewLevel('TOPICS_LIST')}
          className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors"
          title="बंद करें"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Middle Question Counter & Progress Bar with Full Chapter Name */}
        <div className="flex-1 mx-2 space-y-1 min-w-0">
          <div className="flex items-center justify-between gap-2 text-xs font-black">
            <span className={`truncate font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {'chapterNumber' in selectedChapter ? `अध्याय ${selectedChapter.chapterNumber}: ` : ''}{selectedChapter.titleHindi}
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-extrabold shrink-0">
              Q {currentQuestionIndex + 1}/{questionsList.length || 1}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / (questionsList.length || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Right Timer Badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 text-xs font-bold shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(secondsRemaining)}</span>
        </div>
      </div>

      {/* Question Card (Matching Image 7 Question Card) */}
      <div className={`p-5 rounded-3xl border shadow-md space-y-4 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className={`text-sm sm:text-base font-black leading-relaxed ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {displayQuestion}
        </h3>
      </div>

      {/* 4 Option Buttons (Matching Image 7 Cards) */}
      <div className="space-y-2.5">
        {displayOptions.map((opt, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = idx === currentQ.correctAnswer;

          let btnStyles = isDarkMode
            ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
            : 'bg-white border-slate-200/90 text-slate-800 hover:border-blue-300';
          let icon = null;

          if (hasAnsweredCurrent) {
            if (isCorrect) {
              // Correct Option -> Green Card
              btnStyles = 'bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-extrabold';
              icon = (
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              );
            } else if (isSelected) {
              // Incorrect Selected Option -> Red Card
              btnStyles = 'bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-500 text-rose-900 dark:text-rose-200 font-extrabold';
              icon = (
                <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <X className="w-4 h-4 stroke-[3]" />
                </div>
              );
            }
          }

          if (!icon) {
            icon = (
              <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shrink-0" />
            );
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3 text-xs sm:text-sm font-bold shadow-sm active:scale-[0.99] ${btnStyles}`}
            >
              {icon}
              <span className="flex-1 leading-snug">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Explanation Box (Matching Image 7 Card) */}
      {hasAnsweredCurrent && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-1.5 animate-fadeIn">
          <div className="flex items-center gap-1.5 font-black text-amber-700 dark:text-amber-300 text-xs">
            <Sparkles className="w-4 h-4" />
            <span>व्याख्या (Explanation)</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {displayExplanation}
          </p>
        </div>
      )}

      {/* Floating Bottom Action Button (Matching Image 7 Bottom Pill Button) */}
      <div className="pt-2 flex justify-center">
        {currentQuestionIndex < questionsList.length - 1 ? (
          <button
            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
            className="w-full max-w-xs py-3.5 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>अगला प्रश्न</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            className="w-full max-w-xs py-3.5 px-6 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <span>सबमिट करें व परिणाम देखें</span>
            <Trophy className="w-4 h-4 text-amber-300" />
          </button>
        )}
      </div>

      {/* Quiz Submission Result Modal overlay */}
      {isQuizSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl text-center space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center shadow">
              <Trophy className="w-8 h-8 text-amber-500 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-black">टेस्ट परिणाम (Quiz Complete)</h3>
            <p className="text-sm font-bold">
              आपका स्कोर: <span className="text-emerald-600 font-black text-lg">{score}</span> / {questionsList.length}
            </p>
            <p className="text-xs text-slate-500">
              {score / (questionsList.length || 1) >= 0.7
                ? 'शानदार प्रदर्शन! आपने मेरिट योग्यता प्राप्त की है।'
                : 'अच्छा प्रयास! थोड़ा और दोहराएं।'
              }
            </p>

            <button
              onClick={() => setViewLevel('TOPICS_LIST')}
              className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-black text-xs shadow hover:bg-emerald-700"
            >
              वापस टेस्ट सूची पर जाएं
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
