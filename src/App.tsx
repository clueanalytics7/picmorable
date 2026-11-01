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
import { AlbumToolbar } from './components/album/AlbumToolbar';
import { AlbumCoverView } from './components/album/AlbumCoverView';
import { AlbumSpreadView } from './components/album/AlbumSpreadView';
import { AlbumFilmstrip } from './components/album/AlbumFilmstrip';
import { UploadPhotosModal } from './components/album/UploadPhotosModal';
import { DownloadModal } from './components/album/DownloadModal';
import { AlbumSettingsModal } from './components/album/AlbumSettingsModal';
import { RearrangeModal } from './components/album/RearrangeModal';
import { PrivacyModal } from './components/album/PrivacyModal';
import { AlbumSlideshowModal } from './components/album/AlbumSlideshowModal';

export default function App() {
  const [meta, setMeta] = useState<AlbumMetadata>(INITIAL_ALBUM_META);
  const [photos, setPhotos] = useState<AlbumPhoto[]>(INITIAL_PHOTOS);
  const [pages, setPages] = useState<AlbumPage[]>(INITIAL_PAGES);
  const [currentSpreadIndex, setCurrentSpreadIndex] = useState<number>(0); // 0 = Cover
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRearrangeOpen, setIsRearrangeOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);
  const [slideshowStartPhotoIndex, setSlideshowStartPhotoIndex] = useState(0);

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
      // Don't intercept if user is typing in input or textarea
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
      // Also update album title to reflect newly uploaded batch
      setMeta(prev => ({
        ...prev,
        title: 'My Preserved Album',
        subtitle: `${newPhotos.length} personal photographs arranged on-device`,
        description: 'A newly arranged collection of photographs preserved with zero cloud transmission.',
      }));
    } else {
      combinedPhotos = [...photos, ...newPhotos];
    }

    setPhotos(combinedPhotos);
    const newPages = autoArrangePhotosIntoPages(combinedPhotos, strategy);
    setPages(newPages);
    setCurrentSpreadIndex(1); // Jump straight to opening spread
    triggerTurnSound();
  };

  // Rearrange album handler
  const handleConfirmRearrange = (strategy: 'balanced' | 'chronological' | 'single-hero' | 'scrapbook') => {
    const newPages = autoArrangePhotosIntoPages(photos, strategy);
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
    <div className="min-h-screen bg-[#1c1917] text-stone-100 flex flex-col justify-between selection:bg-amber-400 selection:text-stone-950 font-sans">
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
        onShowPrivacyInfo={() => setIsPrivacyOpen(true)}
        onOpenSlideshow={() => handleOpenSlideshow(0)}
      />

      {/* Main Archival Desk Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center py-6 px-2 sm:px-6 relative overflow-x-hidden">
        {/* Subtle Archival Mat Backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#292524_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

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

      {/* Modals */}
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

      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
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
