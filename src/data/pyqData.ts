import { PYQPaper } from '../types';

export const PYQ_PAPERS_DATA: PYQPaper[] = [
  {
    id: 'rbse_2024_science',
    year: 2024,
    board: 'RBSE',
    title: 'RBSE कक्षा 10 विज्ञान मुख्य परीक्षा पत्र 2024 (हल सहित)',
    totalMarks: 80,
    timeAllowed: '3 घंटे 15 मिनट',
    pdfUrl: 'https://raw.githubusercontent.com/rajboards/class10-papers/main/science_2024_solved.pdf',
    downloadUrl: 'https://raw.githubusercontent.com/rajboards/class10-papers/main/science_2024_solved.pdf',
    solutionPdfUrl: 'https://raw.githubusercontent.com/rajboards/class10-papers/main/science_2024_solution.pdf',
    sections: [
      {
        sectionName: 'खण्ड-अ (बहुविकल्पी व अतिलघुउत्तरीय)',
        marksPerQuestion: 1,
        questionsCount: 18,
        sampleQuestions: [
          'मानव में फुफ्फुस किस तंत्र का भाग हैं?',
          'धात्विक ऑक्साइड की प्रकृति सामान्यतः कैसी होती है?',
          'विद्युत धारा का SI मात्रक लिखिए।'
        ]
      },
      {
        sectionName: 'खण्ड-ब (लघुउत्तरीय प्रश्न)',
        marksPerQuestion: 2,
        questionsCount: 12,
        sampleQuestions: [
          'अम्ल व क्षारक के मध्य होने वाली उदासीनीकरण अभिक्रिया का एक समीकरण लिखिए।',
          'फ्लेमिंग का वामहस्त नियम लिखिए।'
        ]
      },
      {
        sectionName: 'खण्ड-स (दीर्घउत्तरीय प्रश्न)',
        marksPerQuestion: 3,
        questionsCount: 4,
        sampleQuestions: [
          'मानव पाचन तंत्र का स्वच्छ नामांकित चित्र बनाइए एवं आमाशय में पाचन प्रक्रिया समझाइए।'
        ]
      },
      {
        sectionName: 'खण्ड-द (निबंधात्मक प्रश्न)',
        marksPerQuestion: 4,
        questionsCount: 3,
        sampleQuestions: [
          'उत्तल लेंस द्वारा प्रतिबिंब निर्माण का आरेख बनाइए जब बिंब 2F₁ पर स्थित हो। आवर्धन का सूत्र भी लिखिए।'
        ]
      }
    ]
  },
  {
    id: 'rbse_2023_science',
    year: 2023,
    board: 'RBSE',
    title: 'RBSE कक्षा 10 विज्ञान मुख्य बोर्ड परीक्षा पत्र 2023',
    totalMarks: 80,
    timeAllowed: '3 घंटे 15 मिनट',
    pdfUrl: 'https://raw.githubusercontent.com/rajboards/class10-papers/main/science_2023.pdf',
    downloadUrl: 'https://raw.githubusercontent.com/rajboards/class10-papers/main/science_2023.pdf',
    sections: [
      {
        sectionName: 'खण्ड-अ (वस्तुनिष्ठ प्रश्न)',
        marksPerQuestion: 1,
        questionsCount: 12,
        sampleQuestions: [
          'जिप्सम को किस ताप पर गर्म करने पर प्लास्टर ऑफ पेरिस प्राप्त होता है?',
          'नेफ्रॉन (वृक्काणु) किसकी क्रियात्मक इकाई है?'
        ]
      }
    ]
  },
  {
    id: 'rbse_2022_science',
    year: 2022,
    board: 'RBSE',
    title: 'RBSE कक्षा 10 विज्ञान बोर्ड परीक्षा पत्र 2022',
    totalMarks: 80,
    timeAllowed: '2 घंटे 45 मिनट',
    pdfUrl: 'https://raw.githubusercontent.com/rajboards/class10-papers/main/science_2022.pdf',
    sections: [
      {
        sectionName: 'मुख्य प्रश्न',
        marksPerQuestion: 2,
        questionsCount: 15,
        sampleQuestions: [
          'ओम का नियम लिखिए। V-I ग्राफ खींचिए।',
          'संतृप्त एवं असंतृप्त हाइड्रोकार्बन में अंतर स्पष्ट कीजिए।'
        ]
      }
    ]
  },
  {
    id: 'rbse_2020_science',
    year: 2020,
    board: 'RBSE',
    title: 'RBSE कक्षा 10 विज्ञान परीक्षा पत्र 2020',
    totalMarks: 80,
    timeAllowed: '3 घंटे 15 मिनट',
    pdfUrl: 'https://raw.githubusercontent.com/rajboards/class10-papers/main/science_2020.pdf',
    sections: []
  },
  {
    id: 'rbse_2026_model_paper',
    year: 2026,
    board: 'RBSE',
    title: '🔥 RBSE बोर्ड कक्षा 10 विज्ञान आधिकारिक मॉडल पेपर 2026 (नवीनतम पैटर्न)',
    totalMarks: 80,
    timeAllowed: '3 घंटे 15 मिनट',
    pdfUrl: 'https://raw.githubusercontent.com/rajboards/class10-papers/main/model_paper_2026.pdf',
    sections: [
      {
        sectionName: 'बोर्ड मॉडल पेपर 2026 पैटर्न',
        marksPerQuestion: 1,
        questionsCount: 20,
        sampleQuestions: [
          'प्रकाश का सर्वाधिक वेग किस माध्यम में होता है? (उत्तर: निर्वात में)',
          'विरंजक चूर्ण का रासायनिक सूत्र क्या है? (उत्तर: CaOCl₂)'
        ]
      }
    ]
  }
];
