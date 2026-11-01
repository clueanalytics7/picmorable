/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Scissors, 
  Sparkles, 
  FileCheck, 
  ArrowRight,
  Eye,
  Info
} from 'lucide-react';
import { AlbumPage, AlbumPhoto, PrintPreFlightReport } from '../../types/album';
import { generatePrintPreFlightReport } from '../../utils/printInspector';

interface PrintInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: AlbumPage[];
  photos: AlbumPhoto[];
  showPrintGuides: boolean;
  onTogglePrintGuides: () => void;
  onBalanceSignatures: () => void;
}

export const PrintInspectorModal: React.FC<PrintInspectorModalProps> = ({
  isOpen,
  onClose,
  pages,
  photos,
  showPrintGuides,
  onTogglePrintGuides,
  onBalanceSignatures,
}) => {
  if (!isOpen) return null;

  const report = generatePrintPreFlightReport(pages, photos);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base font-bold text-stone-100">
                  Pre-Flight Print Inspector
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  report.score >= 90
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {report.grade} ({report.score}/100)
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Ensure your album is ready for professional physical printing and bookbinding.
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

        {/* Content Area */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          {/* Top Scorecard & Physical Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">
                Physical Format
              </span>
              <span className="text-base font-serif font-bold text-amber-100 block">
                10" × 10" Fine Art Hardcover
              </span>
              <p className="text-[10px] text-stone-400">
                Parchment 170 gsm archival matte stock.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">
                Signature Compliance
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-mono font-bold text-stone-100">
                  {report.pageCount} Pages
                </span>
                {report.isSignatureCompliant ? (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800">
                    Compliant (4x)
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-1.5 py-0.2 rounded border border-amber-800">
                    +{report.pagesNeededForSignature} needed
                  </span>
                )}
              </div>
              <p className="text-[10px] text-stone-400">
                Traditional binderies stitch 4-page folded folios.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block">
                Print Resolution
              </span>
              <span className="text-base font-mono font-bold text-emerald-300 block">
                {report.photosOptimal} / {report.totalPhotos} Optimal 300+ DPI
              </span>
              <p className="text-[10px] text-stone-400">
                {report.photosWarning === 0 ? 'Zero pixelation risks.' : `${report.photosWarning} photos with lower DPI.`}
              </p>
            </div>
          </div>

          {/* Safe Margins & Spine Crease Overlay Toggle */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-amber-400 shrink-0">
                <Scissors className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-semibold text-stone-200">
                  Visual Trim Bleed & Center Gutter Crease Guides
                </h4>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Overlays red dashed 3mm cut lines and the 0.5-inch spine gutter crease directly onto your album spreads.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onTogglePrintGuides}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow ${
                showPrintGuides
                  ? 'bg-amber-400 text-stone-950 font-bold'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showPrintGuides ? 'Hide Bleed Guides' : 'Show Bleed Guides'}</span>
            </button>
          </div>

          {/* Bookbinding Signature Optimizer Banner if needed */}
          {!report.isSignatureCompliant && (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-700/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-semibold text-amber-200">
                    Bookbinding Signature Adjustment Recommended
                  </h4>
                  <p className="text-[11px] text-stone-300 mt-0.5">
                    Your album currently has {report.pageCount} pages. Physical fine-art bookbinders fold paper into 4-page signatures. Adding {report.pagesNeededForSignature} archival end-sheets makes it ready for press.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onBalanceSignatures();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors cursor-pointer shadow flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Add Parchment End-Sheets</span>
              </button>
            </div>
          )}

          {/* Per-Photo Resolution Quality Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-semibold text-stone-200">
                Photo Resolution & Physical Dimensions Inspector
              </h3>
              <span className="text-[11px] text-stone-400 font-mono">
                {report.totalPhotos} Photographs Evaluated
              </span>
            </div>

            <div className="rounded-xl border border-stone-800 overflow-hidden bg-stone-950">
              <div className="max-h-60 overflow-y-auto divide-y divide-stone-800/80">
                {report.items.map((item, idx) => (
                  <div key={item.photoId || idx} className="p-3 flex items-center justify-between gap-3 hover:bg-stone-900/50 transition-colors">
                    <div className="min-w-0">
                      <div className="font-serif text-stone-200 text-xs truncate">
                        {item.photoName}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">
                        {item.dimensions} • {item.recommendation}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.status === 'optimal'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : item.status === 'acceptable'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {item.estimatedDpi} DPI
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Professional Bindery Export Standards */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2">
            <div className="flex items-center gap-2 font-serif font-semibold text-stone-200">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Professional Printing Guidelines</span>
            </div>
            <ul className="space-y-1 text-[11px] text-stone-400 list-disc pl-4 leading-relaxed">
              <li><strong>Resolution:</strong> All photographs exported via Picmorable are rendered at maximum device resolution.</li>
              <li><strong>Safe Trim:</strong> Keep essential faces and handwritten captions at least 0.25 inches (6mm) inside the outer page trim edges.</li>
              <li><strong>Gutter Spine:</strong> Avoid centering portraits directly across the middle page fold.</li>
              <li><strong>Color Space:</strong> sRGB images are automatically mapped cleanly to standard commercial CMYK presses (ISO Coated v2 / GRACoL).</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pre-Flight Verification Complete</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
