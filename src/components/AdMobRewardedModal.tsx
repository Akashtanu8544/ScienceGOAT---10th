import React, { useState, useEffect } from 'react';
import { Award, Play, CheckCircle2, X } from 'lucide-react';

interface AdMobRewardedModalProps {
  title: string;
  rewardMessage?: string;
  rewardButtonText?: string;
  onAdCompleted: () => void;
  onClose: () => void;
}

export const AdMobRewardedModal: React.FC<AdMobRewardedModalProps> = ({
  title,
  rewardMessage = 'राजस्थान बोर्ड परीक्षा 2026 के लिए विशेष 100% सटीक प्रश्नोत्तरी, वीडियो लेक्चर्स व मॉडल पेपर्स फ्री में एक्सेस करें!',
  rewardButtonText,
  onAdCompleted,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [adFinished, setAdFinished] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    if (countdown <= 0) {
      setAdFinished(true);
      setIsPlaying(false);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown, isPlaying]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border-2 border-amber-500/50 p-5 text-white shadow-2xl overflow-hidden">
        {/* Top Tag */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-[10px] tracking-wider uppercase">
              विशेष रिवॉर्ड
            </span>
            <span className="text-xs text-slate-400 font-medium">RBSE रिवॉर्ड अनलॉक</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ad Content Box */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 text-center relative overflow-hidden">
          <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-amber-400 text-[10px] font-bold border border-amber-500/30">
            {adFinished ? '✓ अनलॉक तैयार!' : `समय: ${countdown}s`}
          </div>

          <div className="my-3 flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-3xl mb-2 shadow-lg animate-bounce">
              🏆
            </div>
            <h4 className="text-sm font-bold text-amber-300">
              RBSE 10th Toppers Batch 2026
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-xs">
              {rewardMessage}
            </p>
          </div>

          {/* Ad Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex flex-col gap-2">
          {adFinished ? (
            <button
              onClick={onAdCompleted}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>
                {rewardButtonText || `रिवॉर्ड अनलॉक हुआ! सामग्री देखें (${title})`}
              </span>
            </button>
          ) : (
            <div className="text-center">
              <p className="text-[11px] text-slate-400 mb-2">
                कृपया {countdown} सेकंड प्रतीक्षा करें - सामग्री स्वतः अनलॉक होगी
              </p>
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed border border-slate-700"
              >
                अनलॉक हो रहा है... ({countdown}s)
              </button>
            </div>
          )}
        </div>

        <p className="text-[10px] text-slate-500 text-center mt-3">
          🔒 यह ऐप राजस्थान बोर्ड विद्यार्थियों के लिए 100% नि:शुल्क है।
        </p>
      </div>
    </div>
  );
};
