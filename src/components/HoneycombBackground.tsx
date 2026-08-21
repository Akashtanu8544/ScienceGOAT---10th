import React from 'react';

export const HoneycombBackground: React.FC<{ isDarkMode?: boolean }> = React.memo(({ isDarkMode }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic ambient gradient backplate */}
      <div className={`absolute inset-0 transition-colors duration-500 ${
        isDarkMode
          ? 'bg-slate-950'
          : 'bg-gradient-to-br from-slate-100 via-blue-50/70 to-indigo-100/60'
      }`} />

      {/* Primary Honeycomb Grid SVG */}
      <svg className="absolute inset-0 w-full h-full opacity-35 dark:opacity-55" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="honeycomb-pattern-v4"
            width="56"
            height="96"
            patternUnits="userSpaceOnUse"
          >
            {/* Hexagon Path */}
            <path
              d="M28,0 L56,16 L56,48 L28,64 L0,48 L0,16 Z M28,96 L56,80 L56,48 L28,32 L0,48 L0,80 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              className={isDarkMode ? 'text-amber-400/80' : 'text-blue-600/80'}
            />
            {/* Inner Accent Hex Ring */}
            <path
              d="M28,6 L50,19 L50,45 L28,58 L6,45 L6,19 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className={isDarkMode ? 'text-cyan-400/30' : 'text-indigo-400/30'}
            />
            {/* Node dots at vertices */}
            <circle cx="28" cy="0" r="1.8" className={isDarkMode ? 'fill-amber-300' : 'fill-blue-600'} />
            <circle cx="56" cy="16" r="1.8" className={isDarkMode ? 'fill-amber-300' : 'fill-blue-600'} />
            <circle cx="56" cy="48" r="1.8" className={isDarkMode ? 'fill-amber-300' : 'fill-blue-600'} />
            <circle cx="28" cy="64" r="1.8" className={isDarkMode ? 'fill-amber-300' : 'fill-blue-600'} />
            <circle cx="0" cy="48" r="1.8" className={isDarkMode ? 'fill-amber-300' : 'fill-blue-600'} />
            <circle cx="0" cy="16" r="1.8" className={isDarkMode ? 'fill-amber-300' : 'fill-blue-600'} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#honeycomb-pattern-v4)" />
      </svg>

      {/* Subtle background blur overlay layer */}
      <div className="absolute inset-0 backdrop-blur-[3px] bg-white/5 dark:bg-slate-950/20 pointer-events-none" />
    </div>
  );
});
