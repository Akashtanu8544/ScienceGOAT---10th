import React from 'react';
import { 
  ShoppingBasket, 
  ShoppingBag, 
  Salad, 
  Beef, 
  Milk, 
  Package, 
  AlertCircle, 
  Bell, 
  ChevronRight, 
  Sparkles, 
  User, 
  CalendarDays,
  ArrowRight,
  Clock
} from 'lucide-react';
import { AppLanguage, AppSettings, BazarList, QuickStartTemplate } from '../types/foddo';
import { translate } from '../utils/translations';
import { ThemeConfig } from '../utils/theme';
import { DEFAULT_TEMPLATES, FODDOStorage } from '../utils/storage';

interface HomeScreenProps {
  lists: BazarList[];
  settings: AppSettings;
  theme: ThemeConfig;
  currencySymbol: string;
  onOpenNewBazar: () => void;
  onSelectTab: (tab: 'home' | 'lists' | 'history' | 'settings') => void;
  onSelectTemplate: (template: QuickStartTemplate) => void;
  onOpenList: (list: BazarList) => void;
  onOpenNotifications: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  lists,
  settings,
  theme,
  currencySymbol,
  onOpenNewBazar,
  onSelectTab,
  onSelectTemplate,
  onOpenList,
  onOpenNotifications,
}) => {
  const lang = settings.language;

  // Determine Greeting based on hour
  const currentHour = new Date().getHours();
  let greetingKey = 'home.greeting.morning';
  if (currentHour >= 12 && currentHour < 17) {
    greetingKey = 'home.greeting.afternoon';
  } else if (currentHour >= 17 || currentHour < 5) {
    greetingKey = 'home.greeting.evening';
  }

  // Format today's date
  const now = new Date();
  const dateFormatted = now.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).toUpperCase();

  // Calculate overdue lists
  const todayStr = now.toISOString().split('T')[0];
  const activeLists = lists.filter((l) => l.status === 'active');
  const overdueLists = activeLists.filter((l) => l.date < todayStr);
  const todayLists = activeLists.filter((l) => l.date === todayStr);

  const handleCreateList = () => {
    FODDOStorage.triggerHaptic();
    onOpenNewBazar();
  };

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Salad':
        return <Salad className="w-6 h-6 text-green-600 dark:text-green-400" />;
      case 'Beef':
        return <Beef className="w-6 h-6 text-rose-600 dark:text-rose-400" />;
      case 'Milk':
        return <Milk className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      default:
        return <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Top Header */}
      <div className="flex items-start justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400">
              {dateFormatted}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <User className="w-2.5 h-2.5" />
              {translate(lang, 'home.solo')}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            {translate(lang, greetingKey)}
          </h1>
        </div>

        <button
          id="btn-home-notifications"
          type="button"
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm relative"
        >
          <Bell className="w-5 h-5" />
          {overdueLists.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-800" />
          )}
        </button>
      </div>

      {/* Overdue Alert Banner (Amber box as in screenshot) */}
      {overdueLists.length > 0 && (
        <div 
          id="banner-overdue-alert"
          className="rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/60 p-4 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                  {translate(lang, 'home.overdue_alert_title', { count: overdueLists.length })}
                </h2>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                  {translate(lang, 'home.overdue_alert_sub')}
                </p>
              </div>
            </div>
            <button
              id="btn-view-overdue-lists"
              type="button"
              onClick={() => {
                FODDOStorage.triggerHaptic();
                onSelectTab('lists');
              }}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 whitespace-nowrap px-2.5 py-1.5 rounded-lg bg-amber-100/60 dark:bg-amber-900/40 hover:bg-amber-100 transition-colors"
            >
              {translate(lang, 'home.view_in_lists')}
            </button>
          </div>
        </div>
      )}

      {/* Main Action Box / Hero Empty Basket Box */}
      <div 
        id="hero-basket-card"
        className="rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 p-6 sm:p-8 text-center shadow-sm space-y-4"
      >
        {/* Pure Vector Icon Box */}
        <div className="mx-auto w-24 h-24 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
          <ShoppingBasket className="w-12 h-12 stroke-[1.75]" />
        </div>

        <div className="space-y-1.5 max-w-xs mx-auto">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {translate(lang, 'home.empty_title')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {translate(lang, 'home.empty_sub')}
          </p>
        </div>

        <div className="pt-2 flex flex-col items-center gap-2.5">
          <button
            id="btn-create-first-list"
            type="button"
            onClick={handleCreateList}
            className={`w-full max-w-xs py-3.5 px-6 rounded-2xl ${theme.primaryBg} ${theme.primaryHover} text-white font-bold text-sm tracking-wide shadow-md shadow-blue-500/25 transition-all transform active:scale-98`}
          >
            {translate(lang, 'home.create_first_list')}
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            {translate(lang, 'home.fast_badge')}
          </span>
        </div>
      </div>

      {/* Quick Start Templates Section */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {translate(lang, 'home.quick_templates')}
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            1-Tap Add
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {DEFAULT_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.id}
              id={`template-btn-${tmpl.id}`}
              type="button"
              onClick={() => {
                FODDOStorage.triggerHaptic();
                onSelectTemplate(tmpl);
              }}
              className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm transition-all text-center group active:scale-95"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 border ${tmpl.bgTint} transition-transform group-hover:scale-110`}>
                {getTemplateIcon(tmpl.iconName)}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                {translate(lang, tmpl.titleKey)}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {tmpl.items.length} items
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Today / Upcoming Quick Access if available */}
      {todayLists.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              {translate(lang, 'home.today_trips')}
            </h3>
            <button
              type="button"
              onClick={() => onSelectTab('lists')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1"
            >
              {translate(lang, 'lists.tab_all')}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {todayLists.map((list) => {
              const pendingCount = list.items.filter((i) => !i.checked).length;
              return (
                <div
                  key={list.id}
                  id={`home-list-card-${list.id}`}
                  onClick={() => onOpenList(list)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:border-blue-300 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{list.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {list.items.length} items · {pendingCount} pending
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
