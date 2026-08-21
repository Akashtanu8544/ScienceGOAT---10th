import React, { useState, useEffect } from 'react';
import { Loader2, BookOpen, DownloadCloud } from 'lucide-react';

interface LoadingSpinnerProps {
  isDarkMode?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ isDarkMode = false }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>('NCERT सामग्री डाउनलोड हो रही है...');

  useEffect(() => {
    const handleStart = (e: Event) => {
      const customEvt = e as CustomEvent;
      setIsLoading(true);
      setStatusMsg(customEvt.detail?.message || 'NCERT सामग्री डाउनलोड हो रही है...');
    };

    const handleStatus = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail?.message) {
        setStatusMsg(customEvt.detail.message);
      }
    };

    const handleEnd = () => {
      setIsLoading(false);
    };

    window.addEventListener('pdf-proxy-start', handleStart);
    window.addEventListener('pdf-proxy-status', handleStatus);
    window.addEventListener('pdf-proxy-end', handleEnd);

    return () => {
      window.removeEventListener('pdf-proxy-start', handleStart);
      window.removeEventListener('pdf-proxy-status', handleStatus);
      window.removeEventListener('pdf-proxy-end', handleEnd);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-4 border ${
          isDarkMode
            ? 'bg-slate-900 border-amber-500/30 text-white'
            : 'bg-white border-blue-200 text-slate-900'
        }`}
      >
        {/* Animated Badge Icon Container */}
        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/20 via-blue-500/20 to-emerald-500/20 flex items-center justify-center animate-pulse" />
          <Loader2 className="absolute w-14 h-14 text-amber-500 animate-spin" />
          <BookOpen className="absolute w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>

        {/* Text Details */}
        <div className="space-y-1.5">
          <h3 className="text-base font-black text-amber-500 dark:text-amber-400 flex items-center justify-center gap-2">
            <DownloadCloud className="w-5 h-5 animate-bounce" />
            <span>NCERT सामग्री डाउनलोड हो रही है...</span>
          </h3>
          <p
            className={`text-xs font-semibold max-w-[260px] mx-auto leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {statusMsg || 'दस्तावेज़ प्राप्त किया जा रहा है, कृपया प्रतीक्षा करें...'}
          </p>
        </div>

        {/* Progress pulse bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="h-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-400 animate-pulse w-full rounded-full" />
        </div>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          राजस्थान बोर्ड (RBSE) कक्षा 10 विज्ञान - NCERT आधिकारिक सर्वर
        </p>
      </div>
    </div>
  );
};
