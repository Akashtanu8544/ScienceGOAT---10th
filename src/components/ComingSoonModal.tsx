import React, { useState } from 'react';
import {
  Clock,
  Sparkles,
  Tv,
  FileText,
  Bell,
  CheckCircle2,
  X,
  ArrowLeft,
  Calendar,
  Layers,
  GraduationCap
} from 'lucide-react';
import { ScienceGoatLogo } from './ScienceGoatLogo';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: 'video' | 'pyq' | 'solution' | 'general';
  chapterName?: string;
  subtitle?: string;
  isDarkMode?: boolean;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  title,
  type = 'video',
  chapterName,
  subtitle,
  isDarkMode = false,
}) => {
  const [notified, setNotified] = useState(false);

  if (!isOpen) return null;

  const typeConfig = {
    video: {
      icon: Tv,
      color: 'from-amber-500 to-orange-500',
      badgeBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      labelHi: 'वीडियो लेक्चर जल्द आ रहा है',
      labelEn: 'Video Lecture Coming Soon',
      descHi: 'यह वीडियो लेक्चर अभी शिक्षक द्वारा रिकॉर्ड/अपलोड नहीं किया गया है। हमारी विशेषज्ञ टीम इस पर कार्य कर रही है, कृपया प्रतीक्षा करें।',
      descEn: 'This lecture has not been uploaded yet by the educator. Our team is preparing it, please wait.',
    },
    pyq: {
      icon: GraduationCap,
      color: 'from-emerald-500 to-teal-500',
      badgeBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      labelHi: 'बोर्ड प्रश्न-पत्र जल्द आ रहा है',
      labelEn: 'Board PYQ Paper Coming Soon',
      descHi: 'यह बोर्ड प्रश्न-पत्र एवं आधिकारिक समाधान अभी उपलब्ध नहीं कराया गया है। परीक्षा समय सारिणी के अनुसार इसे जल्द ही जोड़ दिया जाएगा।',
      descEn: 'This board exam paper and solution are not yet added. It will be made available shortly.',
    },
    solution: {
      icon: FileText,
      color: 'from-blue-500 to-indigo-500',
      badgeBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
      labelHi: 'विस्तृत समाधान तैयार हो रहा है',
      labelEn: 'Detailed Solution Coming Soon',
      descHi: 'विशेषज्ञ शिक्षकों द्वारा इस प्रश्न-पत्र का हस्तलिखित एवं विस्तृत समाधान तैयार किया जा रहा है।',
      descEn: 'Handwritten step-by-step solutions are being finalized by expert faculty.',
    },
    general: {
      icon: Layers,
      color: 'from-purple-500 to-pink-500',
      badgeBg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
      labelHi: 'सामग्री जल्द उपलब्ध होगी',
      labelEn: 'Content Coming Soon',
      descHi: 'यह अध्ययन सामग्री अभी अपलोड नहीं की गई है। कृपया प्रतीक्षा करें।',
      descEn: 'This study material has not been added yet. Please wait.',
    },
  }[type];

  const IconComponent = typeConfig.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden p-5 sm:p-6 transition-all ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700/80 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-2xl border transition-all active:scale-95 ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
              : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
          }`}
          title="बंद करें (Close)"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center space-y-4 pt-1">
          {/* Cute Doodle Logo Mascot & Icon Badge Combination */}
          <div className="relative">
            <div className="relative p-1">
              <ScienceGoatLogo size="lg" showText={false} />
            </div>

            {/* Floating UI/UX Animated Badge */}
            <div
              className={`absolute -bottom-2 -right-2 p-2 rounded-2xl bg-gradient-to-br ${typeConfig.color} text-white shadow-lg border-2 ${
                isDarkMode ? 'border-slate-900' : 'border-white'
              } animate-bounce`}
            >
              <IconComponent className="w-4 h-4" />
            </div>
          </div>

          {/* Title & Pill Badge */}
          <div className="space-y-1.5 w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider shadow-xs">
              <Clock className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              <span className={typeConfig.badgeBg.split(' ')[1]}>{typeConfig.labelHi}</span>
            </div>

            <h3 className="text-base sm:text-lg font-black leading-snug px-2">
              {title}
            </h3>

            {chapterName && (
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                {chapterName}
              </p>
            )}
          </div>

          {/* Description Box with Animated Progress Bar */}
          <div
            className={`w-full p-3.5 rounded-2xl border text-xs leading-relaxed space-y-2.5 ${
              isDarkMode
                ? 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>तैयारी प्रगति पर है (In Progress)</span>
              </span>
              <span className="font-extrabold text-amber-500">85%</span>
            </div>

            {/* Cute striped animated progress bar */}
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

          {/* Action Buttons */}
          <div className="w-full space-y-2 pt-1">
            <button
              onClick={() => setNotified(!notified)}
              className={`w-full py-3 px-4 rounded-2xl font-black text-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 border shadow-sm ${
                notified
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 border-amber-400'
              }`}
            >
              {notified ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>अपलोड होते ही आपको सूचित किया जाएगा!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>अपलोड होने पर सूचना दें (Notify When Added)</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className={`w-full py-2.5 px-4 rounded-2xl font-bold text-xs transition-all active:scale-[0.98] border ${
                isDarkMode
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
            >
              वापस जाएँ (Go Back)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
