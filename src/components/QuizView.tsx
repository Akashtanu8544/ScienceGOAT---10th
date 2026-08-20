import React, { useState, useEffect } from 'react';
import { Chapter, MockExam, QuizQuestion, UserProgress } from '../types';
import { AdMobRewardedModal } from './AdMobRewardedModal';
import { StorageService } from '../services/db';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, Clock, ArrowLeft, X, Check, Sparkles, RefreshCw, Trophy, ChevronRight, Play, Search } from 'lucide-react';

interface QuizViewProps {
  chapters: Chapter[];
  questionsData: QuizQuestion[];
  mockExamsData: MockExam[];
  progress: UserProgress;
  onBack: () => void;
  onProgressUpdate: () => void;
  customQuizUrl?: string;
  isDarkMode: boolean;
}

export const QuizView: React.FC<QuizViewProps> = ({
  chapters,
  questionsData,
  mockExamsData,
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

  const selectedChapter = (chapters || []).find((c) => c.id === selectedChapterId) || chapters?.[0] || { id: 1, titleHindi: 'रसायन शास्त्र' };

  // Mock exams for current chapter
  const currentChapterExams = (mockExamsData || []).filter((m) => m?.chapterIds?.includes(selectedChapter.id));

  // Fallback default exam if none found in mock data
  const defaultExams = currentChapterExams.length > 0 ? currentChapterExams : [
    {
      id: `ch-${selectedChapter.id}-exam-1`,
      title: `${selectedChapter.titleHindi} - अभ्यास टेस्ट 1`,
      chapterIds: [selectedChapter.id],
      durationMinutes: 15,
      questions: (questionsData || []).filter((q) => q?.chapterId === selectedChapter.id).slice(0, 10),
      rewardedAdRequired: false,
    },
    {
      id: `ch-${selectedChapter.id}-exam-2`,
      title: `${selectedChapter.titleHindi} - बोर्ड स्पेशल मॉक टेस्ट 2`,
      chapterIds: [selectedChapter.id],
      durationMinutes: 20,
      questions: (questionsData || []).filter((q) => q?.chapterId === selectedChapter.id).slice(0, 10),
      rewardedAdRequired: true,
    }
  ];

  const handleStartExamClick = (exam: MockExam) => {
    const isUnlocked = (progress?.unlockedMockExams || []).includes(exam.id);
    if (exam.rewardedAdRequired && !isUnlocked) {
      setPendingAdExam(exam);
    } else {
      startExamNow(exam);
    }
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
            <span className="text-xl">🎯</span> MCQ Quizzes
          </h2>
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
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
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
            className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-black transition-all backdrop-blur-2xl shadow-sm focus:outline-none ${
              isDarkMode
                ? 'bg-slate-900/80 text-slate-100 placeholder-slate-400 border border-slate-700/80 focus:border-purple-400'
                : 'bg-white/90 text-slate-900 placeholder-slate-400 border border-purple-200 focus:border-purple-600'
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
              const hasScore = progress?.quizScores?.[`ch-${ch.id}-exam-1`]?.score !== undefined;
              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    setSelectedChapterId(ch.id);
                    setViewLevel('TOPICS_LIST');
                  }}
                  className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between group shadow-sm backdrop-blur-md ${
                    isDarkMode
                      ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/50'
                      : 'bg-white/90 border-slate-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-xl flex items-center justify-center shrink-0 shadow-inner">
                      {ch.icon3D || '🎯'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400">
                          अध्याय {ch.chapterNumber} • {ch.weightage} अंक
                        </span>
                        {hasScore && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
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
                    <ChevronRight className="w-4 h-4" />
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
      <div className="space-y-4">
        {/* AdMob Rewarded Modal Trigger if pending */}
        {pendingAdExam && (
          <AdMobRewardedModal
            title={pendingAdExam.title}
            onAdCompleted={handleAdCompleted}
            onClose={() => setPendingAdExam(null)}
          />
        )}

        {/* Top Header Card */}
        <div className={`p-4 rounded-3xl border shadow-sm space-y-3 ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewLevel('CHAPTER_LIST')}
              className={`p-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-1 ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> अध्याय सूची
            </button>

            <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
              {defaultExams.length} टेस्ट उपलब्ध
            </span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-2xl font-bold shrink-0">
              🎯
            </div>
            <div className="min-w-0 flex-1">
              <h2 className={`text-sm sm:text-base font-black truncate ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {selectedChapter.titleHindi}
              </h2>
              <p className={`text-[11px] font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                अध्याय-वार ऑनलाइन टेस्ट व बहुविकल्पीय प्रश्न
              </p>
            </div>
          </div>

          {/* Study Progress Bar */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>टेस्ट प्रगति (Quiz Progress)</span>
              <span className="text-purple-600">1/{defaultExams.length} पूर्ण</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full transition-all duration-500 w-1/2" />
            </div>
          </div>
        </div>

        {/* Exams List (Matching Image 4 Cards) */}
        <div className="space-y-2.5">
          {defaultExams.map((exam, idx) => {
            const hasCompleted = !!progress?.quizScores?.[exam.id];
            const isUnlocked = !exam.rewardedAdRequired || (progress?.unlockedMockExams || []).includes(exam.id);

            return (
              <div
                key={exam.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2 shadow-sm transition-all ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {hasCompleted ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-600 font-extrabold flex items-center justify-center text-xs shrink-0">
                      {idx + 1}
                    </div>
                  )}

                  <div className="min-w-0">
                    {hasCompleted ? (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-[10px]">
                        पढ़ा गया (Done)
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold text-[10px]">
                        शेष है (Pending)
                      </span>
                    )}
                    <h4 className={`text-xs font-black truncate mt-0.5 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {exam.title}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => handleStartExamClick(exam)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1 shrink-0 transition-all ${
                    hasCompleted
                      ? 'bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {hasCompleted ? <RefreshCw className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{hasCompleted ? 'दोहराएं' : isUnlocked ? 'दें' : 'अनलॉक करें'}</span>
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
  const currentQ = questionsList[currentQuestionIndex] || {
    questionHindi: 'आवर्त में बाएँ से दाएँ जाने पर संयोजक इलेक्ट्रॉनों की संख्या मुख्य समूह तत्वों के लिए सामान्यतः कैसे बदलती है?',
    optionsHindi: ['8 से 1 तक घटती है', '1 से 8 तक क्रमशः बढ़ती है', 'सदैव 2 रहती है', 'कोई नियमितता नहीं होती'],
    correctAnswer: 1,
    explanationHindi: 'मुख्य समूह तत्वों में किसी आवर्त में बाएँ से दाएँ जाने पर बाह्यतम कोश के इलेक्ट्रॉनों की संख्या सामान्यतः 1 से 8 तक बढ़ती है।',
  };

  const selectedAnswer = userAnswers[currentQuestionIndex];
  const hasAnsweredCurrent = selectedAnswer !== undefined;

  return (
    <div className="space-y-4">
      {/* Top Bar (Matching Image 7 Top Bar) */}
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

        {/* Middle Question Counter & Progress Bar */}
        <div className="flex-1 mx-2 space-y-1">
          <div className="flex items-center justify-between text-xs font-black">
            <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>मॉक टेस्ट</span>
            <span className="text-emerald-600 font-extrabold">Q {currentQuestionIndex + 1} of {questionsList.length || 10}</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / (questionsList.length || 10)) * 100}%` }}
            />
          </div>
        </div>

        {/* Right Timer Badge */}
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 text-xs font-bold shrink-0">
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
          {currentQ.questionHindi}
        </h3>
      </div>

      {/* 4 Option Buttons (Matching Image 7 Cards) */}
      <div className="space-y-2.5">
        {(currentQ?.optionsHindi || []).map((opt, idx) => {
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
            {currentQ.explanationHindi || 'उपरोक्त प्रश्न में मुख्य सिद्धांतों के अनुसार सही उत्तर का चयन किया गया है।'}
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
            <span>सबमिट करें व परिणाम देखें 🏆</span>
          </button>
        )}
      </div>

      {/* Quiz Submission Result Modal overlay */}
      {isQuizSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl text-center space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 mx-auto flex items-center justify-center text-3xl shadow">
              🏆
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
