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
  SlidersHorizontal,
  Play,
  Sparkles,
  Copy,
  Calendar,
  SunMedium,
  Moon,
  Printer,
  Scissors
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
  onShowPrivacyCenter: () => void;
  onOpenSlideshow: () => void;
  onOpenOnboarding: () => void;
  onOpenDuplicates: () => void;
  duplicateCount: number;
  onOpenTimeline: () => void;
  onOpenPricing: () => void;
  onOpenPrintInspector: () => void;
  showPrintGuides: boolean;
  onTogglePrintGuides: () => void;
  viewingMode: 'warm-archival' | 'dark-gallery';
  onToggleViewingMode: () => void;
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
  onShowPrivacyCenter,
  onOpenSlideshow,
  onOpenOnboarding,
  onOpenDuplicates,
  duplicateCount,
  onOpenTimeline,
  onOpenPricing,
  onOpenPrintInspector,
  showPrintGuides,
  onTogglePrintGuides,
  viewingMode,
  onToggleViewingMode,
}) => {
  const isCover = currentSpreadIndex === 0;

  return (
    <header className="sticky top-0 z-40 bg-stone-950/95 text-stone-100 border-b border-stone-800 backdrop-blur-md px-3 sm:px-6 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Branding & Prominent Privacy Centre */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onGoToCover}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-amber-900/60 border border-amber-600/50 flex items-center justify-center text-amber-200 shadow-sm group-hover:border-amber-400 transition-colors">
              <Book className="w-4 h-4 text-amber-400" />
            </div>
            <div className="hidden lg:block">
              <div className="font-serif font-bold text-base tracking-wide text-amber-100 flex items-center gap-2">
                Picmorable
                <span className="text-xs font-sans font-medium px-2 py-0.5 bg-stone-800 text-amber-300 rounded border border-stone-700">
                  Album
                </span>
              </div>
              <p className="text-xs text-stone-300 font-serif italic truncate max-w-[180px]">
                {meta.title}
              </p>
            </div>
          </button>

          {/* Prominent Privacy Centre Indicator */}
          <button
            type="button"
            onClick={onShowPrivacyCenter}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-600 text-emerald-200 text-xs sm:text-sm font-sans hover:bg-emerald-900 transition-colors cursor-pointer shadow-sm group"
            title="Privacy Centre: All photos remain strictly on your device (0 KB uploaded)"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-emerald-100">Privacy Centre</span>
            <span className="hidden sm:inline text-xs text-emerald-400 font-mono">Protected</span>
          </button>

          {/* 2-Minute Onboarding Flow Trigger */}
          <button
            type="button"
            onClick={onOpenOnboarding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-950/90 border border-amber-500/70 text-amber-200 hover:bg-amber-900 text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-sm"
            title="Intimidated by 15,000 photos? Try with 20 photos in 2 minutes"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Try 20 Photos</span>
            <span className="md:hidden">2-Min</span>
          </button>
        </div>

        {/* Center: Spread Navigation Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            type="button"
            onClick={onGoToCover}
            className={`px-3 py-1.5 rounded text-xs sm:text-sm font-serif transition-colors cursor-pointer ${
              isCover 
                ? 'bg-amber-400 text-stone-950 font-bold shadow' 
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

            <span className="text-xs sm:text-sm font-mono px-2.5 text-stone-200 select-none">
              {isCover ? 'Cover Plate' : `Spread ${currentSpreadIndex} / ${totalSpreads - 1}`}
            </span>

            <button
              type="button"
              onClick={onNextSpread}
              disabled={currentSpreadIndex >= totalSpreads - 1}
              className="p-1.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              title="Next Page Spread"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className="p-2 text-stone-400 hover:text-amber-300 hover:bg-stone-800 rounded cursor-pointer transition-colors"
            title={soundEnabled ? 'Page flip sound on' : 'Page flip sound muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Right: Actions, Features & Export */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Life Timeline Button */}
          <button
            type="button"
            onClick={onOpenTimeline}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-800 text-xs sm:text-sm transition-colors cursor-pointer"
            title="View Life Timeline & Suggested Event Chapters"
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="hidden xl:inline">Timeline</span>
          </button>

          {/* Duplicate Detection Button */}
          <button
            type="button"
            onClick={onOpenDuplicates}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs sm:text-sm transition-colors cursor-pointer border ${
              duplicateCount > 0
                ? 'bg-rose-950/80 text-rose-200 border-rose-700 hover:bg-rose-900'
                : 'bg-stone-900 text-stone-300 border-stone-800 hover:text-stone-100'
            }`}
            title="Inspect detected duplicates & burst shots"
          >
            <Copy className="w-4 h-4 text-rose-400" />
            {duplicateCount > 0 && (
              <span className="font-mono text-xs font-bold bg-rose-900 px-1.5 py-0.5 rounded text-rose-100">
                {duplicateCount}
              </span>
            )}
            <span className="hidden xl:inline">Duplicates</span>
          </button>

          {/* Slideshow Presentation Button */}
          <button
            type="button"
            onClick={onOpenSlideshow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-amber-300 hover:text-amber-200 border border-amber-500/50 text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-sm hover:border-amber-400"
            title="Present photos in sleek fullscreen slideshow"
          >
            <Play className="w-4 h-4 fill-current" />
            <span className="hidden md:inline">Slideshow</span>
          </button>

          {/* Add Photos Button */}
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-850 hover:bg-stone-800 text-stone-100 border border-stone-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Add Photos</span>
          </button>

          {/* Rearrange Button */}
          <button
            type="button"
            onClick={onOpenRearrangeMenu}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-800 text-xs sm:text-sm transition-colors cursor-pointer"
            title="Intelligently rearrange album layouts"
          >
            <Shuffle className="w-4 h-4 text-amber-300" />
            <span className="hidden lg:inline">Rearrange</span>
          </button>

          {/* Viewing Mode (Warm Archival vs Modern Dark Gallery) */}
          <button
            type="button"
            onClick={onToggleViewingMode}
            className="p-2 text-stone-300 hover:text-amber-300 hover:bg-stone-800 rounded border border-stone-800 transition-colors cursor-pointer"
            title={viewingMode === 'warm-archival' ? 'Switch to Modern Gallery Dark Mode' : 'Switch to Warm Archival Editorial Mode'}
          >
            {viewingMode === 'warm-archival' ? (
              <Moon className="w-4 h-4 text-stone-300" />
            ) : (
              <SunMedium className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Transparent Pricing (£0 vs £29.99) */}
          <button
            type="button"
            onClick={onOpenPricing}
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-amber-300 hover:text-amber-100 border border-amber-800/80 rounded bg-stone-950/80 hover:bg-stone-900 transition-colors cursor-pointer"
            title="Transparent One-Time Commercial Pricing"
          >
            <span className="font-mono text-xs">Free / Pro</span>
          </button>

          {/* Pre-Flight Print Inspector Button */}
          <button
            type="button"
            onClick={onOpenPrintInspector}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
              showPrintGuides 
                ? 'bg-amber-400 text-stone-950 font-bold border-amber-300 shadow' 
                : 'bg-stone-900 hover:bg-stone-800 text-stone-200 hover:text-white border-stone-800'
            }`}
            title="Pre-Flight Print Inspector: 300 DPI verification & bleed guides"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden xl:inline">Print Inspector</span>
            <span className="text-xs font-mono text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-700">
              300 DPI
            </span>
          </button>

          {/* Album Settings */}
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
