/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Book, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Download, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  BookOpen, 
  SlidersHorizontal,
  FileText,
  Play
} from 'lucide-react';
import { AlbumMetadata } from '../../types/album';

interface AlbumToolbarProps {
  meta: AlbumMetadata;
  currentSpreadIndex: number;
  totalSpreads: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPrevSpread: () => void;
  onNextSpread: () => void;
  onGoToCover: () => void;
  onOpenUploadModal: () => void;
  onOpenDownloadModal: () => void;
  onOpenRearrangeMenu: () => void;
  onOpenSettingsModal: () => void;
  onShowPrivacyInfo: () => void;
  onOpenSlideshow: () => void;
}

export const AlbumToolbar: React.FC<AlbumToolbarProps> = ({
  meta,
  currentSpreadIndex,
  totalSpreads,
  soundEnabled,
  onToggleSound,
  onPrevSpread,
  onNextSpread,
  onGoToCover,
  onOpenUploadModal,
  onOpenDownloadModal,
  onOpenRearrangeMenu,
  onOpenSettingsModal,
  onShowPrivacyInfo,
  onOpenSlideshow,
}) => {
  const isCover = currentSpreadIndex === 0;

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 text-stone-100 border-b border-stone-800 backdrop-blur-md px-3 sm:px-6 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Branding & Privacy Badge */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoToCover}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-amber-900/60 border border-amber-600/50 flex items-center justify-center text-amber-200 shadow-sm group-hover:border-amber-400 transition-colors">
              <Book className="w-4 h-4 text-amber-400" />
            </div>
            <div className="hidden sm:block">
              <div className="font-serif font-bold text-sm tracking-wide text-amber-100 flex items-center gap-1.5">
                Picmorable
                <span className="text-[10px] font-sans font-normal px-1.5 py-0.2 bg-stone-800 text-stone-400 rounded">
                  Album
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-serif italic truncate max-w-[180px]">
                {meta.title}
              </p>
            </div>
          </button>

          {/* Privacy Guarantee Indicator */}
          <button
            type="button"
            onClick={onShowPrivacyInfo}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 text-[11px] font-sans hover:bg-emerald-900/70 transition-colors cursor-pointer"
            title="Privacy-First Guarantee: Click to learn how your photos stay on your device"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline font-medium">100% On-Device</span>
            <span className="text-[10px] text-emerald-400/80">(0 KB sent)</span>
          </button>
        </div>

        {/* Center: Spread Navigation Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onGoToCover}
            className={`px-2.5 py-1 rounded text-xs font-serif transition-colors cursor-pointer ${
              isCover 
                ? 'bg-amber-400 text-stone-950 font-semibold shadow' 
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            Cover
          </button>

          <div className="flex items-center bg-stone-900 border border-stone-800 rounded-md p-0.5">
            <button
              type="button"
              onClick={onPrevSpread}
              disabled={isCover}
              className="p-1 text-stone-300 hover:text-white hover:bg-stone-800 rounded disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Previous Page / Cover"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono px-2 text-stone-300 select-none">
              {isCover ? 'Cover Plate' : `Spread ${currentSpreadIndex} / ${totalSpreads - 1}`}
            </span>

            <button
              type="button"
              onClick={onNextSpread}
              disabled={currentSpreadIndex >= totalSpreads - 1}
              className="p-1 text-stone-300 hover:text-white hover:bg-stone-800 rounded disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Next Page Spread"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded cursor-pointer transition-colors"
            title={soundEnabled ? 'Page flip sound on' : 'Page flip sound muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Right: Core Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Slideshow Presentation Button */}
          <button
            type="button"
            onClick={onOpenSlideshow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-medium transition-colors cursor-pointer shadow-sm hover:border-amber-400"
            title="Present photos in sleek fullscreen slideshow"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Slideshow</span>
          </button>

          {/* Upload Button */}
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 text-xs font-medium transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Add Photos</span>
          </button>

          {/* Rearrange Button */}
          <button
            type="button"
            onClick={onOpenRearrangeMenu}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 text-xs transition-colors cursor-pointer"
            title="Intelligently rearrange album layouts"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden md:inline">Rearrange</span>
          </button>

          {/* Album Settings / Story */}
          <button
            type="button"
            onClick={onOpenSettingsModal}
            className="p-1.5 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded border border-stone-800 transition-colors cursor-pointer"
            title="Edit Album Story & Cover Details"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Download Button */}
          <button
            type="button"
            onClick={onOpenDownloadModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs transition-all shadow cursor-pointer transform hover:scale-102"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </header>
  );
};
