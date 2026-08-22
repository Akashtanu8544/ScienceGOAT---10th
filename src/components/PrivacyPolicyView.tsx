import React, { useState } from 'react';
import { Shield, ArrowLeft, CheckCircle2, Copy, ExternalLink, Mail, Lock, Eye, BookOpen, Smartphone, FileText } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBack: () => void;
  isDarkMode: boolean;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack, isDarkMode }) => {
  const [copied, setCopied] = useState(false);
  const [lang, setLang] = useState<'hi' | 'en'>('hi');

  const privacyUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/privacy.html`
    : 'https://sciencegoat---10th.mobographie.workers.dev/privacy.html';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(privacyUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Top Header Navigation */}
      <div className={`p-4 rounded-3xl border flex items-center justify-between shadow-lg ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold flex items-center gap-1.5 text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          मुख्य पृष्ठ
        </button>

        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          <h2 className="text-sm font-black tracking-wide">गोपनीयता नीति (Privacy Policy)</h2>
        </div>

        {/* Language Switcher */}
        <div className="flex bg-slate-800/20 p-1 rounded-xl border border-slate-700/50 text-[10px] font-bold">
          <button
            onClick={() => setLang('hi')}
            className={`px-2 py-1 rounded-lg transition-all ${lang === 'hi' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
          >
            हिंदी
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded-lg transition-all ${lang === 'en' ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-400'}`}
          >
            English
          </button>
        </div>
      </div>

      {/* Google Play Console Ready URL Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-900/90 via-slate-900 to-purple-950 text-white border border-indigo-500/40 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase font-black tracking-widest text-indigo-300">
              Google Play Console Store Listing Link
            </div>
            <h3 className="text-sm font-black text-white mt-0.5">
              गोपनीयता नीति यूआरएल (Privacy Policy URL)
            </h3>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              गूगल प्ले कंसोल में "Privacy Policy URL" फील्ड में नीचे दिए गए लिंक को पेस्ट करें:
            </p>

            <div className="mt-3 p-2.5 rounded-2xl bg-slate-950/80 border border-indigo-500/30 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold text-amber-300 truncate select-all">
                {privacyUrl}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  }`}
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      कॉपी हो गया!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      कॉपी करें
                    </>
                  )}
                </button>
                <a
                  href="/privacy.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                  title="ओपन गोपनीयता पृष्ठ"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className={`p-5 rounded-3xl border space-y-6 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {lang === 'hi' ? (
          <>
            {/* Summary Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs leading-relaxed font-semibold flex items-start gap-2.5">
              <Lock className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <strong>सुरक्षित एवं निजी:</strong> Science GOAT - 10th RBSE ऐप आपकी निजता की पूरी सुरक्षा करता है। हम आपका कोई भी व्यक्तिगत डेटा (नाम, नंबर, लोकेशन, कांटेक्ट) एकत्र या ट्रांसफर नहीं करते हैं। आपकी शिक्षण प्रगति केवल आपके मोबाइल में सुरक्षित रहती है।
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-amber-500 flex items-center gap-2">
                <Eye className="w-4 h-4" /> 1. परिचय एवं उद्देश्य (Introduction)
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                यह ऐप (पैकेज नाम: <code>com.sciencegoat.class10rbse</code>) राजस्थान बोर्ड (RBSE) कक्षा 10वीं विज्ञान के विद्यार्थियों को हस्तलिखित नोट्स, क्विज़, विगत वर्षों के पेपर (PYQ) और वीडियो लेक्चर्स प्रदान करने के लिए बनाया गया है।
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-amber-500 flex items-center gap-2">
                <FileText className="w-4 h-4" /> 2. डेटा संग्रह एवं उपयोग (Data Collection & Usage)
              </h3>
              <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300">
                <li><strong>कोई व्यक्तिगत डेटा नहीं:</strong> हम आपका नाम, ईमेल, फ़ोन नंबर या लोकेशन कभी नहीं मांगते या स्टोर करते।</li>
                <li><strong>ऑफलाइन अध्ययन प्रगति (Local Progress):</strong> आपके पढ़े गए चैप्टर, क्विज़ स्कोर और बुकमार्क आपके फोन की लोकल मेमोरी (LocalStorage & IndexedDB) में ही सेव रहते हैं।</li>
                <li><strong>ऑफलाइन PDF नोट्स:</strong> ऐप सर्विस वर्कर के जरिए आपके फोन में स्टडी मटेरियल कैशे (Cache) करता है ताकि आप बिना इंटरनेट के भी पढ़ सकें।</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-amber-500 flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> 3. आवश्यक अनुमतियाँ (Permissions Required)
              </h3>
              <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300">
                <li><strong>इंटरनेट एक्सेस (INTERNET):</strong> ऑनलाइन मॉडल पेपर, वीडियो और नए नोट्स लोड करने हेतु।</li>
                <li><strong>लोकल स्टोरेज (STORAGE):</strong> ऑफलाइन नोट्स एवं क्विज़ स्कोर सुरक्षित रखने हेतु।</li>
                <li><strong>अधिसूचनाएँ (NOTIFICATIONS) [ऐच्छिक]:</strong> परीक्षा समय-सारणी एवं दैनिक विज्ञान टिप्स भेजने हेतु।</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="space-y-2">
              <h3 className="text-sm font-black text-amber-500 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> 4. बच्चों एवं विद्यार्थियों की गोपनीयता (Children's Privacy)
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                यह ऐप मुख्य रूप से 13 से 18 वर्ष आयु वर्ग के कक्षा 10वीं के विद्यार्थियों के लिए बनाया गया है। ऐप में केवल शैक्षणिक सामग्री है और किसी भी प्रकार की अनुचित या हानिकारक सामग्री शामिल नहीं है।
              </p>
            </div>

            {/* Section 5 Contact */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" /> संपर्क एवं सहायता (Contact Us)
              </h3>
              <p className="text-[11px] text-slate-400">
                गोपनीयता नीति से संबंधित किसी भी सवाल या सुझाव के लिए हमें ईमेल करें:
              </p>
              <div className="text-xs font-bold text-amber-400 font-mono">
                ictlabgsssaidana@gmail.com
              </div>
            </div>
          </>
        ) : (
          <>
            {/* English Version */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs leading-relaxed font-semibold flex items-start gap-2.5">
              <Lock className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <strong>Privacy Guaranteed:</strong> Science GOAT - 10th RBSE respects student privacy. We do not collect, transmit, or share any personally identifiable information (PII). All learning progress stays 100% local on your device.
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-black text-amber-500 flex items-center gap-2">
                <Eye className="w-4 h-4" /> 1. Application Overview
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Science GOAT (Package ID: <code>com.sciencegoat.class10rbse</code>) is an educational app designed for Class 10th Science students under the Rajasthan Board (RBSE) & NCERT curriculum.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-black text-amber-500 flex items-center gap-2">
                <FileText className="w-4 h-4" /> 2. Data Collection & Processing
              </h3>
              <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300">
                <li><strong>No Personal Data:</strong> We do not ask for or collect names, email addresses, phone numbers, or user accounts.</li>
                <li><strong>Local Progress:</strong> Chapter progress, quiz scores, and bookmarks are saved strictly inside standard browser LocalStorage and IndexedDB on your device.</li>
                <li><strong>Offline PDF Cache:</strong> The app uses Service Worker caching to store offline study PDFs directly on your device.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-black text-amber-500 flex items-center gap-2">
                <Smartphone className="w-4 h-4" /> 3. App Permissions
              </h3>
              <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-300">
                <li><strong>INTERNET:</strong> Needed to fetch study notes, video tutorials, and model test updates.</li>
                <li><strong>STORAGE:</strong> Needed to cache notes and preserve progress locally.</li>
                <li><strong>NOTIFICATIONS:</strong> Optional reminders for daily study tips and board exam alerts.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-black text-amber-500 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> 4. Children & Student Safety
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Our app is designed for secondary school students (typically ages 13-18). It contains strictly curated educational materials compliant with COPPA and Google Play Developer Policies.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <h3 className="text-xs font-black text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" /> Developer Contact
              </h3>
              <p className="text-[11px] text-slate-400">
                For questions or data deletion requests, contact us at:
              </p>
              <div className="text-xs font-bold text-amber-400 font-mono">
                ictlabgsssaidana@gmail.com
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
