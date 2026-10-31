import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { PhotosLibrary } from './components/PhotosLibrary';
import { AlbumsView } from './components/AlbumsView';
import { TimelineView } from './components/TimelineView';
import { PlacesView } from './components/PlacesView';
import { MemoriesView } from './components/MemoriesView';
import { PhotoDetailModal } from './components/PhotoDetailModal';
import { SearchDialog } from './components/SearchDialog';
import { ImportModal } from './components/ImportModal';
import { DuplicateReviewModal } from './components/DuplicateReviewModal';
import { MemoryBookModal } from './components/MemoryBookModal';
import { PrivacyPricingModal } from './components/PrivacyPricingModal';
import { SAMPLE_PHOTOS, SAMPLE_ALBUMS, SAMPLE_DUPLICATES, TIMELINE_YEARS } from './data/sampleArchive';
import { PhotoItem, AlbumItem, DuplicateGroup, CaptionStyle } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [photos, setPhotos] = useState<PhotoItem[]>(SAMPLE_PHOTOS);
  const [albums, setAlbums] = useState<AlbumItem[]>(SAMPLE_ALBUMS);
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>(SAMPLE_DUPLICATES);

  // Modals state
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [selectedBookAlbum, setSelectedBookAlbum] = useState<AlbumItem | null>(null);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [isDuplicatesOpen, setIsDuplicatesOpen] = useState<boolean>(false);

  // Unresolved duplicate count
  const unresolvedDuplicatesCount = duplicates.filter(d => !d.resolved).length;

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update caption handler
  const handleUpdateCaption = (photoId: string, style: CaptionStyle, newText: string) => {
    setPhotos(prev =>
      prev.map(p => {
        if (p.id !== photoId) return p;
        return {
          ...p,
          captions: {
            ...p.captions,
            userCustom: newText.trim() ? newText : undefined,
          },
          provenance: {
            ...p.provenance,
            isUserConfirmed: true,
          },
        };
      })
    );

    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto(prev =>
        prev
          ? {
              ...prev,
              captions: {
                ...prev.captions,
                userCustom: newText.trim() ? newText : undefined,
              },
              provenance: {
                ...prev.provenance,
                isUserConfirmed: true,
              },
            }
          : null
      );
    }
  };

  // Confirm provenance handler
  const handleConfirmProvenance = (photoId: string) => {
    setPhotos(prev =>
      prev.map(p => {
        if (p.id !== photoId) return p;
        return {
          ...p,
          provenance: {
            ...p.provenance,
            isUserConfirmed: true,
          },
        };
      })
    );

    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto(prev =>
        prev
          ? {
              ...prev,
              provenance: {
                ...prev.provenance,
                isUserConfirmed: true,
              },
            }
          : null
      );
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (photoId: string) => {
    setPhotos(prev =>
      prev.map(p => (p.id === photoId ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // Approve album
  const handleApproveAlbum = (albumId: string) => {
    setAlbums(prev =>
      prev.map(a => (a.id === albumId ? { ...a, status: 'approved' } : a))
    );
  };

  // Update album story
  const handleUpdateAlbumStory = (albumId: string, newStory: string) => {
    setAlbums(prev =>
      prev.map(a => (a.id === albumId ? { ...a, userStory: newStory } : a))
    );
  };

  // Resolve duplicate group
  const handleResolveDuplicate = (groupId: string, resolution: 'keep_all' | 'keep_primary') => {
    setDuplicates(prev =>
      prev.map(d => (d.id === groupId ? { ...d, resolved: true, resolution } : d))
    );

    if (resolution === 'keep_primary') {
      const targetGroup = duplicates.find(d => d.id === groupId);
      if (targetGroup) {
        // Hide duplicate from view
        setPhotos(prev =>
          prev.map(p =>
            targetGroup.duplicatePhotoIds.includes(p.id)
              ? { ...p, isExactDuplicate: true }
              : p
          )
        );
      }
    }
  };

  // Create custom album from selection
  const handleCreateAlbumFromPhotos = (photoIds: string[]) => {
    const selectedList = photos.filter(p => photoIds.includes(p.id));
    if (selectedList.length === 0) return;

    const newAlbum: AlbumItem = {
      id: `album-custom-${Date.now()}`,
      title: 'Custom Memory Collection',
      subtitle: `${selectedList.length} photographs curated by you`,
      coverPhotoUrl: selectedList[0].url,
      photoIds: photoIds,
      type: 'user_created',
      dateRange: {
        start: selectedList[0].exif.dateTaken.split(' ')[0],
        end: selectedList[selectedList.length - 1].exif.dateTaken.split(' ')[0],
      },
      locations: Array.from(new Set(selectedList.map(p => p.exif.locationName))),
      aiSummary: 'Personal curation created from your selected photographs.',
      confidence: 'high',
      status: 'approved',
      themes: ['Curated', 'Memories'],
    };

    setAlbums(prev => [newAlbum, ...prev]);
    setActiveTab('albums');
  };

  // Photo Navigation in modal
  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Bar Contract compliant Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        onOpenDuplicates={() => setIsDuplicatesOpen(true)}
        unresolvedDuplicatesCount={unresolvedDuplicatesCount}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeDashboard
            photos={photos}
            albums={albums}
            timelineYears={TIMELINE_YEARS}
            onSelectPhoto={(photo) => setSelectedPhoto(photo)}
            onSelectAlbum={(album) => {
              setSelectedBookAlbum(album);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenBookPreview={(album) => setSelectedBookAlbum(album)}
            onOpenDuplicates={() => setIsDuplicatesOpen(true)}
            unresolvedDuplicatesCount={unresolvedDuplicatesCount}
          />
        )}

        {activeTab === 'photos' && (
          <PhotosLibrary
            photos={photos}
            onSelectPhoto={(photo) => setSelectedPhoto(photo)}
            onToggleFavorite={handleToggleFavorite}
            onCreateAlbumFromPhotos={handleCreateAlbumFromPhotos}
          />
        )}

        {activeTab === 'albums' && (
          <AlbumsView
            albums={albums}
            photos={photos}
            onSelectPhoto={(photo) => setSelectedPhoto(photo)}
            onOpenBookPreview={(album) => setSelectedBookAlbum(album)}
            onApproveAlbum={handleApproveAlbum}
            onUpdateAlbumStory={handleUpdateAlbumStory}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineView
            timelineYears={TIMELINE_YEARS}
            photos={photos}
            onSelectPhoto={(photo) => setSelectedPhoto(photo)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'places' && (
          <PlacesView
            photos={photos}
            onSelectPhoto={(photo) => setSelectedPhoto(photo)}
          />
        )}

        {activeTab === 'memories' && (
          <MemoriesView
            photos={photos}
            albums={albums}
            onSelectPhoto={(photo) => setSelectedPhoto(photo)}
            onOpenBookPreview={(album) => setSelectedBookAlbum(album)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-stone-200 py-6 px-6 bg-stone-100 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif font-bold text-stone-800">Memoria</span>
            <span>·</span>
            <span>Turn your scattered photographs into a beautiful, searchable story of your life.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-stone-900 hover:underline cursor-pointer"
            >
              UK GDPR & Trust Commitments
            </button>
            <span>·</span>
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-stone-900 hover:underline cursor-pointer"
            >
              Preservation Pricing
            </button>
            <span>·</span>
            <span>© 2026 Memoria Ltd</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      {selectedPhoto && (
        <PhotoDetailModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onUpdateCaption={handleUpdateCaption}
          onConfirmProvenance={handleConfirmProvenance}
          onNext={handleNextPhoto}
          onPrev={handlePrevPhoto}
          onOpenBookFromPhoto={(albumId) => {
            setSelectedPhoto(null);
            const foundAlbum = albums.find(a => a.id === albumId) || albums[0];
            setSelectedBookAlbum(foundAlbum);
          }}
        />
      )}

      {selectedBookAlbum && (
        <MemoryBookModal
          album={selectedBookAlbum}
          photos={photos}
          onClose={() => setSelectedBookAlbum(null)}
        />
      )}

      <SearchDialog
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        photos={photos}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
      />

      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportComplete={(newPhotos) => {
          setPhotos(prev => [...newPhotos, ...prev]);
        }}
      />

      <DuplicateReviewModal
        isOpen={isDuplicatesOpen}
        onClose={() => setIsDuplicatesOpen(false)}
        duplicates={duplicates}
        photos={photos}
        onResolveGroup={handleResolveDuplicate}
      />

      <PrivacyPricingModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        photos={photos}
      />

    </div>
  );
}
