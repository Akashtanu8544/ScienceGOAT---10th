import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Quote, Sparkles } from 'lucide-react';
import { DAILY_TIPS_DATA, DailyTip } from '../data/dailyTipsData';

interface DailyTipCardProps {
  isDarkMode: boolean;
}

export const DailyTipCard: React.FC<DailyTipCardProps> = ({ isDarkMode }) => {
  const [currentTip, setCurrentTip] = useState<DailyTip>(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const savedTip = localStorage.getItem('science_goat_daily_tip');

      if (savedTip) {
        const parsed = JSON.parse(savedTip);
        if (parsed.lastFetchedDate === todayStr && parsed.tipIndex !== undefined) {
          const idx = parsed.tipIndex % DAILY_TIPS_DATA.length;
          return DAILY_TIPS_DATA[idx];
        }
      }

      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - startOfYear.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      const newIdx = dayOfYear % DAILY_TIPS_DATA.length;

      return DAILY_TIPS_DATA[newIdx];
    } catch {
      return DAILY_TIPS_DATA[0];
    }
  });

  const [tipIndex, setTipIndex] = useState<number>(() => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const savedTip = localStorage.getItem('science_goat_daily_tip');

      if (savedTip) {
        const parsed = JSON.parse(savedTip);
        if (parsed.lastFetchedDate === todayStr && parsed.tipIndex !== undefined) {
          return parsed.tipIndex % DAILY_TIPS_DATA.length;
        }
      }

      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 0);
      const diff = now.getTime() - startOfYear.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      return dayOfYear % DAILY_TIPS_DATA.length;
    } catch {
      return 0;
    }
  });

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const nextIdx = (tipIndex + 1) % DAILY_TIPS_DATA.length;
      const todayStr = new Date().toISOString().split('T')[0];
      setTipIndex(nextIdx);
      setCurrentTip(DAILY_TIPS_DATA[nextIdx]);
      localStorage.setItem(
        'science_goat_daily_tip',
        JSON.stringify({ tipIndex: nextIdx, lastFetchedDate: todayStr })
      );
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <div
      className={`relative p-4 rounded-3xl border shadow-lg backdrop-blur-2xl transition-all overflow-hidden ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900/90 via-indigo-950/30 to-slate-900/90 border-indigo-500/30'
          : 'bg-gradient-to-br from-indigo-50/90 via-blue-50/70 to-purple-50/80 border-indigo-200/90 shadow-indigo-500/5'
      }`}
    >
      {/* Decorative Glow */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            {currentTip.category === 'quote' ? (
              <Quote className="w-4 h-4" />
            ) : (
              <Lightbulb className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {currentTip.authorOrTopic || 'दैनिक विज्ञान मंत्र'}
              </span>
              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white leading-tight">
              {currentTip.titleHindi}
            </h4>
          </div>
        </div>

        <button
          onClick={handleManualRefresh}
          title="नया विचार देखें"
          className={`p-2 rounded-xl border transition-all active:scale-95 shrink-0 ${
            isDarkMode
              ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-indigo-300'
              : 'bg-white/80 hover:bg-white border-indigo-100 text-indigo-600 shadow-2xs'
          }`}
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      <p className="text-xs font-medium leading-relaxed text-slate-700 dark:text-slate-300 pl-1">
        {currentTip.contentHindi}
      </p>
    </div>
  );
};
