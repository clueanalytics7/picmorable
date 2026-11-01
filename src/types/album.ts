/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PageTemplateId = 
  | 'frontispiece'      // Title page with large album narrative & introduction photo
  | 'hero-single'       // 1 dominant landscape/portrait with centered archival caption
  | 'twin-portrait'     // 2 vertical portraits side-by-side with individual captions
  | 'story-trio'        // 1 prominent photo paired with 2 smaller square/detail snapshots
  | 'quad-scrapbook'    // 4 snapshot-size photos arranged with vintage photo corners
  | 'duo-landscape'     // 2 horizontal landscape photos stacked top and bottom
  | 'full-bleed';       // 1 grand full-page bleed photograph

export type CoverMaterial = 
  | 'burgundy-leather' 
  | 'forest-linen' 
  | 'navy-buckram' 
  | 'sandstone-cloth' 
  | 'espresso-calfskin';

export type FoilStyle = 
  | 'gold' 
  | 'silver' 
  | 'rose-copper' 
  | 'blind-embossed';

export type CornerStyle = 
  | 'black-classic' 
  | 'gold-brass' 
  | 'ivory-cloth' 
  | 'white-border';

export type ScriptStyle = 
  | 'serif-editorial'      // Classic Typeset Editorial Serif
  | 'fountain-pen'        // Flowing Ink Calligraphy / Cursive
  | 'vintage-typewriter'   // 1920s Mechanical Archival Typewriter
  | 'architect-hand';      // Clean Understated Architectural Hand

export type EmbellishmentStyle = 
  | 'none'
  | 'wax-seal'
  | 'botanical-branch'
  | 'postal-date-stamp'
  | 'antique-compass';

export interface PhotoPrintQuality {
  photoId: string;
  photoName: string;
  estimatedDpi: number;
  status: 'optimal' | 'acceptable' | 'warning';
  recommendation: string;
  dimensions: string;
}

export interface PrintPreFlightReport {
  score: number; // 0 - 100
  grade: 'A+ Fine Art Print Ready' | 'A High Quality' | 'B Good' | 'C Needs Review';
  totalPhotos: number;
  photosOptimal: number;
  photosAcceptable: number;
  photosWarning: number;
  pageCount: number;
  isSignatureCompliant: boolean; // multiple of 4
  pagesNeededForSignature: number;
  gutterRiskPhotos: number;
  items: PhotoPrintQuality[];
}

export type PaperTone = 
  | 'warm-cream'        // Classic warm cream parchment
  | 'aged-sepia'        // Aged vellum with warm amber patina
  | 'cotton-rag'        // Fine art cotton rag off-white
  | 'gallery-lustre';   // Crisp archival studio white

export interface AlbumPhoto {
  id: string;
  name: string;
  url: string;
  blob?: Blob;
  caption: string;
  date?: string;
  location?: string;
  width?: number;
  height?: number;
  aspectRatio: 'landscape' | 'portrait' | 'square';
  rotation?: number; // subtle angle (-1.5 to 1.5 deg) for vintage scrapbook feel
  fileSize?: number; // in bytes
  cameraModel?: string; // e.g. "Canon EOS 5D Mark IV" or "iPhone 15 Pro"
  isVerifiedMetadata?: boolean; // true if extracted from authentic camera EXIF
  isDuplicate?: boolean; // flagged by local duplicate detection engine
  duplicateGroupId?: string;
  duplicateReason?: string;
  eventTag?: string; // e.g. "Pacific Coast Highway", "Summer in the Cotswolds"
  voiceNoteUrl?: string; // local blob URL for 15-30s voice recollection
  voiceDuration?: number; // duration in seconds
}

export interface AlbumPage {
  pageNumber: number; // 1-indexed
  templateId: PageTemplateId;
  photoIds: string[];
  customTitle?: string;
  notes?: string;
  embellishment?: EmbellishmentStyle;
}

export interface AlbumSpread {
  spreadIndex: number; // 0 = Cover, 1 = Pages 1-2, 2 = Pages 3-4, etc.
  leftPage: AlbumPage | null; // null for front cover inside or single-page view
  rightPage: AlbumPage | null;
}

export interface AlbumMetadata {
  id: string;
  title: string;
  subtitle: string;
  description: string; // The user's brief/extended description of the entire album
  curator: string;
  dateRange: string;
  coverMaterial: CoverMaterial;
  foilStyle: FoilStyle;
  cornerStyle: CornerStyle;
  scriptStyle: ScriptStyle;
  embellishment: EmbellishmentStyle;
  paperTone: PaperTone;
  createdAt: string;
}


