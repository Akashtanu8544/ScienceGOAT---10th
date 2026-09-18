import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Lightbulb,
  Quote,
  RefreshCw,
  Settings,
  Sparkles,
  X,
  Check,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { DAILY_TIPS_DATA, DailyTip } from '../data/dailyTipsData';
import { CHAPTERS_DATA } from '../data/chaptersData';

interface MergedBoardHeroCardProps {
  isDarkMode: boolean;
  completedChaptersCount?: number;
  onSelectOption?: (
    option: 'Book' | 'Notes' | 'Quiz' | 'PYQ' | 'IMPORTANT' | 'SHARE' | 'MORE_APPS' | 'VIDEOS' | 'PROGRESS' | 'GLOSSARY'
  ) => void;
}

const DEFAULT_EXAM_DATE = '2027-03-22T09:00:00';

export const MergedBoardHeroCard: React.FC<MergedBoardHeroCardProps> = ({
  isDarkMode,
  completedChaptersCount = 0,
  onSelectOption,
}) => {
  // --- Daily Tip State ---
  const [currentTip, setCurrentTip] = useState<DailyTip>(DAILY_TIPS_DATA[0]);
  const [tipIndex, setTipIndex] = useState<number>(0);
  const [isRefreshingTip, setIsRefreshingTip] = useState<boolean>(false);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const savedTip = localStorage.getItem('science_goat_daily_tip');

    if (savedTip) {
      try {
        const parsed = JSON.parse(savedTip);
        if (parsed.lastFetchedDate === todayStr && parsed.tipIndex !== undefined) {
          const idx = parsed.tipIndex % DAILY_TIPS_DATA.length;
          setTipIndex(idx);
          setCurrentTip(DAILY_TIPS_DATA[idx]);
          return;
        }
      } catch (e) {
        console.error('Error loading daily tip state:', e);
      }
    }

    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - startOfYear.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const newIdx = dayOfYear % DAILY_TIPS_DATA.length;

    setTipIndex(newIdx);
    setCurrentTip(DAILY_TIPS_DATA[newIdx]);
    localStorage.setItem(
      'science_goat_daily_tip',
      JSON.stringify({ tipIndex: newIdx, lastFetchedDate: todayStr })
    );
  }, []);

  const handleManualRefreshTip = () => {
    setIsRefreshingTip(true);
    setTimeout(() => {
      const nextIdx = (tipIndex + 1) % DAILY_TIPS_DATA.length;
      const todayStr = new Date().toISOString().split('T')[0];
      setTipIndex(nextIdx);
      setCurrentTip(DAILY_TIPS_DATA[nextIdx]);
      localStorage.setItem(
        'science_goat_daily_tip',
        JSON.stringify({ tipIndex: nextIdx, lastFetchedDate: todayStr })
      );
      setIsRefreshingTip(false);
    }, 250);
  };

  // --- Exam Countdown State ---
  const [examDate, setExamDate] = useState<string>(() => {
    return localStorage.getItem('rbse_science_exam_date') || DEFAULT_EXAM_DATE;
  });

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tempDateInput, setTempDateInput] = useState<string>('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(examDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [examDate]);

  const handleOpenModal = () => {
    const dateObj = new Date(examDate);
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    const localISOTime = new Date(dateObj.getTime() - tzOffset).toISOString().slice(0, 16);
    setTempDateInput(localISOTime);
    setIsModalOpen(true);
  };

  const handleSaveDate = (newDateIso: string) => {
    setExamDate(newDateIso);
    localStorage.setItem('rbse_science_exam_date', newDateIso);
    setIsModalOpen(false);
  };

  const presets = [
    { label: 'RBSE 2027 मुख्य बोर्ड (22 मार्च)', date: '2027-03-22T09:00:00' },
    { label: 'हाफ इयरली बोर्ड (15 दिसंबर)', date: '2026-12-15T09:00:00' },
    { label: 'प्री-बोर्ड स्पेशल (15 जनवरी)', date: '2027-01-15T09:00:00' },
  ];

  const formattedExamDateString = new Date(examDate).toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const totalChapters = CHAPTERS_DATA.length;
  const progressPercent = Math.min(100, Math.round((completedChaptersCount / totalChapters) * 100));

  // Subject breakdown
  const chemTotal = CHAPTERS_DATA.filter((c) => c.subject === 'chemistry').length;
  const bioTotal = CHAPTERS_DATA.filter((c) => c.subject === 'biology').length;
  const physTotal = CHAPTERS_DATA.filter((c) => c.subject === 'physics').length;

  return (
    <div className="space-y-3.5">
      {/* 1. DUAL METRIC SUMMARY CARDS (Directly matching Screen 1 in reference image) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Left Card: Courses / कुल अध्याय */}
        <div
          onClick={() => onSelectOption && onSelectOption('Book')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelectOption && onSelectOption('Book')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer group active:scale-95 flex items-center gap-3 ${
            isDarkMode ? 'card-3d-dark' : 'card-3d-light'
          }`}
        >
          {/* Soft Purple Rounded Icon Container */}
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 stroke-[2.4]" />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
              {totalChapters}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
              कुल अध्याय (Courses)
            </div>
          </div>
        </div>

        {/* Right Card: Completed / पूर्ण अध्याय */}
        <div
          onClick={() => onSelectOption && onSelectOption('PROGRESS')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelectOption && onSelectOption('PROGRESS')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer group active:scale-95 flex items-center gap-3 ${
            isDarkMode ? 'card-3d-dark' : 'card-3d-light'
          }`}
        >
          {/* Soft Teal Rounded Icon Container */}
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-5 h-5 stroke-[2.4]" />
          </div>
          <div className="min-w-0">
            <div className="text-xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
              {completedChaptersCount}
            </div>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1 truncate">
              पूर्ण (Completed)
            </div>
          </div>
        </div>
      </div>

      {/* 3. SEGMENTED MULTI-COLOR LEARNING PROGRESS BAR (Matching Screen 1) */}
      <div
        className={`p-4 rounded-3xl border transition-all space-y-2.5 ${
          isDarkMode ? 'card-3d-dark' : 'card-3d-light'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h3 className="text-xs font-black text-slate-900 dark:text-white tracking-tight">
              अध्ययन प्रगति (Learning progress)
            </h3>
          </div>
          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
            {progressPercent}%
          </span>
        </div>

        {/* Multi-Colored Segmented Pill Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-3.5 p-0.5 overflow-hidden flex gap-1 border border-slate-200/80 dark:border-slate-700/80">
          {/* Chemistry (Sky Blue) */}
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(8, (completedChaptersCount > 0 ? (chemTotal / totalChapters) * 100 : 30))}%` }}
            title="रसायन विज्ञान"
          />
          {/* Biology (Emerald Green) */}
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(8, (completedChaptersCount > 0 ? (bioTotal / totalChapters) * 100 : 38))}%` }}
            title="जीव विज्ञान"
          />
          {/* Physics (Violet) */}
          <div
            className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(8, (completedChaptersCount > 0 ? (physTotal / totalChapters) * 100 : 32))}%` }}
            title="भौतिक विज्ञान"
          />
        </div>

        {/* Subject Segment Legend */}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 pt-0.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500" />
            <span>रसायन ({chemTotal})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>जीव ({bioTotal})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>भौतिक ({physTotal})</span>
          </div>
        </div>
      </div>

      {/* 4. EXAM COUNTDOWN & DAILY TIP */}
      <div
        id="hero-countdown-card"
        className={`relative rounded-3xl p-4 sm:p-5 border transition-all overflow-hidden space-y-3.5 ${
          isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
        }`}
      >
        {/* Countdown Timer Header */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Calendar className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 truncate">
                बोर्ड परीक्षा लक्ष्य: {formattedExamDateString}
              </span>
            </div>
            <button
              type="button"
              onClick={handleOpenModal}
              className={`px-2.5 py-1 rounded-full border text-[10px] font-black flex items-center gap-1 transition-all active:scale-95 shrink-0 ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-indigo-300 hover:bg-slate-800'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              <Settings className="w-3 h-3" />
              <span>तिथि बदलें</span>
            </button>
          </div>

          {timeLeft.isPast ? (
            <div className="p-2.5 text-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-black text-xs flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>परीक्षा का समय आ गया है! शुभकामनाएं!</span>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 text-center">
              <div
                className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200/80 shadow-2xs'
                }`}
              >
                <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums leading-none">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  दिन (Days)
                </span>
              </div>

              <div
                className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200/80 shadow-2xs'
                }`}
              >
                <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums leading-none">
                  {timeLeft.hours}
                </span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  घंटे
                </span>
              </div>

              <div
                className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200/80 shadow-2xs'
                }`}
              >
                <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums leading-none">
                  {timeLeft.minutes}
                </span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  मिनट
                </span>
              </div>

              <div
                className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                  isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200/80 shadow-2xs'
                }`}
              >
                <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 tabular-nums leading-none animate-pulse">
                  {timeLeft.seconds}
                </span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  सेकंड
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Daily Science Motivation / Tip Card */}
        <div
          className={`p-3 rounded-2xl border transition-all space-y-1 ${
            isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-indigo-50/50 border-indigo-100'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-5.5 h-5.5 rounded-lg bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                {currentTip.category === 'quote' ? (
                  <Quote className="w-3 h-3" />
                ) : (
                  <Lightbulb className="w-3 h-3" />
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1 truncate">
                <span>{currentTip.authorOrTopic || 'दैनिक विज्ञान मंत्र'}</span>
                <Sparkles className="w-2.5 h-2.5 text-amber-500 animate-pulse shrink-0" />
              </span>
            </div>

            <button
              type="button"
              onClick={handleManualRefreshTip}
              title="नया विचार देखें"
              className={`p-1 rounded-lg border transition-all active:scale-95 shrink-0 ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-indigo-300'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-indigo-600'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshingTip ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <p className="text-xs font-semibold leading-relaxed text-slate-800 dark:text-slate-200 pl-0.5">
            <span className="font-bold text-amber-600 dark:text-amber-400 mr-1">
              {currentTip.titleHindi}:
            </span>
            {currentTip.contentHindi}
          </p>
        </div>
      </div>

      {/* Date Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          <div
            className={`w-full max-w-md p-5 rounded-3xl border shadow-2xl relative space-y-4 ${
              isDarkMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span>परीक्षा तिथि सेट करें</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  अपनी परीक्षा तिथि और समय चुनें:
                </label>
                <input
                  type="datetime-local"
                  value={tempDateInput}
                  onChange={(e) => setTempDateInput(e.target.value)}
                  className={`w-full p-2.5 text-xs rounded-xl font-bold border transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600'
                  }`}
                />
              </div>

              <div>
                <span className="block text-[11px] font-bold text-slate-500 mb-1.5">
                  त्वरित प्रीसेट (Quick Presets):
                </span>
                <div className="space-y-1.5">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTempDateInput(p.date.slice(0, 16))}
                      className={`w-full text-left p-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                        isDarkMode
                          ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-700 text-slate-200'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{p.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  handleSaveDate(DEFAULT_EXAM_DATE);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-1 ${
                  isDarkMode
                    ? 'border-slate-700 text-slate-400 hover:bg-slate-800'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>डिफ़ॉल्ट</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (tempDateInput) {
                    handleSaveDate(`${tempDateInput}:00`);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md hover:from-amber-600 hover:to-amber-700 flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>सहेजें</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
