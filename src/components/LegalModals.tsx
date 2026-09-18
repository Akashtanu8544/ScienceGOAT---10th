import React, { useState } from 'react';
import { 
  X, 
  Info, 
  FileText, 
  Shield, 
  Star, 
  Share2, 
  Zap, 
  Check, 
  Copy, 
  Smartphone,
  Sparkles,
  Lock
} from 'lucide-react';
import { AppLanguage, AppSettings } from '../types/foddo';
import { ThemeConfig } from '../utils/theme';
import { FODDOStorage } from '../utils/storage';

export type LegalModalType = 'about' | 'terms' | 'privacy' | 'rate' | 'share' | 'sync';

interface LegalModalsProps {
  type: LegalModalType | null;
  onClose: () => void;
  settings: AppSettings;
  theme: ThemeConfig;
}

export const LegalModals: React.FC<LegalModalsProps> = ({
  type,
  onClose,
  settings,
  theme,
}) => {
  const [rating, setRating] = useState(5);
  const [ratedSubmitted, setRatedSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!type) return null;

  const handleShare = () => {
    FODDOStorage.triggerHaptic();
    const shareText = `Check out FODDO - Fast & Private Local-First Grocery & Bazar Companion! 🛒✨\n${window.location.origin}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'about':
        return (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Info className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">About FODDO</h3>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400">Version 2.4.0 (Local-First Edition)</p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <p>
                <strong>FODDO</strong> is your high-speed, private local-first grocery companion designed for effortless daily market and supermarket trips.
              </p>
              <p>
                <strong>Privacy Guaranteed:</strong> 100% of your lists, spending analytics, and custom notes live strictly on your device storage. No mandatory tracking or third-party ads.
              </p>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Terms & Conditions</h3>
              <p className="text-xs text-slate-400">Standard Local Software Terms</p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700 max-h-56 overflow-y-auto">
              <p>1. <strong>Acceptance:</strong> By using FODDO, you accept all terms regarding local-only data management.</p>
              <p>2. <strong>Data Retention:</strong> Because FODDO is offline-first, backup and device export is managed locally via your browser or app storage.</p>
              <p>3. <strong>Fair Use:</strong> All smart templates and pricing estimation features are free for personal shopping management.</p>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Privacy Policy</h3>
              <p className="text-xs text-slate-400">Zero Data Brokerage · Pure Local Storage</p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <p>
                Your grocery items, household shopping budgets, and trip history are never uploaded to remote servers or sold to data collectors.
              </p>
              <p>
                All calculations, category groupings, and reminder notifications execute directly on your local client hardware.
              </p>
            </div>
          </div>
        );

      case 'rate':
        return (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Rate FODDO</h3>
              <p className="text-xs text-slate-400">How is your grocery planning experience?</p>
            </div>

            <div className="flex justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    FODDOStorage.triggerHaptic();
                    setRating(star);
                  }}
                  className="p-1.5 transition-transform hover:scale-125"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>

            {ratedSubmitted ? (
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-fadeIn">
                Thank you for your 5-star review! 🌟
              </p>
            ) : (
              <button
                type="button"
                onClick={() => {
                  FODDOStorage.triggerHaptic();
                  setRatedSubmitted(true);
                }}
                className={`w-full py-3 rounded-xl ${theme.primaryBg} text-white font-bold text-xs shadow-md`}
              >
                Submit Feedback
              </button>
            )}
          </div>
        );

      case 'share':
        return (
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto">
              <Share2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Share FODDO</h3>
              <p className="text-xs text-slate-400">Help friends and family plan smarter bazar trips</p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-slate-600 dark:text-slate-300 truncate">
                {window.location.href}
              </span>
              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        );

      case 'sync':
        return (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Background Sync & Auto-Start</h3>
              <p className="text-xs text-slate-400">Notification & Optimization Settings</p>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <p>
                To receive timely morning & evening bazar reminders on Android/iOS without battery throttles:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Set FODDO App Battery Usage to <strong>Unrestricted</strong>.</li>
                <li>Allow system background notifications for Web/PWA alarms.</li>
                <li>Night reminder (9:00 PM) triggers automatically when active.</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {renderContent()}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs"
        >
          Close
        </button>
      </div>
    </div>
  );
};
