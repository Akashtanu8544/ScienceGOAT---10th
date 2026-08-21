import React from 'react';

interface ScienceGoatLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  showImage?: boolean;
  className?: string;
  variant?: 'full' | 'icon-only';
}

export const ScienceGoatLogo: React.FC<ScienceGoatLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = false,
  showImage = true,
  className = '',
  variant = 'full',
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', text: 'text-xs', badge: 'text-[9px]', gap: 'gap-1.5' },
    sm: { icon: 'w-8 h-8', text: 'text-sm', badge: 'text-[10px]', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', text: 'text-base', badge: 'text-xs', gap: 'gap-2.5' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl', badge: 'text-sm', gap: 'gap-3' },
    xl: { icon: 'w-28 h-28 sm:w-36 sm:h-36', text: 'text-3xl sm:text-4xl', badge: 'text-base', gap: 'gap-4' },
  }[size];

  if (variant === 'icon-only' && showImage) {
    return (
      <img
        src="/logo.svg"
        alt="Science GOAT 10th Logo"
        fetchPriority="high"
        decoding="async"
        className={`${sizeMap.icon} object-contain rounded-2xl shadow-sm ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center ${sizeMap.gap} ${className}`}>
      {/* Official Badge Image */}
      {showImage && (
        <div className={`relative ${sizeMap.icon} shrink-0 group`}>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 via-green-400 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300" />
          <img
            src="/logo.svg"
            alt="Science GOAT 10th Logo"
            fetchPriority="high"
            decoding="async"
            className="relative w-full h-full object-contain rounded-xl drop-shadow-sm select-none"
          />
        </div>
      )}

      {/* Typography */}
      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`font-black tracking-tight ${sizeMap.text} bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent drop-shadow-sm truncate`}>
              Science GOAT
            </span>
            <span className={`px-1.5 py-0.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black ${sizeMap.badge} shadow-sm border border-green-300/40 tracking-wider shrink-0`}>
              10th
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] text-slate-300 dark:text-slate-400 font-bold tracking-wider uppercase mt-0.5">
              RBSE Class 10th
            </span>
          )}
        </div>
      )}
    </div>
  );
};
