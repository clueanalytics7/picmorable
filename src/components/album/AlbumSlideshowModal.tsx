/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Info, 
  Eye, 
  EyeOff, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Clock,
  BookOpen,
  Mic,
  Volume2,
  Square
} from 'lucide-react';
import { AlbumMetadata, AlbumPhoto, AlbumPage } from '../../types/album';

interface AlbumSlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: AlbumPhoto[];
  pages: AlbumPage[];
  meta: AlbumMetadata;
  initialPhotoIndex?: number;
}

export const AlbumSlideshowModal: React.FC<AlbumSlideshowModalProps> = ({
  isOpen,
  onClose,
  photos,
  pages,
  meta,
  initialPhotoIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalDuration, setIntervalDuration] = useState<number>(5000); // 5s default
  const [showCaptions, setShowCaptions] = useState(true);
  const [showInfoDrawer, setShowInfoDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Stop voice audio when photo changes or modal closes
  useEffect(() => {
    if (voiceAudioRef.current) {
      voiceAudioRef.current.pause();
      voiceAudioRef.current = null;
    }
    setIsPlayingVoice(false);
  }, [currentIndex, isOpen]);

  // Sync initial photo when modal opens
  useEffect(() => {
    if (isOpen) {
      const validIndex = Math.min(Math.max(0, initialPhotoIndex), Math.max(0, photos.length - 1));
      setCurrentIndex(validIndex);
      setProgress(0);
    }
  }, [isOpen, initialPhotoIndex, photos.length]);

  // Find which page this photo belongs to
  const currentPhoto = photos[currentIndex];
  const currentPage = pages.find((p) => p.photoIds.includes(currentPhoto?.id));

  // Navigation handlers
  const handleNext = useCallback(() => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const handlePrev = useCallback(() => {
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Autoplay progression & progress bar
  useEffect(() => {
    if (!isOpen || !isPlaying || photos.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      setProgress(0);
      return;
    }

    const stepMs = 50;
    const totalSteps = intervalDuration / stepMs;
    let stepCount = 0;

    progressTimerRef.current = setInterval(() => {
      stepCount++;
      const currentPct = Math.min(100, Math.round((stepCount / totalSteps) * 100));
      setProgress(currentPct);

      if (stepCount >= totalSteps) {
        stepCount = 0;
        setProgress(0);
        handleNext();
      }
    }, stepMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isOpen, isPlaying, intervalDuration, photos.length, handleNext]);

  // Scroll active thumbnail into center view
  useEffect(() => {
    if (thumbnailScrollRef.current) {
      const activeThumb = thumbnailScrollRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentIndex]);

  // Toggle true browser fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Voice note play/pause handler
  const handleToggleVoicePlay = () => {
    if (!currentPhoto?.voiceNoteUrl) return;

    if (isPlayingVoice) {
      voiceAudioRef.current?.pause();
      setIsPlayingVoice(false);
    } else {
      if (!voiceAudioRef.current || voiceAudioRef.current.src !== currentPhoto.voiceNoteUrl) {
        voiceAudioRef.current = new Audio(currentPhoto.voiceNoteUrl);
        voiceAudioRef.current.onended = () => setIsPlayingVoice(false);
        voiceAudioRef.current.onerror = () => setIsPlayingVoice(false);
      }
      voiceAudioRef.current.play().then(() => {
        setIsPlayingVoice(true);
      }).catch((e) => {
        console.warn('Voice play blocked', e);
        setIsPlayingVoice(false);
      });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen && document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setShowCaptions((prev) => !prev);
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setShowInfoDrawer((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, handleNext, handlePrev, onClose]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#0c0a09] text-stone-100 flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-300"
    >
      {/* Ambient Vignette & Cinema Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,30,20,0.15)_0%,rgba(5,5,5,0.92)_100%)] pointer-events-none" />

      {/* Top Presentation Bar */}
      <div className="relative z-20 px-4 sm:px-8 py-3.5 bg-gradient-to-b from-stone-950 via-stone-950/80 to-transparent flex items-center justify-between gap-4 border-b border-stone-800/40">
        {/* Left: Album Meta & Photo Counter */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-amber-100 text-sm sm:text-base tracking-wide">
                {meta.title}
              </span>
              {currentPage && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-800 text-amber-300 border border-stone-700">
                  Plate {currentPage.pageNumber}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-300 font-mono">
              Photo {currentIndex + 1} of {photos.length}
            </p>
          </div>
        </div>

        {/* Center: Autoplay Controls & Speed */}
        <div className="flex items-center gap-2 sm:gap-3 bg-stone-900/90 border border-stone-800 rounded-full px-3.5 py-1.5 shadow-lg backdrop-blur-md">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={() => setIsPlaying((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            title={isPlaying ? 'Pause presentation (Space)' : 'Play presentation (Space)'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5 text-xs text-stone-300 border-l border-stone-700 pl-2.5">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={intervalDuration}
              onChange={(e) => setIntervalDuration(Number(e.target.value))}
              className="bg-transparent text-stone-200 text-xs font-mono focus:outline-none cursor-pointer"
              title="Slideshow interval speed"
            >
              <option value={3000} className="bg-stone-900 text-stone-200">Fast (3s)</option>
              <option value={5000} className="bg-stone-900 text-stone-200">Normal (5s)</option>
              <option value={8000} className="bg-stone-900 text-stone-200">Slow (8s)</option>
            </select>
          </div>
        </div>

        {/* Right: Presentation Utilities */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Toggle Caption visibility */}
          <button
            type="button"
            onClick={() => setShowCaptions((prev) => !prev)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showCaptions ? 'text-amber-300 bg-stone-800' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
            title="Toggle archival caption card (C)"
          >
            {showCaptions ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* Toggle Info Details Drawer */}
          <button
            type="button"
            onClick={() => setShowInfoDrawer((prev) => !prev)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showInfoDrawer ? 'text-amber-300 bg-stone-800' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
            }`}
            title="Toggle photograph metadata info (I)"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Toggle Browser Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 rounded-lg transition-colors cursor-pointer"
            title="Toggle browser fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close Slideshow */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800/80 rounded-lg transition-colors cursor-pointer ml-1"
            title="Exit slideshow (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar for Autoplay */}
      {isPlaying && (
        <div className="relative z-20 w-full bg-stone-800/50 h-0.5">
          <div
            className="bg-amber-400 h-full transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Main Cinema Viewport */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 sm:left-8 z-30 p-3 sm:p-4 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-stone-300 hover:text-white border border-stone-700/50 hover:border-amber-400/80 transition-all cursor-pointer shadow-2xl backdrop-blur-sm group"
          title="Previous Photograph (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 sm:right-8 z-30 p-3 sm:p-4 rounded-full bg-stone-900/60 hover:bg-stone-900/90 text-stone-300 hover:text-white border border-stone-700/50 hover:border-amber-400/80 transition-all cursor-pointer shadow-2xl backdrop-blur-sm group"
          title="Next Photograph (Right Arrow)"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* The Displayed Photograph with Antique Mount Effect */}
        <div className="relative z-10 max-w-5xl max-h-[70vh] flex flex-col items-center justify-center">
          <div className="relative p-2.5 sm:p-3.5 bg-white shadow-2xl rounded-sm border border-stone-300 transition-transform duration-500 max-h-[66vh] flex items-center justify-center">
            {/* Vintage Black Photo Corners */}
            <div className="absolute -top-2 -left-2 w-5 h-5 border-t-3 border-l-3 border-stone-900 pointer-events-none" />
            <div className="absolute -top-2 -right-2 w-5 h-5 border-t-3 border-r-3 border-stone-900 pointer-events-none" />
            <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-3 border-l-3 border-stone-900 pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-3 border-r-3 border-stone-900 pointer-events-none" />

            <img
              key={currentPhoto.id}
              src={currentPhoto.url}
              alt={currentPhoto.caption || currentPhoto.name}
              className="max-h-[62vh] max-w-[85vw] object-contain block select-none animate-in fade-in zoom-in-95 duration-300"
            />
          </div>

          {/* Archival Caption Card Plate */}
          {showCaptions && (
            <div className="mt-4 max-w-2xl w-full bg-stone-950/90 border border-stone-800 rounded-xl px-6 py-3.5 text-center shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-2 duration-200">
              <p className="font-serif italic text-base sm:text-lg text-amber-100 tracking-wide leading-relaxed">
                "{currentPhoto.caption || currentPhoto.name}"
              </p>

              {(currentPhoto.date || currentPhoto.location || currentPage) && (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-xs sm:text-sm text-stone-300 font-mono">
                  {currentPhoto.date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {currentPhoto.date}
                    </span>
                  )}
                  {currentPhoto.date && currentPhoto.location && <span>·</span>}
                  {currentPhoto.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {currentPhoto.location}
                    </span>
                  )}
                  {currentPage && (
                    <>
                      <span>·</span>
                      <span className="text-stone-400">
                        Album Plate {currentPage.pageNumber} ({currentPage.templateId})
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Voice Memory Note Player if recorded on-device */}
              {currentPhoto.voiceNoteUrl && (
                <div className="mt-3 flex items-center justify-center pt-2 border-t border-stone-800/80">
                  <button
                    type="button"
                    onClick={handleToggleVoicePlay}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-sans transition-all cursor-pointer shadow-md ${
                      isPlayingVoice
                        ? 'bg-amber-400 text-stone-950 font-bold animate-pulse'
                        : 'bg-amber-950/80 border border-amber-600/70 text-amber-200 hover:bg-amber-900'
                    }`}
                    title="Play spoken voice memory recorded on-device"
                  >
                    {isPlayingVoice ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
                        <span>Stop Spoken Memory</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-amber-400" />
                        <span>Listen to Spoken Memory</span>
                      </>
                    )}
                    {currentPhoto.voiceDuration && (
                      <span className="font-mono text-xs opacity-80">
                        ({currentPhoto.voiceDuration}s)
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Drawer (Flyout when toggled) */}
        {showInfoDrawer && (
          <div className="absolute right-4 top-16 z-40 w-80 bg-stone-900/95 border border-stone-800 rounded-xl p-4 shadow-2xl backdrop-blur-md text-xs sm:text-sm space-y-3 animate-in fade-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800">
              <div className="flex items-center gap-2 font-serif font-bold text-amber-200 text-sm sm:text-base">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Photograph Info</span>
              </div>
              <button
                type="button"
                onClick={() => setShowInfoDrawer(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-stone-300 font-mono text-xs sm:text-sm">
              <div>
                <span className="text-stone-400 block text-xs">Filename:</span>
                <span className="truncate block text-stone-100 font-medium">{currentPhoto.name}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-xs">Aspect Ratio:</span>
                <span className="capitalize text-stone-200">{currentPhoto.aspectRatio}</span>
              </div>
              {currentPhoto.date && (
                <div>
                  <span className="text-stone-400 block text-xs">Capture Date:</span>
                  <span className="text-stone-200">{currentPhoto.date}</span>
                </div>
              )}
              {currentPhoto.location && (
                <div>
                  <span className="text-stone-400 block text-xs">Location:</span>
                  <span className="text-stone-200">{currentPhoto.location}</span>
                </div>
              )}
              {currentPhoto.voiceNoteUrl && (
                <div>
                  <span className="text-stone-400 block text-xs">Voice Memory:</span>
                  <span className="text-amber-300">Recorded ({currentPhoto.voiceDuration || 15}s audio clip)</span>
                </div>
              )}
              <div>
                <span className="text-stone-400 block text-xs">Preservation Status:</span>
                <span className="text-emerald-400 font-semibold">100% On-Device (0 KB uploaded)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Thumbnail Scrubber Filmstrip */}
      <div className="relative z-20 bg-stone-950/95 border-t border-stone-800 px-4 py-3">
        <div
          ref={thumbnailScrollRef}
          className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-transparent max-w-6xl mx-auto"
        >
          {photos.map((p, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setProgress(0);
                  setCurrentIndex(idx);
                }}
                className={`relative shrink-0 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 scale-105 shadow-lg shadow-amber-400/20'
                    : 'border-stone-800 opacity-60 hover:opacity-100 hover:border-stone-600'
                }`}
                style={{ width: '64px', height: '48px' }}
                title={`Jump to photo ${idx + 1}: ${p.caption || p.name}`}
              >
                <img
                  src={p.url}
                  alt={p.name}
                  className="w-full h-full object-cover select-none"
                />
                <span className="absolute bottom-0 right-0 bg-black/85 text-xs font-mono px-1.5 py-0.5 text-stone-200">
                  {idx + 1}
                </span>
                {p.voiceNoteUrl && (
                  <span className="absolute top-0.5 right-0.5 bg-amber-500 text-stone-950 rounded-full p-0.5 shadow">
                    <Mic className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Keyboard hints footer */}
        <div className="text-center text-xs text-stone-400 font-mono mt-1.5 hidden sm:block">
          [Space] Play/Pause · [← / →] Navigate · [F] Fullscreen · [C] Toggle Caption · [Esc] Exit
        </div>
      </div>
    </div>
  );
};
