import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Settings, X, Check, RotateCcw, Sparkles } from 'lucide-react';

interface ExamCountdownCardProps {
  isDarkMode: boolean;
}

const DEFAULT_EXAM_DATE = '2027-03-22T09:00:00';

export const ExamCountdownCard: React.FC<ExamCountdownCardProps> = ({ isDarkMode }) => {
  const [examDate, setExamDate] = useState<string>(() => {
    return localStorage.getItem('rbse_science_exam_date') || DEFAULT_EXAM_DATE;
  });

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>(() => {
    const target = new Date(examDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [tempDateInput, setTempDateInput] = useState<string>('');

  // Live timer tick
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
    // Format for datetime-local input YYYY-MM-DDTHH:mm
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

  const handleResetDefault = () => {
    handleSaveDate(DEFAULT_EXAM_DATE);
  };

  // Preset Dates for RBSE
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
      <div
        id="board-exam-countdown-card"
        className={`p-4 rounded-3xl border shadow-sm transition-all relative overflow-hidden ${
          isDarkMode
            ? 'bg-slate-900/95 border-rose-500/25 text-white'
            : 'bg-white border-rose-100 text-slate-900 shadow-rose-500/5'
        }`}
      >
        {/* Subtle Decorative Glows */}
        <div className="absolute -left-6 -top-6 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <Calendar className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  बोर्ड परीक्षा लक्ष्य
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-400/25">
                  RBSE 10th
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                {formattedExamDateString}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className={`px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 flex items-center gap-1 text-[11px] font-black shrink-0 ${
              isDarkMode
                ? 'bg-slate-800/90 hover:bg-slate-700 border-slate-700 text-rose-300'
                : 'bg-rose-50/80 hover:bg-rose-100/80 border-rose-200 text-rose-700 shadow-2xs'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>तिथि बदलें</span>
          </button>
        </div>

        {/* Countdown Grid */}
        {timeLeft.isPast ? (
          <div className="p-3 text-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 font-black text-xs flex items-center justify-center gap-1.5 relative z-10">
            <Sparkles className="w-4 h-4 text-rose-500" />
            <span>बोर्ड परीक्षा का समय आ गया है! शुभकामनाएं!</span>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-center relative z-10">
            {/* Days */}
            <div
              className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                isDarkMode
                  ? 'bg-slate-800/60 border-slate-800 text-white'
                  : 'bg-slate-50 border-slate-200/80 text-slate-900'
              }`}
            >
              <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 leading-none tabular-nums font-mono">
                {timeLeft.days}
              </span>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                दिन (Days)
              </span>
            </div>

            {/* Hours */}
            <div
              className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                isDarkMode
                  ? 'bg-slate-800/60 border-slate-800 text-white'
                  : 'bg-slate-50 border-slate-200/80 text-slate-900'
              }`}
            >
              <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 leading-none tabular-nums font-mono">
                {timeLeft.hours}
              </span>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                घंटे (Hrs)
              </span>
            </div>

            {/* Minutes */}
            <div
              className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                isDarkMode
                  ? 'bg-slate-800/60 border-slate-800 text-white'
                  : 'bg-slate-50 border-slate-200/80 text-slate-900'
              }`}
            >
              <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 leading-none tabular-nums font-mono">
                {timeLeft.minutes}
              </span>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                मिनट (Min)
              </span>
            </div>

            {/* Seconds */}
            <div
              className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                isDarkMode
                  ? 'bg-slate-800/60 border-slate-800 text-white'
                  : 'bg-slate-50 border-slate-200/80 text-slate-900'
              }`}
            >
              <span className="text-lg sm:text-xl font-black text-rose-600 dark:text-rose-400 leading-none tabular-nums font-mono animate-pulse">
                {timeLeft.seconds}
              </span>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                सेकंड (Sec)
              </span>
            </div>
          </div>
        )}
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

            {/* Preset Buttons */}
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

            {/* Custom Date Input */}
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

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleResetDefault}
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
