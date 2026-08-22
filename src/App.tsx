import React, { useState, lazy, Suspense } from 'react';
import { HoneycombBackground } from './components/HoneycombBackground';
import { Header } from './components/Header';
import { SideDrawer } from './components/SideDrawer';
import { Dashboard } from './components/Dashboard';
import { BottomNavigation } from './components/BottomNavigation';
import { SplashScreen } from './components/SplashScreen';
import { LoadingSpinner } from './components/LoadingSpinner';

import { CHAPTERS_DATA } from './data/chaptersData';
import { VIDEO_LECTURES_DATA } from './data/videosData';

import { StorageService } from './services/db';
import { UserProgress, GitHubConfig } from './types';
import { X, FileText, Sparkles } from 'lucide-react';

// Lazy loaded secondary views and modals to optimize critical path & LCP performance
const BookViewer = lazy(() => import('./components/BookViewer').then((m) => ({ default: m.BookViewer })));
const NotesViewer = lazy(() => import('./components/NotesViewer').then((m) => ({ default: m.NotesViewer })));
const QuizView = lazy(() => import('./components/QuizView').then((m) => ({ default: m.QuizView })));
const PYQView = lazy(() => import('./components/PYQView').then((m) => ({ default: m.PYQView })));
const ImportantQuestionsView = lazy(() =>
  import('./components/ImportantQuestionsView').then((m) => ({ default: m.ImportantQuestionsView }))
);
const VideoLecturesView = lazy(() =>
  import('./components/VideoLecturesView').then((m) => ({ default: m.VideoLecturesView }))
);
const ProgressTrackerView = lazy(() =>
  import('./components/ProgressTrackerView').then((m) => ({ default: m.ProgressTrackerView }))
);
const GlossaryView = lazy(() => import('./components/GlossaryView').then((m) => ({ default: m.GlossaryView })));
const PrivacyPolicyView = lazy(() =>
  import('./components/PrivacyPolicyView').then((m) => ({ default: m.PrivacyPolicyView }))
);
const ShareModal = lazy(() => import('./components/ShareModal').then((m) => ({ default: m.ShareModal })));
const MoreAppsModal = lazy(() => import('./components/MoreAppsModal').then((m) => ({ default: m.MoreAppsModal })));
const GitHubConfigModal = lazy(() =>
  import('./components/GitHubConfigModal').then((m) => ({ default: m.GitHubConfigModal }))
);

const ViewLoadingFallback = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] gap-3 text-center animate-fadeIn py-12">
    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center animate-spin">
      <Sparkles className="w-5 h-5 text-amber-500" />
    </div>
    <span className={`text-xs font-black ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
      सामग्री लोड हो रही है...
    </span>
  </div>
);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<
    'Dashboard' | 'Book' | 'Notes' | 'Quiz' | 'PYQ' | 'IMPORTANT' | 'VIDEOS' | 'PROGRESS' | 'GLOSSARY' | 'PRIVACY'
  >(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const path = window.location.pathname;
      if (search.includes('view=PRIVACY') || search.includes('privacy') || path.includes('/privacy')) {
        return 'PRIVACY';
      }
    }
    return 'Dashboard';
  });

  const [selectedChapterForNotes, setSelectedChapterForNotes] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Dark/Light Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rbse_theme_mode');
      return saved === 'dark';
    } catch (e) {
      return false;
    }
  });

  // Drawer & Modals State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMoreAppsModalOpen, setIsMoreAppsModalOpen] = useState(false);
  const [isGitHubConfigOpen, setIsGitHubConfigOpen] = useState(false);

  // App Persistence State
  const [progress, setProgress] = useState<UserProgress>(() => StorageService.getProgress());
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(() => StorageService.getGitHubConfig());

  // Toggle Dark Mode
  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('rbse_theme_mode', next ? 'dark' : 'light');
      } catch (e) {}
      return next;
    });
  };

  const refreshProgress = () => {
    setProgress(StorageService.getProgress());
  };

  const handleSelectOption = (
    option: 'Book' | 'Notes' | 'Quiz' | 'PYQ' | 'IMPORTANT' | 'SHARE' | 'MORE_APPS' | 'VIDEOS' | 'PROGRESS' | 'GLOSSARY' | 'PRIVACY'
  ) => {
    if (option === 'SHARE') {
      setIsShareModalOpen(true);
    } else if (option === 'MORE_APPS') {
      setIsMoreAppsModalOpen(true);
    } else {
      if (option === 'Notes') {
        setSelectedChapterForNotes(undefined);
      }
      setCurrentView(option);
    }
  };

  const handleOpenChapterNotes = (chapterId: number) => {
    setSelectedChapterForNotes(chapterId);
    setCurrentView('Notes');
  };

  return (
    <div className={`h-screen w-screen overflow-hidden font-sans selection:bg-amber-500 selection:text-slate-950 relative antialiased flex flex-col items-center transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100/90 text-slate-900'
    }`}>
      {/* App Opening Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Interactive Honeycomb Canvas Background with subtle blur */}
      <HoneycombBackground isDarkMode={isDarkMode} />

      {/* Main Drawer Menu */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenMoreApps={() => setIsMoreAppsModalOpen(true)}
        onOpenGitHubConfig={() => setIsGitHubConfigOpen(true)}
        onOpenPrivacyPolicy={() => setCurrentView('PRIVACY')}
      />

      {/* Mobile App Frame Container with fixed header/footer and scrollable middle */}
      <div className="w-full max-w-md h-screen flex flex-col relative z-10 shadow-2xl overflow-hidden">
        {/* Fixed Top Header */}
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />

        {/* Scrollable Middle Body Section */}
        <main className="flex-1 min-h-0 px-3.5 pt-3 pb-3 overflow-y-auto custom-scrollbar relative">
          {searchQuery ? (
            /* Search Results Overlay View */
            <div className="space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase text-amber-500 tracking-wider">
                  खोज परिणाम ("{searchQuery}")
                </h3>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-bold"
                >
                  <X className="w-3.5 h-3.5" />
                  रद्द करें
                </button>
              </div>

              {/* Filtered Notes Search Results */}
              <div className="space-y-2">
                {CHAPTERS_DATA.filter(
                  (c) =>
                    c.titleHindi.includes(searchQuery) ||
                    c.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.description.includes(searchQuery)
                ).map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      setSearchQuery('');
                      handleOpenChapterNotes(ch.id);
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-amber-500' : 'bg-white border-slate-200 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{ch.icon3D}</span>
                      <div>
                        <div className="text-xs font-bold">{ch.titleHindi}</div>
                        <div className="text-[10px] text-slate-400">{ch.unit}</div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-amber-500 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      नोट्स →
                    </span>
                  </div>
                ))}
              </div>

              {/* Search Video Lectures */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-bold text-slate-400">वीडियो व्याख्यान:</div>
                {VIDEO_LECTURES_DATA.filter((v) =>
                  v.title.includes(searchQuery) || v.topics.some((t) => t.includes(searchQuery))
                ).map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentView('VIDEOS');
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between ${
                      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">🎥</span>
                      <div>
                        <div className="text-xs font-bold truncate max-w-[200px]">{vid.title}</div>
                        <div className="text-[10px] text-slate-400">{vid.teacherName} • {vid.duration}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-500 font-extrabold">देखें →</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Views Router */
            <Suspense fallback={<ViewLoadingFallback isDarkMode={isDarkMode} />}>
              {currentView === 'Dashboard' && (
                <Dashboard
                  onSelectOption={handleSelectOption}
                  completedChaptersCount={(progress?.completedChapters || []).length}
                  completedChapters={progress?.completedChapters || []}
                  isDarkMode={isDarkMode}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              )}

              {currentView === 'Book' && (
                <BookViewer
                  chapters={CHAPTERS_DATA}
                  onBack={() => setCurrentView('Dashboard')}
                  onSelectChapterNotes={handleOpenChapterNotes}
                  customBooksUrl={githubConfig.customBooksJsonUrl}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'Notes' && (
                <NotesViewer
                  chapters={CHAPTERS_DATA}
                  initialChapterId={selectedChapterForNotes}
                  onBack={() => setCurrentView('Dashboard')}
                  onProgressUpdate={refreshProgress}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'Quiz' && (
                <QuizView
                  chapters={CHAPTERS_DATA}
                  progress={progress}
                  onBack={() => setCurrentView('Dashboard')}
                  onProgressUpdate={refreshProgress}
                  customQuizUrl={githubConfig.customQuizJsonUrl}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'PYQ' && (
                <PYQView
                  onBack={() => setCurrentView('Dashboard')}
                  customPyqUrl={githubConfig.customPyqJsonUrl}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'IMPORTANT' && (
                <ImportantQuestionsView
                  onBack={() => setCurrentView('Dashboard')}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'VIDEOS' && (
                <VideoLecturesView
                  onBack={() => setCurrentView('Dashboard')}
                  onOpenNotes={handleOpenChapterNotes}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'PROGRESS' && (
                <ProgressTrackerView
                  progress={progress}
                  chapters={CHAPTERS_DATA}
                  onBack={() => setCurrentView('Dashboard')}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'GLOSSARY' && (
                <GlossaryView
                  onBack={() => setCurrentView('Dashboard')}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'PRIVACY' && (
                <PrivacyPolicyView
                  onBack={() => setCurrentView('Dashboard')}
                  isDarkMode={isDarkMode}
                />
              )}
            </Suspense>
          )}
        </main>

        {/* Fixed Bottom Navigation Footer */}
        <BottomNavigation
          currentView={currentView}
          onSelectView={handleSelectOption}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Global PDF Proxy Loading Spinner */}
      <LoadingSpinner isDarkMode={isDarkMode} />

      {/* Modals */}
      <Suspense fallback={null}>
        {isShareModalOpen && (
          <ShareModal onClose={() => setIsShareModalOpen(false)} isDarkMode={isDarkMode} />
        )}

        {isMoreAppsModalOpen && (
          <MoreAppsModal onClose={() => setIsMoreAppsModalOpen(false)} isDarkMode={isDarkMode} />
        )}

        {isGitHubConfigOpen && (
          <GitHubConfigModal
            config={githubConfig}
            onSave={(updated) => setGithubConfig(updated)}
            onClose={() => setIsGitHubConfigOpen(false)}
            isDarkMode={isDarkMode}
          />
        )}
      </Suspense>
    </div>
  );
}
