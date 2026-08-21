export interface DailyTip {
  id: number;
  category: 'tip' | 'quote' | 'formula' | 'diagram';
  titleHindi: string;
  contentHindi: string;
  authorOrTopic?: string;
  icon: string;
}

export const DAILY_TIPS_DATA: DailyTip[] = [
  {
    id: 1,
    category: 'tip',
    titleHindi: 'चित्र एवं नामांकन (Diagrams) अभ्यास',
    contentHindi: 'RBSE बोर्ड परीक्षा में मानव नेत्र, नेफ्रॉन, पाचन तंत्र और परिपथ आरेख के नामांकित चित्र 3-4 अंक दिलाते हैं। प्रतिदिन कम से कम 1 चित्र बनाकर अभ्यास करें।',
    authorOrTopic: 'बोर्ड परीक्षा टिप',
    icon: '✏️'
  },
  {
    id: 2,
    category: 'quote',
    titleHindi: 'सफलता की कुंजी',
    contentHindi: '"सफलता का कोई रहस्य नहीं है; यह तैयारी, कठिन परिश्रम और असफलता से सीखने का परिणाम है।"- डॉ. एपीजे अब्दुल कलाम',
    authorOrTopic: 'प्रेरणादायक विचार',
    icon: '🌟'
  },
  {
    id: 3,
    category: 'formula',
    titleHindi: 'भौतिकी सूत्र एवं न्यूमेरिकल',
    contentHindi: 'ओम का नियम (V = IR) तथा लेंस सूत्र (1/f = 1/v - 1/u) पर न्यूमेरिकल प्रश्न हल करते समय कार्तीय चिह्न परिपाटी (Sign Convention) का विशेष ध्यान रखें।',
    authorOrTopic: 'भौतिकी स्पेशल',
    icon: '⚡'
  },
  {
    id: 4,
    category: 'tip',
    titleHindi: 'समीकरण संतुलित करना',
    contentHindi: 'रासायनिक अभिक्रियाओं में समीकरणों को संतुलित लिखना आवश्यक है। परीक्षा में केवल वाक्य न लिखें, रासायनिक समीकरण और उनकी भौतिक अवस्थाएँ जरूर दर्शाएँ।',
    authorOrTopic: 'रसायन विज्ञान टिप',
    icon: '🧪'
  },
  {
    id: 5,
    category: 'quote',
    titleHindi: 'सपनों की उड़ान',
    contentHindi: '"सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।"- डॉ. एपीजे अब्दुल कलाम',
    authorOrTopic: 'प्रेरणादायक विचार',
    icon: '🚀'
  },
  {
    id: 6,
    category: 'diagram',
    titleHindi: 'फ्लेमिंग का वामहस्त नियम',
    contentHindi: 'विद्युत मोटर एवं चुंबकीय बल की दिशा के लिए बाएं हाथ का नियम याद रखें: अंगूठा = बल, तर्जनी = चुंबकीय क्षेत्र, मध्यमा = धारा (F-B-I)।',
    authorOrTopic: 'स्मार्ट ट्रिक्स',
    icon: '🖐️'
  },
  {
    id: 7,
    category: 'tip',
    titleHindi: 'उत्तर लेखन प्रस्तुतीकरण (Presentation)',
    contentHindi: 'RBSE उत्तर पुस्तिका में मुख्य बिंदुओं व रासायनिक सूत्रों को अंडरलाइन करें। बड़े प्रश्नों को प्वाइंट्स और हेडिंग में लिखें, जिससे परीक्षक प्रभावित हों।',
    authorOrTopic: 'टॉपर सीक्रेट',
    icon: '📝'
  },
  {
    id: 8,
    category: 'quote',
    titleHindi: 'निरंतर प्रयास',
    contentHindi: '"छोटे-छोटे दैनिक सुधार लंबे समय में आश्चर्यजनक और महान परिणाम देते हैं। लगातार 1% बेहतर बनने की कोशिश करें।"',
    authorOrTopic: 'अध्ययन प्रेरणा',
    icon: '🔥'
  },
  {
    id: 9,
    category: 'tip',
    titleHindi: 'pH मान एवं लवण याद रखें',
    contentHindi: 'प्लास्टर ऑफ पेरिस (CaSO₄·½H₂O), धावन सोडा (Na₂CO₃·10H₂O) और बेकिंग सोडा (NaHCO₃) के रासायनिक सूत्र एवं उपयोग परीक्षा के अति-लघुत्तरात्मक प्रश्नों में बार-बार आते हैं।',
    authorOrTopic: 'इकाई 1 रिवीजन',
    icon: '🧬'
  },
  {
    id: 10,
    category: 'quote',
    titleHindi: 'खुद पर विश्वास',
    contentHindi: '"यदि आप सोचते हैं कि आप कर सकते हैं, तो आप कर सकते हैं। आत्मविश्वास आधी जीत है।"',
    authorOrTopic: 'मनोबल',
    icon: '💡'
  },
  {
    id: 11,
    category: 'tip',
    titleHindi: 'जीव विज्ञान के मुख्य अंतर',
    contentHindi: 'वायवीय व अवायवीय श्वसन, जाइलम व फ्लोएम, तथा धमनी व शिरा में अंतर याद रखें। अंतर हमेशा सारणी (Table) बनाकर स्पष्ट करें।',
    authorOrTopic: 'जीव विज्ञान टिप',
    icon: '🌱'
  },
  {
    id: 12,
    category: 'tip',
    titleHindi: '3 R नियम का उपयोग',
    contentHindi: 'पर्यावरण एवं प्राकृतिक संसाधन अध्याय में 3 R (Reduce, Recycle, Reuse) और 10% ऊर्जा नियम को याद रखें।',
    authorOrTopic: 'पर्यावरण विज्ञान',
    icon: '♻️'
  }
];
