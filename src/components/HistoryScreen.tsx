import React, { useState } from 'react';
import { 
  Search, 
  BarChart3, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Receipt, 
  RotateCcw, 
  X, 
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';
import { AppLanguage, AppSettings, ShoppingHistoryRecord } from '../types/foddo';
import { translate } from '../utils/translations';
import { ThemeConfig } from '../utils/theme';
import { FODDOStorage } from '../utils/storage';

interface HistoryScreenProps {
  history: ShoppingHistoryRecord[];
  settings: AppSettings;
  theme: ThemeConfig;
  currencySymbol: string;
  onOpenAnalytics: () => void;
  onRecreateList: (record: ShoppingHistoryRecord) => void;
  onViewRecord: (record: ShoppingHistoryRecord) => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  settings,
  theme,
  currencySymbol,
  onOpenAnalytics,
  onRecreateList,
  onViewRecord,
}) => {
  const lang = settings.language;
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const totalSpent = history.reduce((acc, r) => acc + r.totalSpent, 0);

  const filteredHistory = history.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.listName.toLowerCase().includes(q) ||
      r.items.some((i) => i.name.toLowerCase().includes(q))
    );
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Header with Search and Analytics (matching Screenshot 5) */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {translate(lang, 'history.title')}
        </h1>

        <div className="flex items-center gap-2">
          <button
            id="btn-history-search"
            type="button"
            onClick={() => {
              FODDOStorage.triggerHaptic();
              setShowSearch(!showSearch);
            }}
            aria-label="Search history"
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            id="btn-history-analytics"
            type="button"
            onClick={() => {
              FODDOStorage.triggerHaptic();
              onOpenAnalytics();
            }}
            className="h-10 px-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition-colors shadow-sm"
          >
            <BarChart3 className="w-4 h-4" />
            <span>{translate(lang, 'history.analytics')}</span>
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {showSearch && (
        <div className="relative animate-fadeIn">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search past trips or items..."
            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Top 2-Column Stat Box (matching Screenshot 5) */}
      <div 
        id="history-stat-box"
        className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 p-5 shadow-sm"
      >
        <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-slate-700 text-center">
          <div className="px-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white block">
              {history.length}
            </span>
            <span className="text-xs font-bold text-slate-400 block mt-1">
              {translate(lang, 'history.completed')}
            </span>
          </div>

          <div className="px-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
              {currencySymbol}{totalSpent.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-400 block mt-1">
              {translate(lang, 'history.lifetime_spent')}
            </span>
          </div>
        </div>
      </div>

      {/* Empty State (matching Screenshot 5) */}
      {filteredHistory.length === 0 && (
        <div 
          id="history-empty-state"
          className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 p-8 sm:p-12 text-center space-y-4 shadow-sm my-4"
        >
          {/* UI Icon Box (matching Screenshot 5) */}
          <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
            <Clock className="w-8 h-8 stroke-[2.2]" />
          </div>

          <div className="space-y-1 max-w-xs mx-auto">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              {translate(lang, 'history.no_history_title')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {translate(lang, 'history.no_history_sub')}
            </p>
          </div>
        </div>
      )}

      {/* History Items List */}
      {filteredHistory.length > 0 && (
        <div className="space-y-3 pt-1">
          {filteredHistory.map((record) => (
            <div
              key={record.id}
              id={`history-card-${record.id}`}
              className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 hover:border-blue-300 transition-all shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => onViewRecord(record)}
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {record.listName}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatDate(record.date)} · {record.itemCount} items
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-base font-black text-slate-900 dark:text-white block">
                    {currencySymbol}{record.totalSpent}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    Paid
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => onViewRecord(record)}
                  className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  View Breakdown
                </button>

                <button
                  type="button"
                  onClick={() => {
                    FODDOStorage.triggerHaptic();
                    onRecreateList(record);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {translate(lang, 'history.recreate')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
