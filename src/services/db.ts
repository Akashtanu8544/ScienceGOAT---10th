import { UserProgress, GitHubConfig, UserProfile } from '../types';

const PROGRESS_KEY = 'rbse_science10_user_progress_v1';
const GITHUB_CONFIG_KEY = 'rbse_science10_github_config_v1';
const USER_PROFILE_KEY = 'rbse_science10_user_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  name: 'कक्षा 10 छात्र',
  district: 'जयपुर',
  schoolName: 'राजकीय उच्च माध्यमिक विद्यालय',
  targetPercentage: '95%+ (राज्य मैरिट सूची)',
  avatarIcon: '👨‍🎓',
};

const DEFAULT_PROGRESS: UserProgress = {
  completedChapters: [1],
  quizScores: {},
  notesDownloaded: [],
  totalPoints: 120,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  unlockedMockExams: [],
  badges: ['राजस्थान बोर्ड परीक्षार्थी', 'प्रथम अध्ययन दिवस'],
};

const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  githubRepoUrl: 'https://github.com/rbse-class10-science/notes-and-papers',
  customBooksJsonUrl: '',
  customNotesJsonUrl: '',
  customQuizJsonUrl: '',
  customPyqJsonUrl: '',
  isCustomEnabled: false,
};

// LocalStorage & IndexedDB Helper
export class StorageService {
  static getProgress(): UserProgress {
    try {
      const data = localStorage.getItem(PROGRESS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const merged: UserProgress = {
          ...DEFAULT_PROGRESS,
          ...parsed,
          completedChapters: Array.isArray(parsed?.completedChapters) ? parsed.completedChapters : DEFAULT_PROGRESS.completedChapters,
          quizScores: (parsed?.quizScores && typeof parsed.quizScores === 'object') ? parsed.quizScores : DEFAULT_PROGRESS.quizScores,
          notesDownloaded: Array.isArray(parsed?.notesDownloaded) ? parsed.notesDownloaded : DEFAULT_PROGRESS.notesDownloaded,
          unlockedMockExams: Array.isArray(parsed?.unlockedMockExams) ? parsed.unlockedMockExams : DEFAULT_PROGRESS.unlockedMockExams,
          badges: Array.isArray(parsed?.badges) ? parsed.badges : DEFAULT_PROGRESS.badges,
        };

        // Streak check
        const today = new Date().toISOString().split('T')[0];
        if (merged.lastActiveDate !== today) {
          const lastDate = new Date(merged.lastActiveDate || today);
          const currDate = new Date(today);
          const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          if (diffDays === 1) {
            merged.streakDays = (merged.streakDays || 0) + 1;
          } else if (diffDays > 1) {
            merged.streakDays = 1;
          }
          merged.lastActiveDate = today;
          this.saveProgress(merged);
        }
        return merged;
      }
    } catch (e) {
      console.error('Error reading progress:', e);
    }
    return DEFAULT_PROGRESS;
  }

  static saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  }

  static markChapterComplete(chapterId: number): UserProgress {
    const p = this.getProgress();
    if (!Array.isArray(p.completedChapters)) {
      p.completedChapters = [];
    }
    if (!p.completedChapters.includes(chapterId)) {
      p.completedChapters.push(chapterId);
      p.totalPoints = (p.totalPoints || 0) + 50;
      this.checkBadges(p);
      this.saveProgress(p);
    }
    return p;
  }

  static recordQuizScore(examId: string, score: number, total: number): UserProgress {
    const p = this.getProgress();
    if (!p.quizScores || typeof p.quizScores !== 'object') {
      p.quizScores = {};
    }
    const percentage = Math.round((score / (total || 1)) * 100);
    p.quizScores[examId] = {
      score,
      total,
      date: new Date().toLocaleDateString('hi-IN'),
      percentage,
    };
    p.totalPoints = (p.totalPoints || 0) + score * 10;
    this.checkBadges(p);
    this.saveProgress(p);
    return p;
  }

  static unlockMockExam(examId: string): UserProgress {
    const p = this.getProgress();
    if (!Array.isArray(p.unlockedMockExams)) {
      p.unlockedMockExams = [];
    }
    if (!p.unlockedMockExams.includes(examId)) {
      p.unlockedMockExams.push(examId);
      this.saveProgress(p);
    }
    return p;
  }

  static checkBadges(p: UserProgress): void {
    if (!Array.isArray(p.badges)) {
      p.badges = [];
    }
    if (!Array.isArray(p.completedChapters)) {
      p.completedChapters = [];
    }
    const badges = new Set(p.badges);
    if (p.completedChapters.length >= 3) badges.add('3 अध्याय पूर्ण');
    if (p.completedChapters.length >= 7) badges.add('आधा पाठ्यक्रम समाप्त');
    if (p.completedChapters.length >= 13) badges.add('🏆 RBSE विज्ञान टॉपर');
    if ((p.totalPoints || 0) >= 300) badges.add('ज्ञान रत्न');
    if ((p.totalPoints || 0) >= 1000) badges.add('⚡ सुपर माइंड');
    if ((p.streakDays || 0) >= 7) badges.add('🔥 7 दिवसीय स्ट्राइक मस्टर');
    p.badges = Array.from(badges);
  }

  static getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(USER_PROFILE_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error reading profile:', e);
    }
    return DEFAULT_PROFILE;
  }

  static saveUserProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  }

  static getGitHubConfig(): GitHubConfig {
    try {
      const data = localStorage.getItem(GITHUB_CONFIG_KEY);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error('Error loading github config:', e);
    }
    return DEFAULT_GITHUB_CONFIG;
  }

  static saveGitHubConfig(config: GitHubConfig): void {
    try {
      localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Error saving github config:', e);
    }
  }
}
