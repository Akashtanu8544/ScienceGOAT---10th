import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'hi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  hi: {
    // App Branding & Navigation
    appName: 'Science GOAT',
    appSubtitle: '10वीं RBSE विज्ञान',
    home: 'होम',
    book: 'किताब',
    notes: 'नोट्स',
    quiz: 'क्विज़',
    progress: 'प्रगति',
    diagrams: 'चित्र व ग्राफ',
    glossary: 'शब्दावली',
    pyq: 'पुराने पेपर्स',
    videos: 'वीडियो',
    important: 'महत्वपूर्ण प्रश्न',

    // Header
    level: 'लेवल',
    streak: 'स्ट्राइक',
    themeDark: 'डार्क मोड',
    themeLight: 'लाइट मोड',
    menu: 'मेनू',
    langToggle: 'English',

    // Dashboard Hero & Search
    boardExam2026: 'RBSE बोर्ड परीक्षा 2026',
    targetScore: 'लक्ष्य: 100/100 विज्ञान में टॉपर',
    searchPlaceholder: 'खोजें: ओम का नियम, रासायनिक समीकरण, मेंडल का नियम...',
    dailyBooster: 'दैनिक परीक्षा बूस्टर',
    subjectOverview: 'विषयवार प्रगति (Subject Overview)',
    detailedReport: 'विस्तृत रिपोर्ट',
    physics: 'भौतिक विज्ञान',
    chemistry: 'रसायन विज्ञान',
    biology: 'जीव विज्ञान',
    studyModules: 'अध्ययन अनुभाग (Study Modules)',
    dailyQuizTitle: 'दैनिक 10 MCQ अभ्यास',
    dailyQuizSubtitle: 'रोजाना 10 प्रश्नों से बोर्ड परीक्षा स्कोर बूस्ट करें',
    takeTest: 'टेस्ट दें',

    // Study Modules Cards
    ncertBookTitle: 'NCERT किताब',
    ncertBookSubtitle: 'NCERT Textbook (PDF)',
    ncertBookBadge: 'डिजिटल बुक',
    topperNotesTitle: 'अध्ययन नोट्स',
    topperNotesSubtitle: 'Topper Notes & Formulas',
    topperNotesBadge: 'हस्तलिखित नोट्स',
    practiceQuizTitle: 'अभ्यास क्विज़',
    practiceQuizSubtitle: 'Chapterwise Online Test',
    practiceQuizBadge: 'ऑनलाइन टेस्ट',
    importantQTitle: 'महत्वपूर्ण प्रश्न',
    importantQSubtitle: '100% Board Special Q&A',
    importantQBadge: '2026 बोर्ड स्पेशल',
    pyqTitle: 'बोर्ड PYQ (2018-2026)',
    pyqSubtitle: 'Solved Papers With Answers',
    pyqBadge: '2018-2026 पेपर्स',
    videosTitle: 'वीडियो कक्षाएं',
    videosSubtitle: 'HD Video Lectures & Tricks',
    videosBadge: 'वीडियो व प्रयोग',
    diagramsTitle: 'चित्र व ग्राफ',
    diagramsSubtitle: 'Ray Diagrams, Graphs & Biology',
    diagramsBadge: 'महत्वपूर्ण आरेख',
    glossaryTitle: 'विज्ञान शब्दावली',
    glossarySubtitle: 'Scientific Terms & Definitions',
    glossaryBadge: 'परिभाषाएं व सूत्र',

    // Book Viewer
    bookHeaderTitle: 'NCERT विज्ञान आधिकारिक पाठ्यपुस्तक',
    bookHeaderSubtitle: 'राजस्थान बोर्ड कक्षा 10वीं अधिकृत संस्करण',
    downloadAll: 'सभी 13 पाठ डाउनलोड करें',
    offlineAvailable: 'ऑफलाइन उपलब्ध',
    readPdf: 'PDF पढ़ें',
    readNotes: 'नोट्स देखें',
    cancelDownload: 'डाउनलोड रोकें',

    // PYQ View
    pyqHeaderTitle: 'विगत वर्षों के बोर्ड प्रश्न पत्र (2018-2026)',
    pyqHeaderSubtitle: 'RBSE बोर्ड मुख्य परीक्षा एवं मॉडल पेपर हल सहित',
    solvedPaper: 'हल सहित',
    officialModelPaper: 'ऑफिशियल मॉडल पेपर',
    viewPaper: 'पेपर देखें',
    downloadPaper: 'डाउनलोड PDF',

    // Video Viewer
    videoLecturesTitle: 'वीडियो लेक्चर्स (HD Lectures)',
    landscapeMode: 'लैंडस्केप / फुलस्क्रीन मोड',
    exitLandscape: 'लैंडस्केप से बाहर आएं',
    keyTakeaways: 'मुख्य बिंदु व ट्रिक्स (Key Takeaways)',

    // Common
    back: 'वापस जाएँ',
    chapters: 'अध्याय',
    marks: 'अंक',
    time: 'समय',
  },

  en: {
    // App Branding & Navigation
    appName: 'Science GOAT',
    appSubtitle: '10th RBSE Science',
    home: 'Home',
    book: 'Book',
    notes: 'Notes',
    quiz: 'Quiz',
    progress: 'Progress',
    diagrams: 'Diagrams & Graphs',
    glossary: 'Glossary',
    pyq: 'Past Papers',
    videos: 'Videos',
    important: 'Important Q&A',

    // Header
    level: 'Level',
    streak: 'Streak',
    themeDark: 'Dark Mode',
    themeLight: 'Light Mode',
    menu: 'Menu',
    langToggle: 'हिन्दी',

    // Dashboard Hero & Search
    boardExam2026: 'RBSE Board Exam 2026',
    targetScore: 'Target: 100/100 Science Topper',
    searchPlaceholder: "Search: Ohm's law, chemical equations, Mendel's laws...",
    dailyBooster: 'Daily Exam Booster',
    subjectOverview: 'Subject Progress Overview',
    detailedReport: 'Detailed Report',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    studyModules: 'Study Modules',
    dailyQuizTitle: 'Daily 10 MCQ Practice',
    dailyQuizSubtitle: 'Boost your board exam score with 10 questions daily',
    takeTest: 'Take Test',

    // Study Modules Cards
    ncertBookTitle: 'NCERT Textbook',
    ncertBookSubtitle: 'Official Class 10 Science (PDF)',
    ncertBookBadge: 'Digital Book',
    topperNotesTitle: 'Study Notes',
    topperNotesSubtitle: 'Topper Notes & Formulas',
    topperNotesBadge: 'Handwritten Notes',
    practiceQuizTitle: 'Practice Quiz',
    practiceQuizSubtitle: 'Chapterwise Online MCQ Test',
    practiceQuizBadge: 'Online Test',
    importantQTitle: 'Important Questions',
    importantQSubtitle: '100% Board Special Q&A',
    importantQBadge: '2026 Board Special',
    pyqTitle: 'Board PYQs (2018-2026)',
    pyqSubtitle: 'Solved Papers With Answers',
    pyqBadge: '2018-2026 Papers',
    videosTitle: 'Video Lectures',
    videosSubtitle: 'HD Video Lectures & Experiments',
    videosBadge: 'Videos & Tricks',
    diagramsTitle: 'Diagrams & Graphs',
    diagramsSubtitle: 'Ray Diagrams, V-I Graphs & Anatomy',
    diagramsBadge: 'Key Illustrations',
    glossaryTitle: 'Science Glossary',
    glossarySubtitle: 'Scientific Terms & Definitions',
    glossaryBadge: 'Formulas & Definitions',

    // Book Viewer
    bookHeaderTitle: 'NCERT Science Official Textbook (English)',
    bookHeaderSubtitle: 'Rajasthan Board Class 10th Authorized Edition',
    downloadAll: 'Download All 13 Chapters',
    offlineAvailable: 'Offline Ready',
    readPdf: 'Read PDF',
    readNotes: 'View Notes',
    cancelDownload: 'Cancel Download',

    // PYQ View
    pyqHeaderTitle: 'Previous Years Question Papers (2018-2026)',
    pyqHeaderSubtitle: 'RBSE Board Main Examination & Solved Model Papers',
    solvedPaper: 'Solved',
    officialModelPaper: 'Official Model Paper',
    viewPaper: 'View Paper',
    downloadPaper: 'Download PDF',

    // Video Viewer
    videoLecturesTitle: 'HD Video Lectures & Lab Classes',
    landscapeMode: 'Landscape / Fullscreen Mode',
    exitLandscape: 'Exit Landscape',
    keyTakeaways: 'Key Takeaways & Formula Tricks',

    // Common
    back: 'Go Back',
    chapters: 'Chapters',
    marks: 'Marks',
    time: 'Time',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'hi',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('sciencegoat_lang');
      if (saved === 'en' || saved === 'hi') return saved;
    } catch {}
    return 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sciencegoat_lang', lang);
      document.documentElement.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    } catch {}
  };

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const t = (key: string, fallback?: string): string => {
    return TRANSLATIONS[language]?.[key] || fallback || TRANSLATIONS['hi']?.[key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language === 'hi' ? 'hi-IN' : 'en-US';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
