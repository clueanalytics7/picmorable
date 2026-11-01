/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { AlbumMetadata, AlbumPhoto, AlbumPage } from '../types/album';
import { generateAlbumTranscript, downloadBlob } from './albumExporter';

/**
 * Converts a photo URL to a Data URL (base64) client-side.
 */
export async function photoToDataUrl(photo: AlbumPhoto): Promise<string> {
  if (photo.url.startsWith('data:')) {
    return photo.url;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(photo.url);
          return;
        }
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch {
        resolve(photo.url);
      }
    };
    img.onerror = () => resolve(photo.url);
    img.src = photo.url;
  });
}

/**
 * Material color definitions for PDF rendering and standalone HTML.
 */
export const MATERIAL_THEMES: Record<
  string,
  {
    bgHex: string;
    darkHex: string;
    spineHex: string;
    textHex: string;
    goldHex: string;
    borderHex: string;
    name: string;
  }
> = {
  'burgundy-leather': {
    bgHex: '#3b121d',
    darkHex: '#250b12',
    spineHex: '#1b070d',
    textHex: '#fcedc7',
    goldHex: '#dfbe68',
    borderHex: '#dfbe68',
    name: 'Burgundy Leather',
  },
  'forest-linen': {
    bgHex: '#1b3425',
    darkHex: '#122218',
    spineHex: '#0c1710',
    textHex: '#ebf4ed',
    goldHex: '#d8c47b',
    borderHex: '#d8c47b',
    name: 'Vintage Forest Linen',
  },
  'navy-buckram': {
    bgHex: '#14233c',
    darkHex: '#0d1727',
    spineHex: '#080e18',
    textHex: '#e5eefc',
    goldHex: '#dfc277',
    borderHex: '#dfc277',
    name: 'Navy Buckram',
  },
  'sandstone-cloth': {
    bgHex: '#645444',
    darkHex: '#45392d',
    spineHex: '#2d241c',
    textHex: '#faf5ee',
    goldHex: '#e8cb82',
    borderHex: '#e8cb82',
    name: 'Sandstone Book Cloth',
  },
  'espresso-calfskin': {
    bgHex: '#2b1c14',
    darkHex: '#1c120c',
    spineHex: '#120b07',
    textHex: '#faeade',
    goldHex: '#deb765',
    borderHex: '#deb765',
    name: 'Espresso Calfskin',
  },
};

export const PAPER_TONE_THEMES: Record<
  string,
  {
    bgHex: string;
    borderHex: string;
    cardBgHex: string;
    textHex: string;
    name: string;
  }
> = {
  'warm-cream': {
    bgHex: '#faf7f0',
    borderHex: '#ded6c3',
    cardBgHex: '#f3ede0',
    textHex: '#382813',
    name: 'Warm Cream Parchment',
  },
  'aged-sepia': {
    bgHex: '#f3ede2',
    borderHex: '#cbbda7',
    cardBgHex: '#e8dcce',
    textHex: '#3b2b1a',
    name: 'Aged Sepia Archival',
  },
  'cotton-rag': {
    bgHex: '#fcfbf8',
    borderHex: '#dad7ce',
    cardBgHex: '#f4f3ed',
    textHex: '#2b2a28',
    name: 'Cotton Rag Fine Art',
  },
  'gallery-lustre': {
    bgHex: '#f6f7f9',
    borderHex: '#cfd4dc',
    cardBgHex: '#eaedf2',
    textHex: '#1f242d',
    name: 'Gallery Lustre Crisp',
  },
};

/**
 * Builds a multi-page, landscape Archival Hardcover Photo Book PDF.
 */
export async function generateAlbumPdf(
  meta: AlbumMetadata,
  photos: AlbumPhoto[],
  pages: AlbumPage[],
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(5, 'Preparing print-ready photo book canvas...');

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4', // 297mm wide x 210mm high
  });

  const pageWidth = 297;
  const pageHeight = 210;
  const theme = MATERIAL_THEMES[meta.coverMaterial] || MATERIAL_THEMES['burgundy-leather'];
  const paperToneKey = meta.paperTone || 'warm-cream';
  const paperTheme = PAPER_TONE_THEMES[paperToneKey] || PAPER_TONE_THEMES['warm-cream'];
  const photoMap = new Map(photos.map((p) => [p.id, p]));

  // Cache photo base64 data URLs
  onProgress?.(15, 'Converting photographs for high-resolution book export...');
  const dataUrlMap = new Map<string, string>();
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    try {
      const dataUrl = await photoToDataUrl(p);
      dataUrlMap.set(p.id, dataUrl);
    } catch (err) {
      console.warn(`Could not prepare photo ${p.name}`, err);
    }
    const pct = Math.round(15 + ((i + 1) / Math.max(1, photos.length)) * 30);
    onProgress?.(pct, `Processed photo ${i + 1} of ${photos.length}...`);
  }

  // --- PAGE 1: HARDCOVER ---
  onProgress?.(50, 'Embossing front hardcover and foil lettering...');
  
  // Fill cover background
  doc.setFillColor(theme.bgHex);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Spine hinge shadow on left
  doc.setFillColor(theme.spineHex);
  doc.rect(0, 0, 18, pageHeight, 'F');
  doc.setFillColor(theme.darkHex);
  doc.rect(18, 0, 4, pageHeight, 'F');

  // Decorative double foil border
  doc.setDrawColor(theme.goldHex);
  doc.setLineWidth(1.2);
  doc.rect(28, 12, pageWidth - 40, pageHeight - 24);
  doc.setLineWidth(0.4);
  doc.rect(31, 15, pageWidth - 46, pageHeight - 30);

  // Corner brass ornaments
  const drawCornerFlourish = (x: number, y: number, dirX: number, dirY: number) => {
    doc.setDrawColor(theme.goldHex);
    doc.setLineWidth(0.8);
    doc.line(x, y, x + dirX * 12, y);
    doc.line(x, y, x, y + dirY * 12);
    doc.circle(x + dirX * 4, y + dirY * 4, 1.2, 'S');
  };
  drawCornerFlourish(31, 15, 1, 1);
  drawCornerFlourish(pageWidth - 15, 15, -1, 1);
  drawCornerFlourish(31, pageHeight - 15, 1, -1);
  drawCornerFlourish(pageWidth - 15, pageHeight - 15, -1, -1);

  // Cover Typography
  doc.setTextColor(theme.goldHex);
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  const curatorText = (meta.curator || 'Private Archival Collection').toUpperCase();
  doc.text(`* ${curatorText} *`, (pageWidth + 18) / 2, 45, { align: 'center' });

  if (meta.dateRange) {
    doc.setFontSize(10);
    doc.setFont('times', 'italic');
    doc.text(meta.dateRange, (pageWidth + 18) / 2, 53, { align: 'center' });
  }

  // Divider line
  doc.setLineWidth(0.5);
  doc.line((pageWidth + 18) / 2 - 35, 62, (pageWidth + 18) / 2 + 35, 62);
  doc.text('+', (pageWidth + 18) / 2, 63, { align: 'center' });

  // Title
  doc.setFont('times', 'bold');
  doc.setFontSize(32);
  const titleLines = doc.splitTextToSize(meta.title.toUpperCase(), pageWidth - 70);
  doc.text(titleLines, (pageWidth + 18) / 2, 88, { align: 'center' });

  // Subtitle
  if (meta.subtitle) {
    doc.setFont('times', 'italic');
    doc.setFontSize(14);
    const subLines = doc.splitTextToSize(meta.subtitle, pageWidth - 80);
    doc.text(subLines, (pageWidth + 18) / 2, 114, { align: 'center' });
  }

  // Cover Bottom Seal
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text('PICMORABLE ARCHIVAL BOOK', (pageWidth + 18) / 2, pageHeight - 26, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('times', 'italic');
  doc.text('Preserved and arranged on-device with zero cloud exposure', (pageWidth + 18) / 2, pageHeight - 21, {
    align: 'center',
  });

  // --- PAGE 2: FRONTISPIECE & NARRATIVE STORY ---
  onProgress?.(65, 'Rendering frontispiece narrative plate...');
  doc.addPage('a4', 'landscape');

  // Parchment paper background
  doc.setFillColor(paperTheme.bgHex);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Archival inner border
  doc.setDrawColor(paperTheme.borderHex);
  doc.setLineWidth(0.5);
  doc.rect(14, 12, pageWidth - 28, pageHeight - 24);

  // Header
  doc.setTextColor('#332a1e');
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text(meta.title, pageWidth / 2, 28, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(11);
  doc.setTextColor('#6b5c49');
  doc.text(meta.subtitle || 'Personal Photographic Retrospective', pageWidth / 2, 35, { align: 'center' });

  // Left column: Narrative Story
  doc.setFillColor(paperTheme.cardBgHex);
  doc.setDrawColor(paperTheme.borderHex);
  doc.rect(22, 45, 125, 138, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor('#382813');
  doc.text('THE STORY OF THIS ALBUM', 28, 55);

  doc.setLineWidth(0.3);
  doc.setDrawColor('#bfae92');
  doc.line(28, 58, 140, 58);

  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor('#3e3529');
  const story = meta.description || 'No album narrative provided.';
  const storyLines = doc.splitTextToSize(story, 113);
  doc.text(storyLines.slice(0, 22), 28, 66, { lineHeightFactor: 1.4 });

  // Story footer
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor('#706352');
  doc.text(`Curated by: ${meta.curator || 'Private Family Archive'}`, 28, 168);
  doc.text(`Period: ${meta.dateRange || 'Private Collection'}`, 28, 174);

  // Right column: Frontispiece Photo
  const firstPhoto = photos[0];
  if (firstPhoto) {
    const photoData = dataUrlMap.get(firstPhoto.id);
    if (photoData) {
      // Photo white border mounting
      doc.setFillColor('#ffffff');
      doc.setDrawColor('#c4b9a3');
      doc.setLineWidth(0.6);
      doc.rect(160, 45, 114, 118, 'FD');

      // Antique corner brackets
      doc.setFillColor('#1f1c19');
      doc.triangle(160, 45, 166, 45, 160, 51, 'F');
      doc.triangle(274, 45, 268, 45, 274, 51, 'F');
      doc.triangle(160, 163, 166, 163, 160, 157, 'F');
      doc.triangle(274, 163, 268, 163, 274, 157, 'F');

      try {
        doc.addImage(photoData, 'JPEG', 164, 49, 106, 96, undefined, 'FAST');
      } catch (err) {
        console.warn('Could not draw frontispiece photo in PDF', err);
      }

      // Caption
      doc.setFont('times', 'italic');
      doc.setFontSize(9);
      doc.setTextColor('#2d261e');
      const capLines = doc.splitTextToSize(`"${firstPhoto.caption || firstPhoto.name}"`, 106);
      doc.text(capLines.slice(0, 2), 213, 153, { align: 'center' });
    }
  }

  // --- SUBSEQUENT PAGES: ALBUM PLATES ---
  for (let pIdx = 0; pIdx < pages.length; pIdx++) {
    const page = pages[pIdx];
    const pagePhotos = page.photoIds.map((id) => photoMap.get(id)).filter(Boolean) as AlbumPhoto[];

    // Skip frontispiece template if it's already represented or render custom plates
    if (page.templateId === 'frontispiece' && pIdx === 0) {
      continue;
    }

    onProgress?.(
      Math.round(70 + ((pIdx + 1) / pages.length) * 25),
      `Rendering Album Plate ${page.pageNumber}...`
    );

    doc.addPage('a4', 'landscape');

    // Page parchment background
    doc.setFillColor(paperTheme.bgHex);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Border
    doc.setDrawColor(paperTheme.borderHex);
    doc.setLineWidth(0.4);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Plate Header
    doc.setFont('times', 'normal');
    doc.setFontSize(8);
    doc.setTextColor('#80725c');
    doc.text(`PICMORABLE ARCHIVE  *  PLATE NO. ${page.pageNumber}`, 18, 19);
    doc.text(page.customTitle || meta.title, pageWidth - 18, 19, { align: 'right' });

    // Plate Footer
    doc.text(`- PAGE ${page.pageNumber} -`, pageWidth / 2, pageHeight - 15, { align: 'center' });

    // Layout slots based on page template
    if (page.templateId === 'hero-single' || page.templateId === 'full-bleed') {
      const p = pagePhotos[0];
      if (p) {
        const pData = dataUrlMap.get(p.id);
        if (pData) {
          const slotX = 40;
          const slotY = 26;
          const slotW = 217;
          const slotH = 145;

          // White photo paper mount
          doc.setFillColor('#ffffff');
          doc.setDrawColor('#c7bea8');
          doc.setLineWidth(0.6);
          doc.rect(slotX, slotY, slotW, slotH, 'FD');

          // Photo corner brackets
          doc.setFillColor('#1f1c19');
          doc.triangle(slotX, slotY, slotX + 7, slotY, slotX, slotY + 7, 'F');
          doc.triangle(slotX + slotW, slotY, slotX + slotW - 7, slotY, slotX + slotW, slotY + 7, 'F');
          doc.triangle(slotX, slotY + slotH, slotX + 7, slotY + slotH, slotX, slotY + slotH - 7, 'F');
          doc.triangle(slotX + slotW, slotY + slotH, slotX + slotW - 7, slotY + slotH, slotX + slotW, slotY + slotH - 7, 'F');

          try {
            doc.addImage(pData, 'JPEG', slotX + 4, slotY + 4, slotW - 8, slotH - 24, undefined, 'FAST');
          } catch (e) {
            console.warn(e);
          }

          // Caption
          doc.setFont('times', 'italic');
          doc.setFontSize(10);
          doc.setTextColor('#261f16');
          const cap = p.caption ? `"${p.caption}"` : p.name;
          doc.text(cap, slotX + slotW / 2, slotY + slotH - 10, { align: 'center' });

          if (p.date || p.location) {
            doc.setFont('times', 'normal');
            doc.setFontSize(8);
            doc.setTextColor('#706352');
            const sub = [p.date, p.location].filter(Boolean).join('  *  ');
            doc.text(sub, slotX + slotW / 2, slotY + slotH - 4, { align: 'center' });
          }
        }
      }
    } else if (page.templateId === 'twin-portrait') {
      const p1 = pagePhotos[0];
      const p2 = pagePhotos[1];
      const renderSlot = (p: AlbumPhoto | undefined, x: number) => {
        if (!p) return;
        const pData = dataUrlMap.get(p.id);
        if (!pData) return;
        const w = 120;
        const h = 150;
        const y = 26;

        doc.setFillColor('#ffffff');
        doc.setDrawColor('#c7bea8');
        doc.setLineWidth(0.6);
        doc.rect(x, y, w, h, 'FD');

        doc.setFillColor('#1f1c19');
        doc.triangle(x, y, x + 6, y, x, y + 6, 'F');
        doc.triangle(x + w, y, x + w - 6, y, x + w, y + 6, 'F');
        doc.triangle(x, y + h, x + 6, y + h, x, y + h - 6, 'F');
        doc.triangle(x + w, y + h, x + w - 6, y + h, x + w, y + h - 6, 'F');

        try {
          doc.addImage(pData, 'JPEG', x + 3, y + 3, w - 6, h - 25, undefined, 'FAST');
        } catch (e) {
          console.warn(e);
        }

        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        doc.setTextColor('#261f16');
        const cap = p.caption ? `"${p.caption}"` : p.name;
        const capLines = doc.splitTextToSize(cap, w - 8);
        doc.text(capLines.slice(0, 2), x + w / 2, y + h - 12, { align: 'center' });
      };

      renderSlot(p1, 24);
      renderSlot(p2, 153);
    } else if (page.templateId === 'duo-landscape') {
      const p1 = pagePhotos[0];
      const p2 = pagePhotos[1];
      const renderLandscapeSlot = (p: AlbumPhoto | undefined, y: number) => {
        if (!p) return;
        const pData = dataUrlMap.get(p.id);
        if (!pData) return;
        const x = 38;
        const w = 221;
        const h = 72;

        doc.setFillColor('#ffffff');
        doc.setDrawColor('#c7bea8');
        doc.setLineWidth(0.6);
        doc.rect(x, y, w, h, 'FD');

        doc.setFillColor('#1f1c19');
        doc.triangle(x, y, x + 6, y, x, y + 6, 'F');
        doc.triangle(x + w, y, x + w - 6, y, x + w, y + 6, 'F');
        doc.triangle(x, y + h, x + 6, y + h, x, y + h - 6, 'F');
        doc.triangle(x + w, y + h, x + w - 6, y + h, x + w, y + h - 6, 'F');

        try {
          doc.addImage(pData, 'JPEG', x + 3, y + 3, w - 6, h - 18, undefined, 'FAST');
        } catch (e) {
          console.warn(e);
        }

        doc.setFont('times', 'italic');
        doc.setFontSize(9);
        doc.setTextColor('#261f16');
        const cap = p.caption ? `"${p.caption}"` : p.name;
        doc.text(cap, x + w / 2, y + h - 7, { align: 'center' });
      };

      renderLandscapeSlot(p1, 25);
      renderLandscapeSlot(p2, 104);
    } else {
      // Quad Scrapbook / Story Trio
      const coords = [
        { x: 26, y: 26, w: 118, h: 72 },
        { x: 153, y: 26, w: 118, h: 72 },
        { x: 26, y: 104, w: 118, h: 72 },
        { x: 153, y: 104, w: 118, h: 72 },
      ];

      pagePhotos.slice(0, 4).forEach((p, sIdx) => {
        const slot = coords[sIdx];
        const pData = dataUrlMap.get(p.id);
        if (!pData || !slot) return;

        doc.setFillColor('#ffffff');
        doc.setDrawColor('#c7bea8');
        doc.setLineWidth(0.5);
        doc.rect(slot.x, slot.y, slot.w, slot.h, 'FD');

        doc.setFillColor('#1f1c19');
        doc.triangle(slot.x, slot.y, slot.x + 5, slot.y, slot.x, slot.y + 5, 'F');
        doc.triangle(slot.x + slot.w, slot.y, slot.x + slot.w - 5, slot.y, slot.x + slot.w, slot.y + 5, 'F');
        doc.triangle(slot.x, slot.y + slot.h, slot.x + 5, slot.y + slot.h, slot.x, slot.y + slot.h - 5, 'F');
        doc.triangle(slot.x + slot.w, slot.y + slot.h, slot.x + slot.w - 5, slot.y + slot.h, slot.x + slot.w, slot.y + slot.h - 5, 'F');

        try {
          doc.addImage(pData, 'JPEG', slot.x + 2, slot.y + 2, slot.w - 4, slot.h - 18, undefined, 'FAST');
        } catch (e) {
          console.warn(e);
        }

        doc.setFont('times', 'italic');
        doc.setFontSize(8);
        doc.setTextColor('#261f16');
        const cap = p.caption ? `"${p.caption}"` : p.name;
        const capLines = doc.splitTextToSize(cap, slot.w - 6);
        doc.text(capLines[0] || '', slot.x + slot.w / 2, slot.y + slot.h - 6, { align: 'center' });
      });
    }
  }

  onProgress?.(98, 'Finalizing PDF document...');
  const pdfBlob = doc.output('blob');
  onProgress?.(100, 'Hardcover photo book ready!');
  return pdfBlob;
}

/**
 * Generates a Standalone, Self-Contained Interactive Photo Album HTML file.
 * Opens offline in ANY browser with full hardcover styling, page turning,
 * photo corners, captions, paper sound, and full-screen slideshow mode.
 */
export async function generateStandaloneAlbumHtml(
  meta: AlbumMetadata,
  photos: AlbumPhoto[],
  pages: AlbumPage[],
  onProgress?: (pct: number, status: string) => void
): Promise<string> {
  onProgress?.(10, 'Encoding photographs for offline standalone album...');

  const photosWithData: {
    id: string;
    name: string;
    dataUrl: string;
    caption: string;
    date?: string;
    location?: string;
  }[] = [];

  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    const dataUrl = await photoToDataUrl(p);
    photosWithData.push({
      id: p.id,
      name: p.name,
      dataUrl,
      caption: p.caption,
      date: p.date,
      location: p.location,
    });
    const pct = Math.round(10 + ((i + 1) / Math.max(1, photos.length)) * 50);
    onProgress?.(pct, `Bundled photo ${i + 1} of ${photos.length}...`);
  }

  onProgress?.(65, 'Building self-contained album structure & offline engine...');

  const theme = MATERIAL_THEMES[meta.coverMaterial] || MATERIAL_THEMES['burgundy-leather'];
  const paperToneKey = meta.paperTone || 'warm-cream';
  const paperTheme = PAPER_TONE_THEMES[paperToneKey] || PAPER_TONE_THEMES['warm-cream'];

  const albumPayload = JSON.stringify({
    meta,
    photos: photosWithData,
    pages,
    theme,
    paperTheme,
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(meta.title)} — Picmorable Traditional Photo Album</title>
  <style>
    :root {
      --bg-desk: #171513;
      --cover-bg: ${theme.bgHex};
      --cover-dark: ${theme.darkHex};
      --cover-spine: ${theme.spineHex};
      --cover-text: ${theme.textHex};
      --foil-gold: ${theme.goldHex};
      --parchment: ${paperTheme.bgHex};
      --parchment-border: ${paperTheme.borderHex};
      --parchment-card: ${paperTheme.cardBgHex};
      --parchment-text: ${paperTheme.textHex};
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", serif;
      background: var(--bg-desk);
      color: #eae5dc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      user-select: none;
      overflow-x: hidden;
    }
    header {
      background: rgba(18, 16, 14, 0.95);
      border-bottom: 1px solid #332d27;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(8px);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .badge {
      font-size: 11px;
      background: #1b3824;
      color: #6ee7b7;
      border: 1px solid #059669;
      padding: 3px 8px;
      border-radius: 999px;
    }
    .btn {
      background: #2b2621;
      border: 1px solid #483f36;
      color: #e5dfd5;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn:hover { background: #3d362e; border-color: #63574a; color: #fff; }
    .btn-gold {
      background: var(--foil-gold);
      color: #1a1409;
      font-weight: 600;
      border-color: #bfa04a;
    }
    .btn-gold:hover { background: #ebd58b; }
    main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }
    .desk-mat {
      max-width: 1020px;
      width: 100%;
      background: #1f1b17;
      border: 1px solid #2f2a24;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 30px 60px rgba(0,0,0,0.7);
    }
    .cover-view {
      border: 4px solid var(--cover-dark);
      border-radius: 4px 16px 16px 4px;
      background: var(--cover-bg);
      color: var(--cover-text);
      min-height: 520px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 48px;
      position: relative;
      cursor: pointer;
      box-shadow: inset 0 0 100px rgba(0,0,0,0.65), 0 20px 40px rgba(0,0,0,0.8);
      text-align: center;
    }
    .cover-spine {
      position: absolute;
      top: 0; bottom: 0; left: 0;
      width: 32px;
      background: linear-gradient(to right, var(--cover-spine), transparent);
      border-right: 1px solid rgba(255,255,255,0.1);
    }
    .cover-border {
      position: absolute;
      inset: 16px;
      border: 2px solid var(--foil-gold);
      border-radius: 0 12px 12px 0;
      pointer-events: none;
      opacity: 0.8;
    }
    .cover-title {
      font-family: "Times New Roman", Times, Georgia, serif;
      font-size: 42px;
      font-weight: bold;
      letter-spacing: 2px;
      color: var(--foil-gold);
      text-shadow: 0 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(223, 190, 104, 0.4);
      margin: 20px 0;
    }
    .cover-subtitle {
      font-family: Georgia, serif;
      font-style: italic;
      font-size: 16px;
      color: var(--foil-gold);
      opacity: 0.9;
      max-width: 500px;
      margin: 0 auto;
    }
    .spread-container {
      background: var(--cover-bg);
      border: 3px solid var(--cover-dark);
      border-radius: 8px;
      padding: 12px;
      box-shadow: inset 0 0 50px rgba(0,0,0,0.6);
    }
    .spread-book {
      display: grid;
      grid-template-columns: 1fr 1fr;
      min-height: 580px;
      background: var(--parchment);
      color: #2b241c;
      border: 1px solid var(--parchment-border);
      position: relative;
      box-shadow: 0 15px 35px rgba(0,0,0,0.5);
    }
    .gutter {
      position: absolute;
      top: 0; bottom: 0; left: 50%;
      width: 36px;
      transform: translateX(-50%);
      background: linear-gradient(to right, rgba(0,0,0,0.06), rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.06));
      pointer-events: none;
      z-index: 10;
    }
    .page {
      padding: 28px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }
    .page-left { border-right: 1px solid #dcd4c0; }
    .photo-mount {
      background: #ffffff;
      border: 1px solid #d4cbb8;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      padding: 8px;
      position: relative;
      margin: 8px auto;
      text-align: center;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .photo-mount:hover { transform: scale(1.02); }
    .photo-mount img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .corner {
      position: absolute;
      width: 14px;
      height: 14px;
      border-color: #222;
      border-style: solid;
      pointer-events: none;
    }
    .corner-tl { top: -4px; left: -4px; border-width: 3px 0 0 3px; }
    .corner-tr { top: -4px; right: -4px; border-width: 3px 3px 0 0; }
    .corner-bl { bottom: -4px; left: -4px; border-width: 0 0 3px 3px; }
    .corner-br { bottom: -4px; right: -4px; border-width: 0 3px 3px 0; }
    .caption {
      font-family: Georgia, serif;
      font-style: italic;
      font-size: 13px;
      color: #382e22;
      margin-top: 6px;
      line-height: 1.3;
    }
    .slideshow-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.96);
      z-index: 100;
      display: none;
      flex-direction: column;
      justify-content: space-between;
    }
    .slideshow-img {
      max-width: 90vw;
      max-height: 75vh;
      object-fit: contain;
      margin: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.9);
      border: 4px solid #fff;
    }
    @media (max-width: 768px) {
      .spread-book { grid-template-columns: 1fr; }
      .gutter { display: none; }
      .page-left { border-right: none; border-bottom: 1px solid #dcd4c0; }
      .cover-title { font-size: 28px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <strong style="color:var(--foil-gold); font-family:serif; font-size:16px;">Picmorable Album</strong>
      <span class="badge">Offline Standalone Edition</span>
    </div>
    <div style="display:flex; gap:8px;">
      <button class="btn" onclick="toggleCover()">Cover</button>
      <button class="btn" onclick="prevSpread()">&#8592; Prev</button>
      <span id="pageIndicator" style="font-size:12px; padding:6px 8px; color:#aaa;">Cover</span>
      <button class="btn" onclick="nextSpread()">Next &#8594;</button>
      <button class="btn btn-gold" onclick="openSlideshow(0)">Play Slideshow</button>
    </div>
  </header>

  <main>
    <div class="desk-mat">
      <!-- COVER -->
      <div id="coverContainer" class="cover-view" onclick="openAlbum()">
        <div class="cover-spine"></div>
        <div class="cover-border"></div>
        <div>
          <div style="font-size:11px; letter-spacing:3px; text-transform:uppercase; color:var(--foil-gold);">
            * ${escapeHtml(meta.curator || 'Family Archival Collection')} *
          </div>
          <div style="font-style:italic; font-size:12px; margin-top:4px; color:var(--foil-gold);">${escapeHtml(meta.dateRange || '')}</div>
        </div>
        <div>
          <h1 class="cover-title">${escapeHtml(meta.title)}</h1>
          <p class="cover-subtitle">${escapeHtml(meta.subtitle || '')}</p>
        </div>
        <div>
          <button class="btn btn-gold" style="padding:10px 24px; font-size:14px;">Open Photo Album</button>
          <div style="font-size:11px; color:#999; margin-top:8px;">Click to turn pages or press right arrow</div>
        </div>
      </div>

      <!-- SPREADS -->
      <div id="spreadContainer" class="spread-container" style="display:none;">
        <div class="spread-book">
          <div class="gutter"></div>
          <div id="leftPage" class="page page-left"></div>
          <div id="rightPage" class="page"></div>
        </div>
      </div>
    </div>
  </main>

  <!-- FULLSCREEN SLIDESHOW OVERLAY -->
  <div id="slideshowOverlay" class="slideshow-overlay">
    <div style="padding:16px 24px; display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.6);">
      <div style="color:var(--foil-gold); font-family:serif; font-size:15px;" id="slideshowTitle">Picmorable Slideshow</div>
      <div style="display:flex; gap:10px; align-items:center;">
        <span id="slideshowCounter" style="font-size:12px; color:#888;"></span>
        <button class="btn" onclick="togglePlaySlideshow()" id="slideshowPlayBtn">Pause</button>
        <button class="btn" onclick="closeSlideshow()">Close &#10005;</button>
      </div>
    </div>
    <div style="flex:1; display:flex; align-items:center; justify-content:center; position:relative; padding:10px;">
      <button class="btn" onclick="prevSlide()" style="position:absolute; left:20px; font-size:24px; padding:10px 16px; z-index:10;">&#8592;</button>
      <img id="slideshowImg" class="slideshow-img" src="" alt="" />
      <button class="btn" onclick="nextSlide()" style="position:absolute; right:20px; font-size:24px; padding:10px 16px; z-index:10;">&#8594;</button>
    </div>
    <div style="padding:16px 24px; text-align:center; background:rgba(0,0,0,0.6);">
      <div id="slideshowCaption" style="font-family:Georgia, serif; font-style:italic; font-size:16px; color:#fff;"></div>
      <div id="slideshowSub" style="font-size:12px; color:#888; margin-top:4px;"></div>
    </div>
  </div>

  <script>
    const ALBUM = ${albumPayload};
    let currentSpread = 0; // 0 = Cover
    let currentSlide = 0;
    let isPlaying = true;
    let slideTimer = null;

    // Synthesize subtle paper-rustle sound via Web Audio API
    function playPaperTurn() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const bufferSize = ctx.sampleRate * 0.12;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.03));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1400;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } catch (e) {}
    }

    function openAlbum() {
      currentSpread = 1;
      playPaperTurn();
      renderSpread();
    }

    function toggleCover() {
      currentSpread = 0;
      playPaperTurn();
      renderSpread();
    }

    function nextSpread() {
      const maxSpreads = Math.ceil(ALBUM.pages.length / 2);
      if (currentSpread < maxSpreads) {
        currentSpread++;
        playPaperTurn();
        renderSpread();
      }
    }

    function prevSpread() {
      if (currentSpread > 0) {
        currentSpread--;
        playPaperTurn();
        renderSpread();
      }
    }

    function renderSpread() {
      const coverEl = document.getElementById('coverContainer');
      const spreadEl = document.getElementById('spreadContainer');
      const ind = document.getElementById('pageIndicator');

      if (currentSpread === 0) {
        coverEl.style.display = 'flex';
        spreadEl.style.display = 'none';
        ind.textContent = 'Cover';
        return;
      }

      coverEl.style.display = 'none';
      spreadEl.style.display = 'block';

      const leftIdx = (currentSpread - 1) * 2;
      const rightIdx = leftIdx + 1;
      const leftPage = ALBUM.pages[leftIdx];
      const rightPage = ALBUM.pages[rightIdx];

      ind.textContent = 'Spread ' + currentSpread + ' / ' + Math.ceil(ALBUM.pages.length / 2);

      renderSinglePage(document.getElementById('leftPage'), leftPage, true);
      renderSinglePage(document.getElementById('rightPage'), rightPage, false);
    }

    function renderSinglePage(el, page, isLeft) {
      if (!page) {
        el.innerHTML = '<div style="margin:auto; text-align:center; font-style:italic; color:#888;">Blank Page</div>';
        return;
      }

      const pPhotos = page.photoIds.map(id => ALBUM.photos.find(p => p.id === id)).filter(Boolean);

      let content = '<div style="font-size:10px; font-family:monospace; color:#888; border-bottom:1px solid #ddd; padding-bottom:4px; margin-bottom:12px;">PAGE ' + page.pageNumber + ' &middot; ' + (page.customTitle || 'ARCHIVAL PLATE') + '</div>';

      if (page.templateId === 'frontispiece') {
        content += '<div style="background:#f3ede0; border:1px solid #d4cbb8; padding:12px; margin-bottom:12px; font-style:italic; font-size:12px; line-height:1.4;">' + (ALBUM.meta.description || 'Archival Narrative Record') + '</div>';
      }

      pPhotos.forEach((photo, pIdx) => {
        const photoGlobalIdx = ALBUM.photos.findIndex(p => p.id === photo.id);
        content += '<div class="photo-mount" onclick="openSlideshow(' + photoGlobalIdx + ')">';
        content += '<div class="corner corner-tl"></div><div class="corner corner-tr"></div>';
        content += '<div class="corner corner-bl"></div><div class="corner corner-br"></div>';
        content += '<img src="' + photo.dataUrl + '" alt="' + (photo.caption || '') + '" style="max-height:220px;" />';
        content += '<div class="caption">"' + (photo.caption || photo.name) + '"</div>';
        if (photo.date || photo.location) {
          content += '<div style="font-size:10px; color:#777; margin-top:2px;">' + (photo.date || '') + ' ' + (photo.location || '') + '</div>';
        }
        content += '</div>';
      });

      content += '<div style="font-size:10px; color:#999; text-align:center; margin-top:auto; padding-top:12px; border-top:1px solid #ddd;">PLATE ' + page.pageNumber + '</div>';
      el.innerHTML = content;
    }

    // Slideshow functions
    function openSlideshow(startIdx) {
      currentSlide = startIdx || 0;
      document.getElementById('slideshowOverlay').style.display = 'flex';
      renderSlide();
      startSlideTimer();
    }

    function closeSlideshow() {
      document.getElementById('slideshowOverlay').style.display = 'none';
      clearInterval(slideTimer);
    }

    function renderSlide() {
      const p = ALBUM.photos[currentSlide];
      if (!p) return;
      document.getElementById('slideshowImg').src = p.dataUrl;
      document.getElementById('slideshowCaption').textContent = p.caption ? '"' + p.caption + '"' : p.name;
      document.getElementById('slideshowSub').textContent = [p.date, p.location].filter(Boolean).join('  *  ');
      document.getElementById('slideshowCounter').textContent = 'Photo ' + (currentSlide + 1) + ' of ' + ALBUM.photos.length;
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % ALBUM.photos.length;
      renderSlide();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + ALBUM.photos.length) % ALBUM.photos.length;
      renderSlide();
    }

    function startSlideTimer() {
      clearInterval(slideTimer);
      if (isPlaying) {
        slideTimer = setInterval(nextSlide, 5000);
      }
    }

    function togglePlaySlideshow() {
      isPlaying = !isPlaying;
      document.getElementById('slideshowPlayBtn').textContent = isPlaying ? 'Pause' : 'Play';
      if (isPlaying) startSlideTimer();
      else clearInterval(slideTimer);
    }

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      const isSlideshow = document.getElementById('slideshowOverlay').style.display === 'flex';
      if (isSlideshow) {
        if (e.key === 'Escape') closeSlideshow();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === ' ') { e.preventDefault(); togglePlaySlideshow(); }
      } else {
        if (e.key === 'ArrowRight') nextSpread();
        if (e.key === 'ArrowLeft') prevSpread();
        if (e.key === 'Home') toggleCover();
      }
    });

    renderSpread();
  </script>
</body>
</html>`;

  onProgress?.(100, 'Standalone interactive album complete!');
  return html;
}

/**
 * Packages an All-in-One Archival Bundle:
 * - Standalone Offline Interactive Album (.html)
 * - Archival Hardcover Photo Book PDF (.pdf)
 * - Archival Text Transcript (.txt)
 * - High-res Photographs folder
 */
export async function exportCompleteAlbumPackage(
  meta: AlbumMetadata,
  photos: AlbumPhoto[],
  pages: AlbumPage[],
  onProgress?: (pct: number, status: string) => void
): Promise<void> {
  const zip = new JSZip();
  const sanitizedTitle = meta.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);

  // 1. Generate Hardcover PDF
  onProgress?.(10, 'Compiling Archival Hardcover Book PDF...');
  const pdfBlob = await generateAlbumPdf(meta, photos, pages, (p, s) => {
    onProgress?.(Math.round(10 + (p / 100) * 35), s);
  });
  zip.file(`${sanitizedTitle}_hardcover_photo_book.pdf`, pdfBlob);

  // 2. Generate Standalone Offline HTML Album
  onProgress?.(50, 'Building Offline Interactive Album HTML...');
  const standaloneHtml = await generateStandaloneAlbumHtml(meta, photos, pages, (p, s) => {
    onProgress?.(Math.round(50 + (p / 100) * 30), s);
  });
  zip.file(`${sanitizedTitle}_interactive_album.html`, standaloneHtml);

  // 3. Transcript
  onProgress?.(85, 'Writing Archival Transcript...');
  const transcript = generateAlbumTranscript(meta, photos, pages);
  zip.file('ALBUM_TRANSCRIPT_AND_CAPTIONS.txt', transcript);

  // 4. Photos folder
  const photosFolder = zip.folder('photos');
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i];
    try {
      if (p.blob) {
        photosFolder?.file(`photo_${String(i + 1).padStart(2, '0')}_${p.name}`, p.blob);
      } else {
        const res = await fetch(p.url);
        const blob = await res.blob();
        photosFolder?.file(`photo_${String(i + 1).padStart(2, '0')}_${p.name}`, blob);
      }
    } catch (err) {
      console.warn('Could not bundle photo blob', err);
    }
  }

  onProgress?.(95, 'Compressing complete archival package...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  onProgress?.(100, 'Archive bundle ready!');
  downloadBlob(zipBlob, `picmorable_${sanitizedTitle}_complete_album.zip`);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
