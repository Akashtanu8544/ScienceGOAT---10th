import React, { useEffect, useState } from 'react';
import { ScienceGoatLogo } from './ScienceGoatLogo';
import { Sparkles, Zap, Award } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 12;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-between p-6 animate-fadeIn select-none">
      {/* Top Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 max-w-sm relative z-10">
        {/* Animated Big Official Logo Badge */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-emerald-500 to-amber-500 rounded-3xl blur-xl opacity-40 animate-pulse" />
          <img
            src="/logo.svg"
            alt="Science GOAT 10th Logo"
            fetchPriority="high"
            decoding="async"
            width="208"
            height="208"
            className="relative w-44 h-44 sm:w-52 sm:h-52 object-contain drop-shadow-2xl rounded-3xl"
          />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <p className="text-xs font-black text-emerald-400 tracking-widest uppercase flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>राजस्थान बोर्ड कक्षा 10वीं विज्ञान</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </p>
        </div>

        {/* Features Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-[11px] font-extrabold text-slate-300 pt-2">
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-amber-300 flex items-center gap-1 shadow-sm">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            नोट्स
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-300 flex items-center gap-1 shadow-sm">
            🧪
            क्विज़
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-rose-300 flex items-center gap-1 shadow-sm">
            <Award className="w-3 h-3 text-rose-400" />
            PYQ & पुस्तकें
          </span>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div className="w-full max-w-xs space-y-2 relative z-10 text-center pb-4">
        <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-rose-500 transition-all duration-150 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
          <span>लोड हो रहा है...</span>
          <span>{progress}%</span>
        </div>
      </div>
    </div>
  );
};
