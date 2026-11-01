/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Download, 
  X, 
  BookOpen, 
  FileCode, 
  Archive, 
  FileText, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { AlbumMetadata, AlbumPhoto, AlbumPage } from '../../types/album';
import { 
  generateAlbumPdf, 
  generateStandaloneAlbumHtml, 
  exportCompleteAlbumPackage,
  MATERIAL_THEMES 
} from '../../utils/albumExportEngine';
import { generateAlbumTranscript, downloadBlob } from '../../utils/albumExporter';

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
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const sanitizedTitle = meta.title.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 30);
  const theme = MATERIAL_THEMES[meta.coverMaterial] || MATERIAL_THEMES['burgundy-leather'];

  // 1. Download Hardcover Book PDF
  const handleDownloadPdf = async () => {
    setIsExporting(true);
    setProgress(0);
    setDownloadSuccess(null);
    try {
      const pdfBlob = await generateAlbumPdf(meta, photos, pages, (pct, status) => {
        setProgress(pct);
        setStatusMessage(status);
      });
      downloadBlob(pdfBlob, `picmorable_${sanitizedTitle}_hardcover_book.pdf`);
      setDownloadSuccess('Archival Hardcover Book PDF generated successfully!');
      setTimeout(() => setIsExporting(false), 1200);
    } catch (err) {
      console.error('PDF export failed', err);
      setStatusMessage('Error compiling PDF. Please try again.');
      setIsExporting(false);
    }
  };

  // 2. Download Standalone Offline Interactive Album HTML
  const handleDownloadHtml = async () => {
    setIsExporting(true);
    setProgress(0);
    setDownloadSuccess(null);
    try {
      const htmlContent = await generateStandaloneAlbumHtml(meta, photos, pages, (pct, status) => {
        setProgress(pct);
        setStatusMessage(status);
      });
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      downloadBlob(blob, `picmorable_${sanitizedTitle}_album.html`);
      setDownloadSuccess('Standalone Interactive Album HTML downloaded!');
      setTimeout(() => setIsExporting(false), 1200);
    } catch (err) {
      console.error('HTML export failed', err);
      setStatusMessage('Error compiling HTML album. Please try again.');
      setIsExporting(false);
    }
  };

  // 3. Download Complete Archival Package ZIP
  const handleDownloadCompleteBundle = async () => {
    setIsExporting(true);
    setProgress(0);
    setDownloadSuccess(null);
    try {
      await exportCompleteAlbumPackage(meta, photos, pages, (pct, status) => {
        setProgress(pct);
        setStatusMessage(status);
      });
      setDownloadSuccess('Complete Archival Package downloaded!');
      setTimeout(() => setIsExporting(false), 1200);
    } catch (err) {
      console.error('Bundle export failed', err);
      setStatusMessage('Error bundling archive. Please try again.');
      setIsExporting(false);
    }
  };

  // 4. Download Plain Text Transcript
  const handleDownloadTranscript = () => {
    const text = generateAlbumTranscript(meta, photos, pages);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `picmorable_${sanitizedTitle}_transcript.txt`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between shrink-0 bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-amber-100 flex items-center gap-2">
                Download Your Photo Album
                <span className="text-[10px] font-sans font-normal px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-500/30">
                  {theme.name}
                </span>
              </h2>
              <p className="text-[11px] text-stone-400">
                Delivered in the exact format of your chosen hardcover photo album.
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

        {/* Scrollable Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Privacy Banner */}
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 flex items-center gap-3 text-xs text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% on-device rendering. All book formats are built purely in your browser memory.</span>
          </div>

          {/* Formatted Products Selection */}
          <div className="space-y-3">
            {/* 1. Archival Hardcover Photo Book PDF */}
            <div
              onClick={isExporting ? undefined : handleDownloadPdf}
              className={`p-4 rounded-xl border border-amber-500/40 bg-stone-950/90 hover:bg-stone-950 hover:border-amber-400 transition-all cursor-pointer group flex items-start gap-4 shadow-lg ${
                isExporting ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div className="w-11 h-11 rounded-lg bg-amber-950/60 border border-amber-500/50 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-semibold text-amber-100 group-hover:text-amber-300 flex items-center gap-2">
                    Hardcover Photo Book (.PDF)
                    <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-amber-400 text-stone-950">
                      Primary Format
                    </span>
                  </h3>
                  <span className="text-xs text-amber-400/90 font-mono">Ready to view / print</span>
                </div>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  A high-resolution landscape photo book formatted in your chosen <strong>{theme.name}</strong> hardcover style. Features foil cover debossing, frontispiece narrative plate, and rearranged spreads with vintage photo corners and archival captions.
                </p>
                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-stone-500 font-mono">
                  <span>{pages.length} pages</span>
                  <span>·</span>
                  <span>{photos.length} photographs</span>
                  <span>·</span>
                  <span className="text-amber-400/80">Print-ready landscape</span>
                </div>
              </div>
            </div>

            {/* 2. Standalone Offline Interactive Album HTML */}
            <div
              onClick={isExporting ? undefined : handleDownloadHtml}
              className={`p-4 rounded-xl border border-stone-800 bg-stone-950/70 hover:bg-stone-950 hover:border-amber-400/60 transition-all cursor-pointer group flex items-start gap-4 ${
                isExporting ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div className="w-11 h-11 rounded-lg bg-stone-800 border border-stone-700 text-amber-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileCode className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-semibold text-stone-200 group-hover:text-amber-200 flex items-center gap-2">
                    Interactive Standalone Photo Album (.HTML)
                    <span className="text-[10px] font-sans font-medium px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                      Offline App
                    </span>
                  </h3>
                  <span className="text-xs text-stone-400 font-mono">Runs anywhere</span>
                </div>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  A self-contained single-file photo album you can double-click on any computer offline. Includes the tactile hardcover binding, page-turning animation, paper-rustle audio, and integrated full-screen presentation slideshow.
                </p>
                <div className="mt-2.5 flex items-center gap-3 text-[11px] text-stone-500 font-mono">
                  <span>Zero dependencies</span>
                  <span>·</span>
                  <span>Works in Chrome, Safari, Edge</span>
                  <span>·</span>
                  <span className="text-emerald-400">Offline forever</span>
                </div>
              </div>
            </div>

            {/* 3. Complete Archival Package ZIP */}
            <div
              onClick={isExporting ? undefined : handleDownloadCompleteBundle}
              className={`p-4 rounded-xl border border-stone-800 bg-stone-950/70 hover:bg-stone-950 hover:border-stone-600 transition-all cursor-pointer group flex items-start gap-4 ${
                isExporting ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <div className="w-11 h-11 rounded-lg bg-stone-800/80 border border-stone-700 text-stone-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Archive className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-sm font-semibold text-stone-200 group-hover:text-amber-200">
                    Complete Archival Package (.ZIP)
                  </h3>
                  <span className="text-[10px] font-mono text-stone-400">All Formats</span>
                </div>
                <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                  Bundles the Hardcover Book (.PDF), Standalone Interactive Album (.HTML), high-resolution photographs, and formatted story transcript into one archival zip.
                </p>
                <div className="mt-2 text-[11px] text-stone-500 font-mono">
                  Complete preservation backup for family archives or cold storage
                </div>
              </div>
            </div>

            {/* 4. Text Transcript */}
            <div
              onClick={handleDownloadTranscript}
              className="p-3.5 rounded-xl border border-stone-800/60 bg-stone-950/40 hover:bg-stone-950 hover:border-stone-700 transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-stone-400 group-hover:text-amber-300" />
                <span className="text-xs font-serif text-stone-300 group-hover:text-amber-200">
                  Album Story & Photo Captions Transcript (.TXT)
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-500">Instant Text Record</span>
            </div>
          </div>

          {/* Progress / Status Display */}
          {isExporting && (
            <div className="space-y-2 pt-2 border-t border-stone-800 animate-in fade-in">
              <div className="flex items-center justify-between text-xs text-amber-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> {statusMessage || 'Rendering album format...'}
                </span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {downloadSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-stone-500 font-mono">
            Zero cloud uploads · 100% Client-side generation
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-1.5 text-xs text-stone-400 hover:text-white rounded-md hover:bg-stone-800 cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
