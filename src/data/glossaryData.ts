import { GlossaryTerm } from '../types';

export const GLOSSARY_DATA: GlossaryTerm[] = [
  // CHEMISTRY
  {
    id: 'g-ch1',
    termHindi: 'उपचयन (Oxidation)',
    termEnglish: 'Oxidation',
    subject: 'chemistry',
    chapterNumber: 1,
    chapterNameHindi: 'रासायनिक अभिक्रियाएं एवं समीकरण',
    definitionHindi: 'वह रासायनिक प्रक्रिया जिसमें किसी पदार्थ में ऑक्सीजन की वृद्धि होती है या हाइड्रोजन का ह्रास (कमी) होता है।',
    exampleOrFormula: '2Cu + O2 → 2CuO',
    keyTag: 'बोर्ड स्पेशल'
  },
  {
    id: 'g-ch2',
    termHindi: 'अपचयन (Reduction)',
    termEnglish: 'Reduction',
    subject: 'chemistry',
    chapterNumber: 1,
    chapterNameHindi: 'रासायनिक अभिक्रियाएं एवं समीकरण',
    definitionHindi: 'वह रासायनिक प्रक्रिया जिसमें किसी पदार्थ में हाइड्रोजन की वृद्धि होती है या ऑक्सीजन का ह्रास होता है।',
    exampleOrFormula: 'CuO + H2 → Cu + H2O',
    keyTag: 'महत्वपूर्ण'
  },
  {
    id: 'g-ch3',
    termHindi: 'रेडॉक्स अभिक्रिया (Redox Reaction)',
    termEnglish: 'Redox Reaction',
    subject: 'chemistry',
    chapterNumber: 1,
    chapterNameHindi: 'रासायनिक अभिक्रियाएं एवं समीकरण',
    definitionHindi: 'ऐसी रासायनिक अभिक्रिया जिसमें एक अभिकारक का उपचयन तथा दूसरे का अपचयन एक साथ होता है।',
    exampleOrFormula: 'ZnO + C → Zn + CO',
    keyTag: 'बार-बार पूछा गया'
  },
  {
    id: 'g-ch4',
    termHindi: 'pH पैमाना (pH Scale)',
    termEnglish: 'pH Scale',
    subject: 'chemistry',
    chapterNumber: 2,
    chapterNameHindi: 'अम्ल, क्षारक एवं लवण',
    definitionHindi: 'किसी विलयन में उपस्थित हाइड्रोजन आयन (H+) की सांद्रता मापने के लिए प्रयुक्त पैमाना। pH < 7 अम्ल, pH = 7 उदासीन, pH > 7 क्षारक होता है।',
    exampleOrFormula: 'pH = -log[H+]',
    keyTag: 'मूल अवधारणा'
  },
  {
    id: 'g-ch5',
    termHindi: 'उदासीनीकरण अभिक्रिया (Neutralization)',
    termEnglish: 'Neutralization',
    subject: 'chemistry',
    chapterNumber: 2,
    chapterNameHindi: 'अम्ल, क्षारक एवं लवण',
    definitionHindi: 'अम्ल एवं क्षारक की परस्पर अभिक्रिया जिससे लवण तथा जल का निर्माण होता है।',
    exampleOrFormula: 'HCl + NaOH → NaCl + H2O',
    keyTag: 'बोर्ड स्पेशल'
  },
  {
    id: 'g-ch6',
    termHindi: 'भर्जन (Roasting)',
    termEnglish: 'Roasting',
    subject: 'chemistry',
    chapterNumber: 3,
    chapterNameHindi: 'धातु एवं अधातु',
    definitionHindi: 'सल्फाइड अयस्क को वायु की उपस्थिति में उच्च ताप पर गर्म करके ऑक्साइड में बदलने की प्रक्रिया।',
    exampleOrFormula: '2ZnS + 3O2 → 2ZnO + 2SO2',
    keyTag: 'अंतर आधारित'
  },
  {
    id: 'g-ch7',
    termHindi: 'निस्तापन (Calcination)',
    termEnglish: 'Calcination',
    subject: 'chemistry',
    chapterNumber: 3,
    chapterNameHindi: 'धातु एवं अधातु',
    definitionHindi: 'कार्बोनेट अयस्क को सीमित वायु में उच्च ताप पर गर्म करके ऑक्साइड में बदलने की प्रक्रिया।',
    exampleOrFormula: 'ZnCO3 → ZnO + CO2',
    keyTag: 'अंतर आधारित'
  },
  {
    id: 'g-ch8',
    termHindi: 'सजातीय श्रेणी (Homologous Series)',
    termEnglish: 'Homologous Series',
    subject: 'chemistry',
    chapterNumber: 4,
    chapterNameHindi: 'कार्बन एवं उसके यौगिक',
    definitionHindi: 'कार्बनिक यौगिकों की ऐसी श्रृंखला जिसके उत्तरोत्तर सदस्यों के बीच -CH2- समूह का अंतर होता है।',
    exampleOrFormula: 'CH4, C2H6, C3H8 (ऐल्केन श्रेणी)',
    keyTag: 'महत्वपूर्ण'
  },
  {
    id: 'g-ch9',
    termHindi: 'साबुनिकरण (Saponification)',
    termEnglish: 'Saponification',
    subject: 'chemistry',
    chapterNumber: 4,
    chapterNameHindi: 'कार्बन एवं उसके यौगिक',
    definitionHindi: 'वसा या तेल की क्षार (जैसे NaOH) के साथ अभिक्रिया कराने पर साबुन और ग्लिसरॉल बनने की प्रक्रिया।',
    exampleOrFormula: 'एस्टर + NaOH → साबुन + एल्कोहॉल',
    keyTag: 'बोर्ड प्रश्न'
  },

  // BIOLOGY
  {
    id: 'g-bio1',
    termHindi: 'स्वपोषी पोषण (Autotrophic Nutrition)',
    termEnglish: 'Autotrophic Nutrition',
    subject: 'biology',
    chapterNumber: 5,
    chapterNameHindi: 'जैव प्रक्रम',
    definitionHindi: 'पोषण का वह तरीका जिसमें जीव अकार्बनिक स्रोतों (जैसे CO2 व जल) से सूर्य के प्रकाश की उपस्थिति में अपना भोजन स्वयं बनाते हैं।',
    exampleOrFormula: 'हरा पौधा (प्रकाश संश्लेषण)',
    keyTag: 'मूल अवधारणा'
  },
  {
    id: 'g-bio2',
    termHindi: 'प्रकाश संश्लेषण (Photosynthesis)',
    termEnglish: 'Photosynthesis',
    subject: 'biology',
    chapterNumber: 5,
    chapterNameHindi: 'जैव प्रक्रम',
    definitionHindi: 'हरित पौधों द्वारा क्लोरोफिल व सूर्य के प्रकाश की उपस्थिति में जल व कार्बन डाइऑक्साइड से ग्लूकोज बनाने की जैव-रासायनिक प्रक्रिया।',
    exampleOrFormula: '6CO2 + 12H2O → C6H12O6 + 6O2 + 6H2O',
    keyTag: 'बोर्ड स्पेशल'
  },
  {
    id: 'g-bio3',
    termHindi: 'नेफ्रॉन / वृक्काणु (Nephron)',
    termEnglish: 'Nephron',
    subject: 'biology',
    chapterNumber: 5,
    chapterNameHindi: 'जैव प्रक्रम',
    definitionHindi: 'वृक्क (Kidney) की कार्यात्मक एवं संरचनात्मक इकाई जो रक्त से अपशिष्ट पदार्थों (यूरिया) को छानकर मूत्र का निर्माण करती है।',
    keyTag: 'चित्र आधारित'
  },
  {
    id: 'g-bio4',
    termHindi: 'तंत्रिका कोशिका / न्यूरॉन (Neuron)',
    termEnglish: 'Neuron',
    subject: 'biology',
    chapterNumber: 6,
    chapterNameHindi: 'नियंत्रण एवं समन्वय',
    definitionHindi: 'तंत्रिका तंत्र की संरचनात्मक एवं कार्यात्मक इकाई जो शरीर में विद्युत आवेगो (Electrical Impulses) का संवहन करती है।',
    keyTag: 'चित्र आधारित'
  },
  {
    id: 'g-bio5',
    termHindi: 'प्रतिवर्ती चाप (Reflex Arc)',
    termEnglish: 'Reflex Arc',
    subject: 'biology',
    chapterNumber: 6,
    chapterNameHindi: 'नियंत्रण एवं समन्वय',
    definitionHindi: 'प्रतिवर्ती क्रिया के दौरान आवेगों के संचरण के पथ (ग्राही अंग → संवेदी तंत्रिका → मेरुरज्जु → प्रेरक तंत्रिका → कार्यकर अंग) को प्रतिवर्ती चाप कहते हैं।',
    keyTag: 'महत्वपूर्ण'
  },
  {
    id: 'g-bio6',
    termHindi: 'पादप हार्मोन (Plant Hormones)',
    termEnglish: 'Phytohormones',
    subject: 'biology',
    chapterNumber: 6,
    chapterNameHindi: 'नियंत्रण एवं समन्वय',
    definitionHindi: 'पौधों में वृद्धि एवं विकास का नियमन करने वाले रासायनिक पदार्थ जैसे ऑक्सिन, जिबरेलिन, साइटोकाइनिन तथा एब्सिसिक अम्ल।',
    keyTag: 'स्मार्ट ट्रिक्स'
  },
  {
    id: 'g-bio7',
    termHindi: 'पुनरुद्भवन (Regeneration)',
    termEnglish: 'Regeneration',
    subject: 'biology',
    chapterNumber: 7,
    chapterNameHindi: 'जीव जनन कैसे करते हैं?',
    definitionHindi: 'किसी जीव के शरीर के कटे हुए भाग से नए पूर्ण जीव का विकसित हो जाना। जैसे प्लेनेरिया और हाइड्रा में।',
    keyTag: 'चित्र आधारित'
  },
  {
    id: 'g-bio8',
    termHindi: 'एकसंकर संकरण (Monohybrid Cross)',
    termEnglish: 'Monohybrid Cross',
    subject: 'biology',
    chapterNumber: 8,
    chapterNameHindi: 'आनुवंशिकता',
    definitionHindi: 'एक ही लक्षण के दो विरोधी रूपों वाले पौधों के बीच कराया गया संकरण (जैसे लंबे व बौने मटर के पौधे)। F2 अनुपात = 3:1 (लक्षणप्ररूपी)।',
    exampleOrFormula: 'मैंडल का प्रथम नियम',
    keyTag: 'बोर्ड स्पेशल'
  },
  {
    id: 'g-bio9',
    termHindi: 'पारितंत्र (Ecosystem)',
    termEnglish: 'Ecosystem',
    subject: 'biology',
    chapterNumber: 13,
    chapterNameHindi: 'हमारा पर्यावरण',
    definitionHindi: 'किसी क्षेत्र के सभी जैविक (सजीव) घटक तथा अजैविक (निर्जीव) घटक मिलकर जो स्वपोषी तंत्र बनाते हैं, उसे पारितंत्र कहते हैं।',
    keyTag: 'मूल अवधारणा'
  },

  // PHYSICS
  {
    id: 'g-phy1',
    termHindi: 'ओम का नियम (Ohm\'s Law)',
    termEnglish: 'Ohm\'s Law',
    subject: 'physics',
    chapterNumber: 11,
    chapterNameHindi: 'विद्युत',
    definitionHindi: 'नियत ताप पर किसी चालक तार के सिरों के बीच का विभवांतर उसमें प्रवाहित विद्युत धारा के समानुपाती होता है।',
    exampleOrFormula: 'V = I × R (जहाँ R = प्रतिरोध)',
    keyTag: '100% बोर्ड प्रश्न'
  },
  {
    id: 'g-phy2',
    termHindi: 'प्रतिरोधकता (Resistivity)',
    termEnglish: 'Resistivity',
    subject: 'physics',
    chapterNumber: 11,
    chapterNameHindi: 'विद्युत',
    definitionHindi: '1 मीटर लंबे और 1 वर्ग मीटर अनुप्रस्थ काट क्षेत्रफल वाले चालक का प्रतिरोध उसकी विशिष्ट प्रतिरोधकता (ρ) कहलाती है। मात्रक: ओम-मीटर (Ω·m)।',
    exampleOrFormula: 'ρ = R × A / L',
    keyTag: 'सूत्र एवं मात्रक'
  },
  {
    id: 'g-phy3',
    termHindi: 'जूल का तापीय नियम (Joule\'s Heating Law)',
    termEnglish: 'Joule\'s Heating Effect',
    subject: 'physics',
    chapterNumber: 11,
    chapterNameHindi: 'विद्युत',
    definitionHindi: 'किसी चालक में उत्पन्न ऊष्मा (H) विद्युत धारा के वर्ग, प्रतिरोध तथा समय के गुणनफल के समानुपाती होती है।',
    exampleOrFormula: 'H = I² × R × t',
    keyTag: 'न्यूमेरिकल स्पेशल'
  },
  {
    id: 'g-phy4',
    termHindi: 'स्नेल का नियम (Snell\'s Law)',
    termEnglish: 'Snell\'s Law',
    subject: 'physics',
    chapterNumber: 9,
    chapterNameHindi: 'प्रकाश – परावर्तन तथा अपवर्तन',
    definitionHindi: 'प्रकाश के अपवर्तन में आपतन कोण की ज्या (sin i) और अपवर्तन कोण की ज्या (sin r) का अनुपात एक नियतांक (अपवर्तनांक) होता है।',
    exampleOrFormula: 'sin i / sin r = μ (नियतांक)',
    keyTag: 'बोर्ड स्पेशल'
  },
  {
    id: 'g-phy5',
    termHindi: 'लेंस की क्षमता (Power of Lens)',
    termEnglish: 'Power of Lens',
    subject: 'physics',
    chapterNumber: 9,
    chapterNameHindi: 'प्रकाश – परावर्तन तथा अपवर्तन',
    definitionHindi: 'किसी लेंस द्वारा प्रकाश किरणों को अभिसरित या अपसरित करने की क्षमता। यह फोकस दूरी का व्युत्क्रम होती है। मात्रक: डायोप्टर (D)।',
    exampleOrFormula: 'P = 1 / f (मीटर में)',
    keyTag: 'मात्रक आधारित'
  },
  {
    id: 'g-phy6',
    termHindi: 'नेत्र की समंजन क्षमता (Power of Accommodation)',
    termEnglish: 'Power of Accommodation',
    subject: 'physics',
    chapterNumber: 10,
    chapterNameHindi: 'मानव नेत्र तथा रंगबिरंगा संसार',
    definitionHindi: 'पक्ष्माभी पेशियों द्वारा अभिनेत्र लेंस की फोकस दूरी को आवश्यकतानुसार समायोजित करने की क्षमता।',
    keyTag: 'परिभाषा'
  },
  {
    id: 'g-phy7',
    termHindi: 'प्रकाश का विक्षेपण (Dispersion of Light)',
    termEnglish: 'Dispersion of Light',
    subject: 'physics',
    chapterNumber: 10,
    chapterNameHindi: 'मानव नेत्र तथा रंगबिरंगा संसार',
    definitionHindi: 'श्वेत प्रकाश का कांच के प्रिज्म से गुजरने पर अपने 7 अवयवी रंगों (VIBGYOR / बैजानीपीनाला) में विभाजित हो जाना।',
    keyTag: 'चित्र आधारित'
  },
  {
    id: 'g-phy8',
    termHindi: 'परिनालिका (Solenoid)',
    termEnglish: 'Solenoid',
    subject: 'physics',
    chapterNumber: 12,
    chapterNameHindi: 'विद्युत धारा के चुंबकीय प्रभाव',
    definitionHindi: 'पास-पास लिपटे विद्युतरोधी तांबे के तार की बेलन की आकृति की अनेक फेरों वाली कुंडली को परिनालिका कहते हैं। यह छड़ चुंबक की भांति कार्य करती है।',
    keyTag: 'महत्वपूर्ण'
  },
  {
    id: 'g-phy9',
    termHindi: 'फ्लेमिंग का वामहस्त नियम (Fleming\'s Left-Hand Rule)',
    termEnglish: 'Fleming\'s Left Hand Rule',
    subject: 'physics',
    chapterNumber: 12,
    chapterNameHindi: 'विद्युत धारा के चुंबकीय प्रभाव',
    definitionHindi: 'बाएं हाथ की तर्जनी (चुंबकीय क्षेत्र), मध्यमा (विद्युत धारा) और अंगूठे (चालक पर बल की दिशा) को परस्पर लंबवत रखने का नियम।',
    keyTag: '100% बोर्ड प्रश्न'
  }
];
