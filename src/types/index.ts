export type SubjectType = 'physics' | 'chemistry' | 'biology';

export interface Chapter {
  id: number;
  chapterNumber: number;
  titleHindi: string;
  titleEnglish: string;
  subject: SubjectType;
  unit: string;
  weightage: number; // Board Exam Weightage Marks (e.g. 6 marks)
  icon3D: string;
  pdfUrl?: string;
  description: string;
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
  totalMarks: number;
  timeAllowed: string;
  pdfUrl: string;
  downloadUrl?: string;
  solutionPdfUrl?: string;
  sections: {
    sectionName: string;
    marksPerQuestion: number;
    questionsCount: number;
    sampleQuestions: string[];
  }[];
}

export interface ImportantQuestion {
  id: string;
  chapterId: number;
  type: 'VSA' | 'SA' | 'LA' | 'DIAGRAM' | 'EQUATION';
  question: string;
  marks: number;
  answer: string;
  repeatedYears?: number[];
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
}

export interface GitHubConfig {
  githubRepoUrl: string;
  customBooksJsonUrl: string;
  customNotesJsonUrl: string;
  customQuizJsonUrl: string;
  customPyqJsonUrl: string;
  isCustomEnabled: boolean;
}
