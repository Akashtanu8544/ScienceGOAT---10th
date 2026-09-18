import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Tv,
  GraduationCap,
  Bell,
  CheckCircle2,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';
import { ScienceGoatLogo } from './ScienceGoatLogo';

interface ComingSoonPlaceholderProps {
  title: string;
  type?: 'video' | 'pyq' | 'solution' | 'general';
  chapterName?: string;
  subtitle?: string;
  onBack?: () => void;
  onExploreOther?: () => void;
  isDarkMode?: boolean;
}

export const ComingSoonPlaceholder: React.FC<ComingSoonPlaceholderProps> = ({
  title,
  type = 'video',
  chapterName,
  subtitle,
  onBack,
  onExploreOther,
  isDarkMode = false,
}) => {
  const [notified, setNotified] = useState(false);

  const typeConfig = {
    video: {
      icon: Tv,
      color: 'from-amber-500 to-orange-500',
      badgeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      labelHi: 'वीडियो लेक्चर जल्द आ रहा है',
      labelEn: 'Video Lecture Coming Soon',
      descHi: 'यह वीडियो लेक्चर अभी शिक्षक द्वारा जोड़ा नहीं गया है। कृपया प्रतीक्षा करें, यह शीघ्र ही उपलब्ध होगा।',
    },
    pyq: {
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-500',
      badgeBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      labelHi: 'बोर्ड पेपर जल्द आ रहा है',
      labelEn: 'Board Paper Coming Soon',
      descHi: 'यह बोर्ड प्रश्न-पत्र अभी तैयार किया जा रहा है। परीक्षा ब्लूप्रिंट के अनुसार इसे शीघ्र ही अपलोड कर दिया जाएगा।',
    },
    solution: {
      icon: GraduationCap,
      color: 'from-blue-500 to-indigo-500',
      badgeBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      labelHi: 'समाधान जल्द उपलब्ध होगा',
      labelEn: 'Solution Coming Soon',
      descHi: 'शिक्षकों द्वारा इस प्रश्न-पत्र का पूर्ण हल तैयार किया जा रहा है। कृपया प्रतीक्षा करें।',
    },
    general: {
      icon: Clock,
      color: 'from-purple-500 to-pink-500',
      badgeBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      labelHi: 'सामग्री जल्द आ रही है',
      labelEn: 'Content Coming Soon',
      descHi: 'यह अध्ययन सामग्री अभी अपलोड नहीं की गई है। कृपया प्रतीक्षा करें।',
    },
  }[type];

  const IconComponent = typeConfig.icon;

  return (
    <div
      className={`w-full p-6 sm:p-8 rounded-3xl border flex flex-col items-center justify-center text-center space-y-4 my-2 transition-all ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Cute Mascot and Floating Icon */}
      <div className="relative">
        <div className="p-1">
          <ScienceGoatLogo size="lg" showText={false} />
        </div>
        <div
          className={`absolute -bottom-2 -right-2 p-2 rounded-2xl bg-gradient-to-br ${typeConfig.color} text-white shadow-lg border-2 ${
            isDarkMode ? 'border-slate-900' : 'border-white'
          } animate-bounce`}
        >
          <IconComponent className="w-4 h-4" />
        </div>
      </div>

      {/* Badge & Title */}
      <div className="space-y-1.5 max-w-sm">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider shadow-xs">
          <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
          <span className={typeConfig.badgeBg.split(' ')[1]}>{typeConfig.labelHi}</span>
        </div>

        <h3 className="text-sm sm:text-base font-black px-2">
          {title}
        </h3>

        {chapterName && (
          <p className="text-xs font-bold text-slate-400">
            {chapterName}
          </p>
        )}
      </div>

      {/* Info Card with Progress Bar */}
      <div
        className={`w-full max-w-sm p-4 rounded-2xl border text-xs leading-relaxed space-y-2.5 ${
          isDarkMode
            ? 'bg-slate-800/60 border-slate-700/60 text-slate-300'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>अपलोड प्रगति: कार्य जारी है</span>
          </span>
          <span className="font-extrabold text-amber-500">85%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${typeConfig.color} transition-all duration-1000`}
            style={{ width: '85%' }}
          />
        </div>

        <p className="text-[11px] sm:text-xs">
          {subtitle || typeConfig.descHi}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-sm pt-1">
        <button
          onClick={() => setNotified(!notified)}
          className={`w-full py-2.5 px-4 rounded-2xl font-black text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 border shadow-sm ${
            notified
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400'
          }`}
        >
          {notified ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>सूचना सहेजी गई!</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              <span>अपलोड होने पर सूचना दें</span>
            </>
          )}
        </button>

        {onBack && (
          <button
            onClick={onBack}
            className={`w-full sm:w-auto py-2.5 px-4 rounded-2xl font-bold text-xs transition-all active:scale-[0.98] border flex items-center justify-center gap-1 shrink-0 ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>वापस जाएँ</span>
          </button>
        )}
      </div>
    </div>
  );
};
