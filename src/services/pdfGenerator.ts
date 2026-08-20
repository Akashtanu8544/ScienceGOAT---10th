import jsPDF from 'jspdf';
import { Chapter, ChapterNotes } from '../types';

export function generateNotesPDF(chapter: Chapter, notes?: ChapterNotes) {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const title = `अध्याय ${chapter.chapterNumber}: ${chapter.titleHindi}`;
  const sub = `RBSE कक्षा 10 विज्ञान - राजस्थान बोर्ड हस्तलिखित परीक्षा नोट्स`;

  // Header Banner
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RBSE CLASS 10 SCIENCE - NOTES SUMMARY', 14, 14);

  doc.setFontSize(11);
  doc.setTextColor(226, 232, 240);
  doc.text(`Chapter ${chapter.chapterNumber}: ${chapter.titleEnglish}`, 14, 22);
  doc.text(`Board Weightage: ${chapter.weightage} Marks`, 150, 22);

  let y = 42;

  // Overview box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(12, y, 186, 25, 3, 3, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text(`Title: ${chapter.titleHindi}`, 16, y + 8);
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Unit: ${chapter.unit} | Subject: ${chapter.subject.toUpperCase()}`, 16, y + 16);
  
  y += 33;

  // Summary section
  doc.setFontSize(12);
  doc.setTextColor(2, 132, 199); // Sky blue
  doc.text('Chapter Summary & Key Concepts (अध्याय सारांश)', 14, y);
  y += 6;

  if (notes) {
    notes.keyPoints.forEach((point, i) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFillColor(14, 165, 233);
      doc.circle(16, y - 1, 1.2, 'F');
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(point, 170);
      doc.text(lines, 20, y);
      y += lines.length * 5 + 3;
    });

    if (notes.formulas && notes.formulas.length > 0) {
      y += 6;
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.setTextColor(168, 85, 247); // Purple
      doc.text('Important Formulas & Equations (महत्वपूर्ण सूत्र)', 14, y);
      y += 6;

      notes.formulas.forEach((f) => {
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
        doc.setFillColor(243, 232, 255);
        doc.roundedRect(12, y, 186, 16, 2, 2, 'F');
        doc.setFontSize(10);
        doc.setTextColor(88, 28, 135);
        doc.text(`${f.name}:  ${f.formula}`, 16, y + 6);
        doc.setFontSize(8.5);
        doc.setTextColor(107, 33, 168);
        doc.text(`Explanation: ${f.explanation}`, 16, y + 12);
        y += 20;
      });
    }
  } else {
    doc.setTextColor(100, 116, 139);
    doc.text(chapter.description, 14, y);
    y += 10;
  }

  // Footer on bottom
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated via RBSE Class 10 Science App - Hindi Medium | Free Study Material', 14, 287);

  doc.save(`RBSE_Class10_Ch${chapter.chapterNumber}_Notes.pdf`);
}
