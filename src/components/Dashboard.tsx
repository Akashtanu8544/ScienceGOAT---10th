import React, { useState } from 'react';
import { BarChart2, ChevronRight, BookOpen, FileText, HelpCircle, Flame, ScrollText, Video, Search, X, Activity } from 'lucide-react';
import { QUIZ_QUESTIONS_DATA } from '../data/quizData';
import { CHAPTERS_DATA } from '../data/chaptersData';

interface DashboardProps {
  onSelectOption: (option: 'Book' | 'Notes' | 'Quiz' | 'PYQ' | 'IMPORTANT' | 'SHARE' | 'MORE_APPS' | 'VIDEOS' | 'PROGRESS') => void;
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
      {/* Glassmorphism Welcome Hero Card */}
      <div
        className={`relative rounded-3xl p-4 sm:p-5 border shadow-xl backdrop-blur-2xl overflow-hidden transition-all group ${
          isDarkMode
            ? 'bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/80 border-slate-700/60 text-white'
            : 'bg-gradient-to-br from-white/90 via-blue-50/60 to-indigo-50/70 border-white/80 text-slate-900'
        }`}
      >
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-amber-500 dark:text-amber-400">
              कक्षा 10वीं विज्ञान
            </span>

            <button
              onClick={() => onSelectOption('PROGRESS')}
              className={`py-1 px-3 rounded-full border font-black text-[11px] flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                isDarkMode
                  ? 'bg-slate-800/90 text-amber-300 border-amber-500/30 hover:bg-slate-700'
                  : 'bg-white/90 text-blue-700 border-blue-200 hover:bg-blue-50'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
              <span>प्रगति: {completedChaptersCount}/13</span>
            </button>
          </div>

          <div className="space-y-0.5">
            <h2 className={`text-lg sm:text-xl font-black tracking-tight flex items-center gap-2 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              <span>Science GOAT</span>
              <span className="px-2 py-0.5 rounded-lg bg-green-500 text-white text-xs font-black">10th</span>
            </h2>
            <p className={`text-xs font-medium leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              राजस्थान बोर्ड कक्षा 10 विज्ञान का संपूर्ण डिजिटल साथी
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Search Bar directly below App Branding */}
      <div className="relative z-10">
        <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
          isDarkMode ? 'text-amber-400' : 'text-blue-600'
        }`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="खोजें: ओम का नियम, रासायनिक अभिक्रिया, अम्ल-क्षार..."
          className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-black transition-all backdrop-blur-2xl shadow-md focus:outline-none ${
            isDarkMode
              ? 'bg-slate-900/80 text-slate-100 placeholder-slate-400 border border-slate-700/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
              : 'bg-white/90 text-slate-900 placeholder-slate-400 border border-blue-200/90 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-blue-500/5'
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

      {/* Performance Overview Section (Small Progress Rings for Physics, Chemistry, Biology) */}
      <div className={`p-3.5 rounded-3xl border shadow-md space-y-2.5 backdrop-blur-2xl ${
        isDarkMode
          ? 'bg-slate-900/80 border-slate-800'
          : 'bg-white/80 border-white/80 shadow-slate-200/50'
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
      </div>

      {/* Daily Quiz Feature Section (Ultra Minimalistic) */}
      <div
        onClick={() => onSelectOption('Quiz')}
        className={`p-3 rounded-2xl border shadow-md relative overflow-hidden backdrop-blur-2xl transition-all cursor-pointer group active:scale-[0.99] ${
          isDarkMode
            ? 'bg-slate-900/90 border-amber-500/30 hover:border-amber-400/60'
            : 'bg-white/95 border-amber-300/60 hover:border-amber-400 shadow-amber-500/5'
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-lg shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              🔥
            </div>
            <h3 className="text-xs sm:text-sm font-black tracking-tight text-slate-900 dark:text-white">
              दैनिक प्रश्नोत्तरी <span className="text-amber-500 font-bold">(Daily Quiz)</span>
            </h3>
          </div>

          <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-black transition-all flex items-center gap-1 shrink-0 shadow-sm group-hover:shadow-amber-500/25">
            <span>क्विज़ खेलें</span>
            <ChevronRight className="w-3.5 h-3.5" />
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

        <div className="grid grid-cols-2 gap-3.5">
          {options.map((opt) => {
            return (
              <button
                key={opt.id}
                onClick={() => onSelectOption(opt.id)}
                className={`p-4 rounded-3xl border flex flex-col items-center justify-center text-center transition-all duration-300 transform active:scale-95 hover:-translate-y-1 group relative overflow-hidden backdrop-blur-2xl shadow-md ${opt.glow} ${
                  isDarkMode
                    ? 'bg-slate-900/70 border-slate-800/80 hover:border-amber-400/50 text-white hover:bg-slate-900/90'
                    : 'bg-white/80 border-white/70 hover:border-blue-400/60 text-slate-900 hover:shadow-xl hover:bg-white/95'
                }`}
              >
                {/* Interactive 3D Avatar Box */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br border ${opt.gradient} flex items-center justify-center text-2xl my-1 transition-transform duration-300 group-hover:scale-110 shadow-md relative overflow-hidden shrink-0`}>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 drop-shadow-md">{opt.icon3D}</span>
                </div>

                {/* Main Section Title */}
                <h4 className="text-xs sm:text-sm font-black tracking-tight leading-tight mt-1.5 text-center">
                  {opt.title}
                </h4>

                {/* Centered Badge Label Pill */}
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs mt-1.5 text-center ${opt.badgeBg}`}>
                  {opt.badgeText}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
