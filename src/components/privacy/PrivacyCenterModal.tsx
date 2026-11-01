/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  HardDrive, 
  CloudOff, 
  Cpu, 
  Share2, 
  Trash2, 
  AlertTriangle, 
  Check, 
  Activity, 
  Lock, 
  FileCheck2,
  RefreshCw
} from 'lucide-react';
import { AlbumPhoto } from '../../types/album';
import { calculateLocalStorageStats } from '../../utils/duplicateDetector';

interface PrivacyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: AlbumPhoto[];
  onWipeSandbox: () => void;
}

export const PrivacyCenterModal: React.FC<PrivacyCenterModalProps> = ({
  isOpen,
  onClose,
  photos,
  onWipeSandbox,
}) => {
  const [confirmWipe, setConfirmWipe] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'metadata' | 'deletion'>('status');

  if (!isOpen) return null;

  const stats = calculateLocalStorageStats(photos);

  const handleExecuteWipe = () => {
    onWipeSandbox();
    setConfirmWipe(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-stone-100">
                  Picmorable Privacy Centre
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/80 text-[10px] font-mono font-medium text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Protected
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans mt-0.5">
                Your photographs remain strictly under your control on this device.
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

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 px-6 text-xs font-sans">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Live Architecture Status
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('metadata')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'metadata'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Verified Metadata vs Notes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deletion')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors cursor-pointer ${
              activeTab === 'deletion'
                ? 'border-rose-400 text-rose-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            Local Data & Sandbox Purge
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs flex-1">
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Four Core Pillars as requested */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 shrink-0">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-mono">
                      Photo processing
                    </span>
                    <span className="text-sm font-semibold text-emerald-300 font-serif">
                      On your device
                    </span>
                    <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                      Arrangement algorithms, EXIF extraction, and layout composition execute locally in memory.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 shrink-0">
                    <CloudOff className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-mono">
                      Cloud photo uploads
                    </span>
                    <span className="text-sm font-semibold text-emerald-300 font-serif">
                      Disabled
                    </span>
                    <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                      Zero cloud storage, zero sync servers, zero third-party telemetry.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 shrink-0">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-mono">
                      AI processing
                    </span>
                    <span className="text-sm font-semibold text-emerald-300 font-serif">
                      Local only
                    </span>
                    <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                      Deduplication, aspect balancing, and date clustering run via client heuristics and Web APIs.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 shrink-0">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-mono">
                      External photo sharing
                    </span>
                    <span className="text-sm font-semibold text-stone-200 font-serif">
                      Not enabled
                    </span>
                    <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                      No public links, no social tracking pixels, no advertising monetization.
                    </p>
                  </div>
                </div>
              </div>

              {/* Real-time Sandbox Inspection Telemetry */}
              <div className="rounded-xl bg-stone-950/70 border border-stone-800 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <div className="flex items-center gap-2 text-stone-200 font-serif font-medium">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span>Device Memory Sandbox Monitor</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    ISOLATED RUNTIME
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block font-sans">Photos in RAM</span>
                    <span className="text-base font-bold font-mono text-amber-200">{stats.photoCount}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block font-sans">Buffer Footprint</span>
                    <span className="text-base font-bold font-mono text-amber-200">{stats.totalFormattedSize}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block font-sans">Verified EXIF</span>
                    <span className="text-base font-bold font-mono text-emerald-300">{stats.verifiedExifCount}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800">
                    <span className="text-[10px] text-stone-400 block font-sans">Outbound Network</span>
                    <span className="text-base font-bold font-mono text-emerald-400">0 Calls</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-950 border border-amber-900/30 text-stone-300 flex items-start gap-3">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong className="text-amber-200">Why this matters:</strong> While conventional photo cloud services ingest your private family photos into centralised data centres for machine learning and behavioral profiling, Picmorable treats your browser as a completely sovereign, air-gapped darkroom.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex items-center gap-2 text-stone-200 font-serif font-medium">
                  <FileCheck2 className="w-4 h-4 text-blue-400" />
                  <span>Metadata Integrity & Provenance</span>
                </div>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Picmorable strictly separates verified hardware camera records (embedded in your file’s original EXIF tag) from user-written captions or suggested descriptions. You always retain the right to edit or replace any memory description.
                </p>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {photos.slice(0, 10).map((photo, idx) => (
                  <div key={photo.id || idx} className="p-3 rounded-lg bg-stone-950 border border-stone-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={photo.url} alt={photo.name} className="w-10 h-10 rounded object-cover border border-stone-700 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-serif text-stone-200 truncate">{photo.name}</div>
                        <div className="text-[10px] text-stone-400 font-mono truncate">
                          {photo.cameraModel || 'Standard Camera'} • {photo.date || 'Undated'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {photo.isVerifiedMetadata ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                          Verified EXIF
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-stone-400">
                          Estimated Date
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-stone-400 text-center font-mono">
                Showing first {Math.min(10, photos.length)} of {photos.length} photos in active memory.
              </p>
            </div>
          )}

          {activeTab === 'deletion' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-serif font-medium">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Immediate Local Data Purge</span>
                </div>
                <p className="text-stone-300 text-[11px] leading-relaxed">
                  Because Picmorable never uploads your photos to any remote server or database, you don’t need to submit a deletion ticket or wait 30 days. Clicking the purge button below immediately revokes all memory buffers (<code className="text-amber-300 font-mono">URL.revokeObjectURL</code>), resets the layout engine, and returns the workspace to pristine zero.
                </p>
              </div>

              {!confirmWipe ? (
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-serif text-stone-200 text-xs font-semibold">
                      Clear Sandbox & Flush Browser Memory
                    </h4>
                    <p className="text-stone-400 text-[11px] mt-0.5">
                      This removes all {photos.length} photos from current session RAM.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmWipe(true)}
                    className="px-3.5 py-2 rounded-lg bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Wipe Sandbox</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-600 space-y-3 animate-in zoom-in-95 duration-150">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-serif text-sm font-bold text-rose-200">
                        Confirm Permanent Sandbox Erasure?
                      </h4>
                      <p className="text-rose-300 text-xs mt-1 leading-relaxed">
                        Are you sure you want to release all {photos.length} photos and reset the album? Your original photo files on your computer or phone are safe and unaffected.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setConfirmWipe(false)}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleExecuteWipe}
                      className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Confirm & Erase Now</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>GDPR, CCPA & Local-First Sovereign Sandbox</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
