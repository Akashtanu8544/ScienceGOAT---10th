import { MockExam, QuizQuestion } from '../../types';
import { ch1Questions } from './ch1';
import { ch2Questions } from './ch2';
import { ch3Questions } from './ch3';
import { ch4Questions } from './ch4';
import { ch5Questions } from './ch5';
import { ch6Questions } from './ch6';
import { ch7Questions } from './ch7';
import { ch8Questions } from './ch8';
import { ch9Questions } from './ch9';
import { ch10Questions } from './ch10';
import { ch11Questions } from './ch11';
import { ch12Questions } from './ch12';
import { ch13Questions } from './ch13';

// Export individual chapter questions for easy targeted updates
export {
  ch1Questions,
  ch2Questions,
  ch3Questions,
  ch4Questions,
  ch5Questions,
  ch6Questions,
  ch7Questions,
  ch8Questions,
  ch9Questions,
  ch10Questions,
  ch11Questions,
  ch12Questions,
  ch13Questions,
};

// Map of chapter questions by chapter ID
export const QUIZ_QUESTIONS_BY_CHAPTER: Record<number, QuizQuestion[]> = {
  1: ch1Questions,
  2: ch2Questions,
  3: ch3Questions,
  4: ch4Questions,
  5: ch5Questions,
  6: ch6Questions,
  7: ch7Questions,
  8: ch8Questions,
  9: ch9Questions,
  10: ch10Questions,
  11: ch11Questions,
  12: ch12Questions,
  13: ch13Questions,
};

// All combined quiz questions
export const QUIZ_QUESTIONS_DATA: QuizQuestion[] = [
  ...ch1Questions,
  ...ch2Questions,
  ...ch3Questions,
  ...ch4Questions,
  ...ch5Questions,
  ...ch6Questions,
  ...ch7Questions,
  ...ch8Questions,
  ...ch9Questions,
  ...ch10Questions,
  ...ch11Questions,
  ...ch12Questions,
  ...ch13Questions,
];

// Mock Exams Data
export const MOCK_EXAMS_DATA: MockExam[] = [
  {
    id: 'mock_unit1_easy',
    title: 'इकाई 1 मोक टेस्ट: रसायन विज्ञान बेसिक',
    unit: 'इकाई 1: रासायनिक पदार्थ - प्रकृति एवं व्यवहार',
    chapterIds: [1, 2, 3, 4],
    totalQuestions: 5,
    durationMinutes: 10,
    rewardedAdRequired: false,
    questions: QUIZ_QUESTIONS_DATA.filter((q) => [1, 2].includes(q.chapterId))
  },
  {
    id: 'mock_unit1_rbse_special',
    title: '🏆 RBSE 2026 बोर्ड स्पेशल रसायन विज्ञान मॉडल पेपर',
    unit: 'इकाई 1: रासायनिक पदार्थ - प्रकृति एवं व्यवहार',
    chapterIds: [1, 2, 3, 4],
    totalQuestions: 6,
    durationMinutes: 15,
    rewardedAdRequired: true,
    questions: QUIZ_QUESTIONS_DATA.filter((q) => [1, 2].includes(q.chapterId))
  },
  {
    id: 'mock_physics_master',
    title: '⚡ प्रकाश एवं विद्युत स्पीड मॉक टेस्ट',
    unit: 'इकाई 3 एवं 4: भौतिक विज्ञान स्पेशल',
    chapterIds: [9, 10, 11, 12],
    totalQuestions: 4,
    durationMinutes: 10,
    rewardedAdRequired: true,
    questions: QUIZ_QUESTIONS_DATA.filter((q) => [9, 11].includes(q.chapterId))
  }
];
