import React from 'react';
import {
  BookOpen,
  FileText,
  CheckSquare,
  GraduationCap,
  Sparkles,
  BarChart2,
  Video,
  BookMarked,
  Search,
  X,
} from 'lucide-react';
import { ExamCountdownCard } from './ExamCountdownCard';
import { useLanguage } from '../utils/languageContext';
import { ScienceGoatLogo } from './ScienceGoatLogo';

interface DashboardProps {
  onSelectOption: (option: 'Book' | 'Notes' | 'Quiz' | 'PYQ' | 'IMPORTANT' | 'SHARE' | 'MORE_APPS' | 'VIDEOS' | 'PROGRESS' | 'GLOSSARY' | 'DIAGRAMS') => void;
  completedChaptersCount: number;
  completedChapters?: number[];
  isDarkMode: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onSelectOption,
  isDarkMode,
  searchQuery,
  onSearchChange,
}) => {
  const { language } = useLanguage();

  const quickSearchTags = language === 'hi' 
    ? ['रासायनिक अभिक्रिया', 'अम्ल क्षार', 'धातु-अधातु', 'प्रकाश परावर्तन', 'विद्युत धारा', 'आनुवंशिकता']
    : ['Chemical Reactions', 'Acids & Bases', 'Metals & Non-metals', 'Light Reflection', 'Electricity', 'Heredity'];

  // Clean study module options: only clean, direct titles, matching icon layout (including Glossary and Video classes)
  const options = [
    {
      id: 'Book' as const,
      title: language === 'hi' ? 'NCERT किताब' : 'NCERT Book',
      icon: BookOpen,
      iconColor: 'text-sky-500 dark:text-sky-400',
      iconBg: isDarkMode ? 'bg-sky-500/15 border-sky-500/30' : 'bg-sky-50 border-sky-200',
    },
    {
      id: 'Notes' as const,
      title: language === 'hi' ? 'अध्ययन नोट्स' : 'Chapter Notes',
      icon: FileText,
      iconColor: 'text-indigo-500 dark:text-indigo-400',
      iconBg: isDarkMode ? 'bg-indigo-500/15 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200',
    },
    {
      id: 'Quiz' as const,
      title: language === 'hi' ? 'अभ्यास क्विज़' : 'Practice Quiz',
      icon: CheckSquare,
      iconColor: 'text-purple-500 dark:text-purple-400',
      iconBg: isDarkMode ? 'bg-purple-500/15 border-purple-500/30' : 'bg-purple-50 border-purple-200',
    },
    {
      id: 'IMPORTANT' as const,
      title: language === 'hi' ? 'महत्वपूर्ण प्रश्न' : 'Important Q&A',
      icon: Sparkles,
      iconColor: 'text-rose-500 dark:text-rose-400',
      iconBg: isDarkMode ? 'bg-rose-500/15 border-rose-500/30' : 'bg-rose-50 border-rose-200',
    },
    {
      id: 'PYQ' as const,
      title: language === 'hi' ? 'बोर्ड PYQ पेपर्स' : 'Board PYQ Papers',
      icon: GraduationCap,
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      iconBg: isDarkMode ? 'bg-emerald-500/15 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200',
    },
    {
      id: 'DIAGRAMS' as const,
      title: language === 'hi' ? 'चित्र व ग्राफ' : 'Diagrams & Graphs',
      icon: BarChart2,
      iconColor: 'text-teal-500 dark:text-teal-400',
      iconBg: isDarkMode ? 'bg-teal-500/15 border-teal-500/30' : 'bg-teal-50 border-teal-200',
    },
    {
      id: 'VIDEOS' as const,
      title: language === 'hi' ? 'वीडियो कक्षाएं' : 'Video Lectures',
      icon: Video,
      iconColor: 'text-amber-500 dark:text-amber-400',
      iconBg: isDarkMode ? 'bg-amber-500/15 border-amber-500/30' : 'bg-amber-50 border-amber-200',
    },
    {
      id: 'GLOSSARY' as const,
      title: language === 'hi' ? 'विज्ञान शब्दावली' : 'Science Glossary',
      icon: BookMarked,
      iconColor: 'text-orange-500 dark:text-orange-400',
      iconBg: isDarkMode ? 'bg-orange-500/15 border-orange-500/30' : 'bg-orange-50 border-orange-200',
    },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* 1. Independent, Premium Board Exam Date Countdown Card */}
      <ExamCountdownCard isDarkMode={isDarkMode} />

      {/* 2. Search Bar immediately below Board Date Card */}
      <div className="space-y-1.5">
        <div className="relative z-10">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-amber-400' : 'text-indigo-600'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'खोजें: ओम का नियम, रासायनिक समीकरण, मेंडल का नियम...'
                : 'Search: Ohm\'s Law, Chemical equations, Mendel\'s law...'
            }
            className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-bold transition-all focus:outline-none ${
              isDarkMode
                ? 'input-3d-dark text-slate-100 placeholder-slate-400 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30'
                : 'input-3d-light text-slate-900 placeholder-slate-500 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-500/30 shadow-xs'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick Search Tag Chips */}
        {!searchQuery && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-[10px]">
            <span className="text-slate-400 dark:text-slate-500 font-bold shrink-0">
              {language === 'hi' ? 'सुझाव:' : 'Tags:'}
            </span>
            {quickSearchTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onSearchChange(tag)}
                className={`px-2 py-0.5 rounded-lg border font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  isDarkMode
                    ? 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 shadow-2xs'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 3. Grid of Study Modules: 8 cards including Video classes & Glossary */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className={`text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>{language === 'hi' ? 'अध्ययन अनुभाग (Study Modules)' : 'Study Modules & Resources'}</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((opt) => {
            const IconComponent = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectOption(opt.id)}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden ${
                  isDarkMode
                    ? 'card-3d-dark text-white hover:border-slate-700'
                    : 'card-3d-light text-slate-900 hover:border-indigo-200'
                }`}
              >
                {/* Natural Vector Icon Container */}
                <div className={`w-11 h-11 rounded-2xl border ${opt.iconBg} flex items-center justify-center my-1 transition-transform group-hover:scale-105 shadow-2xs relative shrink-0`}>
                  <IconComponent className={`w-5 h-5 ${opt.iconColor} stroke-[2.2]`} />
                </div>

                {/* Clean, Direct Section Title */}
                <h4 className="text-xs sm:text-sm font-black tracking-tight leading-tight mt-1 text-center">
                  {opt.title}
                </h4>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Science GOAT 3D Doodle Mascot Motivation Card */}
      <div className={`p-4 rounded-3xl border flex items-center gap-3.5 relative overflow-hidden transition-all ${
        isDarkMode
          ? 'card-3d-dark border-amber-500/25 text-white'
          : 'card-3d-light border-amber-400/30 text-slate-900 bg-gradient-to-r from-amber-500/5 via-indigo-500/5 to-transparent'
      }`}>
        <ScienceGoatLogo size="lg" variant="icon-only" showText={false} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Science GOAT • 100/100 मिशन</span>
          </div>
          <h4 className="text-xs sm:text-sm font-black mt-0.5 tracking-tight truncate">
            {language === 'hi' ? 'राजस्थान बोर्ड 10वीं में सर्वश्रेष्ठ स्कोर करें!' : 'Master Class 10 Science with Ease!'}
          </h4>
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {language === 'hi' ? 'सरल हस्तलिखित नोट्स, अध्यायवार क्विज़ और पिछले वर्षों के पेपर्स' : 'Handwritten notes, modular chapter quizzes & solved PYQs'}
          </p>
        </div>
      </div>
    </div>
  );
};

