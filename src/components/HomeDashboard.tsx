import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  SlidersHorizontal,
  ChevronRight,
  Compass,
  Layers
} from 'lucide-react';
import { PhotoItem, AlbumItem, TimelineYearData } from '../types';

interface HomeDashboardProps {
  photos: PhotoItem[];
  albums: AlbumItem[];
  timelineYears: TimelineYearData[];
  onSelectPhoto: (photo: PhotoItem) => void;
  onSelectAlbum: (album: AlbumItem) => void;
  onNavigateTab: (tab: string) => void;
  onOpenBookPreview: (album: AlbumItem) => void;
  onOpenDuplicates: () => void;
  unresolvedDuplicatesCount: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  photos,
  albums,
  timelineYears,
  onSelectPhoto,
  onSelectAlbum,
  onNavigateTab,
  onOpenBookPreview,
  onOpenDuplicates,
  unresolvedDuplicatesCount,
}) => {
  // Identify featured "On This Day" photo (e.g., photo-3 from late October)
  const onThisDayPhoto = photos.find(p => p.id === 'photo-3') || photos[0];
  const suggestedAlbums = albums.filter(a => a.type === 'ai_event');

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20">
      
      {/* Editorial Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white p-8 sm:p-12 shadow-xl border border-stone-800">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Personal Memory Platform</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight text-balance">
            Your memories, beautifully organized.
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Upload scattered photo archives from old laptops, camera SD cards, and mobile exports. 
            Let Picmorable reconstruct dates, locations, event stories, and layflat memory albums.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('albums')}
              className="px-5 py-2.5 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Explore Suggested Albums</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="px-4 py-2.5 text-xs font-medium text-stone-200 bg-stone-800/80 hover:bg-stone-800 border border-stone-700 rounded-lg transition-colors cursor-pointer"
            >
              Your Life in Pictures
            </button>
          </div>
        </div>

        {/* Decorative corner ambient glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Unboxed Quantitative Stats Strip (§1.A / §1.D) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-2 border-y border-stone-200/80">
        <div>
          <span className="block text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
            3,420
          </span>
          <span className="text-xs text-stone-500">
            Photographs Organised
          </span>
        </div>

        <div>
          <span className="block text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
            18
          </span>
          <span className="text-xs text-stone-500">
            Event Albums Suggested
          </span>
        </div>

        <div>
          <span className="block text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
            14
          </span>
          <span className="text-xs text-stone-500">
            Locations Mapped
          </span>
        </div>

        <div>
          <span className="block text-2xl sm:text-3xl font-serif font-bold text-stone-900 tabular-nums">
            8
          </span>
          <span className="text-xs text-stone-500">
            Memories On This Day
          </span>
        </div>
      </section>

      {/* Duplicate Alert Banner (if any pending) */}
      {unresolvedDuplicatesCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900">
          <div className="flex items-start sm:items-center gap-3">
            <SlidersHorizontal className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <p className="text-xs font-semibold">
                {unresolvedDuplicatesCount} Duplicate & Burst Groups Detected
              </p>
              <p className="text-xs text-amber-800">
                Found identical WhatsApp transfers and rapid camera bursts. Review to keep high-res masters.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenDuplicates}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-amber-800 hover:bg-amber-900 rounded-md transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            Review Duplicates
          </button>
        </div>
      )}

      {/* Main Split: "On This Day" + "Your Life in Pictures" Ribbon */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left (5 cols): "On This Day" Spotlight */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-700" />
              <h2 className="font-serif text-xl font-bold text-stone-900">
                On This Day in History
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('memories')}
              className="text-xs font-medium text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div 
            onClick={() => onSelectPhoto(onThisDayPhoto)}
            className="group relative rounded-xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
              <img
                src={onThisDayPhoto.url}
                alt={onThisDayPhoto.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span>3 years ago today · 24 October 2023</span>
                <span>{onThisDayPhoto.exif.locationName}</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                {onThisDayPhoto.title}
              </h3>
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                "{onThisDayPhoto.captions.memory}"
              </p>
            </div>
          </div>
        </div>

        {/* Right (7 cols): Suggested Albums Carousel / Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <h2 className="font-serif text-xl font-bold text-stone-900">
                Suggested Event Albums
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('albums')}
              className="text-xs font-medium text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Browse 18 Albums</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {suggestedAlbums.slice(0, 4).map((album) => (
              <div
                key={album.id}
                className="group flex flex-col justify-between bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-amber-700/40 hover:shadow-sm transition-all"
              >
                <div 
                  onClick={() => onSelectAlbum(album)}
                  className="cursor-pointer"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-stone-100">
                    <img
                      src={album.coverPhotoUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>{album.dateRange.start}</span>
                      <span>{album.locations[0]?.split(',')[0]}</span>
                    </div>

                    <h3 className="font-serif font-bold text-stone-900 text-sm group-hover:text-amber-800 transition-colors line-clamp-1">
                      {album.title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-normal">
                      {album.aiSummary}
                    </p>
                  </div>
                </div>

                <div className="px-3.5 pb-3 pt-1 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-800 font-medium">
                    Verified Cluster ({album.photoIds.length} photos)
                  </span>
                  <button
                    onClick={() => onOpenBookPreview(album)}
                    className="text-amber-800 hover:text-amber-900 font-medium flex items-center gap-1 cursor-pointer hover:underline"
                    title="Generate Layflat Photo Book"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Memory Book</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Interactive Timeline Teaser: "Your Life in Pictures" (Module 3.5) */}
      <section className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-amber-700 uppercase tracking-wider block mb-1">
              Your Life in Pictures · 2012–2026
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Photographic Journey Across 15 Years
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('timeline')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>Open Interactive Timeline Canvas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Timeline Dot Ribbon */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
          {timelineYears.map((ty) => (
            <button
              key={ty.year}
              onClick={() => onNavigateTab('timeline')}
              className="group p-3 rounded-xl bg-stone-50 hover:bg-amber-50/80 border border-stone-200 hover:border-amber-300 text-left transition-all cursor-pointer"
            >
              <span className="block font-serif text-base font-bold text-stone-900 group-hover:text-amber-900">
                {ty.year}
              </span>
              <span className="text-[11px] text-stone-500 block tabular-nums">
                {ty.photoCount} photos
              </span>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-stone-400 group-hover:text-amber-700">
                <span>{ty.topLocations[0]?.split(',')[0]}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Discovered Moments Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-700" />
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Recently Discovered Moments
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('photos')}
            className="text-xs font-medium text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Photos</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {photos.filter(p => !p.isExactDuplicate).map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              className="group relative rounded-xl overflow-hidden bg-white border border-stone-200 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-3 space-y-1">
                <h4 className="font-serif font-bold text-stone-900 text-xs truncate group-hover:text-amber-800 transition-colors">
                  {photo.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>{photo.exif.locationName?.split(',')[0]}</span>
                  <span>{photo.exif.dateTaken.split('-')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
