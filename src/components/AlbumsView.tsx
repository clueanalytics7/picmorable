import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Edit3, 
  BookOpen, 
  Layers, 
  Plus, 
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { AlbumItem, PhotoItem } from '../types';

interface AlbumsViewProps {
  albums: AlbumItem[];
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
  onOpenBookPreview: (album: AlbumItem) => void;
  onApproveAlbum: (albumId: string) => void;
  onUpdateAlbumStory: (albumId: string, newStory: string) => void;
}

export const AlbumsView: React.FC<AlbumsViewProps> = ({
  albums,
  photos,
  onSelectPhoto,
  onOpenBookPreview,
  onApproveAlbum,
  onUpdateAlbumStory,
}) => {
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumItem | null>(null);
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [storyDraft, setStoryDraft] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'ai_event' | 'rule_based'>('all');

  const filteredAlbums = albums.filter(a => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  const handleStartEditStory = (album: AlbumItem) => {
    setEditingStoryId(album.id);
    setStoryDraft(album.userStory || album.aiSummary);
  };

  const handleSaveStory = (albumId: string) => {
    onUpdateAlbumStory(albumId, storyDraft);
    setEditingStoryId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-8">
      
      {/* Title & Description */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-700 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Module D · Event Reconstruction & Albums</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Preserved Event Albums
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              Events automatically clustered from date ranges, GPS boundaries, and visual scene analysis.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs self-start sm:self-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All ({albums.length})
            </button>
            <button
              onClick={() => setFilterType('ai_event')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterType === 'ai_event' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              AI Event Albums
            </button>
            <button
              onClick={() => setFilterType('rule_based')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                filterType === 'rule_based' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Annual Indexes
            </button>
          </div>
        </div>
      </div>

      {/* Album Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((album) => {
          const albumPhotos = photos.filter(p => album.photoIds.includes(p.id));

          return (
            <div
              key={album.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Cover Image & Header */}
              <div>
                <div 
                  onClick={() => setSelectedAlbum(album)}
                  className="aspect-[16/10] w-full overflow-hidden bg-stone-100 relative group cursor-pointer"
                >
                  <img
                    src={album.coverPhotoUrl}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Status Overlay Badge */}
                  <div className="absolute top-3 left-3">
                    {album.status === 'approved' ? (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-900 bg-emerald-100/90 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        Confirmed Event
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-amber-900 bg-amber-100/90 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs border border-amber-300">
                        <Sparkles className="w-3 h-3 text-amber-700" />
                        Suggested Cluster
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 text-[11px] text-white bg-stone-950/70 backdrop-blur-md px-2.5 py-1 rounded-md font-mono">
                    {album.photoIds.length} Photos
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>{album.dateRange.start} – {album.dateRange.end}</span>
                    </span>
                  </div>

                  <h3 
                    onClick={() => setSelectedAlbum(album)}
                    className="font-serif text-lg font-bold text-stone-900 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    {album.title}
                  </h3>

                  <p className="text-xs text-stone-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{album.locations.join(' · ')}</span>
                  </p>

                  {/* Story Description (Editable) */}
                  {editingStoryId === album.id ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        value={storyDraft}
                        onChange={(e) => setStoryDraft(e.target.value)}
                        rows={3}
                        className="w-full text-xs text-stone-900 p-2.5 rounded-lg border border-amber-600 bg-stone-50 focus:outline-none"
                      />
                      <div className="flex items-center justify-end gap-2 text-xs">
                        <button
                          onClick={() => setEditingStoryId(null)}
                          className="px-2.5 py-1 text-stone-500 hover:text-stone-800 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveStory(album.id)}
                          className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded font-medium cursor-pointer"
                        >
                          Save Story
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group/story relative bg-stone-50 p-3 rounded-lg border border-stone-200/80">
                      <p className="text-xs text-stone-700 font-serif leading-relaxed italic">
                        "{album.userStory || album.aiSummary}"
                      </p>
                      <button
                        onClick={() => handleStartEditStory(album)}
                        className="mt-2 text-[11px] text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Edit album story</span>
                      </button>
                    </div>
                  )}

                  {/* Themes / Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {album.themes.map((th, idx) => (
                      <span key={idx} className="text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded">
                        {th}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between text-xs">
                {album.status !== 'approved' ? (
                  <button
                    onClick={() => onApproveAlbum(album.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve Album</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Preserved & Approved
                  </span>
                )}

                <button
                  onClick={() => onOpenBookPreview(album)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 cursor-pointer"
                  title="Generate Hardcover Layflat Book"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Layflat Book</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Expanded Album Detail View Modal if clicked */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-stone-300">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-amber-700 uppercase tracking-wider block mb-1">
                  Album Collection Detail
                </span>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  {selectedAlbum.title}
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  {selectedAlbum.dateRange.start} – {selectedAlbum.dateRange.end} · {selectedAlbum.locations.join(', ')}
                </p>
              </div>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Photos in this album */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 font-serif italic">
                "{selectedAlbum.userStory || selectedAlbum.aiSummary}"
              </div>

              <h3 className="font-serif font-bold text-stone-900 text-sm">
                Constituent Photographs ({selectedAlbum.photoIds.length})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos
                  .filter(p => selectedAlbum.photoIds.includes(p.id))
                  .map(photo => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        setSelectedAlbum(null);
                        onSelectPhoto(photo);
                      }}
                      className="group aspect-[4/3] rounded-lg overflow-hidden relative cursor-pointer border border-stone-200 bg-stone-100"
                    >
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2 text-[11px] text-white">
                        <span className="truncate">{photo.title}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => {
                  const albumToOpen = selectedAlbum;
                  setSelectedAlbum(null);
                  onOpenBookPreview(albumToOpen);
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Preview Hardcover Photo Book</span>
              </button>
              <button
                onClick={() => setSelectedAlbum(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
