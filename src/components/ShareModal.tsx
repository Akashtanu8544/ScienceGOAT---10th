import React, { useState } from 'react';
import { Share2, Copy, Check, MessageCircle, X } from 'lucide-react';
import { ScienceGoatLogo } from './ScienceGoatLogo';

interface ShareModalProps {
  onClose: () => void;
  isDarkMode?: boolean;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose, isDarkMode = false }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `🧪 *Science GOAT - Class 10 Science (RBSE / NCERT)*\n\nराजस्थान बोर्ड 10वीं विज्ञान का सर्वश्रेष्ठ ऐप! नोट्स, क्विज़, पिछले वर्षों के बोर्ड पेपर, वीडियो लेक्चर एवं डिजिटल पुस्तक निःशुल्क पढ़ें!`;

  const handleCopy = () => {
    const fullText = `${shareText}\n\n${window.location.href}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Science GOAT - 10th Science',
          text: shareText,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed, fallback
      }
    } else {
      handleCopy();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${window.location.href}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-sm rounded-3xl p-5 shadow-2xl space-y-4 border ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isDarkMode ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <ScienceGoatLogo size="sm" variant="icon-only" showText={false} />
            <div>
              <h3 className={`text-base font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Science GOAT शेयर करें
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                सहपाठियों व मित्रों के साथ साझा करें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${
              isDarkMode
                ? 'text-slate-400 hover:text-white bg-slate-800'
                : 'text-slate-500 hover:text-slate-900 bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* Native Share Button */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>शेयर करें (Share App)</span>
            </button>
          )}

          {/* WhatsApp Direct Share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>WhatsApp पर शेयर करें</span>
          </a>

          {/* Copy Share Text */}
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all border active:scale-95 ${
              copied
                ? 'bg-emerald-500 text-white border-emerald-600'
                : isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
          >
            {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'ऐप आमंत्रण कॉपी हो गया!' : 'शेयर मैसेज कॉपी करें (Copy)'}</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
            isDarkMode
              ? 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          बंद करें
        </button>
      </div>
    </div>
  );
};

