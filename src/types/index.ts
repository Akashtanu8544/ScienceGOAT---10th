export type SubjectType = 'physics' | 'chemistry' | 'biology';

export interface Chapter {
  id: number;
  chapterNumber: number;
  titleHindi: string;
  titleEnglish: string;
  subject: SubjectType;
  unit: string;
  unitEnglish?: string;
  weightage: number; // Board Exam Weightage Marks (e.g. 6 marks)
  icon3D: string;
  pdfUrl?: string;
  pdfUrlEn?: string;
  description: string;
  descriptionEnglish?: string;
  estimatedReadingMinutes?: number;
}

export interface NoteSection {
  heading: string;
  content: string;
  bulletPoints?: string[];
  formula?: string;
  reaction?: string;
  diagramTitle?: string;
  diagramDescription?: string;
  importantTip?: string;
}

export interface ChapterNotes {
  chapterId: number;
  summaryHindi: string;
  keyPoints: string[];
  formulas: { name: string; formula: string; explanation: string }[];
  reactions?: { name: string; equation: string; note: string }[];
  sections: NoteSection[];
}

export interface QuizQuestion {
  id: string | number;
  chapterId: number;
  unit?: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
  explanation: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface MockExam {
  id: string;
  title: string;
  unit: string;
  chapterIds: number[];
  totalQuestions: number;
  durationMinutes: number;
  rewardedAdRequired: boolean;
  questions: QuizQuestion[];
}

export interface PYQPaper {
  id: string;
  year: number;
  board: 'RBSE' | 'NCERT';
  title: string;
  titleEnglish?: string;
  totalMarks: number;
  timeAllowed: string;
  pdfUrl: string;
  pdfUrlEn?: string;
  downloadUrl?: string;
  solutionPdfUrl?: string;
  isAvailable?: boolean; // false when not added yet / coming soon
  comingSoonMessage?: string;
  sections: {
    sectionName: string;
    sectionNameEnglish?: string;
    marksPerQuestion: number;
    questionsCount: number;
    sampleQuestions: string[];
    sampleQuestionsEnglish?: string[];
  }[];
}

export interface ImportantQuestion {
  id: string;
  chapterId: number;
  type: 'VSA' | 'SA' | 'LA' | 'DIAGRAM' | 'EQUATION';
  question: string;
  questionEnglish?: string;
  marks: number;
  answer: string;
  answerEnglish?: string;
  repeatedYears?: (number | string)[];
  diagramUrl?: string;
}

export interface VideoLecture {
  id: string;
  chapterId: number;
  title: string;
  subject: SubjectType;
  youtubeId: string;
  duration: string;
  teacherName: string;
  topics: string[];
  keyTakeaways: string[];
  isAvailable?: boolean; // false when not added yet / coming soon
  comingSoonMessage?: string;
}

export interface GlossaryTerm {
  id: string;
  termHindi: string;
  termEnglish: string;
  subject: SubjectType;
  chapterNumber?: number;
  chapterNameHindi?: string;
  definitionHindi: string;
  exampleOrFormula?: string;
  keyTag?: string;
}

export interface UserProfile {
  name: string;
  district: string;
  schoolName: string;
  targetPercentage: string;
  avatarIcon: string;
}

export interface UserProgress {
  completedChapters: number[]; // Chapter IDs marked complete
  quizScores: Record<string, { score: number; total: number; date: string; percentage: number }>;
  notesDownloaded: number[];
  totalPoints: number;
  streakDays: number;
  lastActiveDate: string;
  unlockedMockExams: string[]; // Exam IDs unlocked via rewarded ad
  badges: string[];
  chapterReadingTime?: Record<string | number, number>; // Seconds spent reading per chapter/material
  totalReadingTimeSeconds?: number; // Total reading time in seconds
  dailyReadingTime?: Record<string, number>; // Date 'YYYY-MM-DD' -> seconds spent
  sessionHistory?: { timestamp: number; date: string; chapterId: number; chapterTitle: string; seconds: number }[];
}

export interface GitHubConfig {
  githubRepoUrl: string;
  customBooksJsonUrl: string;
  customNotesJsonUrl: string;
  customQuizJsonUrl: string;
  customPyqJsonUrl: string;
  isCustomEnabled: boolean;
}
