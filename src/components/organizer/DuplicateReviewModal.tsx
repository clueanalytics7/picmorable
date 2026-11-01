/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { AlbumPhoto } from '../../types/album';
import { detectDuplicates, DuplicateGroup } from '../../utils/duplicateDetector';

interface DuplicateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: AlbumPhoto[];
  onKeepHeroAndExcludeOthers: (groupId: string, keptHeroId: string) => void;
  onKeepAllInAlbum: (groupId: string) => void;
}

export const DuplicateReviewModal: React.FC<DuplicateReviewModalProps> = ({
  isOpen,
  onClose,
  photos,
  onKeepHeroAndExcludeOthers,
  onKeepAllInAlbum,
}) => {
  const duplicateGroups = detectDuplicates(photos);
  const [selectedHeroes, setSelectedHeroes] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSelectHero = (groupId: string, photoId: string) => {
    setSelectedHeroes(prev => ({ ...prev, [groupId]: photoId }));
  };

  const handleApplyResolution = (group: DuplicateGroup) => {
    const chosenHero = selectedHeroes[group.groupId] || group.heroPhotoId;
    onKeepHeroAndExcludeOthers(group.groupId, chosenHero);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-300">
              <Copy className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base font-bold text-stone-100">
                  Duplicate & Burst Review
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-mono">
                  {duplicateGroups.length} Clusters Found
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Pick your preferred hero shot. Never automatically deletes original files.
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

        {/* Inviolable Guarantee Notice */}
        <div className="px-6 py-3 bg-stone-950/80 border-b border-stone-800 flex items-center gap-2.5 text-xs text-stone-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-emerald-300">Picmorable Privacy Promise:</strong> Original files on your computer or device will <strong>never</strong> be deleted. Excluded photos simply stay off the printed pages.
          </span>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {duplicateGroups.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-700/60 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-100">
                No Duplicate Photographs Found
              </h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                All photographs in your current album session are distinct frames with unique timestamps and compositions.
              </p>
            </div>
          ) : (
            duplicateGroups.map((group, groupIdx) => {
              const currentHeroId = selectedHeroes[group.groupId] || group.heroPhotoId;

              return (
                <div key={group.groupId || groupIdx} className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-4">
                  {/* Group Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-800/80">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs flex items-center justify-center font-bold">
                        {groupIdx + 1}
                      </span>
                      <span className="font-serif font-semibold text-sm text-stone-200">
                        Burst Sequence / Similar Composition
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400 italic font-serif">
                      {group.reason}
                    </span>
                  </div>

                  {/* Photo Comparison Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {group.photos.map(photo => {
                      const isHero = photo.id === currentHeroId;

                      return (
                        <div
                          key={photo.id}
                          onClick={() => handleSelectHero(group.groupId, photo.id)}
                          className={`relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isHero
                              ? 'bg-amber-950/20 border-amber-400 shadow-md shadow-amber-950/30 ring-1 ring-amber-400/50'
                              : 'bg-stone-900 border-stone-800 hover:border-stone-700 opacity-75 hover:opacity-100'
                          }`}
                        >
                          {/* Hero Selection Badge */}
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                              isHero
                                ? 'bg-amber-400 text-stone-950'
                                : 'bg-stone-800 text-stone-400'
                            }`}>
                              {isHero ? '⭐ Chosen Hero Shot' : 'Duplicate Frame'}
                            </span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              {photo.aspectRatio.toUpperCase()}
                            </span>
                          </div>

                          {/* Image Thumbnail */}
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-stone-950 border border-stone-800 mb-2.5">
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Metadata Details */}
                          <div className="space-y-1 text-[11px]">
                            <div className="font-serif font-medium text-stone-200 truncate">
                              {photo.name}
                            </div>
                            <div className="text-stone-400 font-mono text-[10px]">
                              {photo.date || 'Undated'} • {photo.location || 'Private Location'}
                            </div>
                            <p className="text-stone-400 text-[10px] italic line-clamp-1">
                              {photo.caption}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action row for this cluster */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <p className="text-[11px] text-stone-400">
                      Selecting hero keeps the best shot on album spreads while suppressing duplicates.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onKeepAllInAlbum(group.groupId)}
                        className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
                      >
                        Keep Both in Album
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApplyResolution(group)}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs cursor-pointer shadow flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Hero Shot</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs font-sans">
          <span className="text-stone-400 text-[11px]">
            {duplicateGroups.length} duplicate groups inspected locally
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
