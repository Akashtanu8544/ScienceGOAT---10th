import React from 'react';
import { Sun, Moon, Share2, Shield, X, Flame, Globe, Check, Zap } from 'lucide-react';
import { ScienceGoatLogo } from './ScienceGoatLogo';
import { useLanguage } from '../utils/languageContext';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenShare: () => void;
  onOpenMoreApps?: () => void;
  onOpenPrivacyPolicy?: () => void;
  streakDays?: number;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleTheme,
  onOpenShare,
  onOpenPrivacyPolicy,
  streakDays = 0,
}) => {
  const { language, toggleLanguage } = useLanguage();

  if (!isOpen) return null;

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {}
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div
        className={`relative z-10 w-72 max-w-[82vw] h-full shadow-2xl flex flex-col backdrop-blur-2xl transition-transform duration-200 ${
          isDarkMode
            ? 'bg-slate-950/95 text-slate-100 border-r border-slate-800'
            : 'bg-white/95 text-slate-900 border-r border-slate-200'
        }`}
      >
        {/* Top Header Section */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
        }`}>
          <ScienceGoatLogo
            size="md"
            showText={true}
            showSubtitle={false}
            badgeText="10th"
          />
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation & Controls Section */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs font-bold custom-scrollbar">
          {/* 1. Daily Study Streak Card (Relocated from Top Header) */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            isDarkMode
              ? 'bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-amber-600/10 border-amber-500/30 text-amber-300'
              : 'bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/70 border-amber-200 text-amber-900 shadow-2xs'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-xs">
                  <Flame className="w-5 h-5 fill-white animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-black tracking-tight text-slate-900 dark:text-amber-200">
                    {language === 'hi' ? 'दैनिक अध्ययन स्ट्रीक' : 'Daily Study Streak'}
                  </div>
                  <div className="text-[10px] font-medium text-slate-600 dark:text-amber-400/80 mt-0.5">
                    {language === 'hi' ? 'प्रतिदिन अभ्यास जारी रखें!' : 'Keep learning every day!'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                  {streakDays}
                </span>
                <span className="text-[10px] font-bold block text-slate-500 dark:text-amber-300/80">
                  {language === 'hi' ? 'दिन' : 'days'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Language Switcher (Hindi ↔ English) (Relocated from Top Header) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 px-0.5">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language === 'hi' ? 'भाषा चयन (Language)' : 'App Language'}</span>
            </label>
            <div className={`grid grid-cols-2 p-1 rounded-2xl border gap-1 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  if (language !== 'hi') toggleLanguage();
                }}
                className={`py-2 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all ${
                  language === 'hi'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>हिंदी (HI)</span>
                {language === 'hi' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  if (language !== 'en') toggleLanguage();
                }}
                className={`py-2 px-2.5 rounded-xl font-black text-xs flex items-center justify-center gap-1 transition-all ${
                  language === 'en'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>English (EN)</span>
                {language === 'en' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            </div>
          </div>

          {/* 3. Dark Mode Switcher */}
          <div
            onClick={() => {
              triggerHaptic();
              onToggleTheme();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onToggleTheme()}
            className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
              isDarkMode
                ? 'bg-slate-900/80 text-amber-300 border-slate-800 hover:border-slate-700'
                : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isDarkMode ? (
                <Moon className="w-4.5 h-4.5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
              ) : (
                <Sun className="w-4.5 h-4.5 text-amber-500" />
              )}
              <span>{isDarkMode ? 'डार्क मोड (Dark Mode)' : 'लाइट मोड (Light Mode)'}</span>
            </div>
            {/* Custom Toggle Switch */}
            <div
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 border ${
                isDarkMode ? 'bg-amber-500 border-amber-600 justify-end' : 'bg-slate-300 border-slate-400 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-xs transform transition-transform" />
            </div>
          </div>

          {/* 4. Menu Options */}
          <div className="space-y-1.5 pt-1">
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                onClose();
                onOpenShare();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all border active:scale-98 ${
                isDarkMode
                  ? 'bg-slate-900/60 hover:bg-slate-900 text-slate-200 border-slate-800'
                  : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200 shadow-2xs'
              }`}
            >
              <Share2 className="w-4.5 h-4.5 text-emerald-500" />
              <span className="truncate">{language === 'hi' ? 'मित्रों के साथ शेयर करें' : 'Share App with Friends'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                onClose();
                if (onOpenPrivacyPolicy) {
                  onOpenPrivacyPolicy();
                }
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all border active:scale-98 ${
                isDarkMode
                  ? 'bg-slate-900/60 hover:bg-slate-900 text-slate-200 border-slate-800'
                  : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200 shadow-2xs'
              }`}
            >
              <Shield className="w-4.5 h-4.5 text-indigo-400" />
              <span className="truncate">{language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-3 border-t flex items-center justify-center gap-2 text-[10px] font-bold ${
          isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <ScienceGoatLogo size="xs" variant="icon-only" showText={false} />
          <span>Science GOAT • RBSE / NCERT 10th Science</span>
        </div>
      </div>
    </div>
  );
};

