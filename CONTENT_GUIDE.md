# Science GOAT - 10 Content Management Guide

Welcome to the **Science GOAT - 10** content update guide! This document provides clear, step-by-step instructions on how to add, modify, or remove educational content in the application via GitHub.

All application study content is maintained cleanly inside static TypeScript files in the `src/data/` directory.

---

## 📁 Directory Overview (`src/data/`)

| Content Type | File Location | Description |
| :--- | :--- | :--- |
| **Chapters & NCERT Books** | `src/data/chaptersData.ts` | List of 13 Science chapters and NCERT PDF URLs |
| **Handwritten Notes** | `src/data/notesData.ts` | Detailed chapter-wise study notes and key points |
| **MCQ Quizzes & Mock Exams**| `src/data/quizData.ts` | Chapter-wise MCQs, daily quiz questions & explanations |
| **Board PYQs** | `src/data/pyqData.ts` | Previous years' board question papers (2018–2025) |
| **Important Q&A** | `src/data/importantQuestionsData.ts` | High-yield board exam questions categorized by marks |
| **Video Lectures** | `src/data/videosData.ts` | Curated YouTube video lessons for each chapter |

---

## 1. Adding or Updating Chapters & NCERT PDFs

File: `src/data/chaptersData.ts`

### Object Format:
```typescript
{
  id: 1, // Chapter number (1-13)
  number: '01',
  titleHindi: 'रासायनिक अभिक्रियाएं एवं समीकरण',
  titleEnglish: 'Chemical Reactions and Equations',
  unit: 'रसायन विज्ञान (Chemistry)',
  pdfUrl: 'https://drive.google.com/file/d/YOUR_GOOGLE_DRIVE_PDF_ID/view?usp=sharing',
  summary: 'रासायनिक समीकरणों को संतुलित करना, संयोजन, वियोजन, विस्थापन एवं द्विविस्थापन अभिक्रियाएं।',
}
```

### Steps to update PDF Link:
1. Upload your chapter PDF to Google Drive or any public web host.
2. Ensure the Google Drive file permission is set to **"Anyone with the link can view"**.
3. Replace `pdfUrl` with your file URL.

---

## 2. Adding or Updating Handwritten Study Notes

File: `src/data/notesData.ts`

### Object Format:
```typescript
{
  chapterId: 1,
  title: 'रासायनिक अभिक्रियाएं एवं समीकरण - संपूर्ण टॉपर नोट्स',
  updatedDate: '2026',
  pdfUrl: 'https://example.com/handwritten-notes-ch1.pdf', // Optional PDF download
  keyPoints: [
    'रासायनिक परिवर्तन में नया पदार्थ बनता है।',
    'समीकरण को संतुलित करना द्रव्यमान संरक्षण नियम पर आधारित है।',
    'ऊष्माक्षेपी अभिक्रिया में ऊर्जा उत्सर्जित होती है।',
  ],
  sections: [
    {
      title: '1. रासायनिक अभिक्रिया क्या है?',
      content: `जब दो या दो से अधिक पदार्थ मिलकर नए गुणधर्म वाले पदार्थों का निर्माण करते हैं, तो उसे **रासायनिक अभिक्रिया** कहते हैं।

### उदाहरण:
- लोहे पर जंग लगना
- भोजन का पचना
- मैग्नीशियम फीते का जलना`
    }
  ]
}
```

---

## 3. Adding or Updating MCQ Quiz Questions

File: `src/data/quizData.ts`

### Object Format:
```typescript
{
  id: 101,
  chapterId: 1,
  question: 'संगेमर्मर (Marble) का रासायनिक सूत्र क्या है?',
  options: ['CaCO3', 'CaO', 'Ca(OH)2', 'CaCl2'],
  correctAnswer: 0, // 0-based index (0 = CaCO3)
  explanation: 'संगमरमर तथा चूना पत्थर का रासायनिक सूत्र कैल्शियम कार्बोनेट (CaCO3) होता है।',
}
```

---

## 4. Adding or Updating Board PYQs (Previous Year Papers)

File: `src/data/pyqData.ts`

### Object Format:
```typescript
{
  year: 2025,
  title: 'RBSE कक्षा 10 विज्ञान बोर्ड पेपर 2025 (हल सहित)',
  solutionPdfUrl: 'https://example.com/rbse-2025-science-paper.pdf',
  totalMarks: 80,
  questionsCount: 30,
  questions: [
    {
      id: '2025-Q1',
      questionText: 'अम्ल एवं क्षार की परस्पर अभिक्रिया को क्या कहते हैं?',
      marks: 1,
      answerText: 'उदासीनीकरण अभिक्रिया (Neutralization Reaction)।',
    }
  ]
}
```

---

## 5. Adding or Updating Important Board Questions

File: `src/data/importantQuestionsData.ts`

### Object Format:
```typescript
{
  id: 'imp-ch1-1',
  chapterId: 1,
  question: 'रेडॉक्स अभिक्रिया किसे कहते हैं? उदाहरण देकर स्पष्ट कीजिए।',
  answer: 'जिस अभिक्रिया में एक अभिकारक का उपचयन (Oxidation) तथा दूसरे का अपचयन (Reduction) एक साथ होता है, उसे रेडॉक्स अभिक्रिया कहते हैं।\n\nउदाहरण: CuO + H2 → Cu + H2O',
  type: '4_marks', // '1_mark' | '2_marks' | '4_marks'
  isRepeatedInBoard: true,
}
```

---

## 6. Adding or Updating Video Lectures

File: `src/data/videosData.ts`

### Object Format:
```typescript
{
  id: 'v-ch1-1',
  chapterId: 1,
  youtubeId: 'dQw4w9WgXcQ', // YouTube Video ID from URL (e.g. youtube.com/watch?v=dQw4w9WgXcQ)
  title: 'रासायनिक अभिक्रियाएं: One Shot Revision Video',
  duration: '45 मिनट',
  teacherName: 'विज्ञान सर',
}
```

---

## 🚀 How to Commit Changes on GitHub

1. **Direct Web Edit**:
   - Navigate to the target file in `src/data/` on GitHub.
   - Click the 🖊️ **Edit** icon in the top right.
   - Paste or edit your JSON/TypeScript content.
   - Click **Commit changes...** at the top right.

2. **Local Development (Git CLI)**:
   ```bash
   git checkout -b update-content
   # Edit files in src/data/
   npm run lint
   git add src/data/
   git commit -m "Update chapter 1 notes and quiz questions"
   git push origin update-content
   ```

---
*Created for Science GOAT - 10 Maintainers* 🐐🧪
