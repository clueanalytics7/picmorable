/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlbumPage, AlbumPhoto, PhotoPrintQuality, PrintPreFlightReport } from '../types/album';

/**
 * Estimate physical printed dimension and DPI for a photo given its page template.
 * Standard fine-art photo albums are typically 10" x 10" or 8.5" x 11" per page.
 */
export function evaluatePhotoPrintQuality(photo: AlbumPhoto, templateId?: string): PhotoPrintQuality {
  // Approximate physical width in inches on an 8.5"x10" physical page based on layout slot
  let targetWidthInches = 5.5; // default mid-size photo mount
  if (templateId === 'hero-single' || templateId === 'full-bleed') {
    targetWidthInches = 8.0;
  } else if (templateId === 'twin-portrait' || templateId === 'duo-landscape') {
    targetWidthInches = 6.0;
  } else if (templateId === 'story-trio') {
    targetWidthInches = 4.5;
  } else if (templateId === 'quad-scrapbook') {
    targetWidthInches = 3.6;
  }

  // Determine estimated pixel width
  let pixelWidth = photo.width || 0;
  if (!pixelWidth) {
    // If not directly recorded, estimate from fileSize or standard camera/sample heuristics
    if (photo.fileSize) {
      if (photo.fileSize > 3500000) pixelWidth = 3840; // 4K / full camera RAW
      else if (photo.fileSize > 1800000) pixelWidth = 2400; // standard 5MP-12MP
      else if (photo.fileSize > 800000) pixelWidth = 1600;
      else pixelWidth = 1200;
    } else {
      // Sample pack or web buffer
      pixelWidth = photo.aspectRatio === 'portrait' ? 1200 : 1600;
    }
  }

  const estimatedDpi = Math.round(pixelWidth / targetWidthInches);

  let status: 'optimal' | 'acceptable' | 'warning' = 'optimal';
  let recommendation = 'Crisp fine-art output. Exceeds standard 300 DPI book printing threshold.';

  if (estimatedDpi >= 280) {
    status = 'optimal';
    recommendation = `Optimal print resolution (~${estimatedDpi} DPI). Exceeds fine-art press requirements for smooth tones and fine details.`;
  } else if (estimatedDpi >= 200) {
    status = 'acceptable';
    recommendation = `Good commercial quality (~${estimatedDpi} DPI). Suitable for standard hardcover print-on-demand books.`;
  } else {
    status = 'warning';
    recommendation = `Lower resolution (~${estimatedDpi} DPI). For best physical results, consider a smaller multi-photo grid layout.`;
  }

  const dimensions = `${pixelWidth}px (${targetWidthInches.toFixed(1)}" wide on page)`;

  return {
    photoId: photo.id,
    photoName: photo.name,
    estimatedDpi,
    status,
    recommendation,
    dimensions,
  };
}

/**
 * Generate a comprehensive Pre-Flight Print Inspection Report
 */
export function generatePrintPreFlightReport(pages: AlbumPage[], photos: AlbumPhoto[]): PrintPreFlightReport {
  const photoMap = new Map<string, AlbumPhoto>();
  photos.forEach(p => photoMap.set(p.id, p));

  const items: PhotoPrintQuality[] = [];
  let gutterRiskPhotos = 0;

  pages.forEach(page => {
    page.photoIds.forEach(id => {
      const photo = photoMap.get(id);
      if (photo) {
        const quality = evaluatePhotoPrintQuality(photo, page.templateId);
        items.push(quality);

        if (page.templateId === 'full-bleed' || (page.templateId === 'duo-landscape' && photo.aspectRatio === 'landscape')) {
          gutterRiskPhotos++;
        }
      }
    });
  });

  const totalPhotos = items.length;
  const photosOptimal = items.filter(i => i.status === 'optimal').length;
  const photosAcceptable = items.filter(i => i.status === 'acceptable').length;
  const photosWarning = items.filter(i => i.status === 'warning').length;

  // Bookbinding signatures are typically multiples of 4 (a 4-page folded sheet / folio)
  const pageCount = pages.length;
  const remainder = pageCount % 4;
  const isSignatureCompliant = remainder === 0;
  const pagesNeededForSignature = remainder === 0 ? 0 : 4 - remainder;

  // Calculate score (0-100)
  let score = 95;
  if (totalPhotos > 0) {
    score -= (photosWarning / totalPhotos) * 25;
    score -= (photosAcceptable / totalPhotos) * 5;
  }
  if (!isSignatureCompliant) {
    score -= 5;
  }
  score = Math.max(40, Math.min(100, Math.round(score)));

  let grade: PrintPreFlightReport['grade'] = 'A+ Fine Art Print Ready';
  if (score >= 92) grade = 'A+ Fine Art Print Ready';
  else if (score >= 82) grade = 'A High Quality';
  else if (score >= 70) grade = 'B Good';
  else grade = 'C Needs Review';

  return {
    score,
    grade,
    totalPhotos,
    photosOptimal,
    photosAcceptable,
    photosWarning,
    pageCount,
    isSignatureCompliant,
    pagesNeededForSignature,
    gutterRiskPhotos,
    items,
  };
}

/**
 * Automatically pads the album pages with authentic archival end-sheets
 * so the page count matches traditional 4-page bookbinding signatures.
 */
export function balanceBookbindingSignatures(pages: AlbumPage[]): AlbumPage[] {
  const remainder = pages.length % 4;
  if (remainder === 0) return pages;

  const needed = 4 - remainder;
  const updatedPages = [...pages];

  for (let i = 0; i < needed; i++) {
    const nextNum = updatedPages.length + 1;
    let customTitle = 'Archival Notes & Memories';
    let notes = 'A blank parchment plate reserved for handwritten family inscriptions, dates, and archival notes.';
    if (i === needed - 1) {
      customTitle = 'Colophon & Inscription Plate';
      notes = 'Bound locally on-device with Picmorable. Acid-free archival parchment reproduction.';
    }

    updatedPages.push({
      pageNumber: nextNum,
      templateId: 'frontispiece',
      photoIds: [],
      customTitle,
      notes,
      embellishment: 'botanical-branch',
    });
  }

  return updatedPages;
}
