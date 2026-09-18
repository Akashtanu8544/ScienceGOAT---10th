import React, { useState } from 'react';
import { ArrowLeft, Search, ZoomIn, Info, Sparkles, CheckCircle2, ChevronRight, Layers, Sliders, FlaskConical, Dna, Zap } from 'lucide-react';
import { useLanguage } from '../utils/languageContext';

interface DiagramsAndGraphsViewProps {
  onBack: () => void;
  isDarkMode: boolean;
}

type DiagramCategory = 'all' | 'physics' | 'chemistry' | 'biology';

export const DiagramsAndGraphsView: React.FC<DiagramsAndGraphsViewProps> = ({ onBack, isDarkMode }) => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<DiagramCategory>('all');
  const [selectedId, setSelectedId] = useState<string>('ohms-law');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive State for Ohm's Law Graph
  const [voltage, setVoltage] = useState<number>(6);
  const resistance = 3; // Fixed 3 Ohms for clean calculation
  const current = Number((voltage / resistance).toFixed(2));

  // Interactive State for pH Scale
  const [phValue, setPhValue] = useState<number>(7);

  // Interactive State for Ray Diagram
  const [mirrorObjectPos, setMirrorObjectPos] = useState<'at-c' | 'beyond-c' | 'between-c-f' | 'between-p-f'>('at-c');

  const diagramsList = [
    {
      id: 'ohms-law',
      category: 'physics',
      titleHindi: 'ओम का नियम (V-I ग्राफ व ढाल)',
      titleEnglish: "Ohm's Law (V-I Graph & Slope)",
      chapter: 'अध्याय 11: विद्युत',
      chapterEn: 'Chapter 11: Electricity',
      tag: 'ग्राफ (Graph)',
      icon: '📈',
      importance: '100% बोर्ड परीक्षा में पूछा जाता है (3 अंक)',
    },
    {
      id: 'ph-scale',
      category: 'chemistry',
      titleHindi: 'pH पैमाना एवं सार्वत्रिक सूचक स्पेक्ट्रम',
      titleEnglish: 'pH Scale & Universal Indicator Spectrum',
      chapter: 'अध्याय 2: अम्ल, क्षारक एवं लवण',
      chapterEn: 'Chapter 2: Acids, Bases and Salts',
      tag: 'चार्ट (Chart)',
      icon: '🌈',
      importance: 'बोर्ड प्रश्न पत्र में हर वर्ष 2-3 अंक',
    },
    {
      id: 'reactivity-series',
      category: 'chemistry',
      titleHindi: 'धातुओं की सक्रियता श्रेणी (सक्रियता क्रम)',
      titleEnglish: 'Reactivity Series of Metals',
      chapter: 'अध्याय 3: धातु एवं अधातु',
      chapterEn: 'Chapter 3: Metals and Non-metals',
      tag: 'क्रम चार्ट (Series)',
      icon: '⚡',
      importance: 'विस्थापन अभिक्रियाओं का आधार',
    },
    {
      id: 'ray-diagram-mirror',
      category: 'physics',
      titleHindi: 'अवतल दर्पण द्वारा प्रतिबिंब निर्माण (किरण आरेख)',
      titleEnglish: 'Concave Mirror Ray Diagrams',
      chapter: 'अध्याय 9: प्रकाश – परावर्तन तथा अपवर्तन',
      chapterEn: 'Chapter 9: Light - Reflection & Refraction',
      tag: 'किरण आरेख (Ray Diagram)',
      icon: '🔍',
      importance: '4 अंक का निबंधात्मक प्रश्न',
    },
    {
      id: 'human-heart',
      category: 'biology',
      titleHindi: 'मानव हृदय एवं द्विपंच परिसंचरण',
      titleEnglish: 'Human Heart & Double Circulation',
      chapter: 'अध्याय 5: जैव प्रक्रम',
      chapterEn: 'Chapter 5: Life Processes',
      tag: 'जीव विज्ञान आरेख (Biology)',
      icon: '🫀',
      importance: '4 अंक नामांकित चित्र',
    },
    {
      id: 'nephron-structure',
      category: 'biology',
      titleHindi: 'वृक्काणु (नेफ्रॉन) की संरचना',
      titleEnglish: 'Structure of Nephron (Kidney Unit)',
      chapter: 'अध्याय 5: जैव प्रक्रम',
      chapterEn: 'Chapter 5: Life Processes',
      tag: 'जीव विज्ञान आरेख (Biology)',
      icon: '🧪',
      importance: 'अक्सर पूछा जाने वाला नामांकित चित्र (3 अंक)',
    },
    {
      id: 'reflex-arc',
      category: 'biology',
      titleHindi: 'प्रतिवर्ती चाप एवं न्यूरॉन संरचना',
      titleEnglish: 'Reflex Arc & Structure of Neuron',
      chapter: 'अध्याय 6: नियंत्रण एवं समन्वय',
      chapterEn: 'Chapter 6: Control and Coordination',
      tag: 'तंत्रिका आरेख (Nervous System)',
      icon: '🧠',
      importance: 'बोर्ड परीक्षा 2026 मुख्य प्रश्न (3 अंक)',
    },
    {
      id: 'water-electrolysis',
      category: 'chemistry',
      titleHindi: 'जल का विद्युत अपघटन (Electrolysis of Water)',
      titleEnglish: 'Electrolysis of Water Apparatus',
      chapter: 'अध्याय 1: रासायनिक अभिक्रियाएं',
      chapterEn: 'Chapter 1: Chemical Reactions',
      tag: 'प्रयोग आरेख (Experiment)',
      icon: '🔋',
      importance: 'H₂ और O₂ का 2:1 आयतन अनुपात',
    },
  ];

  const filteredDiagrams = diagramsList.filter((d) => {
    const matchesCat = activeCategory === 'all' || d.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      d.titleHindi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeDiagram = diagramsList.find((d) => d.id === selectedId) || diagramsList[0];

  // Helper for pH color
  const getPhColor = (val: number) => {
    if (val < 3) return '#ef4444'; // Red (Strong Acid)
    if (val < 6) return '#f97316'; // Orange (Weak Acid)
    if (val < 7) return '#eab308'; // Yellow (Very Weak Acid)
    if (val === 7) return '#22c55e'; // Green (Neutral)
    if (val < 10) return '#06b6d4'; // Cyan (Weak Base)
    if (val < 12) return '#3b82f6'; // Blue (Moderate Base)
    return '#8b5cf6'; // Violet/Purple (Strong Base)
  };

  const getPhNature = (val: number) => {
    if (val < 7) return language === 'hi' ? 'अम्लीय (Acidic)' : 'Acidic';
    if (val === 7) return language === 'hi' ? 'उदासीन (Neutral)' : 'Neutral';
    return language === 'hi' ? 'क्षारकीय (Basic / Alkaline)' : 'Alkaline / Basic';
  };

  return (
    <div className="space-y-4 animate-fadeIn pb-8">
      {/* Top Sticky Header */}
      <div
        className={`p-3.5 rounded-3xl border flex items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-xl ${
          isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
        }`}
      >
        <button
          onClick={onBack}
          className={`p-2 rounded-2xl border text-xs font-bold transition-all flex items-center active:scale-95 ${
            isDarkMode
              ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title={language === 'hi' ? 'वापस जाएँ' : 'Go Back'}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="text-center min-w-0">
          <h2 className="text-xs sm:text-sm font-black flex items-center justify-center gap-1.5 truncate">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{language === 'hi' ? 'विज्ञान चित्र, ग्राफ व आरेख' : 'Science Diagrams & Graphs'}</span>
          </h2>
          <p className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">
            {language === 'hi' ? 'कक्षा 10वीं बोर्ड परीक्षा हेतु इंटरैक्टिव चार्ट्स' : 'Interactive visual models for Class 10 Board'}
          </p>
        </div>

        <div className="w-8" />
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
          {[
            { id: 'all', labelHi: 'सभी आरेख', labelEn: 'All Diagrams', icon: Layers },
            { id: 'physics', labelHi: 'भौतिक विज्ञान', labelEn: 'Physics', icon: Zap },
            { id: 'chemistry', labelHi: 'रसायन विज्ञान', labelEn: 'Chemistry', icon: FlaskConical },
            { id: 'biology', labelHi: 'जीव विज्ञान', labelEn: 'Biology', icon: Dna },
          ].map((cat) => {
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as DiagramCategory)}
                className={`px-3 py-1.5 rounded-xl border font-bold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-95 ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : isDarkMode
                    ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? cat.labelHi : cat.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'hi' ? 'आरेख खोजें: ओम ग्राफ, pH स्केल, हृदय, नेफ्रॉन...' : 'Search diagrams: Ohm graph, pH scale, Heart, Nephron...'}
            className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl font-medium focus:outline-none transition-all ${
              isDarkMode
                ? 'bg-slate-900/90 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-amber-400'
                : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-600 shadow-xs'
            }`}
          />
        </div>
      </div>

      {/* Main Interactive Diagram Stage */}
      <div
        className={`p-4 sm:p-5 rounded-3xl border transition-all ${
          isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
        }`}
      >
        {/* Diagram Title & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/50 dark:border-slate-800/50">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-400/30">
              {language === 'hi' ? activeDiagram.chapter : activeDiagram.chapterEn}
            </span>
            <h3 className="text-sm sm:text-base font-black mt-1 flex items-center gap-2">
              {activeDiagram.category === 'chemistry' ? (
                <FlaskConical className="w-4 h-4 text-sky-500 shrink-0 stroke-[2.2]" />
              ) : activeDiagram.category === 'biology' ? (
                <Dna className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.2]" />
              ) : (
                <Zap className="w-4 h-4 text-purple-500 shrink-0 stroke-[2.2]" />
              )}
              <span>{language === 'hi' ? activeDiagram.titleHindi : activeDiagram.titleEnglish}</span>
            </h3>
          </div>

          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeDiagram.importance}</span>
          </span>
        </div>

        {/* 1. OHM'S LAW INTERACTIVE GRAPH */}
        {activeDiagram.id === 'ohms-law' && (
          <div className="py-4 space-y-4">
            {/* Interactive Sliders */}
            <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>{language === 'hi' ? 'विभवांतर (Voltage, V):' : 'Potential Difference (V):'}</span>
                <span className="text-amber-500 text-sm font-black">{voltage} V</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                <span>1 V</span>
                <span>प्रतिरोध R = 3 Ω (स्थिर)</span>
                <span>12 V</span>
              </div>
            </div>

            {/* SVG Graph Visualization */}
            <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
              <svg viewBox="0 0 360 220" className="w-full max-w-md h-52">
                {/* Grid Lines */}
                <defs>
                  <pattern id="graphGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke={isDarkMode ? '#334155' : '#e2e8f0'} strokeWidth="1" strokeDasharray="2,2" />
                  </pattern>
                </defs>
                <rect x="40" y="20" width="300" height="160" fill="url(#graphGrid)" />

                {/* Axes */}
                <line x1="40" y1="180" x2="345" y2="180" stroke={isDarkMode ? '#94a3b8' : '#475569'} strokeWidth="2.5" />
                <line x1="40" y1="20" x2="40" y2="180" stroke={isDarkMode ? '#94a3b8' : '#475569'} strokeWidth="2.5" />

                {/* Axis Labels */}
                <text x="340" y="205" fill={isDarkMode ? '#cbd5e1' : '#1e293b'} fontSize="11" fontWeight="bold" textAnchor="end">
                  विद्युत धारा I (A) →
                </text>
                <text x="15" y="30" fill={isDarkMode ? '#cbd5e1' : '#1e293b'} fontSize="11" fontWeight="bold" transform="rotate(-90 20,30)">
                  विभवांतर V (Volt) →
                </text>

                {/* Linear Graph Line V = I * R */}
                <line x1="40" y1="180" x2="320" y2="40" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />

                {/* Calculated Active Point */}
                {(() => {
                  // Map Voltage (0 to 12) -> Y (180 to 40)
                  const ptY = 180 - (voltage / 12) * 140;
                  // Map Current (0 to 4) -> X (40 to 320)
                  const ptX = 40 + (current / 4) * 280;

                  return (
                    <g>
                      {/* Projection Dotted Lines */}
                      <line x1="40" y1={ptY} x2={ptX} y2={ptY} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                      <line x1={ptX} y1="180" x2={ptX} y2={ptY} stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />

                      {/* Active Circle Point */}
                      <circle cx={ptX} cy={ptY} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

                      {/* Coordinates Label */}
                      <rect x={Math.min(ptX + 8, 250)} y={ptY - 22} width="80" height="20" rx="6" fill={isDarkMode ? '#0f172a' : '#1e293b'} opacity="0.9" />
                      <text x={Math.min(ptX + 48, 290)} y={ptY - 8} fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                        ({current}A, {voltage}V)
                      </text>
                    </g>
                  );
                })()}
              </svg>

              {/* Real-time Math Output Card */}
              <div className="grid grid-cols-3 gap-2 w-full mt-2 text-center">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[10px] text-slate-400 font-bold block">विभवांतर (V)</span>
                  <span className="text-sm font-black text-amber-500">{voltage} V</span>
                </div>
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                  <span className="text-[10px] text-slate-400 font-bold block">धारा (I = V/R)</span>
                  <span className="text-sm font-black text-cyan-500">{current} A</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] text-slate-400 font-bold block">प्रतिरोध (ढाल = V/I)</span>
                  <span className="text-sm font-black text-emerald-500">3.00 Ω</span>
                </div>
              </div>
            </div>

            {/* Exam Formula & Tips */}
            <div className={`p-3 rounded-2xl border text-xs space-y-1.5 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-amber-50/60 border-amber-200'}`}>
              <div className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'बोर्ड परीक्षा मुख्य बिंदु (Ohm\'s Law Facts):' : 'Board Exam Key Facts:'}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                • <strong>ओम का नियम कथन:</strong> स्थिर भौतिक परिस्थितियों (जैसे ताप) में किसी चालक तार में प्रवाहित धारा उसके दोनों सिरों के बीच विभवांतर के समानुपाती होती है: <code>V ∝ I ⇒ V = IR</code>.
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                • <strong>V-I ग्राफ की रेखा:</strong> मूल बिंदु (Origin, 0,0) से गुजरने वाली एक <strong>सरल रेखा (Straight Line)</strong> होती है।
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                • <strong>ग्राफ का ढाल (Slope):</strong> <code>Slope = ΔV / ΔI = R (प्रतिरोध)</code> को दर्शाता है।
              </p>
            </div>
          </div>
        )}

        {/* 2. pH SCALE INTERACTIVE SPECTRUM */}
        {activeDiagram.id === 'ph-scale' && (
          <div className="py-4 space-y-4">
            {/* Interactive Slider */}
            <div className={`p-3 rounded-2xl border ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>{language === 'hi' ? 'pH मान चुनें:' : 'Select pH Value:'}</span>
                <span className="px-2.5 py-0.5 rounded-lg text-white font-black text-sm" style={{ backgroundColor: getPhColor(phValue) }}>
                  pH {phValue} • {getPhNature(phValue)}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="14"
                step="0.5"
                value={phValue}
                onChange={(e) => setPhValue(parseFloat(e.target.value))}
                className="w-full cursor-pointer h-3 rounded-lg"
                style={{
                  background: 'linear-gradient(to right, #ef4444 0%, #f97316 20%, #eab308 40%, #22c55e 50%, #06b6d4 70%, #3b82f6 85%, #8b5cf6 100%)',
                }}
              />

              <div className="flex justify-between text-[10px] font-black mt-1 text-slate-400">
                <span className="text-red-500">0 (प्रबल अम्ल)</span>
                <span className="text-emerald-500">7 (उदासीन)</span>
                <span className="text-purple-500">14 (प्रबल क्षारक)</span>
              </div>
            </div>

            {/* pH Spectrum Scale Visualization Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { nameHi: 'जठर रस (Gastric Juice)', nameEn: 'Gastric Juice', ph: 1.2, color: '#ef4444', desc: 'आमाशय में HCl' },
                { nameHi: 'नींबू का रस (Lemon Juice)', nameEn: 'Lemon Juice', ph: 2.2, color: '#f97316', desc: 'सिट्रिक अम्ल' },
                { nameHi: 'शुद्ध जल / रक्त (Water/Blood)', nameEn: 'Pure Water / Blood', ph: 7.4, color: '#22c55e', desc: 'रक्त pH 7.4' },
                { nameHi: 'मिल्क ऑफ मैग्नीशिया', nameEn: 'Milk of Magnesia', ph: 10.0, color: '#06b6d4', desc: 'Mg(OH)₂ (एंटासिड)' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setPhValue(item.ph)}
                  className={`p-2.5 rounded-2xl border cursor-pointer transition-all active:scale-95 ${
                    Math.abs(phValue - item.ph) < 0.6
                      ? 'ring-2 ring-amber-400 shadow-sm'
                      : isDarkMode
                      ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-black text-xs px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800">
                      pH {item.ph}
                    </span>
                  </div>
                  <h4 className="font-black text-[11px] mt-1.5 truncate">
                    {language === 'hi' ? item.nameHi : item.nameEn}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Board High-Yield Facts */}
            <div className={`p-3 rounded-2xl border text-xs space-y-1 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-blue-50/60 border-blue-200'}`}>
              <div className="font-black text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'दैनिक जीवन में pH का महत्व (Board Exam Direct Questions):' : 'Importance of pH in Daily Life:'}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                1. <strong>मानव शरीर का pH परास:</strong> 7.0 से 7.8 के बीच कार्य करता है।
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                2. <strong>अम्लीय वर्षा (Acid Rain):</strong> वर्षा के जल का pH मान जब <strong>5.6 से कम</strong> हो जाता है।
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                3. <strong>दंत-क्षय (Tooth Decay):</strong> मुंह का pH मान <strong>5.5 से कम</strong> होने पर दांतों का इनेमल (कैल्शियम हाइड्रोक्सीएपेटाइट) संक्षारित होने लगता है।
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                4. <strong>मधुमक्खी / नेटल डंक:</strong> मेथैनॉइक अम्ल छोड़ते हैं, जिसके निवारण हेतु बेकिंग सोडा (दुर्बल क्षारक) या डाक का पौधा लगाते हैं।
              </p>
            </div>
          </div>
        )}

        {/* 3. REACTIVITY SERIES OF METALS */}
        {activeDiagram.id === 'reactivity-series' && (
          <div className="py-4 space-y-4">
            {/* Reactivity Pyramid / Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-rose-500 block">
                  सर्वाधिक अभिक्रियाशील (Top)
                </span>
                <div className="space-y-1 font-black">
                  <div className="flex justify-between p-1.5 rounded-lg bg-rose-500/10"><span>K (पोटैशियम)</span><span className="text-[10px] text-rose-400">शीतल जल से तीव्र</span></div>
                  <div className="flex justify-between p-1.5 rounded-lg bg-rose-500/10"><span>Na (सोडियम)</span><span className="text-[10px] text-rose-400">आग पकड़ता है</span></div>
                  <div className="flex justify-between p-1.5 rounded-lg bg-rose-500/10"><span>Ca (कैल्शियम)</span><span className="text-[10px] text-rose-400">तैरने लगता है</span></div>
                  <div className="flex justify-between p-1.5 rounded-lg bg-rose-500/10"><span>Mg (मैग्नीशियम)</span><span className="text-[10px] text-rose-400">गर्म जल से क्रिया</span></div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-500 block">
                  मध्यम अभिक्रियाशील (Middle)
                </span>
                <div className="space-y-1 font-black">
                  <div className="flex justify-between p-1.5 rounded-lg bg-amber-500/10"><span>Al (एल्युमिनियम)</span><span className="text-[10px] text-amber-400">भाप से क्रिया</span></div>
                  <div className="flex justify-between p-1.5 rounded-lg bg-amber-500/10"><span>Zn (जिंक)</span><span className="text-[10px] text-amber-400">भाप से क्रिया</span></div>
                  <div className="flex justify-between p-1.5 rounded-lg bg-amber-500/10"><span>Fe (लोहा)</span><span className="text-[10px] text-amber-400">Fe₃O₄ बनाता है</span></div>
                  <div className="flex justify-between p-1.5 rounded-lg bg-amber-500/10"><span>Pb (लेड)</span><span className="text-[10px] text-amber-400">अम्ल से मंद क्रिया</span></div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-emerald-500 block">
                  सबसे कम अभिक्रियाशील (Bottom)
                </span>
                <div className="space-y-1 font-black">
                  <div className="flex justify-between p-1.5 rounded-lg bg-emerald-500/10"><span>[H] (हाइड्रोजन)</span><span className="text-[10px] text-emerald-400">संदर्भ अधातु</span></div>
                  <div className="flex justify-between p-1.5 rounded-lg bg-emerald-500/10"><span>Cu (कॉपर)</span><span className="text-[10px] text-emerald-400">अम्ल से H₂ नहीं</span></div>
                  <div className="flex justify-between p-1.5 rounded-lg bg-emerald-500/10"><span>Ag (सिल्वर)</span><span className="text-[10px] text-emerald-400">अक्रिय प्रकृति</span></div>
                  <div className="flex justify-between p-1.5 rounded-lg bg-emerald-500/10"><span>Au (गोल्ड)</span><span className="text-[10px] text-emerald-400">अम्लराज में घुलनशील</span></div>
                </div>
              </div>
            </div>

            {/* Mnemonic Memory Trick */}
            <div className={`p-3 rounded-2xl border text-xs space-y-1.5 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-emerald-50/60 border-emerald-200'}`}>
              <div className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'याद रखने की सुपर ट्रिक (Mnemonic Trick):' : 'Super Mnemonic Trick to Remember:'}</span>
              </div>
              <p className="font-bold text-slate-700 dark:text-slate-200">
                हिंदी ट्रिक: <span className="text-amber-500 font-black">केदार</span> (K) <span className="text-amber-500 font-black">नाथ</span> (Na) <span className="text-amber-500 font-black">का</span> (Ca) <span className="text-amber-500 font-black">माली</span> (Mg) <span className="text-amber-500 font-black">आलू</span> (Al) <span className="text-amber-500 font-black">जरा</span> (Zn) <span className="text-amber-500 font-black">फीके</span> (Fe) <span className="text-amber-500 font-black">पकाता</span> (Pb) <span className="text-amber-500 font-black">है</span> (H) <span className="text-amber-500 font-black">कौन</span> (Cu) <span className="text-amber-500 font-black">आगे</span> (Ag) <span className="text-amber-500 font-black">आया</span> (Au)
              </p>
            </div>
          </div>
        )}

        {/* 4. RAY DIAGRAM (CONCAVE MIRROR) */}
        {activeDiagram.id === 'ray-diagram-mirror' && (
          <div className="py-4 space-y-4">
            {/* Position Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
              {[
                { id: 'at-c', label: 'वक्रता केंद्र C पर (At C)' },
                { id: 'beyond-c', label: 'C से परे (Beyond C)' },
                { id: 'between-c-f', label: 'C और F के बीच' },
                { id: 'between-p-f', label: 'P और F के बीच (आभासी)' },
              ].map((pos) => (
                <button
                  key={pos.id}
                  onClick={() => setMirrorObjectPos(pos.id as any)}
                  className={`px-2.5 py-1 rounded-xl border font-bold whitespace-nowrap transition-all active:scale-95 ${
                    mirrorObjectPos === pos.id
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>

            {/* Interactive Ray Diagram Canvas (SVG) */}
            <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
              <svg viewBox="0 0 400 200" className="w-full max-w-lg h-52">
                {/* Principal Axis */}
                <line x1="10" y1="100" x2="390" y2="100" stroke={isDarkMode ? '#64748b' : '#94a3b8'} strokeWidth="2" strokeDasharray="4,2" />

                {/* Concave Mirror Arc */}
                <path d="M 330,20 A 130,130 0 0,0 330,180" fill="none" stroke="#38bdf8" strokeWidth="4" />
                {/* Silvering Hashing on back of mirror */}
                <path d="M 334,18 L 340,24 M 334,38 L 340,44 M 334,58 L 340,64 M 334,78 L 340,84 M 334,98 L 340,104 M 334,118 L 340,124 M 334,138 L 340,144 M 334,158 L 340,164 M 334,178 L 340,184" stroke="#64748b" strokeWidth="1.5" />

                {/* Pole P, Focus F, Centre C */}
                <circle cx="330" cy="100" r="4" fill="#38bdf8" />
                <text x="338" y="98" fill={isDarkMode ? '#ffffff' : '#0f172a'} fontSize="11" fontWeight="bold">P</text>

                <circle cx="230" cy="100" r="4" fill="#eab308" />
                <text x="228" y="118" fill={isDarkMode ? '#ffffff' : '#0f172a'} fontSize="11" fontWeight="bold">F</text>

                <circle cx="130" cy="100" r="4" fill="#a855f7" />
                <text x="128" y="118" fill={isDarkMode ? '#ffffff' : '#0f172a'} fontSize="11" fontWeight="bold">C</text>

                {/* Dynamic Object & Image based on mirrorObjectPos */}
                {mirrorObjectPos === 'at-c' && (
                  <g>
                    {/* Object Arrow at C */}
                    <line x1="130" y1="100" x2="130" y2="50" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrow)" />
                    <text x="110" y="45" fill="#f59e0b" fontSize="10" fontWeight="black">बिंब (Object)</text>

                    {/* Image Arrow at C (Inverted, Same Size) */}
                    <line x1="130" y1="100" x2="130" y2="150" stroke="#10b981" strokeWidth="3" />
                    <text x="110" y="165" fill="#10b981" fontSize="10" fontWeight="black">प्रतिबिंब (Image)</text>

                    {/* Ray 1: Parallel to Principal Axis -> Passes through F */}
                    <line x1="130" y1="50" x2="330" y2="50" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="330" y1="50" x2="70" y2="180" stroke="#ef4444" strokeWidth="1.5" />

                    {/* Ray 2: Passes through F -> Becomes Parallel */}
                    <line x1="130" y1="50" x2="230" y2="100" stroke="#06b6d4" strokeWidth="1.5" />
                    <line x1="230" y1="100" x2="330" y2="150" stroke="#06b6d4" strokeWidth="1.5" />
                    <line x1="330" y1="150" x2="70" y2="150" stroke="#06b6d4" strokeWidth="1.5" />
                  </g>
                )}

                {mirrorObjectPos === 'beyond-c' && (
                  <g>
                    {/* Object beyond C */}
                    <line x1="70" y1="100" x2="70" y2="40" stroke="#f59e0b" strokeWidth="3" />
                    <text x="50" y="35" fill="#f59e0b" fontSize="10" fontWeight="black">बिंब (Object)</text>

                    {/* Image between C and F (Diminished, Inverted) */}
                    <line x1="180" y1="100" x2="180" y2="130" stroke="#10b981" strokeWidth="2.5" />
                    <text x="160" y="145" fill="#10b981" fontSize="10" fontWeight="black">छोटा प्रतिबिंब</text>

                    {/* Rays */}
                    <line x1="70" y1="40" x2="330" y2="40" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="330" y1="40" x2="130" y2="140" stroke="#ef4444" strokeWidth="1.5" />
                  </g>
                )}

                {mirrorObjectPos === 'between-p-f' && (
                  <g>
                    {/* Object between P and F */}
                    <line x1="280" y1="100" x2="280" y2="60" stroke="#f59e0b" strokeWidth="3" />
                    <text x="250" y="55" fill="#f59e0b" fontSize="10" fontWeight="black">बिंब</text>

                    {/* Virtual Image Behind Mirror (Magnified, Erect) */}
                    <line x1="365" y1="100" x2="365" y2="30" stroke="#a855f7" strokeWidth="3" strokeDasharray="3,3" />
                    <text x="350" y="25" fill="#a855f7" fontSize="10" fontWeight="black">आभासी व सीधा</text>
                  </g>
                )}
              </svg>

              {/* Status Box */}
              <div className="w-full mt-3 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-slate-400 text-[10px] block">प्रतिबिंब की स्थिति:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">
                    {mirrorObjectPos === 'at-c' && 'वक्रता केंद्र C पर'}
                    {mirrorObjectPos === 'beyond-c' && 'C और F के बीच (छोटा)'}
                    {mirrorObjectPos === 'between-c-f' && 'C से परे (बड़ा)'}
                    {mirrorObjectPos === 'between-p-f' && 'दर्पण के पीछे (आभासी, सीधा व आवर्धित)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">प्रकृति (Nature):</span>
                  <span className="font-bold">
                    {mirrorObjectPos === 'between-p-f' ? 'आभासी तथा सीधा (Virtual & Erect)' : 'वास्तविक तथा उल्टा (Real & Inverted)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">आवर्धन (m):</span>
                  <span className="font-black">
                    {mirrorObjectPos === 'at-c' && 'm = -1 (समान आकार)'}
                    {mirrorObjectPos === 'beyond-c' && 'm < 1 (छोटा)'}
                    {mirrorObjectPos === 'between-c-f' && 'm > 1 (बड़ा)'}
                    {mirrorObjectPos === 'between-p-f' && 'm > +1 (धनात्मक)'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. HUMAN HEART & BIOLOGY DIAGRAMS */}
        {(activeDiagram.id === 'human-heart' || activeDiagram.id === 'nephron-structure' || activeDiagram.id === 'reflex-arc' || activeDiagram.id === 'water-electrolysis') && (
          <div className="py-4 space-y-4">
            {/* Step-by-Step Drawing Guide & Anatomical Map */}
            <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs sm:text-sm font-black flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>{language === 'hi' ? 'बोर्ड परीक्षा में 3 मिनट में नामांकित चित्र बनाने की ट्रिक:' : 'How to draw in 3 minutes in Board Exams:'}</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-black">
                  4 Marks Question
                </span>
              </div>

              {activeDiagram.id === 'human-heart' && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <span className="font-black text-blue-500 block">दायां अलिंद (Right Atrium)</span>
                      <span className="text-[10px] text-slate-400">शरीर से विऑक्सीजनित (CO₂) रक्त ग्रहण करता है</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <span className="font-black text-blue-500 block">दायां निलय (Right Ventricle)</span>
                      <span className="text-[10px] text-slate-400">फुफ्फुस धमनी द्वारा फेफड़ों में रक्त पंप करता है</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <span className="font-black text-rose-500 block">बायां अलिंद (Left Atrium)</span>
                      <span className="text-[10px] text-slate-400">फेफड़ों से ऑक्सीजनित (O₂) रक्त प्राप्त करता है</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <span className="font-black text-rose-500 block">बायां निलय (Left Ventricle)</span>
                      <span className="text-[10px] text-slate-400">महाधमनी (Aorta) द्वारा पूरे शरीर में O₂ रक्त भेजता है</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      • <strong>द्विपंच परिसंचरण (Double Circulation):</strong> मानव में रक्त को एक चक्र पूरा करने के लिए हृदय से <strong>दो बार</strong> गुजरना पड़ता है: (1) फुफ्फुसीय परिसंचरण (हृदय ⇄ फेफड़े), और (2) दैहिक परिसंचरण (हृदय ⇄ शरीर)।
                    </p>
                  </div>
                </div>
              )}

              {activeDiagram.id === 'nephron-structure' && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <span className="font-black text-purple-500 block">1. बोमन संपुट (Bowman's Capsule)</span>
                      <span className="text-[10px] text-slate-400">प्यालेनुमा भाग जिसमें केशिका गुच्छ (Glomerulus) स्थित होता है</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <span className="font-black text-cyan-500 block">2. हेनले का लूप (Henle's Loop)</span>
                      <span className="text-[10px] text-slate-400">U-आकार की नलिका जो जल व लवण का पुनरवशोषण करती है</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="font-black text-emerald-500 block">3. संग्राहक वाहिनी (Collecting Duct)</span>
                      <span className="text-[10px] text-slate-400">मूत्र को एकत्रित कर मूत्रवाहिनी में भेजती है</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                      • <strong>मूत्र निर्माण के तीन चरण:</strong> (1) परानिस्यंदन (Ultrafiltration in Glomerulus), (2) चयनात्मक पुनरवशोषण (Selective reabsorption of glucose, amino acids, salts, and water), (3) नलिका स्राव (Tubular secretion)।
                    </p>
                  </div>
                </div>
              )}

              {activeDiagram.id === 'reflex-arc' && (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-black">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-500">उद्दीपन (गरम वस्तु)</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-500">ग्राही अंग (त्वचा)</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-500">संवेदी तंत्रिका (Sensory)</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-500">मेरुरज्जु (Spinal Cord)</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-500">प्रेरक तंत्रिका (Motor)</span>
                    <span>→</span>
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 text-rose-500">कार्यकर अंग (हाथ हटाना)</span>
                  </div>
                </div>
              )}

              {activeDiagram.id === 'water-electrolysis' && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <span className="font-black text-cyan-500 block">कैथोड (Cathode, ऋण ध्रुव -)</span>
                      <p className="text-[11px] text-slate-300 mt-1">
                        • <strong>हाइड्रोजन गैस (H₂)</strong> एकत्रित होती है।<br />
                        • आयतन ऑक्सीजन का <strong>दोगुना (2:1)</strong> होता है।<br />
                        • मोमबत्ती लाने पर 'पॉप' (Pop sound) ध्वनि के साथ जलती है।
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                      <span className="font-black text-rose-500 block">एनोड (Anode, धन ध्रुव +)</span>
                      <p className="text-[11px] text-slate-300 mt-1">
                        • <strong>ऑक्सीजन गैस (O₂)</strong> एकत्रित होती है।<br />
                        • आयतन H₂ से आधा होता है।<br />
                        • जलती अगरबत्ती लाने पर तेजी से प्रज्वलित होती है।
                      </p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center font-black text-amber-400">
                    रासायनिक समीकरण: 2H₂O(l) + विद्युत धारा → 2H₂(g) + O₂(g)
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Grid of Other Diagrams to Explore */}
      <div className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
          {language === 'hi' ? 'अन्य महत्वपूर्ण आरेख चुनें:' : 'Select Diagram to Explore:'}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {filteredDiagrams.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={`p-3 rounded-2xl border text-left transition-all active:scale-95 ${
                selectedId === d.id
                  ? 'ring-2 ring-amber-400 shadow-md bg-amber-500/10 border-amber-400'
                  : isDarkMode
                  ? 'card-3d-dark hover:border-slate-700'
                  : 'card-3d-light hover:border-slate-300'
              }`}
            >
              <div className="mb-2">
                {d.category === 'chemistry' ? (
                  <FlaskConical className="w-5 h-5 text-sky-500 stroke-[2.2]" />
                ) : d.category === 'biology' ? (
                  <Dna className="w-5 h-5 text-emerald-500 stroke-[2.2]" />
                ) : (
                  <Zap className="w-5 h-5 text-purple-500 stroke-[2.2]" />
                )}
              </div>
              <h4 className="text-xs font-black truncate">
                {language === 'hi' ? d.titleHindi : d.titleEnglish}
              </h4>
              <span className="text-[9px] font-bold text-slate-400 truncate block mt-0.5">
                {language === 'hi' ? d.chapter : d.chapterEn}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
