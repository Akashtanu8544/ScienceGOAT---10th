import React, { useState } from 'react';
import { GitHubConfig } from '../types';
import { StorageService } from '../services/db';
import { Settings, Save, Github, RefreshCw, X, Check, HelpCircle } from 'lucide-react';

interface GitHubConfigModalProps {
  config: GitHubConfig;
  onSave: (updated: GitHubConfig) => void;
  onClose: () => void;
}

export const GitHubConfigModal: React.FC<GitHubConfigModalProps> = ({
  config,
  onSave,
  onClose,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">GitHub स्रोत फ़ेच सेटिंग्स</h3>
              <p className="text-xs text-slate-400">अपना कस्टम GitHub JSON / PDF लिंक कनेक्ट करें</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Custom Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <div className="font-bold text-white">कस्टम GitHub ऑटो-फ्रेच चालू करें</div>
              <p className="text-[11px] text-slate-400">चालू होने पर ऐप आपके लिंक से नया डाटा स्वतः लेगा</p>
            </div>
            <input
              type="checkbox"
              checked={form.isCustomEnabled}
              onChange={(e) => setForm({ ...form, isCustomEnabled: e.target.checked })}
              className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">GitHub मुख्य रिपॉजिटरी URL:</label>
            <input
              type="text"
              value={form.githubRepoUrl}
              onChange={(e) => setForm({ ...form, githubRepoUrl: e.target.value })}
              placeholder="https://github.com/username/rbse-class10-science"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">कस्टम क्विज़ JSON (GitHub RAW Link):</label>
            <input
              type="text"
              value={form.customQuizJsonUrl}
              onChange={(e) => setForm({ ...form, customQuizJsonUrl: e.target.value })}
              placeholder="https://raw.githubusercontent.com/.../quiz.json"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">कस्टम PYQ प्रश्न-पत्र JSON/PDF Link:</label>
            <input
              type="text"
              value={form.customPyqJsonUrl}
              onChange={(e) => setForm({ ...form, customPyqJsonUrl: e.target.value })}
              placeholder="https://raw.githubusercontent.com/.../pyqs.json"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 text-slate-200 border border-slate-800 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] leading-relaxed">
            💡 <strong>फ्री डेटाबेस नोट:</strong> यह ऐप पूरी तरह से फ्री LocalStorage व IndexedDB का उपयोग करता है। आप कभी भी GitHub RAW URL अपडेट करके नए प्रश्न या नोट्स बिना ऐप अपडेट किए जोड़ सकते हैं!
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
          >
            रद्द करें
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'सफलतापूर्वक सहेजा गया!' : 'सेटिंग्स सहेजें'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
