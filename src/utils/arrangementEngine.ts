/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlbumPhoto, AlbumPage, AlbumSpread, PageTemplateId } from '../types/album';

/**
 * Intelligent layout organizer that turns a flat array of photos into traditional album pages.
 */
export function autoArrangePhotosIntoPages(
  photos: AlbumPhoto[],
  strategy: 'balanced' | 'chronological' | 'single-hero' | 'scrapbook' = 'balanced'
): AlbumPage[] {
  if (photos.length === 0) {
    return [
      {
        pageNumber: 1,
        templateId: 'frontispiece',
        photoIds: [],
        customTitle: 'Introduction',
      },
    ];
  }

  const pages: AlbumPage[] = [];
  let photoQueue = [...photos];

  // Strategy adjustments
  if (strategy === 'chronological') {
    photoQueue.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });
  }

  // Page 1 is always the Frontispiece / Title Page
  const firstPhoto = photoQueue.shift();
  pages.push({
    pageNumber: 1,
    templateId: 'frontispiece',
    photoIds: firstPhoto ? [firstPhoto.id] : [],
    customTitle: 'The Opening Notes',
  });

  let pageNum = 2;

  if (strategy === 'single-hero') {
    // 1 photo per page
    while (photoQueue.length > 0) {
      const p = photoQueue.shift()!;
      pages.push({
        pageNumber: pageNum++,
        templateId: 'hero-single',
        photoIds: [p.id],
        customTitle: `Plate ${pageNum - 1}`,
      });
    }
    return pages;
  }

  // Balanced intelligent grouping
  while (photoQueue.length > 0) {
    // Look ahead at next candidates
    const p1 = photoQueue[0];
    const p2 = photoQueue[1];
    const p3 = photoQueue[2];
    const p4 = photoQueue[3];

    // Case 1: 4 or more photos available and scrapbook strategy or cluster
    if (strategy === 'scrapbook' && photoQueue.length >= 4) {
      const selected = photoQueue.splice(0, 4);
      pages.push({
        pageNumber: pageNum++,
        templateId: 'quad-scrapbook',
        photoIds: selected.map(p => p.id),
        customTitle: 'Memory Vignettes',
      });
      continue;
    }

    // Case 2: Two consecutive portrait photos -> Pair into twin portrait
    if (p1 && p2 && p1.aspectRatio === 'portrait' && p2.aspectRatio === 'portrait') {
      photoQueue.splice(0, 2);
      pages.push({
        pageNumber: pageNum++,
        templateId: 'twin-portrait',
        photoIds: [p1.id, p2.id],
        customTitle: 'Portraits & Studies',
      });
      continue;
    }

    // Case 3: 3 photos available -> Trio story layout
    if (photoQueue.length >= 3) {
      const selected = photoQueue.splice(0, 3);
      pages.push({
        pageNumber: pageNum++,
        templateId: 'story-trio',
        photoIds: selected.map(p => p.id),
        customTitle: 'Scenes & Moments',
      });
      continue;
    }

    // Case 4: 2 landscape photos available -> Duo landscape layout
    if (photoQueue.length >= 2 && p1.aspectRatio === 'landscape' && p2.aspectRatio === 'landscape') {
      const selected = photoQueue.splice(0, 2);
      pages.push({
        pageNumber: pageNum++,
        templateId: 'duo-landscape',
        photoIds: selected.map(p => p.id),
        customTitle: 'Horizons & Views',
      });
      continue;
    }

    // Case 5: 2 photos left of any orientation -> Twin portrait or duo landscape
    if (photoQueue.length === 2) {
      const selected = photoQueue.splice(0, 2);
      const isLandscape = selected.some(p => p.aspectRatio === 'landscape');
      pages.push({
        pageNumber: pageNum++,
        templateId: isLandscape ? 'duo-landscape' : 'twin-portrait',
        photoIds: selected.map(p => p.id),
        customTitle: 'Gathered Memories',
      });
      continue;
    }

    // Case 6: Single photo left -> Hero single plate
    const single = photoQueue.shift()!;
    pages.push({
      pageNumber: pageNum++,
      templateId: 'hero-single',
      photoIds: [single.id],
      customTitle: single.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
    });
  }

  return pages;
}

/**
 * Converts album pages into physical two-page book spreads.
 * Spread 0: Front Cover (Exterior)
 * Spread 1: Page 1 (Frontispiece on right, inside cover on left)
 * Spread 2: Page 2 (Left) & Page 3 (Right)
 * Spread 3: Page 4 (Left) & Page 5 (Right)...
 */
export function buildAlbumSpreads(pages: AlbumPage[]): AlbumSpread[] {
  const spreads: AlbumSpread[] = [];

  // Spread 0: Cover
  spreads.push({
    spreadIndex: 0,
    leftPage: null,
    rightPage: null,
  });

  if (pages.length === 0) return spreads;

  // Spread 1: Left is inner cover (null), Right is Page 1 (Frontispiece)
  spreads.push({
    spreadIndex: 1,
    leftPage: null,
    rightPage: pages[0] || null,
  });

  // Subsequent spreads: 2 pages per spread
  let pIdx = 1;
  let spreadNum = 2;
  while (pIdx < pages.length) {
    const left = pages[pIdx] || null;
    const right = pages[pIdx + 1] || null;
    spreads.push({
      spreadIndex: spreadNum++,
      leftPage: left,
      rightPage: right,
    });
    pIdx += 2;
  }

  return spreads;
}

/**
 * Return max slots needed for a template
 */
export function getTemplateSlotCount(templateId: PageTemplateId): number {
  switch (templateId) {
    case 'frontispiece':
      return 1;
    case 'hero-single':
    case 'full-bleed':
      return 1;
    case 'twin-portrait':
    case 'duo-landscape':
      return 2;
    case 'story-trio':
      return 3;
    case 'quad-scrapbook':
      return 4;
    default:
      return 1;
  }
}

/**
 * Synthesizes a delicate, vintage paper page turn sound using the Web Audio API.
 * 100% on-device, zero external audio assets required.
 */
export function playPageTurnSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const bufferSize = ctx.sampleRate * 0.15; // 150ms gentle rustle
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // White noise with pink noise envelope
      const decay = Math.exp(-i / (bufferSize * 0.4));
      data[i] = (Math.random() * 2 - 1) * decay * 0.12;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter to sound like soft paper rubbing
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.15);
  } catch {
    // Graceful fallback if user hasn't interacted or audio is locked
  }
}
