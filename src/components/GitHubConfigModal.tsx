import React, { useState } from 'react';
import { GitHubConfig } from '../types';
import { StorageService } from '../services/db';
import { Github, X, Check } from 'lucide-react';

interface GitHubConfigModalProps {
  config: GitHubConfig;
  onSave: (updated: GitHubConfig) => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

export const GitHubConfigModal: React.FC<GitHubConfigModalProps> = ({
  config,
  onSave,
  onClose,
  isDarkMode = false,
}) => {
  const [form, setForm] = useState<GitHubConfig>(config);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    StorageService.saveGitHubConfig(form);
    onSave(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar border ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isDarkMode ? 'border-slate-800' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-500">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                GitHub स्रोत फ़ेच सेटिंग्स
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                अपना कस्टम GitHub JSON / PDF लिंक कनेक्ट करें
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

        <div className="space-y-4 text-xs">
          {/* Custom Toggle */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-xl border ${
              isDarkMode
                ? 'bg-slate-950 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                कस्टम GitHub ऑटो-फ्रेच चालू करें
              </div>
              <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                चालू होने पर ऐप आपके लिंक से नया डाटा स्वतः लेगा
              </p>
            </div>
            <input
              type="checkbox"
              checked={form.isCustomEnabled}
              onChange={(e) => setForm({ ...form, isCustomEnabled: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className={`block font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              GitHub मुख्य रिपॉजिटरी URL:
            </label>
            <input
              type="text"
              value={form.githubRepoUrl}
              onChange={(e) => setForm({ ...form, githubRepoUrl: e.target.value })}
              placeholder="https://github.com/username/rbse-class10-science"
              className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                isDarkMode
                  ? 'bg-slate-950 text-slate-200 border-slate-800 focus:border-amber-400'
                  : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500'
              }`}
            />
          </div>

          <div>
            <label className={`block font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              कस्टम क्विज़ JSON (GitHub RAW Link):
            </label>
            <input
              type="text"
              value={form.customQuizJsonUrl}
              onChange={(e) => setForm({ ...form, customQuizJsonUrl: e.target.value })}
              placeholder="https://raw.githubusercontent.com/.../quiz.json"
              className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                isDarkMode
                  ? 'bg-slate-950 text-slate-200 border-slate-800 focus:border-amber-400'
                  : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500'
              }`}
            />
          </div>

          <div>
            <label className={`block font-bold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
              कस्टम PYQ प्रश्न-पत्र JSON/PDF Link:
            </label>
            <input
              type="text"
              value={form.customPyqJsonUrl}
              onChange={(e) => setForm({ ...form, customPyqJsonUrl: e.target.value })}
              placeholder="https://raw.githubusercontent.com/.../pyqs.json"
              className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none ${
                isDarkMode
                  ? 'bg-slate-950 text-slate-200 border-slate-800 focus:border-amber-400'
                  : 'bg-slate-50 text-slate-900 border-slate-200 focus:border-blue-500'
              }`}
            />
          </div>

          <div
            className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
              isDarkMode
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            💡 <strong>फ्री डेटाबेस नोट:</strong> यह ऐप पूरी तरह से फ्री LocalStorage व IndexedDB का उपयोग करता है। आप कभी भी GitHub RAW URL अपडेट करके नए प्रश्न या नोट्स बिना ऐप अपडेट किए जोड़ सकते हैं!
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs border ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            रद्द करें
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md flex items-center justify-center gap-1 active:scale-95"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : null}
            <span>{savedSuccess ? 'सुरक्षित हुआ!' : 'सेव करें'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
