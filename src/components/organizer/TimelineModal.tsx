/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Image as ImageIcon,
  Play
} from 'lucide-react';
import { AlbumPhoto, AlbumMetadata } from '../../types/album';
import { clusterPhotosIntoEvents, LifeEventGroup } from '../../utils/duplicateDetector';

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: AlbumPhoto[];
  onSelectEventAlbum: (eventPhotos: AlbumPhoto[], eventTitle: string) => void;
  onPlayEventSlideshow: (photoIndex: number) => void;
}

export const TimelineModal: React.FC<TimelineModalProps> = ({
  isOpen,
  onClose,
  photos,
  onSelectEventAlbum,
  onPlayEventSlideshow,
}) => {
  if (!isOpen) return null;

  const events = clusterPhotosIntoEvents(photos);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-600/60 flex items-center justify-center text-amber-300">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base font-bold text-stone-100">
                  Life Timeline & Suggested Albums
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono">
                  {events.length} Event Chapters
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Chronologically structured collections arranged without cloud exposure.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="relative border-l-2 border-amber-800/40 ml-4 sm:ml-6 pl-6 space-y-8 my-2">
            {events.map((event, idx) => {
              const firstPhotoGlobalIndex = photos.findIndex(p => p.id === event.photos[0]?.id);

              return (
                <div key={event.eventName || idx} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-stone-950 shadow ring-2 ring-amber-400/20 group-hover:scale-125 transition-transform" />

                  {/* Event Card */}
                  <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-500/50 transition-colors space-y-4 shadow-lg">
                    {/* Event Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
                          <span className="text-amber-400 font-bold">{event.dateRange}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-500" />
                            {event.location}
                          </span>
                        </div>
                        <h3 className="font-serif text-lg font-bold text-stone-100 mt-1">
                          {event.eventName}
                        </h3>
                      </div>

                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-stone-900 border border-stone-800 text-stone-300">
                        {event.photos.length} Photographs
                      </span>
                    </div>

                    {/* Photo Strip */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {event.photos.slice(0, 6).map((photo, pIdx) => (
                        <div
                          key={photo.id || pIdx}
                          className="relative aspect-square rounded-lg overflow-hidden bg-stone-900 border border-stone-800 group/thumb"
                        >
                          <img
                            src={photo.url}
                            alt={photo.name}
                            className="w-full h-full object-cover transition-transform group-hover/thumb:scale-105"
                          />
                          {photo.isDuplicate && (
                            <span className="absolute bottom-1 right-1 text-[8px] bg-rose-900/90 text-rose-200 px-1 rounded font-mono">
                              Burst
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons for this Event */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-800/80">
                      <p className="text-[11px] text-stone-400 italic font-serif">
                        "{event.photos[0]?.caption || 'Memories preserved in this chapter.'}"
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onPlayEventSlideshow(firstPhotoGlobalIndex >= 0 ? firstPhotoGlobalIndex : 0);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="w-3 h-3 text-amber-400" />
                          <span>Present Slideshow</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectEventAlbum(event.photos, event.eventName);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Bind Dedicated Album</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs font-sans">
          <span className="text-stone-400 text-[11px]">
            Organised locally into {events.length} chronological chapters
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
