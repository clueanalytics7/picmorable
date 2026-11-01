/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlbumMetadata, AlbumPage, AlbumPhoto, AlbumSpread, PageTemplateId } from '../../types/album';
import { AlbumPhotoMount } from './AlbumPhotoMount';
import { LayoutGrid, Edit3, Check, Plus, Sparkles, Feather } from 'lucide-react';

interface AlbumSpreadViewProps {
  spread: AlbumSpread;
  meta: AlbumMetadata;
  photos: AlbumPhoto[];
  onUpdatePhotoCaption: (photoId: string, caption: string) => void;
  onUpdateAlbumDescription: (newDescription: string) => void;
  onUpdatePageTemplate: (pageNumber: number, templateId: PageTemplateId) => void;
  onRemovePhotoFromPage?: (photoId: string) => void;
  onOpenUploadModal: () => void;
  onViewPhoto?: (photoId: string) => void;
}

export const AlbumSpreadView: React.FC<AlbumSpreadViewProps> = ({
  spread,
  meta,
  photos,
  onUpdatePhotoCaption,
  onUpdateAlbumDescription,
  onUpdatePageTemplate,
  onRemovePhotoFromPage,
  onOpenUploadModal,
  onViewPhoto,
}) => {
  const [isEditingAlbumStory, setIsEditingAlbumStory] = useState(false);
  const [draftAlbumStory, setDraftAlbumStory] = useState(meta.description);

  const photoMap = new Map(photos.map(p => [p.id, p]));

  const handleSaveAlbumStory = () => {
    onUpdateAlbumDescription(draftAlbumStory);
    setIsEditingAlbumStory(false);
  };

  // Leather border trim class
  const getCoverTrimClass = () => {
    switch (meta.coverMaterial) {
      case 'forest-linen':
        return 'bg-[#1b3425] border-[#14261b]';
      case 'navy-buckram':
        return 'bg-[#14233c] border-[#0d1829]';
      case 'sandstone-cloth':
        return 'bg-[#6c5e4d] border-[#524638]';
      case 'espresso-calfskin':
        return 'bg-[#2b1c14] border-[#1c120c]';
      case 'burgundy-leather':
      default:
        return 'bg-[#431422] border-[#2e0e17]';
    }
  };

  // Render Page Content based on Template
  const renderPageContent = (page: AlbumPage, isLeft: boolean) => {
    const pagePhotos = page.photoIds.map(id => photoMap.get(id)).filter(Boolean) as AlbumPhoto[];

    // Template 1: Frontispiece (Title Page & Album Narrative)
    if (page.templateId === 'frontispiece') {
      const heroPhoto = pagePhotos[0];

      return (
        <div className="h-full flex flex-col justify-between p-4 sm:p-8">
          {/* Header Stamp */}
          <div className="text-center border-b border-stone-300 pb-4">
            <div className="flex items-center justify-center gap-2 text-stone-500 font-mono text-[10px] tracking-[0.25em] uppercase">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
              <span>{meta.curator || 'Family Archival Collection'}</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-2 tracking-tight">
              {meta.title}
            </h2>

            {meta.subtitle && (
              <p className="font-serif italic text-stone-600 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                {meta.subtitle}
              </p>
            )}

            {meta.dateRange && (
              <p className="font-mono text-[10px] text-stone-400 mt-2 uppercase tracking-widest">
                — {meta.dateRange} —
              </p>
            )}
          </div>

          {/* Center: Story & Frontispiece Photograph */}
          <div className="my-auto py-4 space-y-4">
            {/* Album Narrative Description Section */}
            <div className="bg-stone-50/80 p-4 rounded-sm border border-stone-200/90 shadow-inner">
              <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-stone-200">
                <div className="flex items-center gap-1.5 text-stone-700">
                  <Feather className="w-3.5 h-3.5 text-amber-700" />
                  <span className="font-serif italic font-semibold text-xs tracking-wide">
                    The Story of This Album
                  </span>
                </div>
                {!isEditingAlbumStory && (
                  <button
                    type="button"
                    onClick={() => {
                      setDraftAlbumStory(meta.description);
                      setIsEditingAlbumStory(true);
                    }}
                    className="text-[11px] text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <Edit3 className="w-3 h-3" /> Edit Story
                  </button>
                )}
              </div>

              {isEditingAlbumStory ? (
                <div className="space-y-2">
                  <textarea
                    value={draftAlbumStory}
                    onChange={(e) => setDraftAlbumStory(e.target.value)}
                    rows={4}
                    placeholder="Write a brief or rich description about this entire album, who was there, and why these memories matter..."
                    className="w-full text-xs font-serif text-stone-900 bg-white p-2 border border-amber-300 rounded focus:outline-none leading-relaxed"
                    autoFocus
                  />
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-500 text-[10px]">Saved entirely on your device</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsEditingAlbumStory(false)}
                        className="px-2 py-0.5 text-stone-600 hover:text-stone-900 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveAlbumStory}
                        className="px-3 py-1 bg-stone-900 text-amber-50 rounded text-xs font-medium flex items-center gap-1 cursor-pointer hover:bg-stone-800"
                      >
                        <Check className="w-3 h-3" /> Save Story
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setDraftAlbumStory(meta.description);
                    setIsEditingAlbumStory(true);
                  }}
                  className="cursor-pointer group/story"
                  title="Click to write the narrative of this album"
                >
                  <p className="font-serif italic text-xs sm:text-[13px] text-stone-700 leading-relaxed group-hover/story:text-stone-900 transition-colors">
                    {meta.description || 'Click here to write the narrative description of this entire album...'}
                  </p>
                </div>
              )}
            </div>

            {/* Frontispiece Image */}
            {heroPhoto ? (
              <div className="max-w-xs mx-auto">
                <AlbumPhotoMount
                  photo={heroPhoto}
                  cornerStyle={meta.cornerStyle}
                  onUpdateCaption={onUpdatePhotoCaption}
                  onRemovePhoto={onRemovePhotoFromPage}
                  onViewPhoto={onViewPhoto}
                  imageClassName="max-h-48 sm:max-h-56 object-cover"
                />
              </div>
            ) : (
              <div
                onClick={onOpenUploadModal}
                className="max-w-xs mx-auto border-2 border-dashed border-stone-300 hover:border-amber-700/60 p-6 rounded text-center cursor-pointer transition-colors bg-stone-50/50"
              >
                <Plus className="w-6 h-6 text-stone-400 mx-auto mb-1" />
                <p className="text-xs font-serif text-stone-600">Mount an opening photograph</p>
              </div>
            )}
          </div>

          {/* Footer Stamped Signature */}
          <div className="text-center pt-3 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-400 font-mono">
            <span>PLATE NO. 1</span>
            <span className="italic font-serif">Preserved in Private Archives</span>
            <span>{meta.dateRange || '1998'}</span>
          </div>
        </div>
      );
    }

    // Template 2: Hero Single Photo
    if (page.templateId === 'hero-single' || page.templateId === 'full-bleed') {
      const p = pagePhotos[0];
      return (
        <div className="h-full flex flex-col justify-between p-4 sm:p-8">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
              {page.customTitle || `Plate ${page.pageNumber}`}
            </span>
            <TemplatePicker
              current={page.templateId}
              onChange={(t) => onUpdatePageTemplate(page.pageNumber, t)}
            />
          </div>

          <div className="my-auto py-4 flex items-center justify-center">
            {p ? (
              <AlbumPhotoMount
                photo={p}
                cornerStyle={meta.cornerStyle}
                onUpdateCaption={onUpdatePhotoCaption}
                onRemovePhoto={onRemovePhotoFromPage}
                onViewPhoto={onViewPhoto}
                className="max-w-md w-full"
                imageClassName="max-h-[380px] w-full object-contain"
              />
            ) : (
              <EmptySlot onAdd={onOpenUploadModal} />
            )}
          </div>

          <div className="text-center pt-2 border-t border-stone-200">
            <span className="text-[10px] font-mono text-stone-400">PAGE {page.pageNumber}</span>
          </div>
        </div>
      );
    }

    // Template 3: Twin Portrait
    if (page.templateId === 'twin-portrait') {
      const p1 = pagePhotos[0];
      const p2 = pagePhotos[1];
      return (
        <div className="h-full flex flex-col justify-between p-4 sm:p-8">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
              {page.customTitle || `Plate ${page.pageNumber} — Twin Portraits`}
            </span>
            <TemplatePicker
              current={page.templateId}
              onChange={(t) => onUpdatePageTemplate(page.pageNumber, t)}
            />
          </div>

          <div className="my-auto py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {p1 ? (
              <AlbumPhotoMount
                photo={p1}
                cornerStyle={meta.cornerStyle}
                onUpdateCaption={onUpdatePhotoCaption}
                onRemovePhoto={onRemovePhotoFromPage}
                onViewPhoto={onViewPhoto}
                imageClassName="max-h-56 w-full object-cover"
              />
            ) : (
              <EmptySlot onAdd={onOpenUploadModal} />
            )}

            {p2 ? (
              <AlbumPhotoMount
                photo={p2}
                cornerStyle={meta.cornerStyle}
                onUpdateCaption={onUpdatePhotoCaption}
                onRemovePhoto={onRemovePhotoFromPage}
                onViewPhoto={onViewPhoto}
                imageClassName="max-h-56 w-full object-cover"
              />
            ) : (
              <EmptySlot onAdd={onOpenUploadModal} />
            )}
          </div>

          <div className="text-center pt-2 border-t border-stone-200">
            <span className="text-[10px] font-mono text-stone-400">PAGE {page.pageNumber}</span>
          </div>
        </div>
      );
    }

    // Template 4: Duo Landscape (Stacked)
    if (page.templateId === 'duo-landscape') {
      const p1 = pagePhotos[0];
      const p2 = pagePhotos[1];
      return (
        <div className="h-full flex flex-col justify-between p-4 sm:p-8">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
              {page.customTitle || `Plate ${page.pageNumber} — Landscapes`}
            </span>
            <TemplatePicker
              current={page.templateId}
              onChange={(t) => onUpdatePageTemplate(page.pageNumber, t)}
            />
          </div>

          <div className="my-auto py-2 space-y-4">
            {p1 ? (
              <AlbumPhotoMount
                photo={p1}
                cornerStyle={meta.cornerStyle}
                onUpdateCaption={onUpdatePhotoCaption}
                onRemovePhoto={onRemovePhotoFromPage}
                onViewPhoto={onViewPhoto}
                imageClassName="max-h-40 w-full object-cover"
              />
            ) : (
              <EmptySlot onAdd={onOpenUploadModal} />
            )}

            {p2 ? (
              <AlbumPhotoMount
                photo={p2}
                cornerStyle={meta.cornerStyle}
                onUpdateCaption={onUpdatePhotoCaption}
                onRemovePhoto={onRemovePhotoFromPage}
                onViewPhoto={onViewPhoto}
                imageClassName="max-h-40 w-full object-cover"
              />
            ) : (
              <EmptySlot onAdd={onOpenUploadModal} />
            )}
          </div>

          <div className="text-center pt-2 border-t border-stone-200">
            <span className="text-[10px] font-mono text-stone-400">PAGE {page.pageNumber}</span>
          </div>
        </div>
      );
    }

    // Template 5: Story Trio (1 dominant + 2 snapshots)
    if (page.templateId === 'story-trio') {
      const p1 = pagePhotos[0];
      const p2 = pagePhotos[1];
      const p3 = pagePhotos[2];
      return (
        <div className="h-full flex flex-col justify-between p-4 sm:p-8">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
              {page.customTitle || `Plate ${page.pageNumber} — Vignette Trio`}
            </span>
            <TemplatePicker
              current={page.templateId}
              onChange={(t) => onUpdatePageTemplate(page.pageNumber, t)}
            />
          </div>

          <div className="my-auto py-2 space-y-3">
            {p1 ? (
              <AlbumPhotoMount
                photo={p1}
                cornerStyle={meta.cornerStyle}
                onUpdateCaption={onUpdatePhotoCaption}
                onRemovePhoto={onRemovePhotoFromPage}
                onViewPhoto={onViewPhoto}
                imageClassName="max-h-44 w-full object-cover"
              />
            ) : (
              <EmptySlot onAdd={onOpenUploadModal} />
            )}

            <div className="grid grid-cols-2 gap-3">
              {p2 ? (
                <AlbumPhotoMount
                  photo={p2}
                  cornerStyle={meta.cornerStyle}
                  onUpdateCaption={onUpdatePhotoCaption}
                  onRemovePhoto={onRemovePhotoFromPage}
                  onViewPhoto={onViewPhoto}
                  imageClassName="max-h-28 w-full object-cover"
                />
              ) : (
                <EmptySlot onAdd={onOpenUploadModal} />
              )}
              {p3 ? (
                <AlbumPhotoMount
                  photo={p3}
                  cornerStyle={meta.cornerStyle}
                  onUpdateCaption={onUpdatePhotoCaption}
                  onRemovePhoto={onRemovePhotoFromPage}
                  onViewPhoto={onViewPhoto}
                  imageClassName="max-h-28 w-full object-cover"
                />
              ) : (
                <EmptySlot onAdd={onOpenUploadModal} />
              )}
            </div>
          </div>

          <div className="text-center pt-2 border-t border-stone-200">
            <span className="text-[10px] font-mono text-stone-400">PAGE {page.pageNumber}</span>
          </div>
        </div>
      );
    }

    // Template 6: Quad Scrapbook (4 photos in 2x2 grid)
    const quadPhotos = [pagePhotos[0], pagePhotos[1], pagePhotos[2], pagePhotos[3]];
    return (
      <div className="h-full flex flex-col justify-between p-4 sm:p-8">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest">
            {page.customTitle || `Plate ${page.pageNumber} — Quad Scrapbook`}
          </span>
          <TemplatePicker
            current={page.templateId}
            onChange={(t) => onUpdatePageTemplate(page.pageNumber, t)}
          />
        </div>

        <div className="my-auto py-2 grid grid-cols-2 gap-3 items-center">
          {quadPhotos.map((qp, idx) => (
            <div key={idx}>
              {qp ? (
                <AlbumPhotoMount
                  photo={qp}
                  cornerStyle={meta.cornerStyle}
                  onUpdateCaption={onUpdatePhotoCaption}
                  onRemovePhoto={onRemovePhotoFromPage}
                  onViewPhoto={onViewPhoto}
                  imageClassName="max-h-28 w-full object-cover"
                />
              ) : (
                <EmptySlot onAdd={onOpenUploadModal} />
              )}
            </div>
          ))}
        </div>

        <div className="text-center pt-2 border-t border-stone-200">
          <span className="text-[10px] font-mono text-stone-400">PAGE {page.pageNumber}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-2 sm:px-4">
      {/* The Physical Two-Page Book Spread Container */}
      <div className="relative shadow-2xl rounded-lg p-2.5 sm:p-4 bg-stone-900 border border-stone-800">
        {/* Leather/Cloth Outer Book Rim */}
        <div className={`p-2 sm:p-3 rounded-md border shadow-inner ${getCoverTrimClass()}`}>
          {/* Inside Book Pages Spread */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 min-h-[560px] sm:min-h-[640px] bg-[#faf8f2] rounded shadow-lg overflow-hidden border border-stone-300">
            {/* Center Gutter / Spine Crease Shadow */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-12 bg-gradient-to-r from-black/5 via-black/25 to-black/5 pointer-events-none z-20 shadow-inner" />
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-px w-[1px] bg-stone-400 pointer-events-none z-20" />

            {/* Left Page */}
            <div className="relative h-full border-b md:border-b-0 md:border-r border-stone-300 flex flex-col justify-between">
              {spread.leftPage ? (
                renderPageContent(spread.leftPage, true)
              ) : (
                // Inside Front Cover Marbled Endpaper
                <div className="h-full flex flex-col items-center justify-center p-8 bg-[#f4eee1] text-stone-500 font-serif text-center relative overflow-hidden">
                  <div className="absolute inset-4 border-2 border-stone-300/60 rounded pointer-events-none" />
                  <div className="max-w-xs space-y-3 relative z-10">
                    <div className="w-10 h-10 mx-auto rounded-full border border-stone-300 flex items-center justify-center text-amber-800">
                      ❖
                    </div>
                    <h3 className="text-stone-800 font-semibold text-sm tracking-widest uppercase">
                      Archival Frontispiece
                    </h3>
                    <p className="text-xs italic leading-relaxed text-stone-600">
                      "Memories preserved by hand, arranged on-device, and bound in privacy for generations."
                    </p>
                    <div className="pt-2 text-[10px] font-mono text-stone-400">
                      PICMORABLE NO. {meta.id.slice(-6).toUpperCase()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Page */}
            <div className="relative h-full flex flex-col justify-between">
              {spread.rightPage ? (
                renderPageContent(spread.rightPage, false)
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 bg-[#faf8f2] text-stone-400 font-serif text-center">
                  <p className="text-sm italic">Blank Archival Page</p>
                  <button
                    type="button"
                    onClick={onOpenUploadModal}
                    className="mt-3 px-3 py-1.5 bg-stone-900 text-amber-100 rounded text-xs flex items-center gap-1.5 hover:bg-stone-800 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add photographs here
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for empty slot
const EmptySlot: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <div
    onClick={onAdd}
    className="border-2 border-dashed border-stone-300 hover:border-amber-700/60 rounded p-6 text-center cursor-pointer transition-colors bg-stone-50/50 hover:bg-amber-50/40"
  >
    <Plus className="w-5 h-5 text-stone-400 mx-auto mb-1" />
    <span className="text-[11px] font-serif text-stone-600">Add photograph to this slot</span>
  </div>
);

// Helper component for picking templates
const TemplatePicker: React.FC<{
  current: PageTemplateId;
  onChange: (t: PageTemplateId) => void;
}> = ({ current, onChange }) => {
  return (
    <div className="flex items-center gap-1">
      <LayoutGrid className="w-3 h-3 text-stone-400" />
      <select
        value={current}
        onChange={(e) => onChange(e.target.value as PageTemplateId)}
        className="text-[10px] font-mono bg-stone-100 text-stone-700 border border-stone-300 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
      >
        <option value="hero-single">Single Hero</option>
        <option value="twin-portrait">Twin Portrait</option>
        <option value="story-trio">Story Trio</option>
        <option value="quad-scrapbook">Quad Scrapbook</option>
        <option value="duo-landscape">Duo Landscape</option>
        <option value="frontispiece">Frontispiece</option>
      </select>
    </div>
  );
};
