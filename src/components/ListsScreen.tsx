import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  ChevronRight, 
  Plus, 
  X, 
  RotateCcw,
  SlidersHorizontal,
  Tag
} from 'lucide-react';
import { AppLanguage, AppSettings, BazarList, ListItem } from '../types/foddo';
import { translate } from '../utils/translations';
import { ThemeConfig } from '../utils/theme';
import { FODDOStorage } from '../utils/storage';

interface ListsScreenProps {
  lists: BazarList[];
  settings: AppSettings;
  theme: ThemeConfig;
  currencySymbol: string;
  onOpenNewBazar: () => void;
  onOpenList: (list: BazarList) => void;
  onRescheduleList: (list: BazarList) => void;
  onDeleteList: (listId: string) => void;
}

export const ListsScreen: React.FC<ListsScreenProps> = ({
  lists,
  settings,
  theme,
  currencySymbol,
  onOpenNewBazar,
  onOpenList,
  onRescheduleList,
  onDeleteList,
}) => {
  const lang = settings.language;
  const [activeFilter, setActiveFilter] = useState<'all' | 'today' | 'upcoming' | 'overdue' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Calculations
  const activeLists = lists.filter((l) => l.status === 'active');
  const completedLists = lists.filter((l) => l.status === 'completed');
  const overdueLists = activeLists.filter((l) => l.date < todayStr);
  const todayLists = activeLists.filter((l) => l.date === todayStr);
  const upcomingLists = activeLists.filter((l) => l.date > todayStr);

  const pendingItemsCount = activeLists.reduce(
    (acc, list) => acc + list.items.filter((i) => !i.checked).length,
    0
  );

  // Month spent calculation
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthSpent = lists
    .filter((l) => {
      const listDate = new Date(l.date);
      return listDate.getMonth() === currentMonth && listDate.getFullYear() === currentYear;
    })
    .reduce((acc, l) => acc + (l.actualTotalSpent || l.budget || 0), 0);

  // Filtered lists based on active tab & search
  let filteredLists = lists;
  if (activeFilter === 'today') {
    filteredLists = todayLists;
  } else if (activeFilter === 'upcoming') {
    filteredLists = upcomingLists;
  } else if (activeFilter === 'overdue') {
    filteredLists = overdueLists;
  } else if (activeFilter === 'completed') {
    filteredLists = completedLists;
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredLists = filteredLists.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.items.some((item) => item.name.toLowerCase().includes(q))
    );
  }

  const formatListDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {translate(lang, 'lists.title')}
        </h1>

        <div className="flex items-center gap-2">
          <button
            id="btn-lists-search"
            type="button"
            onClick={() => {
              FODDOStorage.triggerHaptic();
              setShowSearch(!showSearch);
            }}
            aria-label="Search lists"
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            id="btn-lists-filter-menu"
            type="button"
            onClick={() => {
              FODDOStorage.triggerHaptic();
              setActiveFilter(activeFilter === 'overdue' ? 'all' : 'overdue');
            }}
            className="h-10 px-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Filter className="w-4 h-4" />
            <span>{translate(lang, 'lists.filter')}</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar (Expandable) */}
      {showSearch && (
        <div className="relative animate-fadeIn">
          <input
            id="input-search-lists"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search list name or items..."
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

      {/* Top 3-Column Stat Box (matching Screenshot 6) */}
      <div 
        id="lists-summary-box"
        className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 p-4 shadow-sm"
      >
        <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-700 text-center">
          <div className="px-2">
            <span className="text-xl font-black text-slate-900 dark:text-white block">
              {activeLists.length}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 block mt-0.5 whitespace-nowrap">
              {translate(lang, 'lists.active_lists')}
            </span>
          </div>

          <div className="px-2">
            <span className="text-xl font-black text-blue-600 dark:text-blue-400 block">
              {pendingItemsCount}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 block mt-0.5 whitespace-nowrap">
              {translate(lang, 'lists.pending_items')}
            </span>
          </div>

          <div className="px-2">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block">
              {currencySymbol}{monthSpent}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 block mt-0.5 whitespace-nowrap">
              {translate(lang, 'lists.spent_month')}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs / Pills (matching Screenshot 6) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: `${translate(lang, 'lists.tab_all')} (${lists.length})` },
          { id: 'today', label: `${translate(lang, 'lists.tab_today')} (${todayLists.length})` },
          { id: 'upcoming', label: `${translate(lang, 'lists.tab_upcoming')} (${upcomingLists.length})` },
          { id: 'overdue', label: `${translate(lang, 'lists.tab_overdue')} (${overdueLists.length})` },
          { id: 'completed', label: `${translate(lang, 'lists.tab_completed')} (${completedLists.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`filter-pill-${tab.id}`}
            type="button"
            onClick={() => {
              FODDOStorage.triggerHaptic();
              setActiveFilter(tab.id as any);
            }}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? `${theme.primaryBg} text-white shadow-sm shadow-blue-500/20`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overdue Section (If in 'all' or 'overdue' filter and overdue items exist) */}
      {(activeFilter === 'all' || activeFilter === 'overdue') && overdueLists.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <h2 className="text-[11px] font-extrabold tracking-wider text-amber-700 dark:text-amber-400 uppercase px-1">
            {translate(lang, 'lists.overdue_header')}
          </h2>

          <div className="space-y-2.5">
            {overdueLists.map((list) => (
              <div
                key={list.id}
                id={`list-card-overdue-${list.id}`}
                className="p-4 rounded-3xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/60 flex items-center justify-between transition-all hover:shadow-sm"
              >
                <div 
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => {
                    FODDOStorage.triggerHaptic();
                    onOpenList(list);
                  }}
                >
                  <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/60 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {list.name}
                    </h3>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                      {translate(lang, 'lists.expired')} · {formatListDate(list.date)}
                    </p>
                  </div>
                </div>

                <button
                  id={`btn-reschedule-${list.id}`}
                  type="button"
                  onClick={() => {
                    FODDOStorage.triggerHaptic();
                    onRescheduleList(list);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 whitespace-nowrap ml-3"
                >
                  {translate(lang, 'lists.reschedule')}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active & Upcoming Section */}
      {(activeFilter === 'all' || activeFilter === 'today' || activeFilter === 'upcoming' || activeFilter === 'completed') && (
        <div className="space-y-2.5 pt-2">
          {activeFilter === 'all' && (
            <h2 className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase px-1">
              {translate(lang, 'lists.active_header')}
            </h2>
          )}

          {filteredLists
            .filter((l) => (activeFilter === 'all' ? l.date >= todayStr : true))
            .map((list) => {
              const pendingItems = list.items.filter((i) => !i.checked).length;
              const isCompleted = list.status === 'completed';

              return (
                <div
                  key={list.id}
                  id={`list-card-${list.id}`}
                  onClick={() => {
                    FODDOStorage.triggerHaptic();
                    onOpenList(list);
                  }}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 flex items-center justify-between cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isCompleted 
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border-emerald-200 dark:border-emerald-800'
                        : 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {list.name}
                        </h3>
                        {list.date === todayStr && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                            {translate(lang, 'lists.due_today')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {translate(lang, 'lists.items_count', { count: list.items.length })} · {formatListDate(list.date)} {list.reminderTime && `(${list.reminderTime})`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {list.budget && (
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:inline">
                        {currencySymbol}{list.budget}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Empty State */}
      {filteredLists.length === 0 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-center space-y-3 shadow-sm my-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-700/60 text-slate-400 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {translate(lang, 'lists.empty_state')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Create a new shopping list to get organized
            </p>
          </div>
          <button
            id="btn-empty-create-list"
            type="button"
            onClick={onOpenNewBazar}
            className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl ${theme.primaryBg} text-white text-xs font-bold shadow-sm transition-all active:scale-95`}
          >
            <Plus className="w-4 h-4" />
            {translate(lang, 'lists.create_new')}
          </button>
        </div>
      )}
    </div>
  );
};
