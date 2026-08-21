import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { ScienceGoatLogo } from './ScienceGoatLogo';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenDrawer,
}) => {
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch (e) {}
    }
  };

  return (
    <header className={`shrink-0 sticky top-0 z-40 w-full max-w-md mx-auto transition-all duration-200 backdrop-blur-xl border-b shadow-xl ${
      isDarkMode
        ? 'bg-slate-900/95 border-slate-800/90 text-white shadow-black/40'
        : 'bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 border-blue-500/40 text-white shadow-blue-900/20'
    }`}>
      <div className="max-w-md mx-auto px-3.5 py-2">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left Drawer Menu Trigger + Science GOAT Text */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => {
                triggerHaptic();
                onOpenDrawer();
              }}
              className="p-2 rounded-xl bg-gradient-to-b from-white/20 to-white/5 hover:from-white/30 hover:to-white/10 active:translate-y-0.5 active:shadow-inner text-white transition-all flex items-center justify-center shrink-0 border-t border-l border-white/30 border-b border-r border-black/30 shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
              title="मुख्य मेनू"
            >
              <Menu className="w-5 h-5 text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" />
            </button>

            <ScienceGoatLogo size="md" showText={true} showImage={true} />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Dark/Light Mode Quick Toggle Button */}
            <button
              onClick={() => {
                triggerHaptic();
                onToggleTheme();
              }}
              className="p-2 rounded-xl bg-gradient-to-b from-white/20 to-white/5 hover:from-white/30 hover:to-white/10 active:translate-y-0.5 active:shadow-inner text-white transition-all border-t border-l border-white/30 border-b border-r border-black/30 shadow-[0_4px_8px_rgba(0,0,0,0.25)]"
              title={isDarkMode ? 'लाइट मोड' : 'डार्क मोड'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
              ) : (
                <Moon className="w-4 h-4 text-amber-300 fill-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

