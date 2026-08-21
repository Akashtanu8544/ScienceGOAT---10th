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
} from 'lucide-react';
import { DAILY_TIPS_DATA, DailyTip } from '../data/dailyTipsData';

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
    }, 300);
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

  return (
    <>
      {/* Clean Combined Hero Card */}
      <div
        className={`relative rounded-3xl p-4 sm:p-5 border shadow-2xl backdrop-blur-2xl transition-all overflow-hidden space-y-3.5 ${
          isDarkMode
            ? 'card-3d-dark text-white'
            : 'card-3d-light text-slate-900'
        }`}
      >
        {/* Glow Effects */}
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* 1. COUNTDOWN TIMER SECTION */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0 drop-shadow-[0_2px_4px_rgba(244,63,94,0.4)]" />
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                बोर्ड परीक्षा लक्ष्य: {formattedExamDateString}
              </span>
            </div>
            <button
              onClick={handleOpenModal}
              className={`p-1 px-2.5 rounded-xl border text-[10px] font-black flex items-center gap-1 transition-all active:translate-y-0.5 shrink-0 ${
                isDarkMode
                  ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-t border-l border-slate-700 border-b border-r border-slate-950 text-indigo-300 shadow-md'
                  : 'bg-gradient-to-b from-white to-slate-100 border-t border-l border-white border-b border-r border-slate-300 text-indigo-700 shadow-sm'
              }`}
            >
              <Settings className="w-3 h-3" />
              <span>तिथि बदलें</span>
            </button>
          </div>

          {timeLeft.isPast ? (
            <div className="p-2.5 text-center rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-700 dark:text-rose-300 font-black text-xs">
              🎉 परीक्षा का समय आ गया है! शुभकामनाएं!
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 text-center">
              <div
                className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-transform hover:scale-105 ${
                  isDarkMode
                    ? 'bg-slate-950/80 border-indigo-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                    : 'bg-white/95 border-indigo-200 shadow-[0_4px_8px_rgba(37,99,235,0.1)]'
                }`}
              >
                <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 leading-none">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 mt-0.5">
                  दिन (Days)
                </span>
              </div>

              <div
                className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-transform hover:scale-105 ${
                  isDarkMode
                    ? 'bg-slate-950/80 border-indigo-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                    : 'bg-white/95 border-indigo-200 shadow-[0_4px_8px_rgba(37,99,235,0.1)]'
                }`}
              >
                <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 leading-none">
                  {timeLeft.hours}
                </span>
                <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 mt-0.5">
                  घंटे
                </span>
              </div>

              <div
                className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-transform hover:scale-105 ${
                  isDarkMode
                    ? 'bg-slate-950/80 border-indigo-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                    : 'bg-white/95 border-indigo-200 shadow-[0_4px_8px_rgba(37,99,235,0.1)]'
                }`}
              >
                <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 leading-none">
                  {timeLeft.minutes}
                </span>
                <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 mt-0.5">
                  मिनट
                </span>
              </div>

              <div
                className={`p-2 rounded-2xl border flex flex-col items-center justify-center transition-transform hover:scale-105 ${
                  isDarkMode
                    ? 'bg-slate-950/80 border-indigo-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                    : 'bg-white/95 border-indigo-200 shadow-[0_4px_8px_rgba(37,99,235,0.1)]'
                }`}
              >
                <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 leading-none animate-pulse">
                  {timeLeft.seconds}
                </span>
                <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 mt-0.5">
                  सेकंड
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 2. DAILY SCIENCE TIP / MOTIVATION CARD */}
        <div
          className={`p-3 rounded-2xl border backdrop-blur-xl transition-all space-y-1 ${
            isDarkMode
              ? 'bg-slate-950/80 border-indigo-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
              : 'bg-white/95 border-indigo-200 shadow-[0_4px_10px_rgba(15,23,42,0.06)]'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 icon-container-3d">
                {currentTip.category === 'quote' ? (
                  <Quote className="w-3 h-3" />
                ) : (
                  <Lightbulb className="w-3 h-3" />
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                <span>{currentTip.authorOrTopic || 'दैनिक विज्ञान मंत्र'}</span>
                <Sparkles className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
              </span>
            </div>

            <button
              onClick={handleManualRefreshTip}
              title="नया विचार देखें"
              className={`p-1 rounded-lg border transition-all active:translate-y-0.5 shrink-0 ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-indigo-300'
                  : 'bg-slate-50 hover:bg-white border-indigo-200 text-indigo-600'
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
              isDarkMode
                ? 'bg-slate-900 border-slate-700 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-black flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span>परीक्षा तिथि सेट करें (Configure Exam Date)</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                त्वरित विकल्प (Presets):
              </label>
              <div className="flex flex-col gap-1.5">
                {presets.map((p) => (
                  <button
                    key={p.date}
                    onClick={() => handleSaveDate(p.date)}
                    className={`py-2 px-3 rounded-xl border text-xs font-black text-left transition-all hover:border-rose-500 ${
                      examDate === p.date
                        ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400'
                        : isDarkMode
                        ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                कस्टम तिथि एवं समय चुनें:
              </label>
              <input
                type="datetime-local"
                value={tempDateInput}
                onChange={(e) => setTempDateInput(e.target.value)}
                className={`w-full p-2.5 rounded-xl border font-bold text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => handleSaveDate(DEFAULT_EXAM_DATE)}
                className="px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>रीसेट करें</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  रद्द करें
                </button>

                <button
                  onClick={() => {
                    if (tempDateInput) {
                      handleSaveDate(new Date(tempDateInput).toISOString());
                    }
                  }}
                  className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs flex items-center gap-1 shadow-md shadow-rose-500/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>सेव करें</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
