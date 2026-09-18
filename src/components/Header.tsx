import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../utils/languageContext';
import { ScienceGoatLogo } from './ScienceGoatLogo';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenDrawer: () => void;
  streakDays?: number;
  totalPoints?: number;
  onOpenProgress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenDrawer,
}) => {
  const { language } = useLanguage();

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(8);
      } catch (e) {}
    }
  };

  return (
    <header
      id="app-header"
      className={`sticky top-0 z-40 w-full transition-all duration-200 backdrop-blur-xl border-b select-none ${
        isDarkMode
          ? 'bg-[#0A0D18]/90 border-slate-800/80 text-white'
          : 'bg-[#F6F8FD]/95 border-slate-200/80 text-slate-900'
      }`}
    >
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Clean Brand Identity with 3D Doodle Science GOAT Logo */}
        <div
          onClick={onOpenDrawer}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onOpenDrawer()}
          className="cursor-pointer group active:scale-98 transition-transform select-none min-w-0"
          title={language === 'hi' ? 'मेनू' : 'Menu'}
        >
          <ScienceGoatLogo
            size="md"
            showText={true}
            showSubtitle={false}
            badgeText="10th"
          />
        </div>


        {/* Right: Only Theme Toggle and Menu Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Theme Toggle Button */}
          <button
            id="header-theme-toggle-btn"
            type="button"
            onClick={() => {
              triggerHaptic();
              onToggleTheme();
            }}
            className={`p-2 rounded-xl border transition-all active:scale-90 flex items-center justify-center ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
            }`}
            title={isDarkMode ? (language === 'hi' ? 'लाइट मोड चालू करें' : 'Switch to Light Mode') : (language === 'hi' ? 'डार्क मोड चालू करें' : 'Switch to Dark Mode')}
            aria-label="Theme toggle"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            )}
          </button>

          {/* Drawer Menu Button */}
          <button
            id="header-menu-btn"
            type="button"
            onClick={() => {
              triggerHaptic();
              onOpenDrawer();
            }}
            className={`p-2 rounded-xl border transition-all active:scale-90 flex items-center justify-center relative ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
            }`}
            title={language === 'hi' ? 'मेनू' : 'Menu'}
            aria-label="मेनू"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

