import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Icon SVG representation
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#312e81" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="110" fill="url(#bgGrad)"/>
  
  <!-- Outer Glow Ring -->
  <circle cx="256" cy="230" r="170" fill="none" stroke="url(#cyanGrad)" stroke-width="6" opacity="0.4" />
  <circle cx="256" cy="230" r="140" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-dasharray="12 12" opacity="0.6" />

  <!-- Central Atom / Science Symbol -->
  <g transform="translate(256, 220)">
    <ellipse rx="120" ry="45" fill="none" stroke="url(#cyanGrad)" stroke-width="6" transform="rotate(0)" opacity="0.8" />
    <ellipse rx="120" ry="45" fill="none" stroke="url(#cyanGrad)" stroke-width="6" transform="rotate(60)" opacity="0.8" />
    <ellipse rx="120" ry="45" fill="none" stroke="url(#cyanGrad)" stroke-width="6" transform="rotate(120)" opacity="0.8" />
    
    <!-- Nucleus -->
    <circle cx="0" cy="0" r="28" fill="url(#goldGrad)" filter="url(#glow)" />
    <circle cx="0" cy="0" r="14" fill="#ffffff" />
  </g>

  <!-- Badge / Text "SCIENCE GOAT" -->
  <rect x="76" y="380" width="360" height="72" rx="36" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="4" />
  <text x="256" y="425" font-family="'Hind', 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="32" fill="#fbbf24" text-anchor="middle" letter-spacing="2">
    SCIENCE GOAT 10th
  </text>
  <text x="256" y="442" font-family="sans-serif" font-weight="700" font-size="12" fill="#94a3b8" text-anchor="middle">
    RBSE CLASS 10
  </text>
</svg>
`;

// Maskable Icon SVG with safe margins
const maskableIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#312e81" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#6366f1" />
    </linearGradient>
  </defs>

  <!-- Full bleed background for maskable -->
  <rect width="512" height="512" fill="url(#bgGrad)"/>
  
  <g transform="translate(256, 220) scale(0.85)">
    <ellipse rx="120" ry="45" fill="none" stroke="url(#cyanGrad)" stroke-width="8" transform="rotate(0)" />
    <ellipse rx="120" ry="45" fill="none" stroke="url(#cyanGrad)" stroke-width="8" transform="rotate(60)" />
    <ellipse rx="120" ry="45" fill="none" stroke="url(#cyanGrad)" stroke-width="8" transform="rotate(120)" />
    <circle cx="0" cy="0" r="32" fill="url(#goldGrad)" />
    <circle cx="0" cy="0" r="16" fill="#ffffff" />
  </g>

  <rect x="96" y="365" width="320" height="64" rx="32" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="4" />
  <text x="256" y="407" font-family="sans-serif" font-weight="900" font-size="28" fill="#fbbf24" text-anchor="middle">
    SCIENCE GOAT 10
  </text>
</svg>
`;

// Narrow Screenshot SVG (Mobile 1080x1920)
const screenshotNarrowSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="100%" stop-color="#7c3aed" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>

  <rect width="1080" height="1920" fill="url(#bg)"/>

  <!-- Top App Bar -->
  <rect x="0" y="0" width="1080" height="180" fill="#1e1b4b" />
  <text x="60" y="110" font-family="sans-serif" font-weight="900" font-size="44" fill="#ffffff">
    Science GOAT - 10th RBSE
  </text>
  <text x="60" y="150" font-family="sans-serif" font-weight="600" font-size="26" fill="#fbbf24">
    राजस्थान बोर्ड कक्षा 10वीं विज्ञान पूर्ण तैयारी
  </text>

  <!-- Hero Banner -->
  <rect x="60" y="230" width="960" height="300" rx="32" fill="url(#primaryGrad)" />
  <text x="110" y="320" font-family="sans-serif" font-weight="900" font-size="48" fill="#ffffff">
    कक्षा 10वीं विज्ञान हस्तलिखित नोट्स
  </text>
  <text x="110" y="375" font-family="sans-serif" font-weight="500" font-size="30" fill="#e0e7ff">
    अध्यायवार सम्पूर्ण नोट्स, क्विज़, PYQs एवं मॉडल पेपर
  </text>
  <rect x="110" y="420" width="320" height="70" rx="35" fill="#f59e0b" />
  <text x="270" y="465" font-family="sans-serif" font-weight="800" font-size="28" fill="#ffffff" text-anchor="middle">
    अभी पढ़ना शुरू करें
  </text>

  <!-- Features Grid -->
  <!-- Card 1: Notes -->
  <rect x="60" y="580" width="450" height="380" rx="28" fill="url(#cardGrad)" stroke="#3b82f6" stroke-width="4" />
  <circle cx="140" cy="670" r="45" fill="#3b82f6" opacity="0.2" />
  <text x="140" y="685" font-family="sans-serif" font-weight="900" font-size="40" fill="#3b82f6" text-anchor="middle">📝</text>
  <text x="110" y="780" font-family="sans-serif" font-weight="800" font-size="36" fill="#ffffff">हस्तलिखित नोट्स</text>
  <text x="110" y="830" font-family="sans-serif" font-size="26" fill="#94a3b8">सभी 13 अध्यायों के नोट्स</text>

  <!-- Card 2: Online Quiz -->
  <rect x="570" y="580" width="450" height="380" rx="28" fill="url(#cardGrad)" stroke="#10b981" stroke-width="4" />
  <circle cx="650" cy="670" r="45" fill="#10b981" opacity="0.2" />
  <text x="650" y="685" font-family="sans-serif" font-weight="900" font-size="40" fill="#10b981" text-anchor="middle">⚡</text>
  <text x="620" y="780" font-family="sans-serif" font-weight="800" font-size="36" fill="#ffffff">ऑनलाइन टेस्ट</text>
  <text x="620" y="830" font-family="sans-serif" font-size="26" fill="#94a3b8">MCQ एवं मॉक टेस्ट</text>

  <!-- Card 3: PYQs -->
  <rect x="60" y="1000" width="450" height="380" rx="28" fill="url(#cardGrad)" stroke="#f59e0b" stroke-width="4" />
  <circle cx="140" cy="1090" r="45" fill="#f59e0b" opacity="0.2" />
  <text x="140" y="1105" font-family="sans-serif" font-weight="900" font-size="40" fill="#f59e0b" text-anchor="middle">🎓</text>
  <text x="110" y="1200" font-family="sans-serif" font-weight="800" font-size="36" fill="#ffffff">पुराने पेपर (PYQ)</text>
  <text x="110" y="1250" font-family="sans-serif" font-size="26" fill="#94a3b8">2018-2024 बोर्ड पेपर</text>

  <!-- Card 4: Important Questions -->
  <rect x="570" y="1000" width="450" height="380" rx="28" fill="url(#cardGrad)" stroke="#ec4899" stroke-width="4" />
  <circle cx="650" cy="1090" r="45" fill="#ec4899" opacity="0.2" />
  <text x="650" y="1105" font-family="sans-serif" font-weight="900" font-size="40" fill="#ec4899" text-anchor="middle">⭐</text>
  <text x="620" y="1200" font-family="sans-serif" font-weight="800" font-size="36" fill="#ffffff">अति-महत्वपूर्ण Q&amp;A</text>
  <text x="620" y="1250" font-family="sans-serif" font-size="26" fill="#94a3b8">100% बोर्ड प्रश्न</text>

  <!-- Bottom Nav -->
  <rect x="0" y="1740" width="1080" height="180" fill="#0f172a" stroke="#334155" stroke-width="2" />
  <text x="150" y="1840" font-family="sans-serif" font-size="28" fill="#fbbf24" text-anchor="middle">🏠 होम</text>
  <text x="390" y="1840" font-family="sans-serif" font-size="28" fill="#94a3b8" text-anchor="middle">📚 नोट्स</text>
  <text x="630" y="1840" font-family="sans-serif" font-size="28" fill="#94a3b8" text-anchor="middle">🧪 टेस्ट</text>
  <text x="870" y="1840" font-family="sans-serif" font-size="28" fill="#94a3b8" text-anchor="middle">🏆 PYQs</text>
</svg>
`;

// Wide Screenshot SVG (Desktop 1920x1080)
const screenshotWideSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bgWide" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e1b4b" />
    </linearGradient>
    <linearGradient id="cardWide" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <linearGradient id="goldWide" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#d97706" />
    </linearGradient>
  </defs>

  <rect width="1920" height="1080" fill="url(#bgWide)"/>

  <!-- Left Navigation Sidebar -->
  <rect x="0" y="0" width="380" height="1080" fill="#0f172a" stroke="#1e293b" stroke-width="2" />
  <text x="40" y="90" font-family="sans-serif" font-weight="900" font-size="32" fill="#fbbf24">SCIENCE GOAT 10</text>
  <text x="40" y="125" font-family="sans-serif" font-size="18" fill="#94a3b8">RBSE Class 10th Science</text>

  <rect x="20" y="180" width="340" height="60" rx="16" fill="#312e81" />
  <text x="70" y="220" font-family="sans-serif" font-weight="700" font-size="22" fill="#ffffff">📊 Dashboard</text>

  <rect x="20" y="260" width="340" height="60" rx="16" fill="transparent" />
  <text x="70" y="300" font-family="sans-serif" font-weight="600" font-size="22" fill="#94a3b8">📚 Handwritten Notes</text>

  <rect x="20" y="340" width="340" height="60" rx="16" fill="transparent" />
  <text x="70" y="380" font-family="sans-serif" font-weight="600" font-size="22" fill="#94a3b8">🧪 Online Quizzes</text>

  <rect x="20" y="420" width="340" height="60" rx="16" fill="transparent" />
  <text x="70" y="460" font-family="sans-serif" font-weight="600" font-size="22" fill="#94a3b8">📜 Board PYQs (2018-2024)</text>

  <!-- Main Content Area -->
  <text x="440" y="90" font-family="sans-serif" font-weight="900" font-size="40" fill="#ffffff">राजस्थान बोर्ड (RBSE) कक्षा 10वीं विज्ञान</text>
  <text x="440" y="130" font-family="sans-serif" font-size="22" fill="#94a3b8">अध्यायवार हस्तलिखित नोट्स, मॉडल पेपर एवं मॉक टेस्ट</text>

  <!-- Main Banner -->
  <rect x="440" y="170" width="1420" height="240" rx="24" fill="url(#cardWide)" stroke="#4f46e5" stroke-width="3" />
  <text x="490" y="240" font-family="sans-serif" font-weight="900" font-size="36" fill="#fbbf24">100% NCERT / RBSE नवीनतम पाठ्यक्रम आधारित</text>
  <text x="490" y="290" font-family="sans-serif" font-size="24" fill="#e2e8f0">रासायनिक अभिक्रियाएं, अम्ल-क्षार, जीव प्रक्रम, प्रकाश का परावर्तन एवं विद्युत धारा</text>
  <rect x="490" y="325" width="280" height="50" rx="25" fill="url(#goldWide)" />
  <text x="630" y="360" font-family="sans-serif" font-weight="800" font-size="20" fill="#ffffff" text-anchor="middle">नोट्स डाउनलोड करें</text>

  <!-- 3 Feature Cards -->
  <rect x="440" y="450" width="450" height="560" rx="24" fill="#1e293b" border="1px solid #334155" />
  <text x="480" y="520" font-family="sans-serif" font-weight="800" font-size="28" fill="#38bdf8">📝 अध्यायવાર नोट्स</text>
  <text x="480" y="570" font-family="sans-serif" font-size="20" fill="#cbd5e1">• स्पष्ट एवं सुंदर हस्तलिखित अक्षर</text>
  <text x="480" y="610" font-family="sans-serif" font-size="20" fill="#cbd5e1">• महत्वपूर्ण सूत्र एवं चित्र रेखांकन</text>
  <text x="480" y="650" font-family="sans-serif" font-size="20" fill="#cbd5e1">• PDF ऑफलाइन मोड समर्थित</text>

  <rect x="925" y="450" width="450" height="560" rx="24" fill="#1e293b" />
  <text x="965" y="520" font-family="sans-serif" font-weight="800" font-size="28" fill="#4ade80">🎯 क्विज़ एवं परीक्षा प्रैक्टिस</text>
  <text x="965" y="570" font-family="sans-serif" font-size="20" fill="#cbd5e1">• अध्यायवार MCQ प्रश्नोत्तरी</text>
  <text x="965" y="610" font-family="sans-serif" font-size="20" fill="#cbd5e1">• तुरंत स्कोर एवं उत्तर विश्लेषण</text>
  <text x="965" y="650" font-family="sans-serif" font-size="20" fill="#cbd5e1">• मॉडल प्रश्न पत्र 2025-26</text>

  <rect x="1410" y="450" width="450" height="560" rx="24" fill="#1e293b" />
  <text x="1450" y="520" font-family="sans-serif" font-weight="800" font-size="28" fill="#f43f5e">🏆 बोर्ड प्रश्न पत्र (PYQ)</text>
  <text x="1450" y="570" font-family="sans-serif" font-size="20" fill="#cbd5e1">• वर्ष 2018 से 2024 तक के हल</text>
  <text x="1450" y="610" font-family="sans-serif" font-size="20" fill="#cbd5e1">• अति-महत्वपूर्ण 100 प्रश्नोत्तर</text>
  <text x="1450" y="650" font-family="sans-serif" font-size="20" fill="#cbd5e1">• टॉपर उत्तर पुस्तिका विश्लेषण</text>
</svg>
`;

async function generateAllAssets() {
  console.log('Generating logo.svg...');
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), iconSvg);

  console.log('Generating pwa-192x192.png...');
  await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  console.log('Generating icon-192.png...');
  await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-192.png'));

  console.log('Generating pwa-512x512.png...');
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  console.log('Generating icon-512.png...');
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'icon-512.png'));

  console.log('Generating maskable-icon-512x512.png...');
  await sharp(Buffer.from(maskableIconSvg))
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'maskable-icon-512x512.png'));

  console.log('Generating apple-touch-icon.png...');
  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Generating screenshot-narrow.png...');
  await sharp(Buffer.from(screenshotNarrowSvg))
    .resize(1080, 1920)
    .png({ compressionLevel: 8 })
    .toFile(path.join(publicDir, 'screenshot-narrow.png'));

  console.log('Generating screenshot-wide.png...');
  await sharp(Buffer.from(screenshotWideSvg))
    .resize(1920, 1080)
    .png({ compressionLevel: 8 })
    .toFile(path.join(publicDir, 'screenshot-wide.png'));

  console.log('All image assets successfully generated!');
}

generateAllAssets().catch((err) => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
