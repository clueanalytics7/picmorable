/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlbumSpread, AlbumPhoto, AlbumMetadata } from '../../types/album';
import { Book, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface AlbumFilmstripProps {
  spreads: AlbumSpread[];
  currentSpreadIndex: number;
  meta: AlbumMetadata;
  photos: AlbumPhoto[];
  onSelectSpread: (spreadIndex: number) => void;
  onOpenSlideshow?: () => void;
  onMoveSpread?: (spreadIndex: number, direction: 'left' | 'right') => void;
}

export const AlbumFilmstrip: React.FC<AlbumFilmstripProps> = ({
  spreads,
  currentSpreadIndex,
  meta,
  photos,
  onSelectSpread,
  onOpenSlideshow,
  onMoveSpread,
}) => {
  const photoMap = new Map(photos.map(p => [p.id, p]));

  const getMiniPaperBg = () => {
    switch (meta.paperTone) {
      case 'aged-sepia':
        return '#f4ecd8';
      case 'cotton-rag':
        return '#f8f6f0';
      case 'gallery-lustre':
        return '#ffffff';
      case 'warm-cream':
      default:
        return '#faf8f2';
    }
  };

  return (
    <div className="w-full bg-stone-950/90 border-t border-stone-800 py-3.5 px-4 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {spreads.map((spread) => {
          const isSelected = spread.spreadIndex === currentSpreadIndex;
          const isCover = spread.spreadIndex === 0;

          if (isCover) {
            return (
              <button
                key="spread-cover"
                type="button"
                onClick={() => onSelectSpread(0)}
                className={`shrink-0 flex flex-col items-center gap-1.5 group cursor-pointer transition-all ${
                  isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-16 h-20 rounded-md border-2 flex flex-col items-center justify-center shadow-md transition-all p-1.5 ${
                    isSelected ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-stone-700'
                  }`}
                  style={{
                    backgroundColor: 
                      meta.coverMaterial === 'forest-linen' ? '#15271d' :
                      meta.coverMaterial === 'navy-buckram' ? '#0f1b2e' :
                      meta.coverMaterial === 'sandstone-cloth' ? '#524536' :
                      meta.coverMaterial === 'espresso-calfskin' ? '#221610' : '#3b121e'
                  }}
                >
                  <Book className="w-5 h-5 text-amber-300 mb-1" />
                  <span className="text-[10px] font-serif font-bold text-amber-200 uppercase tracking-tighter truncate w-full text-center">
                    Cover
                  </span>
                </div>
                <span className={`text-xs font-mono font-medium ${isSelected ? 'text-amber-300 font-bold' : 'text-stone-400'}`}>
                  Cover Plate
                </span>
              </button>
            );
          }

          // Spread miniatures
          const leftPhotoId = spread.leftPage?.photoIds[0];
          const rightPhotoId = spread.rightPage?.photoIds[0];
          const leftPhoto = leftPhotoId ? photoMap.get(leftPhotoId) : null;
          const rightPhoto = rightPhotoId ? photoMap.get(rightPhotoId) : null;

          return (
            <div
              key={`spread-${spread.spreadIndex}`}
              className="relative shrink-0 flex flex-col items-center gap-1.5 group"
            >
              <button
                type="button"
                onClick={() => onSelectSpread(spread.spreadIndex)}
                className={`cursor-pointer transition-all ${
                  isSelected ? 'scale-105' : 'opacity-75 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-28 h-20 rounded-md border-2 shadow-md flex overflow-hidden transition-all ${
                    isSelected ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-stone-700'
                  }`}
                  style={{ backgroundColor: getMiniPaperBg() }}
                >
                  {/* Left Mini Page */}
                  <div className="w-1/2 h-full border-r border-stone-300 flex items-center justify-center p-0.5 overflow-hidden">
                    {leftPhoto ? (
                      <img src={leftPhoto.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-stone-500 font-serif italic">
                        {spread.leftPage ? `P.${spread.leftPage.pageNumber}` : 'Endpaper'}
                      </span>
                    )}
                  </div>

                  {/* Right Mini Page */}
                  <div className="w-1/2 h-full flex items-center justify-center p-0.5 overflow-hidden" style={{ backgroundColor: getMiniPaperBg() }}>
                    {rightPhoto ? (
                      <img src={rightPhoto.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[9px] text-stone-500 font-serif italic">
                        {spread.rightPage ? `P.${spread.rightPage.pageNumber}` : '—'}
                      </span>
                    )}
                  </div>
                </div>

                <span className={`text-xs font-mono font-medium mt-1 block ${isSelected ? 'text-amber-300 font-bold' : 'text-stone-400'}`}>
                  {spread.leftPage && spread.rightPage
                    ? `p.${spread.leftPage.pageNumber}-${spread.rightPage.pageNumber}`
                    : spread.rightPage
                    ? `p.${spread.rightPage.pageNumber}`
                    : `Spread ${spread.spreadIndex}`}
                </span>
              </button>

              {/* Reordering arrows on hover */}
              {onMoveSpread && (
                <div className="absolute top-1 inset-x-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {spread.spreadIndex > 1 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveSpread(spread.spreadIndex, 'left');
                      }}
                      title="Move spread left"
                      className="p-1 rounded bg-black/80 hover:bg-black text-white text-xs pointer-events-auto cursor-pointer shadow"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  ) : <div />}
                  {spread.spreadIndex < spreads.length - 1 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveSpread(spread.spreadIndex, 'right');
                      }}
                      title="Move spread right"
                      className="p-1 rounded bg-black/80 hover:bg-black text-white text-xs pointer-events-auto cursor-pointer shadow"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : <div />}
                </div>
              )}
            </div>
          );
        })}

        {onOpenSlideshow && (
          <button
            type="button"
            onClick={onOpenSlideshow}
            className="shrink-0 flex flex-col items-center gap-1.5 group cursor-pointer ml-2 transition-all opacity-85 hover:opacity-100"
            title="Start Fullscreen Presentation Slideshow"
          >
            <div className="w-18 h-20 rounded-md border-2 border-amber-500/40 bg-stone-900 shadow-md flex flex-col items-center justify-center p-1.5 group-hover:border-amber-400 group-hover:scale-105 transition-all text-amber-300">
              <Play className="w-6 h-6 fill-current mb-1" />
              <span className="text-[10px] font-sans font-bold text-amber-200 uppercase tracking-tight">
                Play Show
              </span>
            </div>
            <span className="text-xs font-mono font-medium text-stone-400">Slideshow</span>
          </button>
        )}
      </div>
    </div>
  );
};
