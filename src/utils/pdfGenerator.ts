import jsPDF from 'jspdf';
import { SongData } from './songProcessor';

export function generateSingleSongPDF(song: SongData, qrCodeDataUrl: string): void {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text(song.title, 20, 20);

  doc.setFontSize(12);
  doc.text('Lyrics:', 20, 30);
  doc.setFontSize(10);
  const lyricsText = song.lyrics.map(stanza => stanza.join('\n')).join('\n\n');
  const lyricsLines = doc.splitTextToSize(lyricsText, 170);
  doc.text(lyricsLines, 20, 40);

  const translationY = 40 + (lyricsLines.length * 5);
  doc.setFontSize(12);
  doc.text('Translation:', 20, translationY);
  doc.setFontSize(10);
  const translationText = song.translation.map(stanza => stanza.join('\n')).join('\n\n');
  const translationLines = doc.splitTextToSize(translationText, 170);
  doc.text(translationLines, 20, translationY + 10);

  const linkY = translationY + 10 + (translationLines.length * 5);
  doc.setFontSize(12);
  doc.textWithLink('Watch on YouTube', 20, linkY, { url: song.youtubeLink });

  doc.addImage(qrCodeDataUrl, 'PNG', 20, linkY + 10, 50, 50);

  doc.save(`${song.title}.pdf`);
}

export async function generateFullBookPDF(songs: SongData[]): Promise<void> {
  const doc = new jsPDF();
  
  // Add cover page
  doc.setFontSize(22);
  doc.text('Ilahi Book', 10, 20);
  doc.addPage();

  // Add Table of Contents
  doc.setFontSize(16);
  doc.text('Table of Contents', 10, 20);
  songs.forEach((song, index) => {
    doc.text(`${index + 1}. ${song.title}`, 10, 30 + (index * 10));
  });
  doc.addPage();

  // Add song pages
  songs.forEach((song, index) => {
    doc.setFontSize(14);
    doc.text(song.title, 10, 20);
    doc.setFontSize(12);
    const lyricsText = song.lyrics.map(stanza => stanza.join('\n')).join('\n\n');
    doc.text(lyricsText, 10, 30);
    if (index < songs.length - 1) doc.addPage();
  });

  doc.save('ilahiBook.pdf');
}
