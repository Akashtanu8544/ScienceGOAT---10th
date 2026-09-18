import React, { useState } from 'react';
import { 
  X, 
  User, 
  Users, 
  Clock, 
  Bell, 
  CalendarDays, 
  Plus, 
  Check, 
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { AppLanguage, AppSettings, BazarList, ListItem } from '../types/foddo';
import { translate } from '../utils/translations';
import { ThemeConfig } from '../utils/theme';
import { FODDOStorage } from '../utils/storage';

interface NewBazarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateList: (newList: Omit<BazarList, 'id' | 'createdAt'>) => void;
  settings: AppSettings;
  theme: ThemeConfig;
  initialTemplateItems?: ListItem[];
  initialName?: string;
}

export const NewBazarModal: React.FC<NewBazarModalProps> = ({
  isOpen,
  onClose,
  onCreateList,
  settings,
  theme,
  initialTemplateItems = [],
  initialName = '',
}) => {
  const lang = settings.language;
  const [bazarName, setBazarName] = useState(initialName || "Today's Bazar");
  const [mode, setMode] = useState<'solo' | 'shared'>('solo');
  const [reminderTime, setReminderTime] = useState('10:00 AM');
  const [customTime, setCustomTime] = useState('');
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [budget, setBudget] = useState('');

  // Generate date strip for current week & next week
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(() => today.toISOString().split('T')[0]);

  if (!isOpen) return null;

  // Month & Year string
  const monthYearString = today.toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', {
    month: 'long',
    year: 'numeric',
  });

  // 14 days calendar strip
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dateStr, dayName, dayNum, fullDate: d };
  });

  const quickSuggestions = [
    { label: translate(lang, 'new_bazar.sug_weekly'), value: 'Weekly Bazar' },
    { label: translate(lang, 'new_bazar.sug_monthly'), value: 'Monthly Bazar' },
    { label: translate(lang, 'new_bazar.sug_quick'), value: 'Quick Run' },
    { label: translate(lang, 'new_bazar.sug_weekend'), value: 'Weekend Market' },
    { label: translate(lang, 'new_bazar.sug_morning'), value: 'Morning Mandi' },
  ];

  const reminderOptions = ['10:00 AM', '12:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bazarName.trim()) return;

    FODDOStorage.triggerHaptic();
    onCreateList({
      name: bazarName.trim(),
      date: selectedDate,
      reminderTime: showCustomTime && customTime ? customTime : reminderTime,
      status: 'active',
      mode,
      budget: budget ? parseFloat(budget) : undefined,
      items: initialTemplateItems.length > 0 ? initialTemplateItems : [],
    });

    onClose();
  };

  const isToday = selectedDate === today.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto animate-fadeIn">
      <div 
        id="modal-new-bazar"
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[92vh] overflow-y-auto"
      >
        {/* Header with Title, Month/Year & Mode Badge */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {translate(lang, 'new_bazar.title')}
            </h2>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
              {monthYearString}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                FODDOStorage.triggerHaptic();
                setMode(mode === 'solo' ? 'shared' : 'solo');
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
            >
              {mode === 'solo' ? <User className="w-3 h-3" /> : <Users className="w-3 h-3" />}
              <span>{mode === 'solo' ? 'Solo' : 'Shared'}</span>
            </button>

            <button
              id="btn-close-new-bazar"
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Calendar Strip (matching Screenshot 3) */}
        <div className="p-3.5 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {dateOptions.map((opt) => {
              const isSelected = opt.dateStr === selectedDate;
              return (
                <button
                  key={opt.dateStr}
                  type="button"
                  onClick={() => {
                    FODDOStorage.triggerHaptic();
                    setSelectedDate(opt.dateStr);
                  }}
                  className={`flex flex-col items-center justify-center min-w-[50px] py-2 px-1.5 rounded-2xl transition-all ${
                    isSelected
                      ? `${theme.primaryBg} text-white shadow-md shadow-blue-500/30 scale-105`
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`text-[11px] font-semibold ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                    {opt.dayName}
                  </span>
                  <span className="text-base font-black mt-0.5">
                    {opt.dayNum}
                  </span>
                  {isSelected && (
                    <span className="w-1 h-1 rounded-full bg-white mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bazar Name Box (matching Screenshot 3) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase px-1">
              {translate(lang, 'new_bazar.bazar_name')}
            </label>
            <div className="relative">
              <input
                id="input-bazar-name"
                type="text"
                value={bazarName}
                onChange={(e) => setBazarName(e.target.value)}
                placeholder={translate(lang, 'new_bazar.name_placeholder')}
                className="w-full px-4 py-3.5 pr-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                required
              />
              {bazarName && (
                <button
                  type="button"
                  onClick={() => setBazarName('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Suggestions (matching Screenshot 3) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase px-1">
              {translate(lang, 'new_bazar.quick_suggestions')}
            </span>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((sug) => (
                <button
                  key={sug.value}
                  type="button"
                  onClick={() => {
                    FODDOStorage.triggerHaptic();
                    setBazarName(sug.label);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    bazarName === sug.label
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 text-blue-600 dark:text-blue-400'
                      : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {sug.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Time Box (matching Screenshot 3) */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-extrabold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                {translate(lang, 'new_bazar.reminder_time')}
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                {showCustomTime && customTime ? customTime : reminderTime}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {reminderOptions.map((time) => {
                const isSelected = !showCustomTime && reminderTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      FODDOStorage.triggerHaptic();
                      setShowCustomTime(false);
                      setReminderTime(time);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-600 dark:text-blue-400 ring-2 ring-blue-400/20'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setShowCustomTime(!showCustomTime)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  showCustomTime
                    ? 'bg-blue-50 border-blue-400 text-blue-600'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                + Custom
              </button>
            </div>

            {showCustomTime && (
              <div className="pt-2 animate-fadeIn">
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Create Button (matching Screenshot 3) */}
          <div className="pt-2 space-y-2.5">
            <button
              id="btn-submit-create-list"
              type="submit"
              className={`w-full py-4 rounded-2xl ${theme.primaryBg} ${theme.primaryHover} text-white font-black text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all transform active:scale-98`}
            >
              {translate(lang, 'new_bazar.btn_create')}
            </button>

            {/* Reminder Alert Footnote (matching Screenshot 3) */}
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-blue-500" />
              <span>
                {translate(lang, 'new_bazar.reminder_note', {
                  day: isToday ? (lang === 'bn' ? 'আজ' : 'today') : selectedDate,
                  time: showCustomTime && customTime ? customTime : reminderTime,
                })}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
