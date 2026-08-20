import React from 'react';

interface Card3DProps {
  title: string;
  subtitle: string;
  icon: string;
  badgeText?: string;
  gradient: string;
  accentBorder: string;
  shadowColor: string;
  onClick: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  title,
  subtitle,
  icon,
  badgeText,
  gradient,
  accentBorder,
  shadowColor,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer select-none rounded-2xl p-5 transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] active:translate-y-1 active:scale-[0.98] ${gradient} ${accentBorder} border-2 ${shadowColor} shadow-xl backdrop-blur-sm overflow-hidden`}
    >
      {/* 3D Top Highlight effect */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

      {/* Background 3D Floating Icon Watermark */}
      <div className="absolute -right-3 -bottom-3 text-7xl opacity-15 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500 pointer-events-none">
        {icon}
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-start justify-between">
          {/* Main 3D Icon Container */}
          <div className="w-14 h-14 rounded-xl bg-white/20 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-inner transform group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>

          {badgeText && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-400 text-slate-900 shadow-md tracking-wide">
              {badgeText}
            </span>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-extrabold text-white drop-shadow-md tracking-tight group-hover:text-amber-200 transition-colors">
            {title}
          </h3>
          <p className="text-xs font-medium text-slate-200/90 mt-1 line-clamp-2">
            {subtitle}
          </p>
        </div>

        {/* Bottom Interactive Arrow */}
        <div className="mt-4 flex items-center justify-between text-xs font-semibold text-white/80 group-hover:text-white">
          <span>खोलें</span>
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
            →
          </div>
        </div>
      </div>
    </div>
  );
};
