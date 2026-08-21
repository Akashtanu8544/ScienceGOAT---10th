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
  return (
    <header className={`shrink-0 sticky top-0 z-40 w-full max-w-md mx-auto transition-all duration-200 backdrop-blur-xl border-b shadow-md ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800/80 text-white'
        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 border-blue-500/30 text-white shadow-blue-500/10'
    }`}>
      <div className="max-w-md mx-auto px-3.5 py-2">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          {/* Left Drawer Menu Trigger + Science GOAT Text */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onOpenDrawer}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all flex items-center justify-center shrink-0 border border-white/15 shadow-sm"
              title="मुख्य मेनू"
            >
              <Menu className="w-5 h-5 text-amber-400" />
            </button>

            <ScienceGoatLogo size="md" showText={true} showImage={false} />
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Dark/Light Mode Quick Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all border border-white/15 shadow-sm"
              title={isDarkMode ? 'लाइट मोड' : 'डार्क मोड'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-amber-300 fill-amber-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
