import React, { useState } from 'react';
import { 
  Filter, 
  Calendar, 
  Camera, 
  CheckCircle2, 
  Heart, 
  Sparkles, 
  Layers, 
  SlidersHorizontal,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import { PhotoItem, ConfidenceLevel } from '../types';

interface PhotosLibraryProps {
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
  onToggleFavorite: (photoId: string) => void;
  onCreateAlbumFromPhotos?: (photoIds: string[]) => void;
}

export const PhotosLibrary: React.FC<PhotosLibraryProps> = ({
  photos,
  onSelectPhoto,
  onToggleFavorite,
  onCreateAlbumFromPhotos,
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCamera, setSelectedCamera] = useState<string>('all');
  const [hideDuplicates, setHideDuplicates] = useState<boolean>(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [gridSize, setGridSize] = useState<'comfortable' | 'compact'>('comfortable');

  // Extract unique years
  const availableYears = Array.from(
    new Set(photos.map(p => p.exif.dateTaken.split('-')[0]))
  ).sort().reverse();

  // Extract unique camera makes
  const availableCameras = Array.from(
    new Set(photos.map(p => p.exif.cameraMake))
  ).filter(Boolean);

  // Filtered photos
  const filteredPhotos = photos.filter(photo => {
    if (hideDuplicates && photo.isExactDuplicate) return false;
    if (selectedYear !== 'all' && !photo.exif.dateTaken.startsWith(selectedYear)) return false;
    if (selectedCamera !== 'all' && photo.exif.cameraMake !== selectedCamera) return false;
    return true;
  });

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPhotos.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPhotos.map(p => p.id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-6">
      
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Chronological Photo Library
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Displaying {filteredPhotos.length} photographs spanning {availableYears.join(', ')} · Preserved from 5 devices
          </p>
        </div>

        {/* Multi-selection Toolbar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
            <span className="font-semibold">{selectedIds.length} selected</span>
            <button
              onClick={() => onCreateAlbumFromPhotos && onCreateAlbumFromPhotos(selectedIds)}
              className="px-3 py-1 bg-amber-800 text-white rounded font-medium hover:bg-amber-900 transition-colors cursor-pointer"
            >
              Create New Album
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar (Segmented Controls & Toggles) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white rounded-xl border border-stone-200 shadow-xs text-xs">
        
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Year Filter */}
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500 font-medium mr-1">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Camera Gear Filter */}
          <div className="flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500 font-medium mr-1">Camera:</span>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded px-2 py-1 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">All Cameras</option>
              {availableCameras.map(cam => (
                <option key={cam} value={cam}>{cam}</option>
              ))}
            </select>
          </div>

          {/* Hide Duplicates Toggle */}
          <button
            onClick={() => setHideDuplicates(!hideDuplicates)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors cursor-pointer ${
              hideDuplicates
                ? 'bg-stone-100 text-stone-800 border-stone-300'
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}
          >
            {hideDuplicates ? <EyeOff className="w-3.5 h-3.5 text-stone-500" /> : <Eye className="w-3.5 h-3.5 text-amber-700" />}
            <span>{hideDuplicates ? 'Hiding exact duplicates' : 'Showing duplicates'}</span>
          </button>
        </div>

        {/* Right Layout View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSelectAll}
            className="text-stone-500 hover:text-stone-800 hover:underline cursor-pointer"
          >
            {selectedIds.length === filteredPhotos.length ? 'Deselect All' : 'Select All'}
          </button>
          
          <div className="h-4 w-px bg-stone-200 mx-1" />

          <div className="flex items-center bg-stone-100 p-0.5 rounded border border-stone-200">
            <button
              onClick={() => setGridSize('comfortable')}
              className={`px-2 py-0.5 rounded font-medium text-[11px] cursor-pointer ${
                gridSize === 'comfortable' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
              }`}
            >
              Comfortable
            </button>
            <button
              onClick={() => setGridSize('compact')}
              className={`px-2 py-0.5 rounded font-medium text-[11px] cursor-pointer ${
                gridSize === 'compact' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
              }`}
            >
              Compact
            </button>
          </div>
        </div>

      </div>

      {/* Photo Gallery Grid */}
      <div 
        className={`grid gap-4 ${
          gridSize === 'comfortable' 
            ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
            : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
        }`}
      >
        {filteredPhotos.map((photo) => {
          const isSelected = selectedIds.includes(photo.id);

          return (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              className={`group relative bg-white rounded-xl border overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-amber-700 border-amber-600' : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Media Thumbnail */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(photo.id);
                  }}
                  className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                    photo.isFavorite
                      ? 'text-rose-600 bg-white/90 shadow'
                      : 'text-stone-400 hover:text-white bg-stone-900/40 hover:bg-stone-900/70'
                  }`}
                  title="Favorite memory"
                >
                  <Heart className={`w-3.5 h-3.5 ${photo.isFavorite ? 'fill-rose-600' : ''}`} />
                </button>

                {/* Selection Checkbox */}
                <button
                  onClick={(e) => toggleSelect(photo.id, e)}
                  className={`absolute top-2 left-2 w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-700 text-white'
                      : 'bg-stone-900/40 hover:bg-stone-900/70 text-transparent hover:text-white/60'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>

                {/* Duplicate / Burst Badge if present */}
                {photo.isExactDuplicate && (
                  <span className="absolute bottom-2 left-2 text-[10px] bg-stone-950/80 text-amber-300 font-mono px-1.5 py-0.5 rounded">
                    Exact Duplicate
                  </span>
                )}
                {photo.isSimilar && (
                  <span className="absolute bottom-2 left-2 text-[10px] bg-stone-950/80 text-sky-300 font-mono px-1.5 py-0.5 rounded">
                    Burst Candidate
                  </span>
                )}
              </div>

              {/* Card Information */}
              <div className="p-3 space-y-1">
                <h3 className="font-serif font-bold text-stone-900 text-xs truncate group-hover:text-amber-800 transition-colors">
                  {photo.title}
                </h3>

                {/* Unboxed Metadata with · separator (§1.A) */}
                <div className="flex items-center gap-1.5 text-[11px] text-stone-500 truncate">
                  <span>{photo.exif.locationName?.split(',')[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{photo.exif.dateTaken.split(' ')[0]}</span>
                  <span aria-hidden="true">·</span>
                  <span>{photo.exif.cameraModel}</span>
                </div>

                <p className="text-[11px] text-stone-600 line-clamp-1 italic font-serif pt-0.5">
                  "{photo.captions.userCustom || photo.captions.memory}"
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
