import React, { useState } from 'react';
import { VideoLecture } from '../types';
import { VIDEO_LECTURES_DATA } from '../data/videosData';
import { AdMobRewardedModal } from './AdMobRewardedModal';
import { Play, ArrowLeft, Lock, Tv, Search, X } from 'lucide-react';

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
  const [selectedVideo, setSelectedVideo] = useState<VideoLecture | null>(null);
  const [subjectFilter, setSubjectFilter] = useState<'chemistry' | 'biology' | 'physics'>('chemistry');
  const [searchQuery, setSearchQuery] = useState('');

  const [unlockedVideoIds, setUnlockedVideoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rbse_unlocked_videos');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['vid_1'];
  });

  const [pendingVideoForAd, setPendingVideoForAd] = useState<VideoLecture | null>(null);

  const filteredVideos = videos.filter((v) => {
    const matchesSubject = v.subject === subjectFilter;
    const matchesSearch = searchQuery.trim() === '' ||
      v.title.includes(searchQuery) ||
      (v.teacherName && v.teacherName.includes(searchQuery));
    return matchesSubject && matchesSearch;
  });

  const handleSelectVideo = (vid: VideoLecture) => {
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

  /* LEVEL 1: VIDEO LECTURES LIST */
  if (!selectedVideo) {
    return (
      <div className="space-y-3.5 animate-fadeIn">
        {/* Centered Header Bar */}
        <div className={`relative flex items-center justify-center p-3.5 rounded-3xl border shadow-sm backdrop-blur-md ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}>
          <button
            onClick={onBack}
            className={`absolute left-3.5 p-2 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="वापस जाएँ"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className={`text-sm sm:text-base font-black flex items-center gap-2 text-center ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <span className="text-xl">🎥</span> Video Lectures
          </h2>
        </div>

        {/* Pending Ad Modal */}
        {pendingVideoForAd && (
          <AdMobRewardedModal
            title={pendingVideoForAd.title}
            rewardMessage="विज्ञापन देखने के पश्चात् HD वीडियो लेक्चर एवं सूत्र ट्रिक निःशुल्क अनलॉक हो जाएंगे!"
            rewardButtonText="रिवॉर्ड प्राप्त! वीडियो लेक्चर शुरू करें"
            onAdCompleted={handleAdCompleted}
            onClose={() => setPendingVideoForAd(null)}
          />
        )}

        {/* Subject Filter Category Tabs */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'chemistry', label: 'रसायन विज्ञान', icon: '🧪' },
            { id: 'biology', label: 'जीव विज्ञान', icon: '🫀' },
            { id: 'physics', label: 'भौतिक विज्ञान', icon: '⚡' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubjectFilter(tab.id as any)}
              className={`py-2 px-2 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                subjectFilter === tab.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : isDarkMode
                  ? 'bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Page Inline Search Bar */}
        <div className="relative">
          <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
            isDarkMode ? 'text-amber-400' : 'text-amber-600'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="वीडियो लेक्चर में खोजें: टॉपिक, शिक्षक..."
            className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-2xl font-black transition-all backdrop-blur-2xl shadow-sm focus:outline-none ${
              isDarkMode
                ? 'bg-slate-900/80 text-slate-100 placeholder-slate-400 border border-slate-700/80 focus:border-amber-400'
                : 'bg-white/90 text-slate-900 placeholder-slate-400 border border-amber-200 focus:border-amber-600'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Videos List */}
        <div className="space-y-2.5">
          {filteredVideos.map((vid) => {
            const isUnlocked = unlockedVideoIds.includes(vid.id);
            return (
              <div
                key={vid.id}
                onClick={() => handleSelectVideo(vid)}
                className={`p-3.5 rounded-3xl border cursor-pointer transition-all duration-200 transform active:scale-[0.99] flex items-center justify-between gap-3 shadow-sm backdrop-blur-md ${
                  isDarkMode
                    ? 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50'
                    : 'bg-white/90 border-slate-200 hover:border-amber-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/20 text-xl flex items-center justify-center shrink-0 shadow-inner">
                    🎥
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {vid.duration} • {vid.subject.toUpperCase()}
                    </span>
                    <h3 className={`text-xs sm:text-sm font-black truncate mt-0.5 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {vid.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isUnlocked ? (
                    <span className="px-3 py-1.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1 shadow-sm">
                      <Play className="w-3 h-3 fill-current" /> प्ले
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 rounded-2xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-sm">
                      <Lock className="w-3 h-3" /> अनलॉक
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* LEVEL 2: VIDEO PLAYER PAGE */
  return (
    <div className="space-y-3.5 animate-fadeIn">
      <div className={`p-3.5 rounded-3xl border shadow-sm flex items-center justify-between gap-2 backdrop-blur-md ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setSelectedVideo(null)}
            className={`p-2 rounded-2xl border text-xs font-bold transition-all flex items-center ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className={`text-xs sm:text-sm font-black truncate ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {selectedVideo.title}
            </h2>
            <p className="text-[10px] text-amber-500 font-bold">HD Video Lecture ({selectedVideo.duration})</p>
          </div>
        </div>

        <button
          onClick={() => onOpenNotes(selectedVideo.chapterId)}
          className="px-3 py-1.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-xs shadow-sm shrink-0 active:scale-95 transition-transform"
        >
          नोट्स देखें
        </button>
      </div>

      <div className={`p-4 rounded-3xl border shadow-md space-y-4 backdrop-blur-md ${
        isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow">
          <iframe
            src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
            title={selectedVideo.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="space-y-2">
          <h3 className={`text-sm sm:text-base font-black ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {selectedVideo.title}
          </h3>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            {selectedVideo.description}
          </p>

          <div className="pt-2">
            <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <span>💡</span> मुख्य बिंदु व ट्रिक्स (Key Takeaways):
            </h4>
            <div className="space-y-1.5">
              {selectedVideo.keyTakeaways.map((point, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
