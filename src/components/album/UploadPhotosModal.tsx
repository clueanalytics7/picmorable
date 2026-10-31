/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';
import { processLocalFiles } from '../../utils/localImageProcessor';
import { AlbumPhoto } from '../../types/album';

interface UploadPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmUpload: (
    newPhotos: AlbumPhoto[], 
    strategy: 'balanced' | 'chronological' | 'single-hero' | 'scrapbook',
    mode: 'append' | 'replace'
  ) => void;
}

export const UploadPhotosModal: React.FC<UploadPhotosModalProps> = ({
  isOpen,
  onClose,
  onConfirmUpload,
}) => {
  const [stagedPhotos, setStagedPhotos] = useState<AlbumPhoto[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [strategy, setStrategy] = useState<'balanced' | 'chronological' | 'single-hero' | 'scrapbook'>('balanced');
  const [mode, setMode] = useState<'append' | 'replace'>('append');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsProcessing(true);
    try {
      const processed = await processLocalFiles(fileArray);
      setStagedPhotos(prev => [...prev, ...processed]);
    } catch (err) {
      console.error('Error processing local files:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveStaged = (id: string) => {
    setStagedPhotos(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateStagedCaption = (id: string, caption: string) => {
    setStagedPhotos(prev =>
      prev.map(p => (p.id === id ? { ...p, caption } : p))
    );
  };

  const handleCommit = () => {
    if (stagedPhotos.length === 0) return;
    onConfirmUpload(stagedPhotos, strategy, mode);
    setStagedPhotos([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-stone-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-amber-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-400" />
              Upload Photos into Hardcover Album
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Select multiple photographs from your device. Processed 100% locally in your browser.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Privacy Banner */}
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-emerald-200">
                Privacy-First Architecture — Zero Photos Leave Your Device
              </p>
              <p className="text-emerald-300/80 mt-0.5 leading-relaxed text-[11px]">
                Your image files are read via direct browser memory buffers (<code className="font-mono text-emerald-300">URL.createObjectURL</code>). Not a single pixel is uploaded to any remote server or third party.
              </p>
            </div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-amber-400 bg-amber-950/20 scale-[0.99]'
                : 'border-stone-700 hover:border-amber-500/70 bg-stone-950/50 hover:bg-stone-900/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
            />
            <div className="w-12 h-12 rounded-full bg-amber-900/40 border border-amber-500/40 text-amber-300 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-semibold text-amber-100">
              Drag & Drop your photographs here
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              or click to browse from your computer (select multiple files at once)
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-stone-500 font-mono">
              <span>JPG</span> · <span>PNG</span> · <span>WebP</span> · <span>HEIC</span> · <span>AVIF</span>
            </div>
          </div>

          {/* Staged Photos Preview */}
          {stagedPhotos.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider font-mono">
                  Loaded Photographs ({stagedPhotos.length})
                </span>
                <button
                  type="button"
                  onClick={() => setStagedPhotos([])}
                  className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {stagedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex items-center gap-3 p-2 bg-stone-950 border border-stone-800 rounded-lg group"
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-14 h-14 object-cover rounded bg-stone-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-stone-200 truncate max-w-[140px]">
                          {photo.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStaged(photo.id)}
                          className="text-stone-500 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={photo.caption}
                        onChange={(e) => handleUpdateStagedCaption(photo.id, e.target.value)}
                        placeholder="Write a brief photo caption..."
                        className="w-full text-[11px] font-serif bg-stone-900 border border-stone-700 rounded px-2 py-1 text-stone-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Arrangement Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Intelligent Arrangement Strategy
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value as any)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg p-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="balanced">Intelligent Balanced (Pairs portraits, highlights panoramas)</option>
                <option value="chronological">Chronological Order (Earliest to latest)</option>
                <option value="single-hero">Single Hero Plates (1 photo per page)</option>
                <option value="scrapbook">Dense Scrapbook (4 photos per spread)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                Album Action
              </label>
              <div className="flex items-center gap-3 mt-2">
                <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="radio"
                    name="uploadMode"
                    value="append"
                    checked={mode === 'append'}
                    onChange={() => setMode('append')}
                    className="accent-amber-400"
                  />
                  <span>Append to current album</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                  <input
                    type="radio"
                    name="uploadMode"
                    value="replace"
                    checked={mode === 'replace'}
                    onChange={() => setMode('replace')}
                    className="accent-amber-400"
                  />
                  <span>Start new album</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-800 flex items-center justify-between bg-stone-950/80">
          <span className="text-xs text-stone-400">
            {stagedPhotos.length > 0 ? `${stagedPhotos.length} photos ready to arrange` : 'Select photos above'}
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-300 hover:text-white text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={stagedPhotos.length === 0 || isProcessing}
              onClick={handleCommit}
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-bold transition-all shadow disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Arrange into Hardcover Album</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
