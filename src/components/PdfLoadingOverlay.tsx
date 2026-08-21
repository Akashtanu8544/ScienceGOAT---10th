import React from 'react';
import { Loader2, BookOpen, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';

interface PdfLoadingOverlayProps {
  title?: string;
  progress: number; // 0 to 100
  statusMessage?: string;
  errorMsg?: string | null;
  onRetry?: () => void;
  onCancel?: () => void;
  isDarkMode?: boolean;
}

export const PdfLoadingOverlay: React.FC<PdfLoadingOverlayProps> = ({
  title = 'PDF दस्तावेज़',
  progress,
  statusMessage = 'NCERT सर्वर से PDF प्राप्त की जा रही है...',
  errorMsg,
  onRetry,
  onCancel,
  isDarkMode = false,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn ${
        isDarkMode ? 'bg-slate-950/90' : 'bg-slate-900/40'
      }`}
    >
      <div
        className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center space-y-5 relative overflow-hidden border ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Background Ambient Glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {errorMsg ? (
          /* Error State */
          <>
            <div
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${
                isDarkMode
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  : 'bg-rose-50 border-rose-200 text-rose-600'
              }`}
            >
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3
                className={`text-sm font-black ${
                  isDarkMode ? 'text-rose-200' : 'text-rose-700'
                }`}
              >
                PDF लोड करने में विफल
              </h3>
              <p
                className={`text-xs leading-relaxed max-w-xs ${
                  isDarkMode ? 'text-rose-300/80' : 'text-rose-800'
                }`}
              >
                {errorMsg}
              </p>
            </div>
            <div className="flex items-center gap-2 w-full pt-2">
              {onCancel && (
                <button
                  onClick={onCancel}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all active:scale-95 border ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  बंद करें
                </button>
              )}
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  पुनः प्रयास
                </button>
              )}
            </div>
          </>
        ) : (
          /* Active Loading State */
          <>
            <div className="relative flex items-center justify-center my-1">
              {/* Outer Spinner */}
              <Loader2 className="w-16 h-16 text-amber-500 animate-spin" />
              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-amber-500 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1 w-full">
              <h3
                className={`text-sm font-black truncate px-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {title}
              </h3>
              <p
                className={`text-xs font-bold ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-600'
                }`}
              >
                {statusMessage}
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="w-full space-y-1.5">
              <div
                className={`w-full rounded-full h-2.5 overflow-hidden border p-0.5 ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700/80'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                <div
                  className="bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 h-full rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${Math.max(5, progress)}%` }}
                />
              </div>
              <div
                className={`flex items-center justify-between text-[11px] font-bold px-1 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Proxy Syncing
                </span>
                <span className="text-amber-600 dark:text-amber-400 font-extrabold">
                  {progress}%
                </span>
              </div>
            </div>

            {onCancel && (
              <button
                onClick={onCancel}
                className={`text-xs underline pt-1 font-bold transition-colors ${
                  isDarkMode
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                रद्द करें
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
