import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, Smartphone, X, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappText = encodeURIComponent(
    `🧪 *Science GOAT - 10 (RBSE कक्षा 10 विज्ञान - 100% निशुल्क मोबाइल ऐप)*\n\nराजस्थान बोर्ड 10वीं विज्ञान का सर्वश्रेष्ठ ऐप! नोट्स, क्विज़, पिछले 5 सालों के बोर्ड पेपर, वीडियो लेक्चर एवं डिजिटल पुस्तक निःशुल्क पढ़ें!\n\nअभी खोलें: ${appUrl}`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-5 text-white shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">एप शेयर करें</h3>
              <p className="text-xs text-slate-400">अपने सहपाठियों के साथ शेयर करें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Share Links */}
        <div className="space-y-2.5">
          <a
            href={`https://api.whatsapp.com/send?text=${whatsappText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>💬 WhatsApp पर व्हाट्सएप ग्रुप्स में शेयर करें</span>
          </a>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={appUrl}
              className="flex-1 px-3 py-2.5 rounded-xl bg-slate-950 text-slate-300 text-xs border border-slate-800 focus:outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'कॉपी हुआ!' : 'कॉपी करें'}</span>
            </button>
          </div>
        </div>

        {/* Add to Home Screen / Mobile App Guide */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <Smartphone className="w-4 h-4" />
            <span>मोबाइल होम स्क्रीन पर ऐप आइकॉन कैसे जोड़ें?</span>
          </div>
          <ol className="text-slate-300 leading-relaxed list-decimal list-inside space-y-1">
            <li>Chrome ब्राउज़र में ऊपर दिए गए <strong>तीन बिंदु (⋮)</strong> पर क्लिक करें।</li>
            <li><strong>'Add to Home screen' (होम स्क्रीन में जोड़ें)</strong> चुनें।</li>
            <li>अब यह ऐप आपके मोबाइल में बिना इंटरनेट के भी सीधे ऐप की तरह खुलेगा!</li>
          </ol>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
        >
          बंद करें
        </button>
      </div>
    </div>
  );
};
