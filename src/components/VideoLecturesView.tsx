import React, { useState, useRef, useEffect } from 'react';
import { VideoLecture } from '../types';
import { VIDEO_LECTURES_DATA } from '../data/videosData';
import { AdMobRewardedModal } from './AdMobRewardedModal';
import { ComingSoonModal } from './ComingSoonModal';
import { ComingSoonPlaceholder } from './ComingSoonPlaceholder';
import {
  Play,
  ArrowLeft,
  Lock,
  Search,
  BookOpen,
  Maximize,
  Minimize,
  RotateCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Tv,
  FlaskConical,
  Dna,
  Zap,
  Clock,
} from 'lucide-react';
import { useLanguage } from '../utils/languageContext';

interface VideoLecturesViewProps {
  videos?: VideoLecture[];
  onBack: () => void;
  onOpenNotes: (chapterId: number) => void;
  isDarkMode: boolean;
}

export const VideoLecturesView: React.FC<VideoLecturesViewProps> = ({
  videos = VIDEO_LECTURES_DATA,
  onBack,
  onOpenNotes,
  isDarkMode,
}) => {
  const { language, t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState<VideoLecture | null>(null);
  const [comingSoonVideo, setComingSoonVideo] = useState<VideoLecture | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'biology' | 'physics'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLandscapeMode, setIsLandscapeMode] = useState<boolean>(false);
  const [forceCssRotation, setForceCssRotation] = useState<boolean>(false);

  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [unlockedVideoIds, setUnlockedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rbse_unlocked_videos');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['vid_1', 'vid_2'];
  });

  const [pendingVideoForAd, setPendingVideoForAd] = useState<VideoLecture | null>(null);

  const isVideoAvailable = (vid: VideoLecture) => {
    return vid.isAvailable !== false && !!vid.youtubeId && vid.youtubeId.trim() !== '' && vid.youtubeId !== 'COMING_SOON';
  };

  const filteredVideos = videos.filter((v) => {
    const matchesSubject = v.subject === subjectFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.teacherName && v.teacherName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  const handleSelectVideo = (vid: VideoLecture) => {
    if (!isVideoAvailable(vid)) {
      setComingSoonVideo(vid);
      return;
    }

    const isUnlocked = unlockedVideoIds.includes(vid.id);
    if (!isUnlocked) {
      setPendingVideoForAd(vid);
    } else {
      setSelectedVideo(vid);
    }
  };

  const handleAdCompleted = () => {
    if (pendingVideoForAd) {
      const updated = [...unlockedVideoIds, pendingVideoForAd.id];
      setUnlockedVideoIds(updated);
      try {
        localStorage.setItem('rbse_unlocked_videos', JSON.stringify(updated));
      } catch (e) {}
      setSelectedVideo(pendingVideoForAd);
      setPendingVideoForAd(null);
    }
  };

  const toggleLandscape = async () => {
    if (!isLandscapeMode) {
      setIsLandscapeMode(true);
      try {
        if (playerContainerRef.current?.requestFullscreen) {
          await playerContainerRef.current.requestFullscreen();
        }
        // Attempt screen orientation lock to landscape if available
        if ((screen.orientation as any)?.lock) {
          await (screen.orientation as any).lock('landscape').catch(() => {});
        }
      } catch (err) {}
    } else {
      setIsLandscapeMode(false);
      setForceCssRotation(false);
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        }
        if ((screen.orientation as any)?.unlock) {
          (screen.orientation as any).unlock();
        }
      } catch (err) {}
    }
  };

  // Switch to next or previous video inside landscape player
  const currentIndex = selectedVideo ? videos.findIndex((v) => v.id === selectedVideo.id) : -1;
  const prevVideo = currentIndex > 0 ? videos[currentIndex - 1] : null;
  const nextVideo = currentIndex >= 0 && currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;

  /* LEVEL 1: VIDEO LECTURES LIST */
  if (!selectedVideo) {
    return (
      <div className="space-y-3.5 animate-fadeIn">
        {/* Centered Header Bar */}
        <div
          className={`relative flex items-center justify-between p-3.5 rounded-3xl border transition-all ${
            isDarkMode ? 'card-3d-dark text-white' : 'card-3d-light text-slate-900'
          }`}
        >
          <button
            onClick={onBack}
            className={`p-2.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center active:scale-95 ${
              isDarkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title={language === 'hi' ? 'वापस जाएँ' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2
            className={`text-xs sm:text-base font-black flex items-center gap-2 text-center truncate ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            <Tv className="w-5 h-5 text-amber-500 shrink-0 stroke-[2.2]" />
            <span>{t('videosTitle', 'वीडियो लेक्चर्स (HD Lectures)')}</span>
          </h2>
          <div className="w-9" />
        </div>

        {/* Pending Ad Modal */}
        {pendingVideoForAd && (
          <AdMobRewardedModal
            title={pendingVideoForAd.title}
            rewardMessage={
              language === 'hi'
                ? 'विज्ञापन देखने के पश्चात् HD वीडियो लेक्चर एवं सूत्र ट्रिक निःशुल्क अनलॉक हो जाएंगे!'
                : 'Watch a quick ad to unlock this HD video lecture and formula tricks for free!'
            }
            rewardButtonText={
              language === 'hi'
                ? 'रिवॉर्ड प्राप्त! वीडियो लेक्चर शुरू करें'
                : 'Reward Received! Start Lecture'
            }
            onRewardEarned={handleAdCompleted}
            onClose={() => setPendingVideoForAd(null)}
          />
        )}

        {/* Search & Subject Tabs */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'hi'
                  ? 'अध्याय या विषय खोजें: रासायनिक अभिक्रिया, प्रकाश, ओम का नियम...'
                  : 'Search video: Chemical Reactions, Light, Ohm’s Law...'
              }
              className={`w-full pl-9 pr-3 py-2.5 text-xs rounded-2xl font-bold transition-all focus:outline-none ${
                isDarkMode
                  ? 'input-3d-dark text-slate-100 placeholder-slate-400 focus:border-amber-400'
                  : 'input-3d-light text-slate-900 placeholder-slate-500 focus:border-indigo-600 shadow-xs'
              }`}
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'chemistry', labelHi: 'रसायन विज्ञान', labelEn: 'Chemistry', icon: FlaskConical },
              { id: 'physics', labelHi: 'भौतिक विज्ञान', labelEn: 'Physics', icon: Zap },
              { id: 'biology', labelHi: 'जीव विज्ञान', labelEn: 'Biology', icon: Dna },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSubjectFilter(tab.id as any)}
                  className={`flex-1 py-2 rounded-2xl font-black text-xs transition-all active:scale-95 border flex items-center justify-center gap-1.5 ${
                    subjectFilter === tab.id
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                      : isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span className="truncate">{language === 'hi' ? tab.labelHi : tab.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Videos List Cards */}
        <div className="space-y-3">
          {filteredVideos.map((vid) => {
            const isUnlocked = unlockedVideoIds.includes(vid.id);
            const isAvailable = isVideoAvailable(vid);

            return (
              <div
                key={vid.id}
                onClick={() => handleSelectVideo(vid)}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between gap-3 ${
                  isDarkMode
                    ? 'card-3d-dark hover:border-amber-400/40'
                    : 'card-3d-light hover:border-amber-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-700 flex items-center justify-center">
                    {isAvailable ? (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${vid.youtubeId}/mqdefault.jpg`}
                          alt={vid.title}
                          className="w-full h-full object-cover opacity-85"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-4 h-4 text-white fill-white drop-shadow" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center p-1">
                        <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                      </div>
                    )}
                    <span className="absolute bottom-1 right-1 text-[8px] bg-black/80 text-white font-bold px-1 rounded">
                      {vid.duration}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {!isAvailable && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 text-[9px] font-black border border-amber-500/30 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 animate-pulse" />
                          <span>{language === 'hi' ? 'जल्द आ रहा है' : 'Coming Soon'}</span>
                        </span>
                      )}
                    </div>
                    <h3
                      className={`text-xs sm:text-sm font-black truncate ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {vid.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate">
                      {vid.teacherName || 'RBSE विशेषज्ञ फैकल्टी'} • {vid.duration}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!isAvailable ? (
                    <span className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center gap-1 border border-amber-500/30 shadow-xs">
                      <Clock className="w-3.5 h-3.5 animate-pulse" />
                      <span>{language === 'hi' ? 'प्रतीक्षा करें' : 'Please Wait'}</span>
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs flex items-center gap-1 shadow-xs">
                      <Play className="w-3 h-3 fill-current" />
                      <span>{language === 'hi' ? 'प्ले' : 'Play'}</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-xs flex items-center gap-1 shadow-xs">
                      <Lock className="w-3 h-3" />
                      <span>{language === 'hi' ? 'अनलॉक' : 'Unlock'}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coming Soon Modal */}
        <ComingSoonModal
          isOpen={!!comingSoonVideo}
          onClose={() => setComingSoonVideo(null)}
          title={comingSoonVideo?.title || ''}
          chapterName={comingSoonVideo ? `अध्याय ${comingSoonVideo.chapterId}` : ''}
          type="video"
          subtitle={comingSoonVideo?.comingSoonMessage || 'यह वीडियो व्याख्यान अभी शिक्षक द्वारा ऐप में नहीं जोड़ा गया है। जल्द आ रहा है, कृपया प्रतीक्षा करें।'}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  }

  /* LEVEL 2: ACTIVE VIDEO PLAYER (WITH DEDICATED LANDSCAPE MODE) */
  return (
    <div
      ref={playerContainerRef}
      className={`space-y-3.5 animate-fadeIn ${
        isLandscapeMode
          ? 'fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden p-2 sm:p-4'
          : ''
      }`}
    >
      {/* Player Header Controls */}
      <div
        className={`p-3 rounded-2xl border flex items-center justify-between gap-2 transition-all ${
          isLandscapeMode
            ? 'bg-slate-950/90 border-slate-800 text-white shadow-xl'
            : isDarkMode
            ? 'card-3d-dark text-white'
            : 'card-3d-light text-slate-900'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => {
              if (isLandscapeMode) toggleLandscape();
              setSelectedVideo(null);
            }}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center active:scale-95 ${
              isDarkMode || isLandscapeMode
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-black truncate">
              {selectedVideo.title}
            </h2>
            <p className="text-[10px] text-amber-400 font-bold flex items-center gap-1.5">
              <span>HD Video • {selectedVideo.duration}</span>
              {isLandscapeMode && <span className="bg-amber-500/20 px-1.5 rounded text-[9px]">Landscape On</span>}
            </p>
          </div>
        </div>

        {/* Right Action Bar: Landscape Toggle & Notes */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Landscape / Fullscreen Toggle Button */}
          <button
            onClick={toggleLandscape}
            className={`px-3 py-1.5 rounded-xl font-black text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-95 ${
              isLandscapeMode
                ? 'bg-amber-500 text-slate-950 border border-amber-400'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
            }`}
            title={isLandscapeMode ? 'Exit Landscape' : 'Enter Landscape Mode'}
          >
            {isLandscapeMode ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">
              {isLandscapeMode
                ? language === 'hi' ? 'सामान्य मोड' : 'Exit Landscape'
                : language === 'hi' ? 'लैंडस्केप मोड' : 'Landscape Mode'}
            </span>
          </button>

          {/* Force CSS Rotate for mobile devices without auto-rotate */}
          {isLandscapeMode && (
            <button
              onClick={() => setForceCssRotation(!forceCssRotation)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
              title="घुमाएं (Rotate Screen)"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onOpenNotes(selectedVideo.chapterId)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs shadow-sm shrink-0 active:scale-95 transition-all flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{language === 'hi' ? 'नोट्स' : 'Notes'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Frame */}
      <div
        className={`rounded-3xl overflow-hidden border transition-all ${
          isLandscapeMode
            ? 'flex-1 w-full bg-black border-slate-800 flex items-center justify-center relative'
            : isDarkMode
            ? 'card-3d-dark p-3 sm:p-4 text-white'
            : 'card-3d-light p-3 sm:p-4 text-slate-900'
        }`}
      >
        {isVideoAvailable(selectedVideo) ? (
          <div
            className={`w-full overflow-hidden bg-black shadow-lg rounded-2xl ${
              isLandscapeMode ? 'h-full flex items-center justify-center' : 'aspect-video'
            } ${forceCssRotation ? 'rotate-90 scale-95 transition-transform' : ''}`}
          >
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={selectedVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        ) : (
          <ComingSoonPlaceholder
            title={selectedVideo.title}
            type="video"
            chapterName={`अध्याय ${selectedVideo.chapterId}`}
            subtitle={selectedVideo.comingSoonMessage}
            onBack={() => setSelectedVideo(null)}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Non-landscape Extra Content & Key Takeaways */}
        {!isLandscapeMode && (
          <div className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-base font-black">
                {selectedVideo.title}
              </h3>
              <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                {selectedVideo.subject.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              {selectedVideo.description}
            </p>

            {/* In-App Key Takeaways */}
            <div className="pt-2">
              <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('keyTakeaways', 'मुख्य बिंदु व ट्रिक्स (Key Takeaways):')}</span>
              </h4>
              <div className="space-y-1.5">
                {selectedVideo.keyTakeaways.map((point, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2.5 ${
                      isDarkMode
                        ? 'bg-slate-900/60 border-slate-800 text-slate-200'
                        : 'bg-slate-50 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 shadow-xs" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Landscape Bottom Control Bar with Next / Prev */}
      {isLandscapeMode && (
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white">
          <button
            disabled={!prevVideo}
            onClick={() => prevVideo && setSelectedVideo(prevVideo)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-bold ${
              prevVideo
                ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                : 'opacity-40 border-slate-900 cursor-not-allowed text-slate-600'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'पिछला वीडियो' : 'Previous'}</span>
          </button>

          <span className="text-[10px] text-slate-400 truncate max-w-xs px-2">
            {selectedVideo.title}
          </span>

          <button
            disabled={!nextVideo}
            onClick={() => nextVideo && setSelectedVideo(nextVideo)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border font-bold ${
              nextVideo
                ? 'bg-amber-500 border-amber-400 hover:bg-amber-600 text-slate-950'
                : 'opacity-40 border-slate-900 cursor-not-allowed text-slate-600'
            }`}
          >
            <span>{language === 'hi' ? 'अगला वीडियो' : 'Next'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
