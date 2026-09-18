import React from 'react';
import { Home, BookOpen, FileText, Target, BarChart2 } from 'lucide-react';

export type ScienceTab = 'home' | 'book' | 'notes' | 'quiz' | 'progress';

interface ScienceBottomNavProps {
  currentTab: ScienceTab;
  onSelectTab: (tab: ScienceTab) => void;
  isDarkMode: boolean;
  completedChaptersCount?: number;
  streakDays?: number;
}

export const ScienceBottomNav: React.FC<ScienceBottomNavProps> = ({
  currentTab,
  onSelectTab,
  isDarkMode,
}) => {
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch (e) {}
    }
  };

  const handleTabClick = (tab: ScienceTab) => {
    triggerHaptic();
    onSelectTab(tab);
  };

  const tabs: { id: ScienceTab; label: string; labelEn: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'होम', labelEn: 'Home', icon: Home },
    { id: 'book', label: 'किताब', labelEn: 'Book', icon: BookOpen },
    { id: 'notes', label: 'नोट्स', labelEn: 'Notes', icon: FileText },
    { id: 'quiz', label: 'क्विज़', labelEn: 'Quiz', icon: Target },
    { id: 'progress', label: 'प्रगति', labelEn: 'Stats', icon: BarChart2 },
  ];

  return (
    <nav
      id="science-bottom-nav"
      aria-label="Bottom Navigation"
      className="fixed bottom-3 left-4 right-4 max-w-md mx-auto z-40 select-none pb-safe pointer-events-none"
    >
      {/* Modern Floating Capsule Dock (Matching Reference Image) */}
      <div
        className={`pointer-events-auto w-full rounded-full p-1.5 backdrop-blur-2xl border transition-all duration-200 flex items-center justify-between shadow-[0_12px_36px_rgba(0,0,0,0.35)] ${
          isDarkMode
            ? 'bg-[#0D0F1E]/95 border-white/10 text-slate-400'
            : 'bg-[#0F1424]/95 border-white/15 text-slate-300'
        }`}
      >
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex items-center justify-center transition-all duration-200 rounded-full py-2 px-3 active:scale-90 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_4px_16px_rgba(16,185,129,0.45)] font-black'
                  : 'hover:text-white text-slate-400'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.6] scale-105' : 'stroke-[1.8]'
                  }`}
                />
                {isActive && (
                  <span className="text-[11px] font-extrabold tracking-tight animate-fadeIn whitespace-nowrap">
                    {tab.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
