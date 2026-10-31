/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlbumPhoto } from '../types/album';

/**
 * Clean filename into a pleasant initial title or caption placeholder
 */
function cleanFilenameToTitle(filename: string): string {
  const withoutExt = filename.replace(/\.[^/.]+$/, '');
  const clean = withoutExt
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // Capitalize first letter of words
  return clean.replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Formats a Date object into a readable archival date
 */
function formatArchivalDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Processes an array of local image files 100% on-device in browser memory.
 * No server uploads, no cloud analytics, strictly client-side object URLs.
 */
export async function processLocalFiles(files: File[]): Promise<AlbumPhoto[]> {
  const photos: AlbumPhoto[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) continue;

    const objectUrl = URL.createObjectURL(file);
    const friendlyTitle = cleanFilenameToTitle(file.name);
    const fileDate = file.lastModified ? new Date(file.lastModified) : new Date();

    // Determine dimensions and aspect ratio
    const { width, height, aspectRatio } = await new Promise<{
      width: number;
      height: number;
      aspectRatio: 'landscape' | 'portrait' | 'square';
    }>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 800;
        const h = img.naturalHeight || 600;
        const ratio = w / h;
        let ar: 'landscape' | 'portrait' | 'square' = 'landscape';
        if (ratio < 0.82) ar = 'portrait';
        else if (ratio >= 0.82 && ratio <= 1.22) ar = 'square';
        else ar = 'landscape';
        resolve({ width: w, height: h, aspectRatio: ar });
      };
      img.onerror = () => {
        resolve({ width: 800, height: 600, aspectRatio: 'landscape' });
      };
      img.src = objectUrl;
    });

    // Subtle random tilt between -1.2 and +1.2 degrees for authentic scrapbook feel
    const randomTilt = parseFloat(((Math.random() * 2.4) - 1.2).toFixed(1));

    photos.push({
      id: `local-photo-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      url: objectUrl,
      blob: file,
      caption: '', // Left blank for the user to write their description, or prefilled on click
      date: formatArchivalDate(fileDate),
      location: '',
      width,
      height,
      aspectRatio,
      rotation: randomTilt,
    });
  }

  return photos;
}
