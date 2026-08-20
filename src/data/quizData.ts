import { MockExam, QuizQuestion } from '../types';

export const QUIZ_QUESTIONS_DATA: QuizQuestion[] = [
  // Ch 1
  {
    id: 'q1_1',
    chapterId: 1,
    unit: 'इकाई 1: रासायनिक पदार्थ - प्रकृति एवं व्यवहार',
    question: 'लोह-चूर्ण पर तनु हाइड्रोक्लोरिक अम्ल डालने से क्या होता है?',
    options: ['हाइड्रोजन गैस एवं आयरन क्लोराइड बनता है', 'क्लोरीन गैस एवं आयरन हाइड्रोक्साइड बनता है', 'कोई अभिक्रिया नहीं होती', 'आयरन लवण एवं जल बनता है'],
    correctAnswer: 0,
    explanation: 'Fe + 2HCl → FeCl₂ + H₂↑ (लोहा अम्ल से अभिक्रिया करके हाइड्रोजन गैस विस्थापित करता है)।',
    difficulty: 'easy'
  },
  {
    id: 'q1_2',
    chapterId: 1,
    unit: 'इकाई 1: रासायनिक पदार्थ - प्रकृति एवं व्यवहार',
    question: 'सिल्वर क्लोराइड (AgCl) का रंग सूर्य के प्रकाश में कैसा हो जाता है?',
    options: ['सफेद', 'धूसर (Grey)', 'पीला', 'काला'],
    correctAnswer: 1,
    explanation: 'प्रकाश अपघटन के कारण 2AgCl → 2Ag + Cl₂ में सिल्वर पृथक हो जाता है जिसका रंग धूसर (Grey) होता है।',
    difficulty: 'easy'
  },
  {
    id: 'q1_3',
    chapterId: 1,
    unit: 'इकाई 1: रासायनिक पदार्थ - प्रकृति एवं व्यवहार',
    question: 'चिप्स के पैकेट में विकृतगंधिता से बचाने के लिए कौन-सी गैस भरी जाती है?',
    options: ['ऑक्सीजन', 'नाइट्रोजन', 'हाइड्रोजन', 'कार्बन डाइऑक्साइड'],
    correctAnswer: 1,
    explanation: 'नाइट्रोजन एक अक्रिय गैस है जो तेल व वसा के उपचयन (ऑक्सीकरण) को रोकती है।',
    difficulty: 'medium'
  },

  // Ch 2
  {
    id: 'q2_1',
    chapterId: 2,
    unit: 'इकाई 1: रासायनिक पदार्थ - प्रकृति एवं व्यवहार',
    question: 'शुद्ध जल का pH मान कितना होता है?',
    options: ['0', '7', '14', '1'],
    correctAnswer: 1,
    explanation: 'शुद्ध जल उदासीन होता है, इसलिए इसका pH मान 7 होता है।',
    difficulty: 'easy'
  },
  {
    id: 'q2_2',
    chapterId: 2,
    unit: 'इकाई 1: रासायनिक पदार्थ - प्रकृति एवं व्यवहार',
    question: 'प्लास्टर ऑफ पेरिस (POP) का रासायनिक सूत्र क्या है?',
    options: ['CaSO₄·2H₂O', 'CaSO₄·½H₂O', 'CaCO₃', 'CaOCl₂'],
    correctAnswer: 1,
    explanation: 'प्लास्टर ऑफ पेरिस का सूत्र CaSO₄·½H₂O (कैल्शियम सल्फेट अर्धहाइड्रेट) है।',
    difficulty: 'medium'
  },
  {
    id: 'q2_3',
    chapterId: 2,
    unit: 'इकाई 1: रासायनिक पदार्थ - प्रकृति एवं व्यवहार',
    question: 'मुँह का pH मान कितने से कम होने पर दांतों का क्षय प्रारंभ हो जाता है?',
    options: ['7.0', '6.5', '5.5', '8.0'],
    correctAnswer: 2,
    explanation: 'pH 5.5 से कम होने पर दांतों का इनैमल (कैल्शियम फास्फेट) संक्षारित होने लगता है।',
    difficulty: 'medium'
  },

  // Ch 9
  {
    id: 'q9_1',
    chapterId: 9,
    unit: 'इकाई 3: प्राकृतिक घटनाएं',
    question: 'वाहन के पीछे का दृश्य देखने (Side Mirror) के लिए किस दर्पण का उपयोग किया जाता है?',
    options: ['अवतल दर्पण', 'समतल दर्पण', 'उत्तल दर्पण', 'कोई नहीं'],
    correctAnswer: 2,
    explanation: 'उत्तल दर्पण हमेशा सीधा, छोटा तथा विस्तृत दृष्टि-क्षेत्र (Wide view) प्रदान करता है।',
    difficulty: 'easy'
  },
  {
    id: 'q9_2',
    chapterId: 9,
    unit: 'इकाई 3: प्राकृतिक घटनाएं',
    question: 'एक उत्तल लेंस की फोकस दूरी 50 सेमी है। इसकी क्षमता (Power) क्या होगी?',
    options: ['+2 D', '-2 D', '+0.5 D', '+5 D'],
    correctAnswer: 0,
    explanation: 'f = 0.5 m. क्षमता P = 1 / 0.5 = +2 D (डायोप्टर)।',
    difficulty: 'hard'
  },

  // Ch 11
  {
    id: 'q11_1',
    chapterId: 11,
    unit: 'इकाई 4: विद्युत धारा का प्रभाव',
    question: 'ओम के नियम के अनुसार विभवांतर (V) और धारा (I) का अनुपात क्या कहलाता है?',
    options: ['विद्युत शक्ति', 'प्रतिरोध (R)', 'आवेश', 'कार्य'],
    correctAnswer: 1,
    explanation: 'V / I = R (प्रतिरोध)। नियत ताप पर चालक का प्रतिरोध स्थिर रहता है।',
    difficulty: 'easy'
  },
  {
    id: 'q11_2',
    chapterId: 11,
    unit: 'इकाई 4: विद्युत धारा का प्रभाव',
    question: '1 यूनिट (kWh) में कितने जूल (Joule) होते हैं?',
    options: ['3.6 × 10⁶ J', '3.6 × 10⁵ J', '1000 J', '3600 J'],
    correctAnswer: 0,
    explanation: '1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J।',
    difficulty: 'hard'
  }
];

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
