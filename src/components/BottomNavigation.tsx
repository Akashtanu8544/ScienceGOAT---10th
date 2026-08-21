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
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch (e) {}
    }
  };

  const navItems = [
    { id: 'Dashboard', label: 'होम', icon3D: '🏠' },
    { id: 'Book', label: 'पुस्तक', icon3D: '📖' },
    { id: 'Notes', label: 'नोट्स', icon3D: '📝' },
    { id: 'VIDEOS', label: 'वीडियो', icon3D: '🎥' },
    { id: 'Quiz', label: 'क्विज़', icon3D: '🎯' },
  ];

  return (
    <nav className={`shrink-0 sticky bottom-0 left-0 right-0 z-40 backdrop-blur-2xl border-t py-1.5 px-2 max-w-md landscape:max-w-full w-full mx-auto transition-all duration-200 ${
      isDarkMode
        ? 'bg-slate-900/95 border-slate-800/90 text-slate-400 shadow-[0_-8px_20px_rgba(0,0,0,0.5)]'
        : 'bg-white/95 border-slate-200/90 text-slate-600 shadow-[0_-8px_20px_rgba(15,23,42,0.08)]'
    }`}>
      <div className="flex items-center justify-around gap-1.5">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                triggerHaptic();
                onSelectView(item.id);
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl transition-all flex-1 min-w-0 relative ${
                isActive
                  ? isDarkMode
                    ? 'text-amber-300 bg-gradient-to-b from-amber-500/30 to-amber-600/10 font-black border-t border-l border-amber-400/40 border-b border-r border-amber-600/50 shadow-[0_4px_12px_rgba(245,158,11,0.25)] -translate-y-1'
                    : 'text-blue-700 bg-gradient-to-b from-blue-100 to-blue-50 font-black border-t border-l border-blue-300/80 border-b border-r border-blue-400/40 shadow-[0_4px_12px_rgba(37,99,235,0.2)] -translate-y-1'
                  : 'hover:text-slate-900 dark:hover:text-slate-200 opacity-75 hover:opacity-100 active:translate-y-0.5'
              }`}
              title={item.label}
            >
              <span className={`text-xl leading-none transform transition-transform mb-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)] ${
                isActive ? 'scale-110 animate-bounce-subtle' : ''
              }`}>
                {item.icon3D}
              </span>
              <span className={`text-[10px] truncate leading-tight font-black tracking-tight ${
                isActive
                  ? isDarkMode ? 'text-amber-300' : 'text-blue-700'
                  : isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {item.label}
              </span>

              {/* 3D Active Indicator Pill */}
              {isActive && (
                <span className={`absolute -bottom-1 w-2.5 h-1 rounded-full shadow-sm ${
                  isDarkMode ? 'bg-amber-400 shadow-amber-400/80' : 'bg-blue-600 shadow-blue-600/80'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

