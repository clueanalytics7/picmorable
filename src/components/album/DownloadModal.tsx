/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Download, 
  X, 
  Archive, 
  FileText, 
  Image as ImageIcon, 
  ShieldCheck, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { AlbumMetadata, AlbumPhoto, AlbumPage } from '../../types/album';
import { 
  exportAlbumPackageZip, 
  generateAlbumTranscript, 
  downloadBlob 
} from '../../utils/albumExporter';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: AlbumMetadata;
  photos: AlbumPhoto[];
  pages: AlbumPage[];
  currentSpreadIndex: number;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  meta,
  photos,
  pages,
  currentSpreadIndex,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  // Option 1: Complete ZIP Archive
  const handleDownloadZip = async () => {
    setIsExporting(true);
    setProgress(0);
    try {
      await exportAlbumPackageZip(meta, photos, pages, (pct, status) => {
        setProgress(pct);
        setStatusMessage(status);
      });
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Export failed', err);
      setStatusMessage('Export error occurred. Please try again.');
      setIsExporting(false);
    }
  };

  // Option 2: Text Transcript
  const handleDownloadTranscript = () => {
    const text = generateAlbumTranscript(meta, photos, pages);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const filename = `${meta.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_transcript.txt`;
    downloadBlob(blob, filename);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-amber-100">
                Download Rearranged Album
              </h2>
              <p className="text-[11px] text-stone-400">
                Export your album layouts, rearranged photographs, and captions locally.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Privacy Banner */}
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 flex items-center gap-3 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Everything generated in your browser. No files or text sent to external servers.</span>
          </div>

          {/* Export Options Cards */}
          <div className="space-y-3">
            {/* 1. Complete Zip */}
            <div
              onClick={isExporting ? undefined : handleDownloadZip}
              className={`p-4 rounded-xl border border-stone-800 bg-stone-950/70 hover:bg-stone-950 hover:border-amber-400/60 transition-all cursor-pointer group flex items-start gap-4 ${
                isExporting ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-amber-900/40 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Archive className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-semibold text-amber-100 group-hover:text-amber-300">
                    Complete Archival Album (.ZIP)
                  </h3>
                  <span className="text-[10px] font-mono bg-stone-800 text-stone-300 px-2 py-0.5 rounded">
                    Recommended
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Includes all rearranged high-resolution photographs organized by page, the complete formatted caption story transcript (<code className="text-amber-300/80">.TXT</code>), and structured metadata (<code className="text-amber-300/80">.JSON</code>).
                </p>
                <div className="mt-2 text-[11px] text-stone-500 font-mono">
                  {photos.length} photos · {pages.length} pages · 100% on-device zip
                </div>
              </div>
            </div>

            {/* 2. Text Story & Captions */}
            <div
              onClick={handleDownloadTranscript}
              className="p-4 rounded-xl border border-stone-800 bg-stone-950/70 hover:bg-stone-950 hover:border-stone-600 transition-all cursor-pointer group flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-sm font-semibold text-stone-200 group-hover:text-amber-200">
                  Album Story & Photo Captions Transcript (.TXT)
                </h3>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  A formatted archival text document with your album overview story and all photo captions organized by plate number.
                </p>
                <div className="mt-2 text-[11px] text-stone-500 font-mono">
                  Instant download · Plain text preservation format
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar during zip compilation */}
          {isExporting && (
            <div className="space-y-2 pt-2 border-t border-stone-800 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-amber-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> {statusMessage || 'Packaging archive...'}
                </span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-1.5 text-xs text-stone-400 hover:text-white rounded-md hover:bg-stone-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
