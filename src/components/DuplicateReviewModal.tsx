import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  SlidersHorizontal, 
  ArrowRight, 
  Trash2, 
  Layers, 
  FileCheck, 
  Eye, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { DuplicateGroup, PhotoItem } from '../types';

interface DuplicateReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  duplicates: DuplicateGroup[];
  photos: PhotoItem[];
  onResolveGroup: (groupId: string, resolution: 'keep_all' | 'keep_primary') => void;
}

export const DuplicateReviewModal: React.FC<DuplicateReviewModalProps> = ({
  isOpen,
  onClose,
  duplicates,
  photos,
  onResolveGroup,
}) => {
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

  if (!isOpen) return null;

  const currentGroup = duplicates[selectedGroupIndex] || duplicates[0];
  const primaryPhoto = photos.find(p => p.id === currentGroup?.primaryPhotoId);
  const duplicatePhoto = photos.find(p => p.id === currentGroup?.duplicatePhotoIds[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-amber-700 uppercase tracking-wider block mb-1">
              Module A · Duplicate & Burst Resolution
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Review Duplicate & Near-Duplicate Groups
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Identified through combination of cryptographic file hashing (MD5) and perceptual hash visual embeddings.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Group Selector Bar */}
        <div className="flex items-center gap-2 px-6 py-3 bg-stone-50 border-b border-stone-200 overflow-x-auto text-xs">
          <span className="text-stone-500 font-medium">Group:</span>
          {duplicates.map((grp, idx) => (
            <button
              key={grp.id}
              onClick={() => setSelectedGroupIndex(idx)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                selectedGroupIndex === idx
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <span>{grp.type === 'exact' ? 'Exact Copy' : 'Burst Shot'} #{idx + 1}</span>
              {grp.resolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          ))}
        </div>

        {/* Comparison Body */}
        {currentGroup && primaryPhoto && duplicatePhoto ? (
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Rationale Banner */}
            <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Detection Rationale ({Math.round(currentGroup.similarityScore * 100)}% Similarity Score)
                </p>
                <p className="text-stone-700 mt-0.5 leading-relaxed">
                  {currentGroup.reason}
                </p>
              </div>
            </div>

            {/* Side-by-side Photo Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Primary Master Photo */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Primary Master (High Resolution)
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    {(primaryPhoto.exif.fileSizeBytes / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>

                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-200">
                  <img
                    src={primaryPhoto.url}
                    alt={primaryPhoto.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <h4 className="font-serif font-bold text-stone-900">{primaryPhoto.title}</h4>
                  <div className="text-stone-500 font-mono text-[11px] space-y-0.5">
                    <div>Source: {primaryPhoto.exif.sourceDevice}</div>
                    <div>File: {primaryPhoto.exif.originalFileName}</div>
                    <div>Date: {primaryPhoto.exif.dateTaken}</div>
                    <div>Camera: {primaryPhoto.exif.cameraMake} {primaryPhoto.exif.cameraModel}</div>
                  </div>
                </div>
              </div>

              {/* Duplicate / Candidate Photo */}
              <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {currentGroup.type === 'exact' ? 'Compressed Transfer Copy' : 'Burst Candidate'}
                  </span>
                  <span className="text-xs font-mono text-stone-500">
                    {(duplicatePhoto.exif.fileSizeBytes / 1024 / 1024).toFixed(1)} MB
                  </span>
                </div>

                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-200">
                  <img
                    src={duplicatePhoto.url}
                    alt={duplicatePhoto.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <h4 className="font-serif font-bold text-stone-900">{duplicatePhoto.title}</h4>
                  <div className="text-stone-500 font-mono text-[11px] space-y-0.5">
                    <div>Source: {duplicatePhoto.exif.sourceDevice}</div>
                    <div>File: {duplicatePhoto.exif.originalFileName}</div>
                    <div>Date: {duplicatePhoto.exif.dateTaken}</div>
                    <div>Camera: {duplicatePhoto.exif.cameraMake} {duplicatePhoto.exif.cameraModel}</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Resolution Actions */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-stone-600">
                Choose how to manage this group:
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => onResolveGroup(currentGroup.id, 'keep_all')}
                  className="flex-1 sm:flex-initial px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                >
                  Keep Both Separate
                </button>
                <button
                  onClick={() => onResolveGroup(currentGroup.id, 'keep_primary')}
                  className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Consolidate (Keep Master Only)
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center text-xs text-stone-500">
            No unresolved duplicate groups remaining. All photographs cleanly catalogued.
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Never deletes photos permanently without your explicit review</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            Done Reviewing
          </button>
        </div>

      </div>

    </div>
  );
};
