/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlbumMetadata, 
  AlbumPhoto, 
  AlbumPage, 
  PageTemplateId, 
  CoverMaterial, 
  FoilStyle 
} from './types/album';
import { INITIAL_ALBUM_META, INITIAL_PHOTOS, INITIAL_PAGES } from './data/sampleAlbum';
import { 
  autoArrangePhotosIntoPages, 
  buildAlbumSpreads, 
  playPageTurnSound 
} from './utils/arrangementEngine';
import { detectDuplicates } from './utils/duplicateDetector';
import { AlbumToolbar } from './components/album/AlbumToolbar';
import { AlbumCoverView } from './components/album/AlbumCoverView';
import { AlbumSpreadView } from './components/album/AlbumSpreadView';
import { AlbumFilmstrip } from './components/album/AlbumFilmstrip';
import { UploadPhotosModal } from './components/album/UploadPhotosModal';
import { DownloadModal } from './components/album/DownloadModal';
import { AlbumSettingsModal } from './components/album/AlbumSettingsModal';
import { RearrangeModal } from './components/album/RearrangeModal';
import { PrivacyCenterModal } from './components/privacy/PrivacyCenterModal';
import { QuickOnboardingModal } from './components/onboarding/QuickOnboardingModal';
import { DuplicateReviewModal } from './components/organizer/DuplicateReviewModal';
import { TimelineModal } from './components/organizer/TimelineModal';
import { PricingModal } from './components/pricing/PricingModal';
import { AlbumSlideshowModal } from './components/album/AlbumSlideshowModal';

export default function App() {
  const [meta, setMeta] = useState<AlbumMetadata>(INITIAL_ALBUM_META);
  const [photos, setPhotos] = useState<AlbumPhoto[]>(INITIAL_PHOTOS);
  const [pages, setPages] = useState<AlbumPage[]>(INITIAL_PAGES);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState<number>(0); // 0 = Cover
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [viewingMode, setViewingMode] = useState<'warm-archival' | 'dark-gallery'>('warm-archival');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRearrangeOpen, setIsRearrangeOpen] = useState(false);
  const [isPrivacyCenterOpen, setIsPrivacyCenterOpen] = useState(false);
  const [isQuickOnboardingOpen, setIsQuickOnboardingOpen] = useState(false);
  const [isDuplicateReviewOpen, setIsDuplicateReviewOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [slideshowStartPhotoIndex, setSlideshowStartPhotoIndex] = useState(0);

  // Compute duplicate clusters count
  const duplicateClusters = useMemo(() => {
    return detectDuplicates(photos);
  }, [photos]);

  const duplicateCount = duplicateClusters.reduce((acc, g) => acc + (g.photos.length - 1), 0);

  // Handlers for Slideshow Presentation
  const handleOpenSlideshow = (photoIndex: number = 0) => {
    setSlideshowStartPhotoIndex(photoIndex);
    setIsSlideshowOpen(true);
  };

  const handleViewPhoto = (photoId: string) => {
    const idx = photos.findIndex(p => p.id === photoId);
    handleOpenSlideshow(idx >= 0 ? idx : 0);
  };

  // Derive two-page spreads
  const spreads = useMemo(() => {
    return buildAlbumSpreads(pages);
  }, [pages]);

  // Turn page sound effect trigger
  const triggerTurnSound = () => {
    if (soundEnabled) {
      playPageTurnSound();
    }
  };

  // Navigation handlers
  const handleNextSpread = () => {
    if (currentSpreadIndex < spreads.length - 1) {
      triggerTurnSound();
      setCurrentSpreadIndex(prev => prev + 1);
    }
  };

  const handlePrevSpread = () => {
    if (currentSpreadIndex > 0) {
      triggerTurnSound();
      setCurrentSpreadIndex(prev => prev - 1);
    }
  };

  const handleGoToCover = () => {
    if (currentSpreadIndex !== 0) {
      triggerTurnSound();
      setCurrentSpreadIndex(0);
    }
  };

  const handleSelectSpread = (spreadIndex: number) => {
    if (spreadIndex !== currentSpreadIndex) {
      triggerTurnSound();
      setCurrentSpreadIndex(spreadIndex);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        handleNextSpread();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrevSpread();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleGoToCover();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpreadIndex, spreads.length, soundEnabled]);

  // Caption update handler for individual picture
  const handleUpdatePhotoCaption = (photoId: string, newCaption: string) => {
    setPhotos(prev =>
      prev.map(p => (p.id === photoId ? { ...p, caption: newCaption } : p))
    );
  };

  // Overall album narrative description update handler
  const handleUpdateAlbumDescription = (newDescription: string) => {
    setMeta(prev => ({
      ...prev,
      description: newDescription,
    }));
  };

  // Page template update handler
  const handleUpdatePageTemplate = (pageNumber: number, templateId: PageTemplateId) => {
    setPages(prev =>
      prev.map(p => (p.pageNumber === pageNumber ? { ...p, templateId } : p))
    );
  };

  // Remove photo handler
  const handleRemovePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    setPages(prev =>
      prev.map(p => ({
        ...p,
        photoIds: p.photoIds.filter(id => id !== photoId),
      }))
    );
  };

  // Upload handler (append or replace with smart arrangement)
  const handleConfirmUpload = (
    newPhotos: AlbumPhoto[],
    strategy: 'balanced' | 'chronological' | 'single-hero' | 'scrapbook',
    mode: 'append' | 'replace'
  ) => {
    let combinedPhotos: AlbumPhoto[];
    if (mode === 'replace') {
      combinedPhotos = newPhotos;
      setMeta(prev => ({
        ...prev,
        title: 'Personal Life Archive',
        subtitle: `${newPhotos.length} personal photographs arranged on-device`,
        description: 'A newly arranged collection of photographs preserved with zero cloud transmission.',
      }));
    } else {
      combinedPhotos = [...photos, ...newPhotos];
    }

    setPhotos(combinedPhotos);
    // Exclude duplicates from default spread binding
    const activePhotos = combinedPhotos.filter(p => !p.isDuplicate);
    const newPages = autoArrangePhotosIntoPages(activePhotos.length > 0 ? activePhotos : combinedPhotos, strategy);
    setPages(newPages);
    setCurrentSpreadIndex(1);
    triggerTurnSound();
  };

  // Onboarding completion handler
  const handleCompleteOnboarding = (newPhotos: AlbumPhoto[], customMeta?: Partial<AlbumMetadata>) => {
    setPhotos(newPhotos);
    if (customMeta) {
      setMeta(prev => ({ ...prev, ...customMeta }));
    }
    // Filter out duplicates so only hero shots appear in page spreads
    const activePhotos = newPhotos.filter(p => !p.isDuplicate);
    const newPages = autoArrangePhotosIntoPages(activePhotos.length > 0 ? activePhotos : newPhotos, 'balanced');
    setPages(newPages);
    setCurrentSpreadIndex(1);
    triggerTurnSound();
  };

  // Wipe sandbox handler (clears memory and resets to initial clean state)
  const handleWipeSandbox = () => {
    // Revoke any blob URLs
    photos.forEach(p => {
      if (p.url.startsWith('blob:')) {
        URL.revokeObjectURL(p.url);
      }
    });

    setPhotos([]);
    setPages([
      {
        pageNumber: 1,
        templateId: 'frontispiece',
        photoIds: [],
        customTitle: 'Opening Frontispiece',
      },
    ]);
    setMeta({
      id: 'album-empty',
      title: 'Untouched Darkroom Album',
      subtitle: 'Zero photos loaded in browser memory',
      description: 'Your local sandbox memory is completely clear. Click Add Photos or Try 20 Photos to bind a new album.',
      curator: 'Private Curator',
      dateRange: 'Present',
      coverMaterial: 'forest-linen',
      foilStyle: 'gold',
      cornerStyle: 'black-classic',
      createdAt: new Date().toISOString().split('T')[0],
    });
    setCurrentSpreadIndex(0);
    triggerTurnSound();
  };

  // Duplicate resolution handler: keeps chosen hero in book, flags others as excluded duplicates
  const handleKeepHeroAndExcludeOthers = (groupId: string, keptHeroId: string) => {
    const updatedPhotos = photos.map(p => {
      if (p.duplicateGroupId === groupId || p.id === keptHeroId) {
        return {
          ...p,
          isDuplicate: p.id !== keptHeroId,
        };
      }
      return p;
    });

    setPhotos(updatedPhotos);

    // Rebuild spreads with only active non-duplicate photos
    const activePhotos = updatedPhotos.filter(p => !p.isDuplicate);
    const updatedPages = autoArrangePhotosIntoPages(activePhotos, 'balanced');
    setPages(updatedPages);
    triggerTurnSound();
  };

  // Keep both frames in album
  const handleKeepAllInAlbum = (groupId: string) => {
    const updatedPhotos = photos.map(p => {
      if (p.duplicateGroupId === groupId) {
        return { ...p, isDuplicate: false };
      }
      return p;
    });

    setPhotos(updatedPhotos);
    const updatedPages = autoArrangePhotosIntoPages(updatedPhotos, 'balanced');
    setPages(updatedPages);
    triggerTurnSound();
  };

  // Select event album from Timeline view
  const handleSelectEventAlbum = (eventPhotos: AlbumPhoto[], eventTitle: string) => {
    setMeta(prev => ({
      ...prev,
      title: eventTitle,
      subtitle: `${eventPhotos.length} photographs from ${eventPhotos[0]?.date || 'this event chapter'}`,
      description: `A focused hardcover chapter documenting ${eventTitle}. Preserved 100% on-device with zero cloud exposure.`,
    }));

    const activePhotos = eventPhotos.filter(p => !p.isDuplicate);
    const eventPages = autoArrangePhotosIntoPages(activePhotos.length > 0 ? activePhotos : eventPhotos, 'balanced');
    setPages(eventPages);
    setCurrentSpreadIndex(1);
    triggerTurnSound();
  };

  // Rearrange album handler
  const handleConfirmRearrange = (strategy: 'balanced' | 'chronological' | 'single-hero' | 'scrapbook') => {
    const activePhotos = photos.filter(p => !p.isDuplicate);
    const newPages = autoArrangePhotosIntoPages(activePhotos.length > 0 ? activePhotos : photos, strategy);
    setPages(newPages);
    setCurrentSpreadIndex(1);
    triggerTurnSound();
  };

  // Meta update handler
  const handleSaveMeta = (updatedMeta: Partial<AlbumMetadata>) => {
    setMeta(prev => ({ ...prev, ...updatedMeta }));
  };

  const currentSpread = spreads[currentSpreadIndex] || spreads[0];

  return (
    <div className={`min-h-screen text-stone-100 flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950 font-sans transition-colors duration-300 ${
      viewingMode === 'warm-archival' ? 'bg-[#1c1917]' : 'bg-[#0c0a09]'
    }`}>
      {/* Top Navigation & Action Toolbar */}
      <AlbumToolbar
        meta={meta}
        currentSpreadIndex={currentSpreadIndex}
        totalSpreads={spreads.length}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
        onPrevSpread={handlePrevSpread}
        onNextSpread={handleNextSpread}
        onGoToCover={handleGoToCover}
        onOpenUploadModal={() => setIsUploadOpen(true)}
        onOpenDownloadModal={() => setIsDownloadOpen(true)}
        onOpenRearrangeMenu={() => setIsRearrangeOpen(true)}
        onOpenSettingsModal={() => setIsSettingsOpen(true)}
        onShowPrivacyCenter={() => setIsPrivacyCenterOpen(true)}
        onOpenSlideshow={() => handleOpenSlideshow(0)}
        onOpenOnboarding={() => setIsQuickOnboardingOpen(true)}
        onOpenDuplicates={() => setIsDuplicateReviewOpen(true)}
        duplicateCount={duplicateCount}
        onOpenTimeline={() => setIsTimelineOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        viewingMode={viewingMode}
        onToggleViewingMode={() => setViewingMode(prev => prev === 'warm-archival' ? 'dark-gallery' : 'warm-archival')}
      />

      {/* Main Archival Desk Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center py-6 px-2 sm:px-6 relative overflow-x-hidden">
        {/* Subtle Archival Mat Backdrop */}
        <div className={`absolute inset-0 [background-size:24px_24px] pointer-events-none transition-opacity ${
          viewingMode === 'warm-archival'
            ? 'bg-[radial-gradient(#292524_1px,transparent_1px)] opacity-40'
            : 'bg-[radial-gradient(#1c1917_1px,transparent_1px)] opacity-20'
        }`} />

        {/* View Switch: Closed Cover vs. Open Spread */}
        {currentSpreadIndex === 0 ? (
          <AlbumCoverView
            meta={meta}
            photoCount={photos.length}
            onOpenAlbum={() => {
              triggerTurnSound();
              setCurrentSpreadIndex(1);
            }}
            onEditCoverSettings={() => setIsSettingsOpen(true)}
            onQuickMaterialChange={(mat) => setMeta(prev => ({ ...prev, coverMaterial: mat }))}
            onQuickFoilChange={(foil) => setMeta(prev => ({ ...prev, foilStyle: foil }))}
          />
        ) : (
          <div className="w-full flex flex-col items-center">
            <AlbumSpreadView
              spread={currentSpread}
              meta={meta}
              photos={photos}
              onUpdatePhotoCaption={handleUpdatePhotoCaption}
              onUpdateAlbumDescription={handleUpdateAlbumDescription}
              onUpdatePageTemplate={handleUpdatePageTemplate}
              onRemovePhotoFromPage={handleRemovePhoto}
              onOpenUploadModal={() => setIsUploadOpen(true)}
              onViewPhoto={handleViewPhoto}
            />
          </div>
        )}
      </main>

      {/* Bottom Filmstrip Spread Navigator */}
      <AlbumFilmstrip
        spreads={spreads}
        currentSpreadIndex={currentSpreadIndex}
        meta={meta}
        photos={photos}
        onSelectSpread={handleSelectSpread}
        onOpenSlideshow={() => handleOpenSlideshow(0)}
      />

      {/* Modals & Flow Controllers */}
      <QuickOnboardingModal
        isOpen={isQuickOnboardingOpen}
        onClose={() => setIsQuickOnboardingOpen(false)}
        onCompleteOnboarding={handleCompleteOnboarding}
        onOpenDuplicates={() => setIsDuplicateReviewOpen(true)}
        onOpenTimeline={() => setIsTimelineOpen(true)}
      />

      <PrivacyCenterModal
        isOpen={isPrivacyCenterOpen}
        onClose={() => setIsPrivacyCenterOpen(false)}
        photos={photos}
        onWipeSandbox={handleWipeSandbox}
      />

      <DuplicateReviewModal
        isOpen={isDuplicateReviewOpen}
        onClose={() => setIsDuplicateReviewOpen(false)}
        photos={photos}
        onKeepHeroAndExcludeOthers={handleKeepHeroAndExcludeOthers}
        onKeepAllInAlbum={handleKeepAllInAlbum}
      />

      <TimelineModal
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        photos={photos}
        onSelectEventAlbum={handleSelectEventAlbum}
        onPlayEventSlideshow={handleOpenSlideshow}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
      />

      <UploadPhotosModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onConfirmUpload={handleConfirmUpload}
      />

      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        meta={meta}
        photos={photos}
        pages={pages}
        currentSpreadIndex={currentSpreadIndex}
      />

      <AlbumSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        meta={meta}
        onSaveMeta={handleSaveMeta}
      />

      <RearrangeModal
        isOpen={isRearrangeOpen}
        onClose={() => setIsRearrangeOpen(false)}
        onConfirmRearrange={handleConfirmRearrange}
        photoCount={photos.length}
      />

      <AlbumSlideshowModal
        isOpen={isSlideshowOpen}
        onClose={() => setIsSlideshowOpen(false)}
        photos={photos}
        pages={pages}
        meta={meta}
        initialPhotoIndex={slideshowStartPhotoIndex}
      />
    </div>
  );
}
