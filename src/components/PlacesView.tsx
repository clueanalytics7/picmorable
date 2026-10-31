import React, { useState } from 'react';
import { MapPin, Navigation, Sparkles, ChevronRight, Globe, Compass } from 'lucide-react';
import { PhotoItem } from '../types';

interface PlacesViewProps {
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
}

export const PlacesView: React.FC<PlacesViewProps> = ({ photos, onSelectPhoto }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  // Extract distinct countries
  const countries = Array.from(new Set(photos.map(p => p.exif.country))).filter(Boolean);

  const filteredPhotos = photos.filter(p => {
    if (p.isExactDuplicate) return false;
    if (selectedCountry === 'all') return true;
    return p.exif.country === selectedCountry;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-20 space-y-8">
      
      {/* Header */}
      <div className="border-b border-stone-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-700 mb-1">
          <Globe className="w-3.5 h-3.5" />
          <span>Geographical Provenance & Location Atlas</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Photographic Places & GPS Coordinates
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          Extracted directly from verified EXIF latitude/longitude tags without altering privacy permissions.
        </p>
      </div>

      {/* Country Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCountry('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
            selectedCountry === 'all'
              ? 'bg-stone-900 text-white'
              : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
          }`}
        >
          All Locations ({photos.filter(p => !p.isExactDuplicate).length})
        </button>
        {countries.map(c => (
          <button
            key={c}
            onClick={() => setSelectedCountry(c)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCountry === c
                ? 'bg-amber-800 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured Location Atlas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Spain Atlas Card */}
        <div 
          onClick={() => setSelectedCountry('Spain')}
          className="group bg-white rounded-2xl border border-stone-200 overflow-hidden p-5 shadow-xs hover:shadow-md transition-all cursor-pointer relative"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[10px] font-mono text-amber-700 uppercase tracking-wider block">
                Southern Europe
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                Andalucía, Spain
              </h3>
            </div>
            <span className="text-xs font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
              36.75° N, 3.81° W
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed mb-4">
            Nerja coves, El Tajo gorge cliffs in Ronda, white villages of Frigiliana, and Mediterranean coast.
          </p>

          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-100">
            <img
              src="/src/assets/images/travel_coastal_spain_1793453871431.jpg"
              alt="Spain"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* United Kingdom Atlas Card */}
        <div 
          onClick={() => setSelectedCountry('United Kingdom')}
          className="group bg-white rounded-2xl border border-stone-200 overflow-hidden p-5 shadow-xs hover:shadow-md transition-all cursor-pointer relative"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[10px] font-mono text-amber-700 uppercase tracking-wider block">
                British Isles
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                Oxfordshire & Cotswolds
              </h3>
            </div>
            <span className="text-xs font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
              51.75° N, 1.25° W
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed mb-4">
            University quadrangles, honey-stone cottages of Castle Combe, and autumn bridges along river Windrush.
          </p>

          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-100">
            <img
              src="/src/assets/images/cotswolds_autumn_cottage_1793454002285.jpg"
              alt="United Kingdom"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Japan Atlas Card */}
        <div 
          onClick={() => setSelectedCountry('Japan')}
          className="group bg-white rounded-2xl border border-stone-200 overflow-hidden p-5 shadow-xs hover:shadow-md transition-all cursor-pointer relative"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className="text-[10px] font-mono text-amber-700 uppercase tracking-wider block">
                East Asia
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                Kyoto & Kansai, Japan
              </h3>
            </div>
            <span className="text-xs font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
              35.01° N, 135.76° E
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed mb-4">
            Spring sakura pavilions, Arashiyama moss temple trails, stone lanterns, and pagoda morning mists.
          </p>

          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-100">
            <img
              src="/src/assets/images/tokyo_spring_garden_1793453873185.jpg"
              alt="Japan"
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

      </div>

      {/* Filtered Photos from Location */}
      <div className="space-y-4 pt-4">
        <h2 className="font-serif text-xl font-bold text-stone-900">
          Photographs from {selectedCountry === 'all' ? 'All Mapped Regions' : selectedCountry} ({filteredPhotos.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto(photo)}
              className="group bg-white rounded-xl border border-stone-200 overflow-hidden cursor-pointer hover:shadow-md transition-all"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-3 space-y-1">
                <h4 className="font-serif font-bold text-stone-900 text-xs truncate group-hover:text-amber-800">
                  {photo.title}
                </h4>
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{photo.exif.locationName?.split(',')[0]}</span>
                  </span>
                  <span>{photo.exif.dateTaken.split(' ')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
