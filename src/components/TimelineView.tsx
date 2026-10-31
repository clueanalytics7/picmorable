import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  ChevronRight,
  Download,
  Share2
} from 'lucide-react';
import { TimelineYearData, PhotoItem } from '../types';

interface TimelineViewProps {
  timelineYears: TimelineYearData[];
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  timelineYears,
  photos,
  onSelectPhoto,
  onNavigateTab,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2022);

  const currentYearData = timelineYears.find(y => y.year === selectedYear) || timelineYears[0];

  // Photos from selected year
  const yearPhotos = photos.filter(p => p.exif.dateTaken.startsWith(String(selectedYear)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-10">
      
      {/* Title & Introduction */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-700 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Module E · Your Life in Pictures</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900">
          Photographic Journey · 2012–2026
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
          An emotional chronological tapestry reconstructing your life experiences across years, devices, and travels.
        </p>
      </div>

      {/* Interactive Dot Density Timeline Ribbon (§3.5) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
          <span>ARCHIVE TIMELINE</span>
          <span>SELECT A YEAR TO EXPLORE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {timelineYears.map((ty) => {
            const isSelected = ty.year === selectedYear;
            // Generate visual dot density (1 dot per ~100 photos)
            const dotCount = Math.max(2, Math.min(8, Math.round(ty.photoCount / 75)));

            return (
              <button
                key={ty.year}
                onClick={() => setSelectedYear(ty.year)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-900 text-white border-amber-800 shadow-md scale-102 ring-2 ring-amber-700/50'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className={`font-serif text-lg font-bold ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {ty.year}
                  </span>
                  <span className={`text-[10px] tabular-nums font-mono ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                    {ty.photoCount}
                  </span>
                </div>

                {/* Dot density representation from document */}
                <div className="flex items-center gap-1 my-1.5">
                  {Array.from({ length: dotCount }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-amber-300' : 'bg-stone-400'
                      }`}
                    />
                  ))}
                </div>

                <span className={`text-[10px] truncate block ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  {ty.topLocations[0]?.split(',')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Section for Selected Year */}
      <section className="bg-stone-900 text-white rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-xl space-y-8">
        
        {/* Year Spotlight Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-stone-800 pb-8">
          <div className="space-y-2">
            <span className="text-xs font-mono text-amber-400 tracking-wider uppercase">
              Year in Review
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white">
              {currentYearData.year}
            </h2>
            <p className="text-stone-300 text-sm max-w-xl">
              Captured across {currentYearData.monthsActive} active months, with memorable travels in {currentYearData.topLocations.join(' and ')}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-stone-800/80 border border-stone-700/80 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-mono">Archived Media</span>
              <span className="text-lg font-bold font-serif text-white tabular-nums">
                {currentYearData.photoCount}
              </span>
              <span className="text-stone-400 text-[11px] ml-1">photographs</span>
            </div>

            <div className="px-4 py-2 rounded-xl bg-stone-800/80 border border-stone-700/80 text-xs">
              <span className="text-stone-400 block text-[10px] uppercase font-mono">Top Milestones</span>
              <span className="text-sm font-semibold text-amber-300">
                {currentYearData.highlightEvents.length} Major Events
              </span>
            </div>
          </div>
        </div>

        {/* Highlight Events Strip */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-amber-400 uppercase tracking-wider">
            Reconstructed Events from {currentYearData.year}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentYearData.highlightEvents.map((evt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between"
              >
                <div>
                  <span className="font-serif font-bold text-stone-100 text-sm">
                    {evt}
                  </span>
                  <span className="block text-xs text-stone-400 mt-0.5">
                    Clustered from temporal sequences & GPS metadata
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery for Selected Year */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-white">
              Photographs Preserved from {currentYearData.year}
            </h3>
            <button
              onClick={() => onNavigateTab('photos')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore all in library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {yearPhotos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {yearPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => onSelectPhoto(photo)}
                  className="group bg-stone-950 rounded-xl overflow-hidden border border-stone-800 cursor-pointer hover:border-amber-600/50 transition-all"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-stone-900">
                    <img
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-3.5 space-y-1">
                    <h4 className="font-serif font-bold text-white text-xs truncate group-hover:text-amber-300 transition-colors">
                      {photo.title}
                    </h4>
                    <p className="text-[11px] text-stone-400 truncate">
                      {photo.exif.locationName} · {photo.exif.dateTaken.split(' ')[0]}
                    </p>
                    <p className="text-[11px] text-stone-300 line-clamp-1 italic font-serif">
                      "{photo.captions.memory}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-950/40 rounded-xl border border-stone-800 text-stone-400 text-xs">
              Sample gallery contains 4 key anchor years. Click 2023, 2022, 2021, or 2019 to view preserved photos.
            </div>
          )}
        </div>

      </section>

    </div>
  );
};
