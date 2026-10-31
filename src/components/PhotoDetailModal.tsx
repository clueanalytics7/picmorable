import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Edit3, 
  Save, 
  RotateCcw,
  BookOpen,
  Share2,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react';
import { PhotoItem, CaptionStyle } from '../types';

interface PhotoDetailModalProps {
  photo: PhotoItem | null;
  onClose: () => void;
  onUpdateCaption: (photoId: string, style: CaptionStyle, newText: string) => void;
  onConfirmProvenance: (photoId: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  onOpenBookFromPhoto?: (albumId?: string) => void;
}

export const PhotoDetailModal: React.FC<PhotoDetailModalProps> = ({
  photo,
  onClose,
  onUpdateCaption,
  onConfirmProvenance,
  onNext,
  onPrev,
  onOpenBookFromPhoto,
}) => {
  if (!photo) return null;

  const [selectedStyle, setSelectedStyle] = useState<CaptionStyle>('memory');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [activeTab, setActiveTab] = useState<'provenance' | 'exif' | 'story'>('provenance');

  const currentCaption = photo.captions.userCustom || photo.captions[selectedStyle];

  const handleStartEdit = () => {
    setEditText(currentCaption);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateCaption(photo.id, selectedStyle, editText);
    setIsEditing(false);
  };

  const handleResetToAi = () => {
    onUpdateCaption(photo.id, selectedStyle, '');
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="relative w-full max-w-6xl max-h-[94vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-stone-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-stone-400 hover:text-white bg-stone-950/60 hover:bg-stone-950 rounded-full transition-colors cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Photo Canvas */}
        <div className="relative flex-1 bg-stone-950 flex items-center justify-center min-h-[320px] lg:min-h-[580px] select-none p-4">
          <img
            src={photo.url}
            alt={photo.title}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
            referrerPolicy="no-referrer"
          />

          {/* Navigation Chevrons */}
          {onPrev && (
            <button
              onClick={onPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 text-stone-300 hover:text-white bg-stone-900/70 hover:bg-stone-900 rounded-full transition-all cursor-pointer"
              title="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {onNext && (
            <button
              onClick={onNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 text-stone-300 hover:text-white bg-stone-900/70 hover:bg-stone-900 rounded-full transition-all cursor-pointer"
              title="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          {/* Photo quick badge (bottom overlay) */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-400 bg-stone-900/80 backdrop-blur-md px-3.5 py-2 rounded-lg border border-stone-800/80">
            <span className="truncate font-mono">{photo.exif.originalFileName}</span>
            <div className="flex items-center gap-3 shrink-0">
              <span>{photo.exif.locationName}</span>
              <span aria-hidden="true">·</span>
              <span>{photo.exif.dateTaken.split(' ')[0]}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Memory Intelligence & Provenance Inspector */}
        <div className="w-full lg:w-[440px] flex flex-col bg-stone-900 text-stone-100 border-t lg:border-t-0 lg:border-l border-stone-800 max-h-[85vh] lg:max-h-none overflow-y-auto">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-800">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-mono text-amber-400 tracking-wide uppercase">
                Memory Inspector
              </span>
              {photo.provenance.isUserConfirmed ? (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  <CheckCircle2 className="w-3 h-3" />
                  Confirmed by You
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-800/50">
                  <Sparkles className="w-3 h-3" />
                  AI Suggested
                </span>
              )}
            </div>
            <h2 className="font-serif text-xl font-bold text-white tracking-tight leading-snug">
              {photo.title}
            </h2>
            <p className="text-xs text-stone-400 mt-1 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>{photo.exif.locationName}, {photo.exif.country}</span>
            </p>
          </div>

          {/* Section: Three Caption Styles (Section 3.3) */}
          <div className="p-5 border-b border-stone-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-stone-200">
                  Memory Narrative & Captions
                </span>
              </div>

              {!isEditing && (
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-200 hover:underline cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {/* Style Selector Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-950/80 rounded-lg mb-3 text-xs">
              {(['simple', 'descriptive', 'memory'] as CaptionStyle[]).map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    setSelectedStyle(style);
                    setIsEditing(false);
                  }}
                  className={`py-1.5 px-2 rounded-md font-medium capitalize text-center transition-all cursor-pointer ${
                    selectedStyle === style
                      ? 'bg-amber-900/60 text-amber-200 shadow-sm border border-amber-700/60'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            {/* Caption Content Box */}
            <div className="bg-stone-950/60 rounded-xl p-3.5 border border-stone-800/80">
              {isEditing ? (
                <div className="space-y-2.5">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    className="w-full text-xs text-stone-100 bg-stone-900 p-2.5 rounded-lg border border-amber-600/60 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Enter personal caption or memory details..."
                  />
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={handleResetToAi}
                      className="text-stone-400 hover:text-stone-200 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Revert to AI</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-2.5 py-1 text-stone-400 hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded-md shadow-sm cursor-pointer"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-stone-200 leading-relaxed font-serif italic">
                    "{currentCaption}"
                  </p>
                  {photo.captions.userCustom && (
                    <span className="block mt-2 text-[10px] text-amber-400/90 font-mono">
                      Personal note saved by user
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Confirmation CTA */}
            {!photo.provenance.isUserConfirmed && (
              <button
                onClick={() => onConfirmProvenance(photo.id)}
                className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-lg transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Description as Accurately Preserved</span>
              </button>
            )}
          </div>

          {/* Sub-tabs for Details */}
          <div className="flex items-center border-b border-stone-800 px-5 text-xs font-medium">
            <button
              onClick={() => setActiveTab('provenance')}
              className={`py-2.5 mr-4 transition-colors cursor-pointer ${
                activeTab === 'provenance'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Provenance Architecture
            </button>
            <button
              onClick={() => setActiveTab('exif')}
              className={`py-2.5 mr-4 transition-colors cursor-pointer ${
                activeTab === 'exif'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Verified EXIF
            </button>
            <button
              onClick={() => setActiveTab('story')}
              className={`py-2.5 transition-colors cursor-pointer ${
                activeTab === 'story'
                  ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Album & Event
            </button>
          </div>

          {/* Sub-Tab Contents */}
          <div className="p-5 space-y-4 text-xs">
            
            {activeTab === 'provenance' && (
              <div className="space-y-3">
                <p className="text-[11px] text-stone-400 leading-normal">
                  The platform separates factual camera data from AI visual detections and narrative inferences to prevent hallucination.
                </p>

                {/* Tier 1: Verified Metadata */}
                <div className="p-3 bg-stone-950/70 rounded-lg border border-stone-800">
                  <div className="flex items-center gap-1.5 mb-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Tier 1: Verified Facts (EXIF Hardware)</span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    {photo.provenance.verifiedMetadataSummary}
                  </p>
                </div>

                {/* Tier 2: Visual Observations */}
                <div className="p-3 bg-stone-950/70 rounded-lg border border-stone-800">
                  <div className="flex items-center gap-1.5 mb-1 text-sky-400 font-medium">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Tier 2: Visual Content (Computer Vision)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {photo.provenance.visualObjects.map((obj, i) => (
                      <span key={i} className="text-[10px] text-stone-300 bg-stone-800/80 px-2 py-0.5 rounded">
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tier 3: Contextual Interpretation */}
                <div className="p-3 bg-stone-950/70 rounded-lg border border-stone-800">
                  <div className="flex items-center gap-1.5 mb-1 text-amber-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Tier 3: Contextual Inference (AI Hypothesis)</span>
                  </div>
                  <p className="text-stone-300 text-[11px] leading-relaxed">
                    {photo.provenance.contextualInference}
                  </p>
                  <div className="mt-2 text-[10px] text-stone-500 font-mono">
                    Model: {photo.provenance.modelUsed} · Confidence: {Math.round(photo.provenance.confidence * 100)}%
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exif' && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-stone-300">
                  <div className="p-2.5 bg-stone-950/60 rounded border border-stone-800">
                    <span className="text-[10px] text-stone-500 block uppercase font-mono">Camera</span>
                    <span className="font-medium">{photo.exif.cameraMake} {photo.exif.cameraModel}</span>
                  </div>
                  <div className="p-2.5 bg-stone-950/60 rounded border border-stone-800">
                    <span className="text-[10px] text-stone-500 block uppercase font-mono">Lens / Focal</span>
                    <span className="font-medium">{photo.exif.focalLength} ({photo.exif.aperture})</span>
                  </div>
                  <div className="p-2.5 bg-stone-950/60 rounded border border-stone-800">
                    <span className="text-[10px] text-stone-500 block uppercase font-mono">Shutter & ISO</span>
                    <span className="font-mono">{photo.exif.shutterSpeed} · ISO {photo.exif.iso}</span>
                  </div>
                  <div className="p-2.5 bg-stone-950/60 rounded border border-stone-800">
                    <span className="text-[10px] text-stone-500 block uppercase font-mono">Timestamp</span>
                    <span className="font-mono">{photo.exif.dateTaken}</span>
                  </div>
                  <div className="p-2.5 bg-stone-950/60 rounded border border-stone-800 col-span-2">
                    <span className="text-[10px] text-stone-500 block uppercase font-mono">GPS Coordinates</span>
                    <span className="font-mono text-[11px]">{photo.exif.latitude?.toFixed(4)}° N, {photo.exif.longitude?.toFixed(4)}° W</span>
                  </div>
                  <div className="p-2.5 bg-stone-950/60 rounded border border-stone-800 col-span-2">
                    <span className="text-[10px] text-stone-500 block uppercase font-mono">Source Device & Archive File</span>
                    <span className="text-stone-300 block">{photo.exif.sourceDevice}</span>
                    <span className="text-stone-500 font-mono text-[10px]">{photo.exif.originalFileName} ({(photo.exif.fileSizeBytes / 1024 / 1024).toFixed(1)} MB)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'story' && (
              <div className="space-y-3">
                <div className="p-3 bg-stone-950/70 rounded-lg border border-stone-800">
                  <span className="text-[10px] text-amber-400 uppercase font-mono block mb-1">
                    Assigned Album
                  </span>
                  <p className="font-serif font-bold text-white text-sm">
                    {photo.albumTitle || 'Not assigned to an album'}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Event cluster based on 3-day window and location proximity.
                  </p>
                </div>

                <div className="p-3 bg-stone-950/70 rounded-lg border border-stone-800">
                  <span className="text-[10px] text-stone-400 uppercase font-mono block mb-1">
                    Themes & Tags
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {photo.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] text-stone-300 bg-stone-800 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {onOpenBookFromPhoto && (
                  <button
                    onClick={() => onOpenBookFromPhoto(photo.suggestedAlbumId)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Create Layflat Hardcover Memory Book</span>
                  </button>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
