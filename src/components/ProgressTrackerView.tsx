import React from 'react';
import { UserProgress, Chapter } from '../types';
import { Award, Flame, CheckCircle, ArrowLeft, FlaskConical, Zap, Dna, Clock, BookOpen } from 'lucide-react';

interface ProgressTrackerViewProps {
  progress: UserProgress;
  chapters: Chapter[];
  onBack: () => void;
  isDarkMode: boolean;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({
  progress,
  chapters,
  onBack,
  isDarkMode,
}) => {
  const completedChapters = progress?.completedChapters || [];
  const completedCount = completedChapters.length;
  const progressPercent = Math.round((completedCount / (chapters?.length || 1)) * 100);

  const chemistryChapters = (chapters || []).filter((c) => c.subject === 'chemistry');
  const physicsChapters = (chapters || []).filter((c) => c.subject === 'physics');
  const biologyChapters = (chapters || []).filter((c) => c.subject === 'biology');

  const chemistryCompleted = chemistryChapters.filter((c) => completedChapters.includes(c.id)).length;
  const physicsCompleted = physicsChapters.filter((c) => completedChapters.includes(c.id)).length;
  const biologyCompleted = biologyChapters.filter((c) => completedChapters.includes(c.id)).length;

  const chemPercent = Math.round((chemistryCompleted / (chemistryChapters.length || 1)) * 100);
  const physPercent = Math.round((physicsCompleted / (physicsChapters.length || 1)) * 100);
  const bioPercent = Math.round((biologyCompleted / (biologyChapters.length || 1)) * 100);

  // Reading Session Analytics
  const totalSeconds = progress?.totalReadingTimeSeconds || 0;
  const totalMins = Math.floor(totalSeconds / 60);
  const displayReadingTime =
    totalMins >= 60
      ? `${(totalMins / 60).toFixed(1)} घंटे`
      : `${totalMins} मिनट`;

  const readingMap = progress?.chapterReadingTime || {};

  return (
    <div className="space-y-4">
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
          <span className="text-xl">📈</span> प्रगति रिपोर्ट कार्ड
        </h2>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-2">
        <div className={`p-3 rounded-2xl border text-center space-y-1 shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
            <Flame className="w-3.5 h-3.5 fill-amber-500" />
          </div>
          <div className="text-xs sm:text-sm font-black text-amber-500">{progress.streakDays}d</div>
          <div className="text-[9px] font-bold text-slate-500">स्ट्राइक</div>
        </div>

        <div className={`p-3 rounded-2xl border text-center space-y-1 shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-7 h-7 rounded-full bg-blue-500/10 text-blue-500 mx-auto flex items-center justify-center">
            <Award className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs sm:text-sm font-black text-blue-500">{progress.totalPoints}</div>
          <div className="text-[9px] font-bold text-slate-500">अंक</div>
        </div>

        <div className={`p-3 rounded-2xl border text-center space-y-1 shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-7 h-7 rounded-full bg-purple-500/10 text-purple-500 mx-auto flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs sm:text-sm font-black text-purple-500">{displayReadingTime}</div>
          <div className="text-[9px] font-bold text-slate-500">अध्ययन समय</div>
        </div>

        <div className={`p-3 rounded-2xl border text-center space-y-1 shadow-sm ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
          <div className="text-xs sm:text-sm font-black text-emerald-500">{progressPercent}%</div>
          <div className="text-[9px] font-bold text-slate-500">पाठ्यक्रम</div>
        </div>
      </div>

      {/* Reading Time per Chapter Analytics */}
      <div className={`p-4 rounded-3xl border shadow-sm space-y-3 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <Clock className="w-4 h-4 text-purple-500" />
            <span>अध्याय-वार अध्ययन समय (Reading Analytics)</span>
          </h3>
          <span className="text-[10px] font-bold text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            कुल: {displayReadingTime}
          </span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {(chapters || []).map((ch) => {
            const chSeconds = readingMap[ch.id] || readingMap[`अध्याय ${ch.chapterNumber}: ${ch.titleHindi}`] || 0;
            const chMins = Math.floor(chSeconds / 60);
            const chSecs = chSeconds % 60;
            const timeLabel = chMins > 0 ? `${chMins} मि ${chSecs} से` : `${chSecs} से`;

            return (
              <div
                key={ch.id}
                className={`p-2.5 rounded-2xl border flex items-center justify-between gap-2 text-xs ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700/60' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base">{ch.icon3D || '📖'}</span>
                  <span className={`font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    अध्याय {ch.chapterNumber}: {ch.titleHindi}
                  </span>
                </div>
                <span className={`font-black shrink-0 ${chSeconds > 0 ? 'text-purple-500' : 'text-slate-400'}`}>
                  {timeLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Wise Progress Cards */}
      <div className={`p-4 rounded-3xl border shadow-sm space-y-3.5 ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h3 className={`text-xs font-black uppercase tracking-wider ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          📊 विषय-वार प्रगति (Subject Progress)
        </h3>

        {/* Chemistry */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-blue-600">
              <FlaskConical className="w-3.5 h-3.5" /> रसायन विज्ञान (Chemistry)
            </span>
            <span className="text-slate-500">{chemistryCompleted}/{chemistryChapters.length} ({chemPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${chemPercent}%` }} />
          </div>
        </div>

        {/* Physics */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-purple-600">
              <Zap className="w-3.5 h-3.5" /> भौतिक विज्ञान (Physics)
            </span>
            <span className="text-slate-500">{physicsCompleted}/{physicsChapters.length} ({physPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${physPercent}%` }} />
          </div>
        </div>

        {/* Biology */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <Dna className="w-3.5 h-3.5" /> जीव विज्ञान (Biology)
            </span>
            <span className="text-slate-500">{biologyCompleted}/{biologyChapters.length} ({bioPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${bioPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
