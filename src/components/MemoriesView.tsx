import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Compass, 
  Heart, 
  ChevronRight, 
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { PhotoItem, AlbumItem } from '../types';

interface MemoriesViewProps {
  photos: PhotoItem[];
  albums: AlbumItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
  onOpenBookPreview: (album: AlbumItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({
  photos,
  albums,
  onSelectPhoto,
  onOpenBookPreview,
  onNavigateTab,
}) => {
  // Select memorable moments
  const onThisDayPhotos = photos.filter(p => !p.isExactDuplicate);
  const featuredEventAlbum = albums.find(a => a.id === 'album-cotswolds-autumn-2023') || albums[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-10">
      
      {/* Title */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-700 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Module E · Memory Discovery Engine</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Rediscover Your Past Experiences
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          A dedicated memory portal that prompts rediscovery without requiring manual searching.
        </p>
      </div>

      {/* Hero Memory Feature: "3 Years Ago Today" */}
      <div className="bg-stone-900 text-white rounded-3xl overflow-hidden shadow-xl border border-stone-800 grid grid-cols-1 lg:grid-cols-12 items-stretch">
        
        {/* Left: Memory details */}
        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="inline-block text-xs font-mono text-amber-400 tracking-wider uppercase">
              On This Day · Flashback
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
              Autumn Walk through Castle Combe
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Captured 24 October 2023 (3 years ago)</span>
              <span aria-hidden="true">·</span>
              <span>Wiltshire, UK</span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm font-serif italic leading-relaxed pt-2">
              "A crisp October afternoon wandering Castle Combe. Warm golden light lit up the thatched rooflines and glowing autumn leaves over the village bridge."
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-stone-800">
            <div className="text-[11px] text-stone-400 font-mono">
              Preserved from: MacBook Pro 2023 Local SSD · Sony A7 III
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  const target = photos.find(p => p.id === 'photo-3') || photos[0];
                  onSelectPhoto(target);
                }}
                className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
              >
                Inspect Memory Details
              </button>
              <button
                onClick={() => onOpenBookPreview(featuredEventAlbum)}
                className="px-4 py-2 text-xs font-medium text-white bg-stone-800 hover:bg-stone-700 rounded-lg border border-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>View Memory Book</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Big photo */}
        <div className="lg:col-span-7 bg-stone-950 relative min-h-[300px] lg:min-h-full">
          <img
            src="/src/assets/images/cotswolds_autumn_cottage_1793454002285.jpg"
            alt="Castle Combe Autumn"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

      </div>

      {/* Grid: Other Historical Milestones */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-stone-900">
          This Season Across Previous Years
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Milestone 1: Oxford Graduation */}
          <div 
            onClick={() => {
              const target = photos.find(p => p.id === 'photo-2') || photos[0];
              onSelectPhoto(target);
            }}
            className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src="/src/assets/images/family_graduation_memory_1793453873000.jpg"
                  alt="Oxford Graduation"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 space-y-1.5">
                <span className="text-[10px] font-mono text-amber-800 uppercase block">
                  5 Years Ago · Milestone
                </span>
                <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-amber-800">
                  University Degree Ceremony
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2">
                  Oxford quadrangle gathering with parents and brother in June sunlight.
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Oxford, UK</span>
              <span className="text-amber-800 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Milestone 2: Andalucia Holiday */}
          <div 
            onClick={() => {
              const target = photos.find(p => p.id === 'photo-1') || photos[0];
              onSelectPhoto(target);
            }}
            className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src="/src/assets/images/travel_coastal_spain_1793453871431.jpg"
                  alt="Nerja Cove"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 space-y-1.5">
                <span className="text-[10px] font-mono text-amber-800 uppercase block">
                  4 Years Ago · Summer Travel
                </span>
                <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-amber-800">
                  Mediterranean Swimming at Maro Cove
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2">
                  Turquoise waters and wooden boat under Andalusian sea cliffs.
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Nerja, Spain</span>
              <span className="text-amber-800 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Milestone 3: Kyoto Spring */}
          <div 
            onClick={() => {
              const target = photos.find(p => p.id === 'photo-4') || photos[0];
              onSelectPhoto(target);
            }}
            className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                <img
                  src="/src/assets/images/tokyo_spring_garden_1793453873185.jpg"
                  alt="Kyoto Pavilion"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 space-y-1.5">
                <span className="text-[10px] font-mono text-amber-800 uppercase block">
                  7 Years Ago · Spring Trip
                </span>
                <h3 className="font-serif text-base font-bold text-stone-900 group-hover:text-amber-800">
                  Kyoto Cherry Blossom Pavilion
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2">
                  Stone lanterns in early morning mountain mist surrounded by blossoming sakura.
                </p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Kyoto, Japan</span>
              <span className="text-amber-800 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                <span>View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Secondary Concept: "Forgotten Archives" from Old Devices */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-mono text-amber-800 uppercase tracking-wider block">
            Forgotten Photo Archive Discovery
          </span>
          <h3 className="font-serif text-xl font-bold text-stone-900">
            Have old hard drives or laptop backups?
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Memoria excels at reconciling forgotten folders, external discs, and chat exports into one seamless timeline with deduplication and metadata restoration.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('photos')}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-800 rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          Review Consolidated Archive
        </button>
      </div>

    </div>
  );
};
