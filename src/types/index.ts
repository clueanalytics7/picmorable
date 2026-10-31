export type CaptionStyle = 'simple' | 'descriptive' | 'memory';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface ExifMetadata {
  dateTaken: string; // ISO or YYYY-MM-DD HH:mm
  cameraMake: string;
  cameraModel: string;
  lens?: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: number;
  latitude?: number;
  longitude?: number;
  locationName: string;
  country: string;
  fileSizeBytes: number;
  originalFileName: string;
  fileHash: string; // MD5/SHA256
  perceptualHash: string;
  sourceDevice: string;
}

export interface AiProvenance {
  verifiedMetadataSummary: string; // From EXIF (fact)
  visualObjects: string[];          // From CV model (visual observation)
  detectedScene: string;           // Environment
  contextualInference: string;     // AI hypothesis
  confidence: number;              // 0 to 1
  modelUsed: string;
  generatedDate: string;
  isUserConfirmed: boolean;
}

export interface PhotoCaptions {
  simple: string;
  descriptive: string;
  memory: string;
  userCustom?: string;
}

export interface PhotoItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  exif: ExifMetadata;
  captions: PhotoCaptions;
  provenance: AiProvenance;
  suggestedAlbumId?: string;
  albumTitle?: string;
  tags: string[];
  isFavorite?: boolean;
  duplicateGroupId?: string;
  isExactDuplicate?: boolean;
  isSimilar?: boolean;
}

export interface AlbumItem {
  id: string;
  title: string;
  subtitle: string;
  coverPhotoUrl: string;
  photoIds: string[];
  type: 'rule_based' | 'ai_event' | 'user_created';
  dateRange: {
    start: string;
    end: string;
  };
  locations: string[];
  aiSummary: string;
  userStory?: string;
  confidence: ConfidenceLevel;
  status: 'suggested' | 'approved' | 'customized';
  themes: string[];
}

export interface DuplicateGroup {
  id: string;
  type: 'exact' | 'similar_burst' | 'resized';
  primaryPhotoId: string;
  duplicatePhotoIds: string[];
  similarityScore: number;
  reason: string;
  resolved: boolean;
  resolution?: 'keep_all' | 'keep_primary' | 'custom';
}

export interface SearchFilter {
  query: string;
  year?: number;
  location?: string;
  category?: string;
  confidence?: ConfidenceLevel;
}

export interface ParsedSearchQuery {
  rawQuery: string;
  visualConcepts: string[];
  locationFilter?: string;
  dateRange?: {
    from?: string;
    to?: string;
    year?: number;
  };
  eventType?: string;
}

export interface TimelineYearData {
  year: number;
  photoCount: number;
  topLocations: string[];
  highlightEvents: string[];
  coverPhotoUrl: string;
  monthsActive: number;
}
