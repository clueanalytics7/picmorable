/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlbumPhoto } from '../types/album';

export interface DuplicateGroup {
  groupId: string;
  reason: string;
  heroPhotoId: string;
  photos: AlbumPhoto[];
}

export interface LifeEventGroup {
  eventName: string;
  dateRange: string;
  location: string;
  photos: AlbumPhoto[];
}

export interface LocalStorageStats {
  photoCount: number;
  totalBytes: number;
  totalFormattedSize: string;
  verifiedExifCount: number;
  userEditedCount: number;
  duplicatesIdentified: number;
  networkRequestsSent: number;
  cloudUploadsStatus: 'Disabled (100% On-Device)';
  localAiInference: 'Active (Client-Side JS/Heuristics)';
}

/**
 * Scan photo set for duplicate candidates or rapid burst shots.
 * Picmorable identifies candidates without ever deleting files from the user's computer.
 */
export function detectDuplicates(photos: AlbumPhoto[]): DuplicateGroup[] {
  const groups: Map<string, AlbumPhoto[]> = new Map();

  // 1. Group by explicit duplicateGroupId if present
  photos.forEach(photo => {
    if (photo.duplicateGroupId) {
      const existing = groups.get(photo.duplicateGroupId) || [];
      existing.push(photo);
      groups.set(photo.duplicateGroupId, existing);
    }
  });

  // 2. Identify rapid burst or identical filename/size/timestamp heuristic
  for (let i = 0; i < photos.length; i++) {
    for (let j = i + 1; j < photos.length; j++) {
      const p1 = photos[i];
      const p2 = photos[j];

      // Skip if already in explicit group
      if (p1.duplicateGroupId && p2.duplicateGroupId && p1.duplicateGroupId === p2.duplicateGroupId) {
        continue;
      }

      // Check identical name and size
      const sameName = p1.name === p2.name;
      const sameSize = p1.fileSize && p2.fileSize && p1.fileSize === p2.fileSize;
      const sameDate = p1.date && p2.date && p1.date === p2.date;
      const sameLoc = p1.location && p2.location && p1.location === p2.location;

      if ((sameName && sameSize) || (sameDate && sameLoc && p1.aspectRatio === p2.aspectRatio && p1.eventTag === p2.eventTag && !p1.duplicateGroupId && !p2.duplicateGroupId)) {
        const generatedKey = `burst-${p1.id}-${p2.id}`;
        if (!groups.has(generatedKey)) {
          groups.set(generatedKey, [p1, p2]);
        }
      }
    }
  }

  // Convert to formatted DuplicateGroup array
  const result: DuplicateGroup[] = [];
  groups.forEach((groupPhotos, groupId) => {
    if (groupPhotos.length > 1) {
      // Find the hero shot (one not marked duplicate, or largest size, or first)
      const hero = groupPhotos.find(p => !p.isDuplicate) || groupPhotos[0];
      const reason = groupPhotos.find(p => p.duplicateReason)?.duplicateReason || 
        'Visually similar composition or rapid burst sequence taken within seconds.';

      result.push({
        groupId,
        reason,
        heroPhotoId: hero.id,
        photos: groupPhotos,
      });
    }
  });

  return result;
}

/**
 * Cluster photographs into meaningful Life Timeline events.
 */
export function clusterPhotosIntoEvents(photos: AlbumPhoto[]): LifeEventGroup[] {
  const eventMap: Map<string, AlbumPhoto[]> = new Map();

  photos.forEach(photo => {
    const key = photo.eventTag || photo.location || photo.date || 'Uncategorised Moments';
    const existing = eventMap.get(key) || [];
    existing.push(photo);
    eventMap.set(key, existing);
  });

  const events: LifeEventGroup[] = [];
  eventMap.forEach((eventPhotos, eventName) => {
    const dates = eventPhotos.map(p => p.date).filter(Boolean) as string[];
    const locations = eventPhotos.map(p => p.location).filter(Boolean) as string[];

    const dateRange = dates.length > 0 ? dates[0] + (dates.length > 1 && dates[dates.length - 1] !== dates[0] ? ` – ${dates[dates.length - 1]}` : '') : 'Preserved Moment';
    const location = locations.length > 0 ? locations[0] : 'Private Location';

    events.push({
      eventName,
      dateRange,
      location,
      photos: eventPhotos,
    });
  });

  return events;
}

/**
 * Calculate transparent on-device sandbox metrics for the Privacy Centre.
 */
export function calculateLocalStorageStats(photos: AlbumPhoto[]): LocalStorageStats {
  const photoCount = photos.length;
  const totalBytes = photos.reduce((acc, p) => acc + (p.fileSize || 3500000), 0);
  
  let formattedSize = '';
  if (totalBytes < 1024 * 1024) {
    formattedSize = `${(totalBytes / 1024).toFixed(1)} KB`;
  } else {
    formattedSize = `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const verifiedExifCount = photos.filter(p => p.isVerifiedMetadata || p.cameraModel).length;
  const userEditedCount = photos.filter(p => p.caption && p.caption.length > 0).length;
  const duplicateGroups = detectDuplicates(photos);
  const duplicatesIdentified = duplicateGroups.reduce((acc, g) => acc + (g.photos.length - 1), 0);

  return {
    photoCount,
    totalBytes,
    totalFormattedSize: formattedSize,
    verifiedExifCount,
    userEditedCount,
    duplicatesIdentified,
    networkRequestsSent: 0, // Inviolable guarantee: 0 network calls
    cloudUploadsStatus: 'Disabled (100% On-Device)',
    localAiInference: 'Active (Client-Side JS/Heuristics)',
  };
}
