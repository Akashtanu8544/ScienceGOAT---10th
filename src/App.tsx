import React, { useState } from 'react';
import { HoneycombBackground } from './components/HoneycombBackground';
import { Header } from './components/Header';
import { SideDrawer } from './components/SideDrawer';
import { Dashboard } from './components/Dashboard';
import { BookViewer } from './components/BookViewer';
import { NotesViewer } from './components/NotesViewer';
import { QuizView } from './components/QuizView';
import { PYQView } from './components/PYQView';
import { ImportantQuestionsView } from './components/ImportantQuestionsView';
import { VideoLecturesView } from './components/VideoLecturesView';
import { ProgressTrackerView } from './components/ProgressTrackerView';
import { ShareModal } from './components/ShareModal';
import { MoreAppsModal } from './components/MoreAppsModal';
import { GitHubConfigModal } from './components/GitHubConfigModal';
import { BottomNavigation } from './components/BottomNavigation';
import { SplashScreen } from './components/SplashScreen';

import { CHAPTERS_DATA } from './data/chaptersData';
import { NOTES_DATA } from './data/notesData';
import { QUIZ_QUESTIONS_DATA, MOCK_EXAMS_DATA } from './data/quizData';
import { PYQ_PAPERS_DATA } from './data/pyqData';
import { IMPORTANT_QUESTIONS_DATA } from './data/importantQuestionsData';
import { VIDEO_LECTURES_DATA } from './data/videosData';

import { StorageService } from './services/db';
import { UserProgress, GitHubConfig } from './types';
import { Search, X, FileText } from 'lucide-react';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<
    'Dashboard' | 'Book' | 'Notes' | 'Quiz' | 'PYQ' | 'IMPORTANT' | 'VIDEOS' | 'PROGRESS'
  >('Dashboard');

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
    option: 'Book' | 'Notes' | 'Quiz' | 'PYQ' | 'IMPORTANT' | 'SHARE' | 'MORE_APPS' | 'VIDEOS' | 'PROGRESS'
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
    <div className={`min-h-screen font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden antialiased flex flex-col items-center transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100/90 text-slate-900'
    }`}>
      {/* App Opening Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* 3D Honeycomb Background */}
      <HoneycombBackground isDarkMode={isDarkMode} />

      {/* Side Drawer Menu */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenMoreApps={() => setIsMoreAppsModalOpen(true)}
        onOpenGitHubConfig={() => setIsGitHubConfigOpen(true)}
      />

      {/* Centered Mobile Shell */}
      <div className={`w-full max-w-md min-h-screen shadow-2xl relative flex flex-col pb-20 transition-colors backdrop-blur-sm ${
        isDarkMode ? 'bg-slate-950/25 sm:border-x sm:border-slate-800/80' : 'bg-slate-100/25 sm:border-x sm:border-white/50'
      }`}>
        {/* Header */}
        <Header
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />

        {/* Main Content Viewport */}
        <main className="relative z-10 flex-1 px-3.5 py-2 space-y-3">
          {/* Global Search Overlay */}
          {searchQuery.trim().length > 0 ? (
            <div className={`rounded-3xl p-4 border shadow-2xl space-y-3.5 backdrop-blur-2xl ${
              isDarkMode ? 'bg-slate-900/90 border-slate-700/80' : 'bg-white/90 border-white/80'
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-black text-amber-500 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  <span>खोज परिणाम: '{searchQuery}'</span>
                </h3>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] font-bold text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800"
                >
                  बंद करें ✕
                </button>
              </div>

              {/* Filtered Chapters */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">📖 सम्बंधित अध्याय व नोट्स:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {CHAPTERS_DATA.filter(
                    (c) =>
                      c.titleHindi.includes(searchQuery) ||
                      c.description.includes(searchQuery) ||
                      c.titleEnglish.toLowerCase().includes(searchQuery.toLowerCase())
                  ).slice(0, 5).map((ch) => (
                    <div
                      key={ch.id}
                      onClick={() => {
                        setSearchQuery('');
                        handleOpenChapterNotes(ch.id);
                      }}
                      className={`cursor-pointer p-3 rounded-2xl border flex items-center justify-between transition-all active:scale-98 ${
                        isDarkMode ? 'bg-slate-950/80 border-slate-800 hover:border-amber-500/50' : 'bg-slate-50/90 border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{ch.icon3D}</span>
                        <div>
                          <div className="text-[10px] font-black text-amber-500">अध्याय {ch.chapterNumber}</div>
                          <div className="text-xs font-bold">{ch.titleHindi}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-blue-600 dark:text-amber-400 font-extrabold flex items-center gap-0.5">
                        <FileText className="w-3 h-3" />
                        नोट्स →
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtered Video Lectures */}
              <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-wider">🎥 सम्बंधित वीडियो व्याख्यान:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {VIDEO_LECTURES_DATA.filter(
                    (v) =>
                      v.title.includes(searchQuery) ||
                      v.teacherName.includes(searchQuery)
                  ).slice(0, 3).map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => {
                        setSearchQuery('');
                        setCurrentView('VIDEOS');
                      }}
                      className={`cursor-pointer p-3 rounded-2xl border flex items-center justify-between transition-all active:scale-98 ${
                        isDarkMode ? 'bg-slate-950/80 border-slate-800 hover:border-amber-500/50' : 'bg-slate-50/90 border-slate-200 hover:border-blue-400'
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
            </div>
          ) : (
            /* Views Router */
            <>
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
                  notesData={NOTES_DATA}
                  initialChapterId={selectedChapterForNotes}
                  onBack={() => setCurrentView('Dashboard')}
                  onProgressUpdate={refreshProgress}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'Quiz' && (
                <QuizView
                  chapters={CHAPTERS_DATA}
                  questionsData={QUIZ_QUESTIONS_DATA}
                  mockExamsData={MOCK_EXAMS_DATA}
                  progress={progress}
                  onBack={() => setCurrentView('Dashboard')}
                  onProgressUpdate={refreshProgress}
                  customQuizUrl={githubConfig.customQuizJsonUrl}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'PYQ' && (
                <PYQView
                  papers={PYQ_PAPERS_DATA}
                  onBack={() => setCurrentView('Dashboard')}
                  customPyqUrl={githubConfig.customPyqJsonUrl}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'IMPORTANT' && (
                <ImportantQuestionsView
                  questions={IMPORTANT_QUESTIONS_DATA}
                  onBack={() => setCurrentView('Dashboard')}
                  isDarkMode={isDarkMode}
                />
              )}

              {currentView === 'VIDEOS' && (
                <VideoLecturesView
                  videos={VIDEO_LECTURES_DATA}
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
            </>
          )}
        </main>



        {/* Bottom Navigation */}
        <BottomNavigation
          currentView={currentView}
          onSelectView={handleSelectOption}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Modals */}
      {isShareModalOpen && (
        <ShareModal onClose={() => setIsShareModalOpen(false)} />
      )}

      {isMoreAppsModalOpen && (
        <MoreAppsModal onClose={() => setIsMoreAppsModalOpen(false)} />
      )}

      {isGitHubConfigOpen && (
        <GitHubConfigModal
          config={githubConfig}
          onSave={(updated) => setGithubConfig(updated)}
          onClose={() => setIsGitHubConfigOpen(false)}
        />
      )}
    </div>
  );
}
