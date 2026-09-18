import React from 'react';
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  CheckCircle2,
  Tag
} from 'lucide-react';
import { AppLanguage, AppSettings, ShoppingHistoryRecord, ItemCategory } from '../types/foddo';
import { translate } from '../utils/translations';
import { ThemeConfig } from '../utils/theme';
import { CategoryIcon } from './CategoryIcon';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ShoppingHistoryRecord[];
  settings: AppSettings;
  theme: ThemeConfig;
  currencySymbol: string;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  history,
  settings,
  theme,
  currencySymbol,
}) => {
  const lang = settings.language;

  if (!isOpen) return null;

  const totalSpent = history.reduce((acc, h) => acc + h.totalSpent, 0);
  const totalTrips = history.length;
  const avgPerTrip = totalTrips > 0 ? Math.round(totalSpent / totalTrips) : 0;

  // Category breakdown calculation
  const categoryTotals: Record<string, { total: number; count: number }> = {};
  const itemCounts: Record<string, { count: number; category: ItemCategory }> = {};

  history.forEach((trip) => {
    trip.items.forEach((item) => {
      const cat = item.category || 'other';
      const itemCost = item.actualPrice || item.estimatedPrice || (trip.totalSpent / (trip.items.length || 1));
      
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { total: 0, count: 0 };
      }
      categoryTotals[cat].total += itemCost;
      categoryTotals[cat].count += 1;

      // Item frequencies
      const itemName = item.name.toLowerCase();
      if (!itemCounts[itemName]) {
        itemCounts[itemName] = { count: 0, category: item.category };
      }
      itemCounts[itemName].count += 1;
    });
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1].total - a[1].total);
  const sortedItems = Object.entries(itemCounts).sort((a, b) => b[1].count - a[1].count).slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        id="modal-spending-analytics"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Spending Analytics
              </h2>
              <p className="text-xs text-slate-400">
                Insights across your bazar trips
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Key Metric Boxes */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Spent</span>
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
              {currencySymbol}{totalSpent.toLocaleString()}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Completed</span>
            <span className="text-base font-black text-slate-900 dark:text-white mt-1 block">
              {totalTrips} trips
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Avg / Trip</span>
            <span className="text-base font-black text-blue-600 dark:text-blue-400 mt-1 block">
              {currencySymbol}{avgPerTrip}
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
              Category Distribution
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              {sortedCategories.length} categories
            </span>
          </div>

          {sortedCategories.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 dark:bg-slate-850 rounded-2xl">
              Complete trips to see category distribution charts
            </p>
          ) : (
            <div className="space-y-2.5">
              {sortedCategories.map(([cat, data]) => {
                const percent = totalSpent > 0 ? Math.round((data.total / totalSpent) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2 capitalize">
                        <CategoryIcon category={cat as ItemCategory} size="sm" />
                        <span>{cat}</span>
                      </div>
                      <span>
                        {currencySymbol}{Math.round(data.total)} ({percent}%)
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${Math.max(percent, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Purchased Items */}
        {sortedItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold tracking-wider text-slate-400 uppercase">
              Most Frequent Items
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {sortedItems.map(([item, info]) => (
                <div
                  key={item}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between capitalize"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate pr-1">
                    {item}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 shrink-0">
                    {info.count}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors"
        >
          Close Analytics
        </button>
      </div>
    </div>
  );
};
