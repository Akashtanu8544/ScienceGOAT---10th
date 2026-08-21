import React from 'react';
import { Home, BookOpen, FileText, Tv, HelpCircle } from 'lucide-react';

interface BottomNavigationProps {
  currentView: string;
  onSelectView: (view: any) => void;
  isDarkMode: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentView,
  onSelectView,
  isDarkMode,
}) => {
  const navItems = [
    { id: 'Dashboard', label: 'होम', icon: Home, icon3D: '🏠' },
    { id: 'Book', label: 'पुस्तक', icon: BookOpen, icon3D: '📖' },
    { id: 'Notes', label: 'नोट्स', icon: FileText, icon3D: '📝' },
    { id: 'VIDEOS', label: 'वीडियो', icon: Tv, icon3D: '🎥' },
    { id: 'Quiz', label: 'क्विज़', icon: HelpCircle, icon3D: '🎯' },
  ];

  return (
    <nav className={`shrink-0 sticky bottom-0 left-0 right-0 z-40 backdrop-blur-2xl border-t py-1.5 px-2 max-w-md w-full mx-auto transition-colors duration-200 ${
      isDarkMode
        ? 'bg-slate-900/90 border-slate-800/80 text-slate-400'
        : 'bg-white/90 border-slate-200 text-slate-600 shadow-2xl'
    }`}>
      <div className="flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex items-center justify-center p-2 rounded-2xl transition-all active:scale-90 relative ${
                isActive
                  ? isDarkMode
                    ? 'text-amber-300 bg-amber-500/25 font-black scale-105 border border-amber-400/40 shadow-md shadow-amber-500/10'
                    : 'text-blue-700 bg-blue-100 font-black scale-105 border border-blue-300 shadow-md shadow-blue-500/10'
                  : 'hover:text-slate-900 dark:hover:text-slate-200 opacity-70 hover:opacity-100'
              }`}
              title={item.label}
            >
              <span className="text-xl leading-none transform transition-transform group-hover:scale-110">{item.icon3D}</span>
              {isActive && (
                <span className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full ${
                  isDarkMode ? 'bg-amber-400' : 'bg-blue-600'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
