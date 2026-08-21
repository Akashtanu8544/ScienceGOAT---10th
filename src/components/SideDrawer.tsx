import React from 'react';
import { Sun, Moon, Settings, Star, Share2, MessageSquare, X } from 'lucide-react';
import { ScienceGoatLogo } from './ScienceGoatLogo';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenShare: () => void;
  onOpenMoreApps?: () => void;
  onOpenGitHubConfig: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleTheme,
  onOpenShare,
  onOpenGitHubConfig,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fadeIn">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div
        className={`relative z-10 w-72 max-w-[80vw] h-full shadow-2xl flex flex-col backdrop-blur-xl transition-transform duration-300 ${
          isDarkMode ? 'bg-slate-900/85 text-slate-100 border-r border-slate-800/80' : 'bg-white/85 text-slate-900 border-r border-white/60'
        }`}
      >
        {/* Top Header Section */}
        <div className={`p-4 border-b flex flex-col gap-2 ${
          isDarkMode ? 'bg-slate-950/90 border-slate-800 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-blue-800'
        }`}>
          <div className="flex items-center justify-between">
            <ScienceGoatLogo size="md" showText={true} />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs font-semibold custom-scrollbar">
          {/* Dark Mode Switcher */}
          <div
            onClick={() => {
              if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                try { navigator.vibrate(10); } catch (e) {}
              }
              onToggleTheme();
            }}
            className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
              isDarkMode
                ? 'bg-slate-800/90 text-amber-300 border-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]'
                : 'bg-white text-slate-800 border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2.5 font-bold">
              {isDarkMode ? <Moon className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>{isDarkMode ? 'डार्क मोड (Dark Mode)' : 'लाइट मोड (Light Mode)'}</span>
            </div>
            {/* Custom Toggle Switch */}
            <div
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 border shadow-inner ${
                isDarkMode ? 'bg-amber-500 border-amber-600 justify-end' : 'bg-slate-300 border-slate-400 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform" />
            </div>
          </div>

          {/* Menu Options */}
          <div className="space-y-1.5">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                  try { navigator.vibrate(10); } catch (e) {}
                }
                onClose();
                onOpenGitHubConfig();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all border active:translate-y-0.5 ${
                isDarkMode
                  ? 'bg-slate-800/40 hover:bg-slate-800 text-slate-200 border-slate-800 shadow-sm'
                  : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200/80 shadow-2xs'
              }`}
            >
              <Settings className="w-4 h-4 text-blue-500" />
              <span>सेटिंग्स (Settings / Source)</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                  try { navigator.vibrate(10); } catch (e) {}
                }
                onClose();
                onOpenShare();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all border active:translate-y-0.5 ${
                isDarkMode
                  ? 'bg-slate-800/40 hover:bg-slate-800 text-slate-200 border-slate-800 shadow-sm'
                  : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200/80 shadow-2xs'
              }`}
            >
              <Share2 className="w-4 h-4 text-emerald-500" />
              <span>एप शेयर करें (Share App)</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                  try { navigator.vibrate(10); } catch (e) {}
                }
                onClose();
                alert('धन्यवाद! Science GOAT - 10 को रेट करने के लिए शेयर बटन दबाएं।');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all border active:translate-y-0.5 ${
                isDarkMode
                  ? 'bg-slate-800/40 hover:bg-slate-800 text-slate-200 border-slate-800 shadow-sm'
                  : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200/80 shadow-2xs'
              }`}
            >
              <Star className="w-4 h-4 text-amber-500" />
              <span>रेट करें (Rate Science GOAT ★★★★★)</span>
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                  try { navigator.vibrate(10); } catch (e) {}
                }
                onClose();
                alert('आप अपने सुझाव या प्रश्न हमें व्हाट्सएप शेयर बटन के माध्यम से भेज सकते हैं।');
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all border active:translate-y-0.5 ${
                isDarkMode
                  ? 'bg-slate-800/40 hover:bg-slate-800 text-slate-200 border-slate-800 shadow-sm'
                  : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-200/80 shadow-2xs'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-purple-500" />
              <span>फीचर अनुरोध (Feature Request)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-3 text-center text-[10px] font-bold border-t ${
          isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          Science GOAT - 10 • RBSE Class 10th
        </div>
      </div>
    </div>
  );
};
