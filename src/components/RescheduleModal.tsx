import React, { useState } from 'react';
import { X, Calendar, Clock, Bell, Check } from 'lucide-react';
import { AppLanguage, AppSettings, BazarList } from '../types/foddo';
import { translate } from '../utils/translations';
import { ThemeConfig } from '../utils/theme';
import { FODDOStorage } from '../utils/storage';

interface RescheduleModalProps {
  list: BazarList | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (listId: string, newDate: string, newTime: string) => void;
  settings: AppSettings;
  theme: ThemeConfig;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  list,
  isOpen,
  onClose,
  onConfirm,
  settings,
  theme,
}) => {
  const lang = settings.language;
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const thisWeekend = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
  thisWeekend.setDate(today.getDate() + daysUntilSaturday);
  const weekendStr = thisWeekend.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState(list?.reminderTime || '10:00 AM');

  if (!isOpen || !list) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    FODDOStorage.triggerHaptic();
    onConfirm(list.id, selectedDate, selectedTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                Reschedule List
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[180px]">
                {list.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Date Presets */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Quick Date Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setSelectedDate(todayStr)}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                selectedDate === todayStr
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(tomorrowStr)}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                selectedDate === tomorrowStr
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => setSelectedDate(weekendStr)}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                selectedDate === weekendStr
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              Weekend
            </button>
          </div>
        </div>

        {/* Custom Date Input */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Specific Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
          />
        </div>

        {/* Reminder Time */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Reminder Time
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white"
          >
            <option value="08:00 AM">08:00 AM (Early Morning)</option>
            <option value="10:00 AM">10:00 AM (Morning Bazar)</option>
            <option value="12:00 PM">12:00 PM (Noon)</option>
            <option value="04:00 PM">04:00 PM (Afternoon)</option>
            <option value="06:00 PM">06:00 PM (Evening Mandi)</option>
            <option value="08:00 PM">08:00 PM (Night Run)</option>
          </select>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            Update Date & Time
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
