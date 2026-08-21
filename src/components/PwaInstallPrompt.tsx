import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PwaInstallPromptProps {
  isDarkMode: boolean;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({ isDarkMode }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);

  useEffect(() => {
    // Check if already running as standalone PWA
    const isAppStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    setIsStandalone(isAppStandalone);

    if (isAppStandalone) {
      return;
    }

    // Check iOS platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt banner if user hasn't dismissed it in this session
      const hasDismissed = sessionStorage.getItem('pwa_prompt_dismissed');
      if (!hasDismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Auto show iOS guide banner if on iOS browser and not installed
    if (isIosDevice && !sessionStorage.getItem('pwa_prompt_dismissed')) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIosGuide(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isStandalone || !showBanner) {
    return null;
  }

  return (
    <>
      {/* Bottom PWA Install Banner */}
      <div
        className={`fixed bottom-16 left-0 right-0 z-50 p-3 mx-auto max-w-md landscape:max-w-xl transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-4`}
      >
        <div
          className={`relative p-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-center justify-between gap-3 ${
            isDarkMode
              ? 'bg-slate-900/95 border-indigo-500/30 text-white shadow-indigo-950/50'
              : 'bg-white/95 border-indigo-200 text-slate-800 shadow-xl'
          }`}
        >
          {/* App Icon + Text */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-xs sm:text-sm truncate">
                  Science GOAT ऐप स्थापित करें
                </h4>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                  PWA
                </span>
              </div>
              <p className="text-[11px] opacity-75 truncate">
                ऑफ़लाइन नोट्स, टेस्ट व बिना इंटरनेट अध्ययन हेतु
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>इंस्टॉल करें</span>
            </button>
            <button
              onClick={handleDismiss}
              className={`p-1.5 rounded-lg transition-colors ${
                isDarkMode
                  ? 'hover:bg-slate-800 text-slate-400'
                  : 'hover:bg-slate-100 text-slate-500'
              }`}
              title="बंद करें"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Installation Instructions Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-500" />
                iOS पर इंस्टॉल करने का तरीका
              </h3>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-lg hover:bg-slate-800/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ol className="space-y-3 text-xs mb-5">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>Safari ब्राउज़र में शेयर बटन (<Share className="w-3.5 h-3.5 inline mx-0.5 text-indigo-400" />) पर टैप करें।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>नीचे स्क्रॉल करके <strong>'Add to Home Screen' (होम स्क्रीन में जोड़ें)</strong> चुनें।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>ऊपर दाएँ कोने में <strong>'Add'</strong> पर टैप करें। ऐप आपके फ़ोन पर इंस्टॉल हो जाएगा!</span>
              </li>
            </ol>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              समझ गया
            </button>
          </div>
        </div>
      )}
    </>
  );
};
