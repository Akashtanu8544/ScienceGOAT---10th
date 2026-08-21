import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Award, CheckCircle2 } from 'lucide-react';

interface StudyStreakCardProps {
  isDarkMode: boolean;
}

interface StreakData {
  streakCount: number;
  lastActiveDate: string;
  historyDates?: string[]; // Keeps track of active dates YYYY-MM-DD
}

export const StudyStreakCard: React.FC<StudyStreakCardProps> = ({ isDarkMode }) => {
  const [streak, setStreak] = useState<number>(1);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Yesterday calculation
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    const saved = localStorage.getItem('science_goat_streak_data');
    let currentStreak = 1;
    let historyList: string[] = [todayStr];

    if (saved) {
      try {
        const parsed: StreakData = JSON.parse(saved);
        historyList = parsed.historyDates || [todayStr];
        
        if (!historyList.includes(todayStr)) {
          historyList.push(todayStr);
        }

        if (parsed.lastActiveDate === todayStr) {
          // Already logged in today
          currentStreak = parsed.streakCount || 1;
        } else if (parsed.lastActiveDate === yesterdayStr) {
          // Continued consecutive streak
          currentStreak = (parsed.streakCount || 0) + 1;
        } else {
          // Streak broken, restart at 1
          currentStreak = 1;
        }
      } catch (e) {
        console.error('Failed to parse streak data:', e);
      }
    }

    // Retain only last 30 days history for lightness
    if (historyList.length > 30) {
      historyList = historyList.slice(historyList.length - 30);
    }

    setStreak(currentStreak);
    setHistory(historyList);

    const updatedData: StreakData = {
      streakCount: currentStreak,
      lastActiveDate: todayStr,
      historyDates: historyList,
    };

    localStorage.setItem('science_goat_streak_data', JSON.stringify(updatedData));
  }, []);

  // Determine motivational badge based on streak
  const getStreakBadge = (count: number) => {
    if (count >= 30) return { label: 'RBSE लीजेंड 👑', color: 'bg-amber-500 text-slate-950 border-amber-300' };
    if (count >= 14) return { label: 'साइंस टॉपर 🏆', color: 'bg-rose-500 text-white border-rose-300' };
    if (count >= 7) return { label: 'बोर्ड फाइटर 🚀', color: 'bg-purple-500 text-white border-purple-300' };
    if (count >= 3) return { label: 'स्पीड मोड 🔥', color: 'bg-orange-500 text-white border-orange-300' };
    return { label: 'शुरुआत ⚡', color: 'bg-emerald-500 text-white border-emerald-300' };
  };

  const badge = getStreakBadge(streak);

  // Generate last 7 days representation
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('hi-IN', { weekday: 'narrow' }) || 'दिन';
      const isActive = history.includes(dateStr) || i === 0;

      days.push({
        dateStr,
        dayName,
        isActive,
        isToday: i === 0,
      });
    }
    return days;
  };

  const last7Days = getLast7Days();

  return (
    <div
      className={`p-4 rounded-3xl border shadow-lg backdrop-blur-2xl transition-all relative overflow-hidden ${
        isDarkMode
          ? 'bg-gradient-to-br from-slate-900/90 via-orange-950/20 to-slate-900/90 border-orange-500/30'
          : 'bg-gradient-to-br from-orange-50/90 via-amber-50/70 to-rose-50/80 border-orange-200/90 shadow-orange-500/5'
      }`}
    >
      {/* Decorative Glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl shadow-md shrink-0 animate-bounce">
            🔥
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                स्टडी स्ट्रिक (Study Streak)
              </h4>
            </div>
            <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1">
              <span>{streak} दिन लगातार पढ़ाई</span>
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border shadow-xs ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      {/* 7-Day Visual Tracker */}
      <div className="pt-1">
        <div className="flex items-center justify-between gap-1 max-w-xs mx-auto">
          {last7Days.map((item) => (
            <div key={item.dateStr} className="flex flex-col items-center gap-1 flex-1">
              <span className={`text-[9px] font-bold ${
                item.isToday
                  ? 'text-orange-600 dark:text-orange-400 font-black'
                  : 'text-slate-500 dark:text-slate-400'
              }`}>
                {item.dayName}
              </span>

              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  item.isActive
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm scale-105'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-600 border border-slate-700'
                    : 'bg-slate-200/80 text-slate-400 border border-slate-200'
                }`}
              >
                {item.isActive ? (
                  <Flame className="w-3.5 h-3.5 fill-current" />
                ) : (
                  '•'
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
