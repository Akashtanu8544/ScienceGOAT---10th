import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Chapter, ChapterNotes } from '../types';

// Clean text helper to strip any internal citation tags e.g. [cite: 2]
const cleanText = (str: string) => {
  if (!str) return '';
  return str.replace(/\[cite:\s*\d+\]/g, '').trim();
};

export async function generateNotesPDF(chapter: Chapter, notes?: ChapterNotes) {
  // Create offscreen container styled with Noto Sans Devanagari for 100% Hindi PDF rendering
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.color = '#0f172a';
  container.style.fontFamily = "'Noto Sans Devanagari', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  container.style.padding = '32px';
  container.style.boxSizing = 'border-box';

  // Inject Google Font link if not present
  if (!document.getElementById('noto-sans-devanagari-font')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'noto-sans-devanagari-font';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700;800;900&display=swap';
    document.head.appendChild(fontLink);
  }

  // Construct HTML content exactly matching the Notes Viewer appearance
  let html = `
    <div style="border-bottom: 3px solid #4f46e5; padding-bottom: 16px; margin-bottom: 24px;">
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #4f46e5; letter-spacing: 1px;">
        RBSE Class 10 Science • Handwritten & Revision Notes
      </div>
      <h1 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 6px 0 2px 0;">
        अध्याय ${chapter.chapterNumber}: ${chapter.titleHindi}
      </h1>
      <div style="font-size: 13px; font-weight: 700; color: #6366f1;">
        ${chapter.titleEnglish}
      </div>
    </div>
  `;

  if (notes) {
    // 1. Summary
    if (notes.summaryHindi) {
      html += `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
          <h2 style="font-size: 14px; font-weight: 900; color: #d97706; margin: 0 0 8px 0; display: flex; align-items: center;">
            📌 अध्याय सारांश (Chapter Summary)
          </h2>
          <p style="font-size: 13px; line-height: 1.6; color: #334155; margin: 0; font-weight: 500;">
            ${cleanText(notes.summaryHindi)}
          </p>
        </div>
      `;
    }

    // 2. Key Points
    if (notes.keyPoints && notes.keyPoints.length > 0) {
      html += `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 15px; font-weight: 900; color: #4f46e5; margin: 0 0 12px 0;">
            ✨ मुख्य बोर्ड अवधारणाएं व बिंदु (Key Concepts)
          </h2>
          <div style="display: flex; flex-direction: column; gap: 8px;">
      `;
      notes.keyPoints.forEach((pt, idx) => {
        const text = cleanText(pt);
        html += `
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 10px 12px; font-size: 12px; line-height: 1.5; color: #1e293b; display: flex; align-items: flex-start; gap: 8px;">
            <span style="background-color: #4f46e5; color: #ffffff; font-weight: 800; font-size: 10px; border-radius: 4px; padding: 2px 6px; min-width: 18px; text-align: center;">${idx + 1}</span>
            <span style="font-weight: 500;">${text}</span>
          </div>
        `;
      });
      html += `</div></div>`;
    }

    // 3. Formulas
    if (notes.formulas && notes.formulas.length > 0) {
      html += `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 15px; font-weight: 900; color: #9333ea; margin: 0 0 12px 0;">
            🧮 महत्वपूर्ण सूत्र व रासायनिक समीकरण (Formulas & Equations)
          </h2>
          <div style="display: flex; flex-direction: column; gap: 10px;">
      `;
      notes.formulas.forEach((f) => {
        html += `
          <div style="background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 10px; padding: 12px;">
            <div style="font-size: 13px; font-weight: 800; color: #7e22ce; margin-bottom: 6px;">
              📌 ${cleanText(f.name)}
            </div>
            <div style="background-color: #0f172a; color: #34d399; font-family: monospace; font-size: 13px; font-weight: 700; padding: 8px 12px; border-radius: 6px; margin-bottom: 6px;">
              ${cleanText(f.formula)}
            </div>
            <div style="font-size: 11px; color: #475569; font-weight: 500;">
              <strong>व्याख्या:</strong> ${cleanText(f.explanation)}
            </div>
          </div>
        `;
      });
      html += `</div></div>`;
    }

    // 4. Detailed Sections
    if (notes.sections && notes.sections.length > 0) {
      html += `
        <div style="margin-bottom: 20px;">
          <h2 style="font-size: 15px; font-weight: 900; color: #0284c7; margin: 0 0 12px 0;">
            📖 विस्तृत अध्याय पाठ्य (Detailed Chapter Content)
          </h2>
      `;
      notes.sections.forEach((sec) => {
        html += `
          <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; margin-bottom: 12px;">
            <h3 style="font-size: 13px; font-weight: 800; color: #0369a1; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin: 0 0 8px 0;">
              ${cleanText(sec.heading)}
            </h3>
            ${sec.content ? `<p style="font-size: 12px; line-height: 1.5; color: #334155; margin: 0 0 8px 0; font-weight: 500;">${cleanText(sec.content)}</p>` : ''}
            ${sec.formula || sec.reaction ? `
              <div style="background-color: #0f172a; color: #fbbf24; font-family: monospace; font-size: 12px; font-weight: 700; padding: 6px 10px; border-radius: 6px; margin-bottom: 8px;">
                ${cleanText(sec.formula || sec.reaction || '')}
              </div>
            ` : ''}
            ${sec.bulletPoints && sec.bulletPoints.length > 0 ? `
              <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #334155;">
                ${sec.bulletPoints.map(bp => `<li style="margin-bottom: 4px; font-weight: 500;">${cleanText(bp)}</li>`).join('')}
              </ul>
            ` : ''}
            ${sec.importantTip ? `
              <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 8px 12px; margin-top: 8px; font-size: 11px; color: #b45309; font-weight: 600;">
                🔥 <strong>बोर्ड परीक्षा टिप:</strong> ${cleanText(sec.importantTip)}
              </div>
            ` : ''}
          </div>
        `;
      });
      html += `</div>`;
    }
  } else {
    html += `
      <div style="font-size: 13px; line-height: 1.6; color: #334155; margin-top: 16px;">
        ${cleanText(chapter.description)}
      </div>
    `;
  }

  // Footer
  html += `
    <div style="margin-top: 30px; border-top: 1px solid #cbd5e1; padding-top: 12px; font-size: 10px; font-weight: 700; color: #94a3b8; text-align: center;">
      RBSE Class 10 Science App • Rajasthan Board Hindi Medium Study Material
    </div>
  `;

  container.innerHTML = html;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`RBSE_Class10_Ch${chapter.chapterNumber}_Notes.pdf`);
  } catch (err) {
    console.error('PDF Generation Error:', err);
  } finally {
    document.body.removeChild(container);
  }
}

export function createNotesJsPdfDoc(chapter: Chapter, notes?: ChapterNotes): jsPDF {
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  doc.text(`RBSE Class 10 Science Ch ${chapter.chapterNumber}`, 14, 20);
  return doc;
}

export function getNotesPdfBlobUrl(chapter: Chapter, notes?: ChapterNotes): string {
  const doc = createNotesJsPdfDoc(chapter, notes);
  return URL.createObjectURL(doc.output('blob'));
}
