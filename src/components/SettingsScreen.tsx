import React, { useState } from 'react';
import { 
  Languages, 
  Sun, 
  Palette, 
  DollarSign, 
  Smartphone, 
  Bell, 
  Moon, 
  Zap, 
  Info, 
  FileText, 
  Shield, 
  Star, 
  Share2, 
  Trash2, 
  RotateCcw, 
  ChevronRight,
  Check,
  CheckCircle2,
  X
} from 'lucide-react';
import { AppLanguage, AppSettings, AppTheme, ColorPalette } from '../types/foddo';
import { translate } from '../utils/translations';
import { COLOR_PALETTES, CURRENCIES, ThemeConfig } from '../utils/theme';
import { FODDOStorage } from '../utils/storage';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearShoppingData: () => void;
  onResetAllData: () => void;
  theme: ThemeConfig;
  onOpenLegalModal: (type: 'about' | 'terms' | 'privacy' | 'rate' | 'share' | 'sync') => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onClearShoppingData,
  onResetAllData,
  theme,
  onOpenLegalModal,
}) => {
  const lang = settings.language;
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleLanguageChange = (newLang: AppLanguage) => {
    FODDOStorage.triggerHaptic();
    onUpdateSettings({ language: newLang });
  };

  const handleAppearanceChange = (appearance: AppTheme) => {
    FODDOStorage.triggerHaptic();
    onUpdateSettings({ appearance });
  };

  const handlePaletteChange = (palette: ColorPalette) => {
    FODDOStorage.triggerHaptic();
    onUpdateSettings({ colorPalette: palette });
  };

  const handleCurrencyChange = (currencyCode: string) => {
    FODDOStorage.triggerHaptic();
    onUpdateSettings({ currency: currencyCode });
  };

  return (
    <div className="space-y-6 pb-24 animate-fadeIn">
      {/* Title */}
      <div className="pt-1">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {translate(lang, 'settings.title')}
        </h1>
      </div>

      {/* ========================================================
          PREFERENCES BOX (matching Screenshot 2)
          ======================================================== */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase px-1">
          {translate(lang, 'settings.preferences')}
        </h2>

        <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 divide-y divide-slate-100 dark:divide-slate-700/60 shadow-sm overflow-hidden">
          
          {/* Language Selector */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
                <Languages className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.language')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translate(lang, 'settings.lang_sub')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="btn-lang-en"
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  settings.language === 'en'
                    ? `${theme.primaryBg} text-white shadow-sm shadow-blue-500/20`
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                English
              </button>
              <button
                id="btn-lang-bn"
                type="button"
                onClick={() => handleLanguageChange('bn')}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                  settings.language === 'bn'
                    ? `${theme.primaryBg} text-white shadow-sm shadow-blue-500/20`
                    : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                বাংলা
              </button>
            </div>
          </div>

          {/* Appearance (System / Light / Dark) */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.appearance')}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['system', 'light', 'dark'] as AppTheme[]).map((thm) => (
                <button
                  key={thm}
                  id={`btn-theme-${thm}`}
                  type="button"
                  onClick={() => handleAppearanceChange(thm)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all ${
                    settings.appearance === thm
                      ? `${theme.primaryBg} text-white shadow-sm shadow-blue-500/20`
                      : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {translate(lang, `settings.theme_${thm}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette (7 Aesthetics with double dots) */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center shrink-0">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.color_palette')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translate(lang, 'settings.palette_sub')}
                </p>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {Object.values(COLOR_PALETTES).map((pal) => {
                const isSelected = settings.colorPalette === pal.id;
                return (
                  <button
                    key={pal.id}
                    id={`btn-palette-${pal.id}`}
                    type="button"
                    onClick={() => handlePaletteChange(pal.id)}
                    className={`flex flex-col items-center min-w-[110px] p-2.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: pal.dotColor1 }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: pal.dotColor2 }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {pal.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currency Selector */}
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.currency')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translate(lang, 'settings.currency_sub')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {CURRENCIES.map((curr) => {
                const isSelected = settings.currency === curr.code;
                return (
                  <button
                    key={curr.code}
                    id={`btn-curr-${curr.code}`}
                    type="button"
                    onClick={() => handleCurrencyChange(curr.code)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? `${theme.primaryBg} text-white border-transparent shadow-sm`
                        : 'bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 border-transparent hover:bg-slate-200'
                    }`}
                  >
                    {curr.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Haptic Feedback Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.haptic')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translate(lang, 'settings.haptic_sub')}
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.hapticFeedback}
              onClick={() => {
                const nextVal = !settings.hapticFeedback;
                onUpdateSettings({ hapticFeedback: nextVal });
                if (nextVal) FODDOStorage.triggerHaptic();
              }}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.hapticFeedback ? theme.primaryBg : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.hapticFeedback ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Notifications Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.notifications')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translate(lang, 'settings.notifications_sub')}
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.notifications}
              onClick={() => {
                FODDOStorage.triggerHaptic();
                onUpdateSettings({ notifications: !settings.notifications });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.notifications ? theme.primaryBg : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Night Reminder Toggle */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.night_reminder')}
                </h3>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.nightReminder}
              onClick={() => {
                FODDOStorage.triggerHaptic();
                onUpdateSettings({ nightReminder: !settings.nightReminder });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.nightReminder ? theme.primaryBg : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.nightReminder ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Background Sync & Auto-Start (matching Screenshot 2 bottom item) */}
          <div
            onClick={() => {
              FODDOStorage.triggerHaptic();
              onOpenLegalModal('sync');
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.bg_sync')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translate(lang, 'settings.bg_sync_sub')}
                </p>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

        </div>
      </div>

      {/* ========================================================
          APP & LEGAL BOX (matching Screenshot 1)
          ======================================================== */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase px-1">
          {translate(lang, 'settings.app_legal')}
        </h2>

        <div className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 divide-y divide-slate-100 dark:divide-slate-700/60 shadow-sm overflow-hidden">
          
          {/* About FODDO */}
          <div
            id="item-about-foddo"
            onClick={() => {
              FODDOStorage.triggerHaptic();
              onOpenLegalModal('about');
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.about')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translate(lang, 'settings.about_sub')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Terms & Conditions */}
          <div
            id="item-terms"
            onClick={() => {
              FODDOStorage.triggerHaptic();
              onOpenLegalModal('terms');
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.terms')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translate(lang, 'settings.terms_sub')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Privacy Policy */}
          <div
            id="item-privacy"
            onClick={() => {
              FODDOStorage.triggerHaptic();
              onOpenLegalModal('privacy');
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.privacy')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translate(lang, 'settings.privacy_sub')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Rate This App */}
          <div
            id="item-rate"
            onClick={() => {
              FODDOStorage.triggerHaptic();
              onOpenLegalModal('rate');
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.rate')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translate(lang, 'settings.rate_sub')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

          {/* Share This App */}
          <div
            id="item-share"
            onClick={() => {
              FODDOStorage.triggerHaptic();
              onOpenLegalModal('share');
            }}
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60 flex items-center justify-center shrink-0">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {translate(lang, 'settings.share')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {translate(lang, 'settings.share_sub')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>

        </div>
      </div>

      {/* ========================================================
          DANGER ZONE BOX (matching Screenshot 1)
          ======================================================== */}
      <div className="space-y-2">
        <h2 className="text-[11px] font-extrabold tracking-wider text-rose-600 dark:text-rose-400 uppercase px-1">
          {translate(lang, 'settings.danger_zone')}
        </h2>

        <div className="rounded-3xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/90 dark:border-rose-900/40 divide-y divide-rose-100 dark:divide-rose-900/40 shadow-sm overflow-hidden">
          
          {/* Clear All Data */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400">
                    {translate(lang, 'settings.clear_data')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {translate(lang, 'settings.clear_data_sub')}
                  </p>
                </div>
              </div>

              <button
                id="btn-clear-all-data"
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-rose-600 border border-rose-200 dark:border-rose-800/60 hover:bg-rose-50 transition-colors shadow-xs"
              >
                Clear
              </button>
            </div>

            {showClearConfirm && (
              <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-800 space-y-2.5 animate-fadeIn">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Are you sure you want to delete all shopping lists and history?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onClearShoppingData();
                      setShowClearConfirm(false);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                  >
                    Yes, Clear Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset All */}
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60 flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-orange-700 dark:text-orange-400">
                    {translate(lang, 'settings.reset')}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {translate(lang, 'settings.reset_sub')}
                  </p>
                </div>
              </div>

              <button
                id="btn-reset-all"
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-orange-600 border border-orange-200 dark:border-orange-800/60 hover:bg-orange-50 transition-colors shadow-xs"
              >
                Reset
              </button>
            </div>

            {showResetConfirm && (
              <div className="mt-3 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-800 space-y-2.5 animate-fadeIn">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  This will reset all preferences, theme choices, lists and history back to default.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onResetAllData();
                      setShowResetConfirm(false);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
                  >
                    Yes, Full Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer Tagline (matching Screenshot 1) */}
      <div className="text-center pt-2 pb-4">
        <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          {translate(lang, 'settings.footer_tagline')}
        </p>
      </div>
    </div>
  );
};
