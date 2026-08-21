import React from 'react';

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
    { id: 'Dashboard', label: 'होम', icon3D: '🏠' },
    { id: 'Book', label: 'पुस्तक', icon3D: '📖' },
    { id: 'Notes', label: 'नोट्स', icon3D: '📝' },
    { id: 'VIDEOS', label: 'वीडियो', icon3D: '🎥' },
    { id: 'Quiz', label: 'क्विज़', icon3D: '🎯' },
  ];

  return (
    <nav className={`shrink-0 sticky bottom-0 left-0 right-0 z-40 backdrop-blur-2xl border-t py-1.5 px-1.5 max-w-md w-full mx-auto transition-colors duration-200 ${
      isDarkMode
        ? 'bg-slate-900/95 border-slate-800/80 text-slate-400'
        : 'bg-white/95 border-slate-200 text-slate-600 shadow-2xl'
    }`}>
      <div className="flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-2xl transition-all active:scale-95 flex-1 min-w-0 ${
                isActive
                  ? isDarkMode
                    ? 'text-amber-300 bg-amber-500/20 font-black border border-amber-400/30 shadow-sm'
                    : 'text-blue-700 bg-blue-50 font-black border border-blue-200 shadow-sm'
                  : 'hover:text-slate-900 dark:hover:text-slate-200 opacity-75 hover:opacity-100'
              }`}
              title={item.label}
            >
              <span className="text-lg leading-none transform transition-transform mb-0.5">{item.icon3D}</span>
              <span className={`text-[10px] truncate leading-tight font-extrabold ${
                isActive
                  ? isDarkMode ? 'text-amber-300' : 'text-blue-700'
                  : isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
