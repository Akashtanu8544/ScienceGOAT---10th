import React from 'react';

interface ScienceGoatLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  showImage?: boolean;
  customSubtitle?: string;
  className?: string;
  variant?: 'full' | 'icon-only';
  badgeText?: string;
}

export const ScienceGoatLogo: React.FC<ScienceGoatLogoProps> = ({
  size = 'md',
  showText = true,
  showSubtitle = false,
  showImage = true,
  customSubtitle,
  className = '',
  variant = 'full',
  badgeText = '10th',
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', rounded: 'rounded-lg', text: 'text-xs', badge: 'text-[8px] px-1 py-0.2', gap: 'gap-1.5' },
    sm: { icon: 'w-8 h-8', rounded: 'rounded-xl', text: 'text-sm', badge: 'text-[9px] px-1.5 py-0.5', gap: 'gap-2' },
    md: { icon: 'w-10 h-10', rounded: 'rounded-2xl', text: 'text-sm sm:text-base', badge: 'text-[9px] px-1.5 py-0.5', gap: 'gap-2.5' },
    lg: { icon: 'w-16 h-16', rounded: 'rounded-3xl', text: 'text-xl', badge: 'text-xs px-2 py-0.5', gap: 'gap-3' },
    xl: { icon: 'w-24 h-24 sm:w-28 sm:h-28', rounded: 'rounded-3xl', text: 'text-2xl sm:text-3xl', badge: 'text-xs px-2.5 py-1', gap: 'gap-3.5' },
  }[size];

  if (variant === 'icon-only' && showImage) {
    return (
      <div className={`relative ${sizeMap.icon} shrink-0 group ${className}`}>
        <img
          src="/logo.svg"
          alt="Science GOAT 3D Doodle Mascot Logo"
          fetchPriority="high"
          decoding="async"
          className={`w-full h-full object-contain ${sizeMap.rounded} drop-shadow-md transition-transform duration-200 group-hover:scale-105 active:scale-95`}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${sizeMap.gap} ${className}`}>
      {/* 3D Doodle Mascot App Logo */}
      {showImage && (
        <div className={`relative ${sizeMap.icon} shrink-0 group`}>
          <img
            src="/logo.svg"
            alt="Science GOAT 3D Doodle Mascot Logo"
            fetchPriority="high"
            decoding="async"
            className={`w-full h-full object-contain ${sizeMap.rounded} drop-shadow-md select-none transition-transform duration-200 group-hover:scale-105 active:scale-95`}
          />
        </div>
      )}

      {/* Typography */}
      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 leading-tight">
            <span className={`font-black tracking-tight ${sizeMap.text} text-slate-900 dark:text-white truncate`}>
              Science <span className="text-amber-500 dark:text-amber-400">GOAT</span>
            </span>
            {badgeText && (
              <span className={`rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black ${sizeMap.badge} shadow-xs tracking-wider shrink-0`}>
                {badgeText}
              </span>
            )}
          </div>
          {showSubtitle && customSubtitle && (
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-wider truncate mt-0.5">
              {customSubtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

