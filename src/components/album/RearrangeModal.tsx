/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Shuffle, Sparkles, Calendar, Layers, Grid2X2 } from 'lucide-react';

interface RearrangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmRearrange: (strategy: 'balanced' | 'chronological' | 'single-hero' | 'scrapbook') => void;
  photoCount: number;
}

export const RearrangeModal: React.FC<RearrangeModalProps> = ({
  isOpen,
  onClose,
  onConfirmRearrange,
  photoCount,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'balanced' | 'chronological' | 'single-hero' | 'scrapbook'>('balanced');

  if (!isOpen) return null;

  const handleApply = () => {
    onConfirmRearrange(selectedStrategy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-base font-bold text-amber-100">
              Intelligent Layout Rearrangement
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Strategies List */}
        <div className="p-6 space-y-3">
          <p className="text-xs text-stone-400 mb-2">
            Choose how your {photoCount} photographs should be rearranged across the hardcover album pages:
          </p>

          {[
            {
              id: 'balanced',
              title: 'Intelligent Balanced (Recommended)',
              desc: 'Pairs vertical portraits side-by-side, allocates hero plates for wide panoramic shots, and balances spreads.',
              icon: Sparkles,
              tag: 'Best Visuals',
            },
            {
              id: 'chronological',
              title: 'Chronological Timeline',
              desc: 'Arranges photographs sequentially from the earliest date recorded to the latest.',
              icon: Calendar,
              tag: 'By Date',
            },
            {
              id: 'single-hero',
              title: 'Single Hero Plates',
              desc: 'Gives every photograph its own dedicated full page with a large centered archival caption.',
              icon: Layers,
              tag: '1 Per Page',
            },
            {
              id: 'scrapbook',
              title: 'Dense Scrapbook',
              desc: 'Packs multiple snapshot photographs per page with organic subtle rotations and corner brackets.',
              icon: Grid2X2,
              tag: 'Classic Collage',
            },
          ].map((s) => {
            const Icon = s.icon;
            const isSelected = selectedStrategy === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedStrategy(s.id as any)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isSelected
                    ? 'border-amber-400 bg-stone-950 shadow-md ring-1 ring-amber-400/30'
                    : 'border-stone-800 bg-stone-950/60 hover:bg-stone-950 hover:border-stone-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-stone-800 text-stone-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-semibold font-serif ${isSelected ? 'text-amber-200' : 'text-stone-200'}`}>
                      {s.title}
                    </h4>
                    <span className="text-[10px] font-mono bg-stone-800 text-stone-400 px-2 py-0.5 rounded">
                      {s.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-stone-400 hover:text-white rounded-md cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-bold transition-all shadow cursor-pointer"
          >
            Apply Layout
          </button>
        </div>
      </div>
    </div>
  );
};
