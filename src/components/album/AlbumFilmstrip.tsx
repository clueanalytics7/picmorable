/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlbumSpread, AlbumPhoto, AlbumMetadata } from '../../types/album';
import { Book, Image as ImageIcon } from 'lucide-react';

interface AlbumFilmstripProps {
  spreads: AlbumSpread[];
  currentSpreadIndex: number;
  meta: AlbumMetadata;
  photos: AlbumPhoto[];
  onSelectSpread: (spreadIndex: number) => void;
}

export const AlbumFilmstrip: React.FC<AlbumFilmstripProps> = ({
  spreads,
  currentSpreadIndex,
  meta,
  photos,
  onSelectSpread,
}) => {
  const photoMap = new Map(photos.map(p => [p.id, p]));

  return (
    <div className="w-full bg-stone-950/80 border-t border-stone-800/80 py-3 px-4 backdrop-blur-md">
      <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {spreads.map((spread) => {
          const isSelected = spread.spreadIndex === currentSpreadIndex;
          const isCover = spread.spreadIndex === 0;

          if (isCover) {
            return (
              <button
                key="spread-cover"
                type="button"
                onClick={() => onSelectSpread(0)}
                className={`shrink-0 flex flex-col items-center gap-1 group cursor-pointer transition-all ${
                  isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-14 h-18 rounded border-2 flex flex-col items-center justify-center shadow transition-all p-1 ${
                    isSelected ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-stone-700'
                  }`}
                  style={{
                    backgroundColor: 
                      meta.coverMaterial === 'forest-linen' ? '#1b3425' :
                      meta.coverMaterial === 'navy-buckram' ? '#14233c' :
                      meta.coverMaterial === 'sandstone-cloth' ? '#6c5e4d' :
                      meta.coverMaterial === 'espresso-calfskin' ? '#2b1c14' : '#431422'
                  }}
                >
                  <Book className="w-4 h-4 text-amber-300 mb-1" />
                  <span className="text-[8px] font-serif text-amber-200 uppercase tracking-tighter truncate w-full text-center">
                    Cover
                  </span>
                </div>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-amber-300 font-bold' : 'text-stone-400'}`}>
                  Cover
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
            <button
              key={`spread-${spread.spreadIndex}`}
              type="button"
              onClick={() => onSelectSpread(spread.spreadIndex)}
              className={`shrink-0 flex flex-col items-center gap-1 group cursor-pointer transition-all ${
                isSelected ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div
                className={`w-24 h-18 rounded border-2 bg-[#faf8f2] shadow flex overflow-hidden transition-all ${
                  isSelected ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-stone-700'
                }`}
              >
                {/* Left Mini Page */}
                <div className="w-1/2 h-full border-r border-stone-300 bg-[#f4eee1] flex items-center justify-center p-0.5 overflow-hidden">
                  {leftPhoto ? (
                    <img src={leftPhoto.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[8px] text-stone-400 font-serif italic">
                      {spread.leftPage ? `P.${spread.leftPage.pageNumber}` : 'Endpaper'}
                    </span>
                  )}
                </div>

                {/* Right Mini Page */}
                <div className="w-1/2 h-full bg-[#faf8f2] flex items-center justify-center p-0.5 overflow-hidden">
                  {rightPhoto ? (
                    <img src={rightPhoto.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[8px] text-stone-400 font-serif italic">
                      {spread.rightPage ? `P.${spread.rightPage.pageNumber}` : '—'}
                    </span>
                  )}
                </div>
              </div>

              <span className={`text-[10px] font-mono ${isSelected ? 'text-amber-300 font-bold' : 'text-stone-400'}`}>
                {spread.leftPage && spread.rightPage
                  ? `p.${spread.leftPage.pageNumber}-${spread.rightPage.pageNumber}`
                  : spread.rightPage
                  ? `p.${spread.rightPage.pageNumber}`
                  : `Spread ${spread.spreadIndex}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
