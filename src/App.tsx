import React, { useState, useEffect } from 'react';
import { Chapter, UserProgress } from './types';
import { CHAPTERS_DATA } from './data/chaptersData';
import { StorageService } from './services/db';
import { LanguageProvider, useLanguage } from './utils/languageContext';

// Primary View Components
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { BookViewer } from './components/BookViewer';
import { NotesViewer } from './components/NotesViewer';
import { QuizView } from './components/QuizView';
import { PYQView } from './components/PYQView';
import { ImportantQuestionsView } from './components/ImportantQuestionsView';
import { VideoLecturesView } from './components/VideoLecturesView';
import { GlossaryView } from './components/GlossaryView';
import { ProgressTrackerView } from './components/ProgressTrackerView';
import { DiagramsAndGraphsView } from './components/DiagramsAndGraphsView';
import { SplashScreen } from './components/SplashScreen';
import { SideDrawer } from './components/SideDrawer';
import { ScienceBottomNav, ScienceTab } from './components/ScienceBottomNav';

// Modals
import { ShareModal } from './components/ShareModal';
import { MoreAppsModal } from './components/MoreAppsModal';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';

type ActiveViewType =
  | 'DASHBOARD'
  | 'BOOK'
  | 'NOTES'
  | 'QUIZ'
  | 'PYQ'
  | 'IMPORTANT'
  | 'VIDEOS'
  | 'GLOSSARY'
  | 'PROGRESS'
  | 'DIAGRAMS'
  | 'PRIVACY_POLICY';

function AppContent() {
  const { language } = useLanguage();

  // Splash Screen State (shown only once per initial load)
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      const hasShown = sessionStorage.getItem('sciencegoat_splash_shown');
      return !hasShown;
    } catch {
      return false;
    }
  });

  // User Progress and Persistence State
  const [progress, setProgress] = useState<UserProgress>(() => StorageService.getProgress());

  // Dark/Light Theme State (persisted)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('sciencegoat_theme');
      if (saved !== null) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Navigation State
  const [currentTab, setCurrentTab] = useState<ScienceTab>('home');
  const [activeView, setActiveView] = useState<ActiveViewType>('DASHBOARD');
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isMoreAppsModalOpen, setIsMoreAppsModalOpen] = useState<boolean>(false);

  // Sync theme with DOM document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('sciencegoat_theme', 'dark'); } catch {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('sciencegoat_theme', 'light'); } catch {}
    }
  }, [isDarkMode]);

  // Handle Splash Screen finish
  const handleSplashFinish = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('sciencegoat_splash_shown', 'true');
    } catch {}
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Refresh User Progress from Database/LocalStorage
  const handleProgressUpdate = () => {
    const updated = StorageService.getProgress();
    setProgress({ ...updated });
  };

  // Switch Bottom Tab
  const handleSelectTab = (tab: ScienceTab) => {
    setCurrentTab(tab);
    switch (tab) {
      case 'home':
        setSelectedChapterId(null);
        setActiveView('DASHBOARD');
        break;
      case 'book':
        setSelectedChapterId(null);
        setActiveView('BOOK');
        break;
      case 'notes':
        setSelectedChapterId(null);
        setActiveView('NOTES');
        break;
      case 'quiz':
        setActiveView('QUIZ');
        break;
      case 'progress':
        setActiveView('PROGRESS');
        break;
      default:
        setActiveView('DASHBOARD');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Options selected from Dashboard or other links
  const handleSelectDashboardOption = (
    option: 'Book' | 'Notes' | 'Quiz' | 'PYQ' | 'IMPORTANT' | 'SHARE' | 'MORE_APPS' | 'VIDEOS' | 'PROGRESS' | 'GLOSSARY' | 'DIAGRAMS'
  ) => {
    switch (option) {
      case 'Book':
        setSelectedChapterId(null);
        setCurrentTab('book');
        setActiveView('BOOK');
        break;
      case 'Notes':
        setSelectedChapterId(null);
        setCurrentTab('notes');
        setActiveView('NOTES');
        break;
      case 'Quiz':
        setSelectedChapterId(null);
        setCurrentTab('quiz');
        setActiveView('QUIZ');
        break;
      case 'PROGRESS':
        setCurrentTab('progress');
        setActiveView('PROGRESS');
        break;
      case 'PYQ':
        setActiveView('PYQ');
        break;
      case 'IMPORTANT':
        setActiveView('IMPORTANT');
        break;
      case 'DIAGRAMS':
        setActiveView('DIAGRAMS');
        break;
      case 'VIDEOS':
        setActiveView('VIDEOS');
        break;
      case 'GLOSSARY':
        setActiveView('GLOSSARY');
        break;
      case 'SHARE':
        setIsShareModalOpen(true);
        break;
      case 'MORE_APPS':
        setIsMoreAppsModalOpen(true);
        break;
      default:
        setActiveView('DASHBOARD');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back Button Navigation handler
  const handleBackToDashboard = () => {
    setCurrentTab('home');
    setActiveView('DASHBOARD');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Notes for a specific chapter
  const handleOpenChapterNotes = (chapterId: number) => {
    setSelectedChapterId(chapterId);
    setCurrentTab('notes');
    setActiveView('NOTES');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Quiz for a specific chapter
  const handleOpenChapterQuiz = (chapterId?: number) => {
    if (chapterId) setSelectedChapterId(chapterId);
    setCurrentTab('quiz');
    setActiveView('QUIZ');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If splash screen is active, show it
  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  const completedCount = progress?.completedChapters?.length || 0;
  const streakDays = progress?.streakDays || 0;
  const totalPoints = progress?.totalPoints || 0;

  return (
    <div
      id="science-goat-app"
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100'
          : 'bg-slate-100/90 text-slate-900'
      }`}
    >
      {/* Sticky Top Header with Streak, Points, Menu, Theme Toggle */}
      <Header
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        streakDays={streakDays}
        totalPoints={totalPoints}
        onOpenProgress={() => handleSelectTab('progress')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto px-3.5 pt-3 pb-24 transition-all">
        {activeView === 'DASHBOARD' && (
          <Dashboard
            onSelectOption={handleSelectDashboardOption}
            completedChaptersCount={completedCount}
            completedChapters={progress?.completedChapters || []}
            isDarkMode={isDarkMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {activeView === 'BOOK' && (
          <BookViewer
            chapters={CHAPTERS_DATA}
            onBack={handleBackToDashboard}
            onSelectChapterNotes={handleOpenChapterNotes}
            isDarkMode={isDarkMode}
            initialChapterId={selectedChapterId || undefined}
          />
        )}

        {activeView === 'NOTES' && (
          <NotesViewer
            chapters={CHAPTERS_DATA}
            initialChapterId={selectedChapterId || undefined}
            onBack={handleBackToDashboard}
            onProgressUpdate={handleProgressUpdate}
            onOpenQuizTab={handleOpenChapterQuiz}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'QUIZ' && (
          <QuizView
            chapters={CHAPTERS_DATA}
            progress={progress}
            onBack={handleBackToDashboard}
            onProgressUpdate={handleProgressUpdate}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'PROGRESS' && (
          <ProgressTrackerView
            progress={progress}
            chapters={CHAPTERS_DATA}
            onBack={handleBackToDashboard}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'PYQ' && (
          <PYQView
            onBack={handleBackToDashboard}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'IMPORTANT' && (
          <ImportantQuestionsView
            onBack={handleBackToDashboard}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'DIAGRAMS' && (
          <DiagramsAndGraphsView
            onBack={handleBackToDashboard}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'VIDEOS' && (
          <VideoLecturesView
            onBack={handleBackToDashboard}
            onOpenNotes={handleOpenChapterNotes}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'GLOSSARY' && (
          <GlossaryView
            onBack={handleBackToDashboard}
            isDarkMode={isDarkMode}
          />
        )}

        {activeView === 'PRIVACY_POLICY' && (
          <PrivacyPolicyView
            onBack={handleBackToDashboard}
            isDarkMode={isDarkMode}
          />
        )}
      </main>

      {/* Modern Bottom Navigation Bar */}
      <ScienceBottomNav
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        isDarkMode={isDarkMode}
        completedChaptersCount={completedCount}
        streakDays={streakDays}
      />

      {/* Side Drawer Menu */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenMoreApps={() => setIsMoreAppsModalOpen(true)}
        onOpenPrivacyPolicy={() => {
          setIsDrawerOpen(false);
          setActiveView('PRIVACY_POLICY');
        }}
        streakDays={streakDays}
      />

      {/* Modals */}
      {isShareModalOpen && (
        <ShareModal
          onClose={() => setIsShareModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}

      {isMoreAppsModalOpen && (
        <MoreAppsModal
          onClose={() => setIsMoreAppsModalOpen(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
