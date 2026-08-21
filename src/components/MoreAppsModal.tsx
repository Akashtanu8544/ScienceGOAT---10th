import React from 'react';
import { AppWindow, ExternalLink, X } from 'lucide-react';

interface MoreAppsModalProps {
  onClose: () => void;
  isDarkMode?: boolean;
}

const APPS_LIST = [
  {
    title: 'RBSE कक्षा 10 गणित - सूत्र एवं मॉडल पेपर',
    icon: '📐',
    rating: '4.9 ⭐',
    desc: 'गणित के सभी अध्यायों के हल, प्रमेय, सूत्रकोष एवं मॉडल पेपर्स फ्री डाउनलोड।',
    downloadUrl: '#'
  },
  {
    title: 'सामाजिक विज्ञान (SST) हस्तलिखित नोट्स',
    icon: '🗺️',
    rating: '4.8 ⭐',
    desc: 'इतिहास, भूगोल, राजनीति विज्ञान एवं अर्थशास्त्र के शार्ट रिवीजन नोट्स।',
    downloadUrl: '#'
  },
  {
    title: 'RBSE 10th बोर्ड रिजल्ट एवं मार्कशीट ट्रैकर',
    icon: '📊',
    rating: '4.9 ⭐',
    desc: 'राजस्थान बोर्ड अजमेर (BSER) 10वीं का रिजल्ट सबसे पहले देखें।',
    downloadUrl: '#'
  },
  {
    title: 'हिंदी एवं संस्कृत व्याकरण मास्टर',
    icon: '📚',
    rating: '4.7 ⭐',
    desc: 'संधि, समास, प्रत्यय, कारक, अनुवाद एवं पत्र लेखन की सरल गाइड।',
    downloadUrl: '#'
  }
];

export const MoreAppsModal: React.FC<MoreAppsModalProps> = ({ onClose, isDarkMode = false }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto custom-scrollbar border ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-3 border-b sticky top-0 z-10 backdrop-blur-md ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
              <AppWindow className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                और शैक्षणिक एप्स (More RBSE Apps)
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                राजस्थान बोर्ड विद्यार्थियों हेतु विशेष ऐप्स
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

        <div className="space-y-3">
          {APPS_LIST.map((app, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 hover:border-amber-500/50'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl shrink-0 ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  {app.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {app.title}
                    </h4>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300">
                      {app.rating}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {app.desc}
                  </p>
                </div>
              </div>

              <button className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shrink-0 flex items-center gap-1 shadow active:scale-95">
                <span>डाउनलोड</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors ${
            isDarkMode
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          बंद करें
        </button>
      </div>
    </div>
  );
};
