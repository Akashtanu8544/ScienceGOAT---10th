import React, { useState } from 'react';
import { BarChart2, ChevronRight, BookOpen, FileText, HelpCircle, Flame, ScrollText, Video, Search, X, Activity, BookMarked } from 'lucide-react';
import { QUIZ_QUESTIONS_DATA } from '../data/quizData';
import { CHAPTERS_DATA } from '../data/chaptersData';
import { MergedBoardHeroCard } from './MergedBoardHeroCard';

interface DashboardProps {
  onSelectOption: (option: 'Book' | 'Notes' | 'Quiz' | 'PYQ' | 'IMPORTANT' | 'SHARE' | 'MORE_APPS' | 'VIDEOS' | 'PROGRESS' | 'GLOSSARY') => void;
  completedChaptersCount: number;
  completedChapters?: number[];
  isDarkMode: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

interface SubjectProgressRingProps {
  title: string;
  subtitle: string;
  icon: string;
  completed: number;
  total: number;
  strokeColor: string;
  colorClass: string;
  badgeBg: string;
  isDarkMode: boolean;
  onClick: () => void;
}

const SubjectProgressRing: React.FC<SubjectProgressRingProps> = ({
  title,
  subtitle,
  icon,
  completed,
  total,
  strokeColor,
  colorClass,
  badgeBg,
  isDarkMode,
  onClick,
}) => {
  const percent = Math.round((completed / (total || 1)) * 100);
  const size = 52;
  const strokeWidth = 4.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-2xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer group active:scale-95 shadow-sm hover:shadow-md ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
          : 'bg-white/90 border-slate-200/90 hover:border-blue-300'
      }`}
    >
      {/* Progress Ring with Center Icon & Percentage */}
      <div className="relative w-13 h-13 flex items-center justify-center my-0.5">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className={isDarkMode ? 'text-slate-800' : 'text-slate-100'}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm leading-none group-hover:scale-110 transition-transform">{icon}</span>
          <span className={`text-[9px] font-black mt-0.5 ${colorClass}`}>
            {percent}%
          </span>
        </div>
      </div>

      {/* Label and Progress Subtext */}
      <div className="mt-1 space-y-0.5 w-full">
        <div className={`text-[11px] font-black tracking-tight leading-tight truncate ${
          isDarkMode ? 'text-slate-100' : 'text-slate-900'
        }`}>
          {title}
        </div>
        <div className={`text-[9px] font-black px-1.5 py-0.5 rounded-full inline-block border ${badgeBg}`}>
          {completed}/{total} अध्याय
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectOption,
  completedChaptersCount,
  completedChapters = [],
  isDarkMode,
  searchQuery,
  onSearchChange,
}) => {
  // Calculate Subject Completion
  const chemistryChapters = CHAPTERS_DATA.filter((c) => c.subject === 'chemistry');
  const physicsChapters = CHAPTERS_DATA.filter((c) => c.subject === 'physics');
  const biologyChapters = CHAPTERS_DATA.filter((c) => c.subject === 'biology');

  const chemistryCompleted = chemistryChapters.filter((c) => completedChapters.includes(c.id)).length;
  const physicsCompleted = physicsChapters.filter((c) => completedChapters.includes(c.id)).length;
  const biologyCompleted = biologyChapters.filter((c) => completedChapters.includes(c.id)).length;

  const options = [
    {
      id: 'Book' as const,
      title: 'NCERT किताब',
      badgeText: 'PDF पाठ्यपुस्तक',
      Icon: BookOpen,
      icon3D: '📖',
      gradient: isDarkMode ? 'from-blue-600/30 via-cyan-600/20 to-blue-900/40 text-cyan-300 border-cyan-500/40' : 'from-blue-500/20 via-cyan-400/20 to-blue-600/10 text-blue-800 border-blue-300',
      badgeBg: 'bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-400/30',
      glow: 'group-hover:shadow-blue-500/25',
    },
    {
      id: 'Notes' as const,
      title: 'अध्ययन नोट्स',
      badgeText: 'टॉपर नोट्स',
      Icon: FileText,
      icon3D: '📝',
      gradient: isDarkMode ? 'from-indigo-600/30 via-purple-600/20 to-indigo-900/40 text-indigo-300 border-indigo-500/40' : 'from-indigo-500/20 via-purple-400/20 to-indigo-600/10 text-indigo-800 border-indigo-300',
      badgeBg: 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-400/30',
      glow: 'group-hover:shadow-indigo-500/25',
    },
    {
      id: 'Quiz' as const,
      title: 'MCQ टेस्ट',
      badgeText: 'अभ्यास क्विज़',
      Icon: HelpCircle,
      icon3D: '🎯',
      gradient: isDarkMode ? 'from-purple-600/30 via-pink-600/20 to-purple-900/40 text-pink-300 border-pink-500/40' : 'from-purple-500/20 via-pink-400/20 to-purple-600/10 text-purple-800 border-purple-300',
      badgeBg: 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-400/30',
      glow: 'group-hover:shadow-purple-500/25',
    },
    {
      id: 'IMPORTANT' as const,
      title: 'महत्वपूर्ण प्रश्न',
      badgeText: '100% बोर्ड स्पेशल',
      Icon: Flame,
      icon3D: '🔥',
      gradient: isDarkMode ? 'from-rose-600/30 via-orange-600/20 to-rose-900/40 text-rose-300 border-rose-500/40' : 'from-rose-500/20 via-orange-400/20 to-rose-600/10 text-rose-800 border-rose-300',
      badgeBg: 'bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-400/30',
      glow: 'group-hover:shadow-rose-500/25',
    },
    {
      id: 'PYQ' as const,
      title: 'बोर्ड PYQ',
      badgeText: 'हल प्रश्न पत्र',
      Icon: ScrollText,
      icon3D: '📜',
      gradient: isDarkMode ? 'from-emerald-600/30 via-teal-600/20 to-emerald-900/40 text-emerald-300 border-emerald-500/40' : 'from-emerald-500/20 via-teal-400/20 to-emerald-600/10 text-emerald-800 border-emerald-300',
      badgeBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-400/30',
      glow: 'group-hover:shadow-emerald-500/25',
    },
    {
      id: 'VIDEOS' as const,
      title: 'वीडियो कक्षाएं',
      badgeText: 'वीडियो लेक्चर',
      Icon: Video,
      icon3D: '🎥',
      gradient: isDarkMode ? 'from-amber-600/30 via-yellow-600/20 to-amber-900/40 text-amber-300 border-amber-500/40' : 'from-amber-500/20 via-yellow-400/20 to-amber-600/10 text-amber-800 border-amber-300',
      badgeBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-400/30',
      glow: 'group-hover:shadow-amber-500/25',
    },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Merged Master Board Hero Card (Science GOAT + Progress + Countdown + Streak + Daily Tip) */}
      <MergedBoardHeroCard
        isDarkMode={isDarkMode}
        completedChaptersCount={completedChaptersCount}
        onSelectOption={onSelectOption}
      />

      {/* Dashboard Search Bar directly below Merged Hero Card */}
      <div className="relative z-10">
        <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
          isDarkMode ? 'text-amber-400' : 'text-indigo-600'
        }`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="खोजें: ओम का नियम, रासायनिक अभिक्रिया, अम्ल-क्षार..."
          className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-black transition-all shadow-md focus:outline-none ${
            isDarkMode
              ? 'input-3d-dark text-slate-100 placeholder-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
              : 'input-3d-light text-slate-900 placeholder-slate-500 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-indigo-500/5'
          }`}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Performance Overview Section with Integrated Daily Quiz */}
      <div className={`p-3.5 rounded-3xl border shadow-xl space-y-3 backdrop-blur-2xl transition-all ${
        isDarkMode
          ? 'card-3d-dark'
          : 'card-3d-light'
      }`}>
        <div className="flex items-center justify-between px-1">
          <h3 className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <Activity className="w-3.5 h-3.5 text-amber-500" />
            <span>प्रदर्शन अवलोकन (Performance Overview)</span>
          </h3>
          <button
            onClick={() => onSelectOption('PROGRESS')}
            className="text-[10px] font-black text-amber-500 hover:underline flex items-center gap-0.5"
          >
            <span>रिपोर्ट देखें</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Physics Ring */}
          <SubjectProgressRing
            title="भौतिकी"
            subtitle="Physics"
            icon="⚡"
            completed={physicsCompleted}
            total={physicsChapters.length}
            strokeColor="#A855F7"
            colorClass="text-purple-600 dark:text-purple-400"
            badgeBg="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-400/30"
            isDarkMode={isDarkMode}
            onClick={() => onSelectOption('PROGRESS')}
          />

          {/* Chemistry Ring */}
          <SubjectProgressRing
            title="रसायन"
            subtitle="Chemistry"
            icon="🧪"
            completed={chemistryCompleted}
            total={chemistryChapters.length}
            strokeColor="#0284C7"
            colorClass="text-sky-600 dark:text-sky-400"
            badgeBg="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-400/30"
            isDarkMode={isDarkMode}
            onClick={() => onSelectOption('PROGRESS')}
          />

          {/* Biology Ring */}
          <SubjectProgressRing
            title="जीव विज्ञान"
            subtitle="Biology"
            icon="🧬"
            completed={biologyCompleted}
            total={biologyChapters.length}
            strokeColor="#10B981"
            colorClass="text-emerald-600 dark:text-emerald-400"
            badgeBg="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/30"
            isDarkMode={isDarkMode}
            onClick={() => onSelectOption('PROGRESS')}
          />
        </div>

        {/* Integrated Daily Quiz Bar inside Performance Overview */}
        <div
          onClick={() => onSelectOption('Quiz')}
          className={`p-2.5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between gap-2.5 ${
            isDarkMode
              ? 'bg-slate-950/80 border-amber-500/40 hover:border-amber-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
              : 'bg-amber-50/90 border-amber-300/80 hover:border-amber-400 shadow-[0_4px_10px_rgba(245,158,11,0.15)]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-bold flex items-center justify-center text-sm shrink-0 shadow-md group-hover:scale-110 transition-transform">
              🎯
            </div>
            <div>
              <h4 className="text-xs font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                <span>दैनिक प्रश्नोत्तरी</span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  (Daily Quiz)
                </span>
              </h4>
              <p className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 leading-none mt-0.5">
                रोजाना 10 प्रश्नों से तैयारी मजबूत करें
              </p>
            </div>
          </div>

          <button className="btn-3d-amber px-2.5 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 shrink-0">
            <span>क्विज़ खेलें</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Grid of 6 Interactive Centered Study Section Cards */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <span>📚</span>
            <span>अध्ययन अनुभाग (Study Sections)</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 landscape:grid-cols-3 sm:landscape:grid-cols-6 gap-3.5">
          {options.map((opt) => {
            return (
              <button
                key={opt.id}
                onClick={() => onSelectOption(opt.id)}
                className={`p-4 rounded-3xl border flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer group relative overflow-hidden backdrop-blur-2xl ${
                  isDarkMode
                    ? 'card-3d-dark text-white'
                    : 'card-3d-light text-slate-900'
                }`}
              >
                {/* Interactive 3D Avatar Box */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br border ${opt.gradient} flex items-center justify-center text-2xl my-1 transition-transform duration-300 group-hover:scale-110 shadow-lg relative overflow-hidden shrink-0 icon-container-3d`}>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 drop-shadow-md">{opt.icon3D}</span>
                </div>

                {/* Main Section Title */}
                <h4 className="text-xs sm:text-sm font-black tracking-tight leading-tight mt-1.5 text-center">
                  {opt.title}
                </h4>

                {/* Centered Badge Label Pill */}
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-xs mt-1.5 text-center ${opt.badgeBg}`}>
                  {opt.badgeText}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Science Glossary Feature Card - Positioned Below Board PYQ & Video Classes Grid */}
      <div
        onClick={() => onSelectOption('GLOSSARY')}
        className={`p-3.5 rounded-2xl border shadow-lg relative overflow-hidden backdrop-blur-2xl transition-all cursor-pointer group ${
          isDarkMode
            ? 'card-3d-dark'
            : 'card-3d-light'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0 shadow-inner group-hover:scale-110 transition-transform icon-container-3d">
              📚
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>विज्ञान शब्दावली</span>
                <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded-md">
                  Glossary
                </span>
              </h3>
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                कक्षा 10वीं के मुख्य वैज्ञानिक शब्द व परिभाषाएं
              </p>
            </div>
          </div>

          <button className="btn-3d-amber px-3 py-1.5 rounded-xl text-[11px] font-black flex items-center gap-1 shrink-0">
            <span>खोलें</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
