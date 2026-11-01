/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Lock, 
  BookOpen, 
  Download, 
  Zap, 
  HelpCircle 
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-stone-100">
                Simple, Honest Ownership
              </h2>
              <p className="text-[11px] text-stone-400">
                No monthly subscriptions. No cloud storage lock-in. Pay once, own forever.
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

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
              Picmorable Commercial Guarantee
            </span>
            <h3 className="font-serif text-2xl font-bold text-stone-100">
              Preserve your memories without endless fees
            </h3>
            <p className="text-stone-300 text-xs leading-relaxed">
              Mainstream photo apps rent your memories back to you behind monthly cloud storage subscriptions. Picmorable runs on your hardware, so your photos remain free forever.
            </p>
          </div>

          {/* Pricing Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Free Tier */}
            <div className="p-6 rounded-2xl bg-stone-950 border border-stone-800 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
                    Community Edition
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-stone-300">
                    Always Free
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif text-3xl font-bold text-stone-100">£0</span>
                    <span className="text-xs text-stone-400">/ forever</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Everything you need to organize photos on-device and bind memory albums.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-stone-800/80 text-xs">
                  <div className="flex items-center gap-2 text-stone-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>100% on-device private sandbox (0 KB sent)</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited hardcover album page spreads</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Intelligent aspect-ratio arrangement engine</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Fullscreen presentation slideshow with audio</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Standalone offline HTML album & ZIP export</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Life Timeline & event clustering</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                Current Active Plan
              </button>
            </div>

            {/* Pro Lifetime Tier */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-amber-950/30 border-2 border-amber-500/60 shadow-xl flex flex-col justify-between space-y-6 relative">
              <div className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold font-mono text-[10px] shadow">
                ONE-TIME LAUNCH OFFER
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                    Picmorable Pro Archival
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-700/80">
                    Lifetime License
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold text-amber-100">£29.99</span>
                    <span className="text-xs text-stone-400 line-through">£49.99</span>
                    <span className="text-xs text-amber-300 font-mono">one-time</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    For serious memory preservationists, family archivists and photographers.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-amber-900/40 text-xs">
                  <div className="flex items-center gap-2 text-stone-200">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Print-Ready 300 DPI Archival PDF Export</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-200">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Advanced Burgundy Leather & Forest Linen cloths</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-200">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Custom Debossed Gold & Rose-Copper Foils</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-200">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Deep burst-shot similarity detection engine</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-200">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>High-resolution vector typography for book printers</span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-200">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Lifetime updates included • Zero recurring renewals</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-all cursor-pointer shadow hover:shadow-amber-400/20"
              >
                Included in This Preview Build
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-2 text-stone-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>30-Day Money-Back Guarantee • No Telemetry Ever</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
