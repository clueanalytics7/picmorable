/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlbumMetadata, CoverMaterial, FoilStyle, PaperTone } from '../../types/album';
import { BookOpen, Sparkles, SlidersHorizontal, ShieldCheck, Edit3, Check, Palette } from 'lucide-react';

interface AlbumCoverViewProps {
  meta: AlbumMetadata;
  photoCount: number;
  onOpenAlbum: () => void;
  onEditCoverSettings: () => void;
  onQuickMaterialChange: (material: CoverMaterial) => void;
  onQuickFoilChange: (foil: FoilStyle) => void;
  onUpdateMetaField?: (field: keyof AlbumMetadata, value: any) => void;
}

export const AlbumCoverView: React.FC<AlbumCoverViewProps> = ({
  meta,
  photoCount,
  onOpenAlbum,
  onEditCoverSettings,
  onQuickMaterialChange,
  onQuickFoilChange,
  onUpdateMetaField,
}) => {
  // Inline editing state for cover text
  const [editingField, setEditingField] = useState<'title' | 'subtitle' | 'curator' | 'dateRange' | null>(null);
  const [tempValue, setTempValue] = useState('');

  const startEditing = (field: 'title' | 'subtitle' | 'curator' | 'dateRange', currentValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingField(field);
    setTempValue(currentValue || '');
  };

  const saveEditing = (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    if (editingField && onUpdateMetaField) {
      onUpdateMetaField(editingField, tempValue);
    }
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEditing(e);
    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  // Modern luxury material textures & deep velvety tones
  const getMaterialClasses = () => {
    switch (meta.coverMaterial) {
      case 'forest-linen':
        return 'bg-[#15271d] text-emerald-100 shadow-[inset_0_0_100px_rgba(0,0,0,0.7),0_25px_50px_-12px_rgba(0,0,0,0.7)] border-[#0d1a13]';
      case 'navy-buckram':
        return 'bg-[#0f1b2e] text-blue-100 shadow-[inset_0_0_100px_rgba(0,0,0,0.7),0_25px_50px_-12px_rgba(0,0,0,0.7)] border-[#0a121f]';
      case 'sandstone-cloth':
        return 'bg-[#524536] text-amber-50 shadow-[inset_0_0_90px_rgba(0,0,0,0.6),0_25px_50px_-12px_rgba(0,0,0,0.6)] border-[#3b3227]';
      case 'espresso-calfskin':
        return 'bg-[#221610] text-amber-100 shadow-[inset_0_0_100px_rgba(0,0,0,0.8),0_25px_50px_-12px_rgba(0,0,0,0.8)] border-[#150d0a]';
      case 'burgundy-leather':
      default:
        return 'bg-[#3b121e] text-rose-100 shadow-[inset_0_0_100px_rgba(0,0,0,0.7),0_25px_50px_-12px_rgba(0,0,0,0.7)] border-[#240a12]';
    }
  };

  // Modern refined metallic foil stamping
  const getFoilStyles = () => {
    switch (meta.foilStyle) {
      case 'silver':
        return {
          color: '#f3f4f6',
          textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 15px rgba(243,244,246,0.35)',
          borderGild: 'border-[#e5e7eb]/40',
          accent: '#e5e7eb',
        };
      case 'rose-copper':
        return {
          color: '#f0ad95',
          textShadow: '0 1px 2px rgba(0,0,0,0.9), 0 0 15px rgba(240,173,149,0.35)',
          borderGild: 'border-[#f0ad95]/40',
          accent: '#f0ad95',
        };
      case 'blind-embossed':
        return {
          color: 'rgba(255,255,255,0.45)',
          textShadow: '0 1px 1px rgba(255,255,255,0.15), inset 0 1px 2px rgba(0,0,0,0.95)',
          borderGild: 'border-white/20',
          accent: 'rgba(255,255,255,0.5)',
        };
      case 'gold':
      default:
        return {
          color: '#f3d382',
          textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 18px rgba(243,211,130,0.4)',
          borderGild: 'border-[#f3d382]/45',
          accent: '#f3d382',
        };
    }
  };

  const foil = getFoilStyles();

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10 px-4 w-full">
      {/* 3D Modern Luxury Hardcover Book */}
      <div className="relative group max-w-2xl w-full">
        {/* Soft atmospheric ambient shadow */}
        <div className="absolute -inset-6 bg-black/60 blur-3xl rounded-3xl -z-10 transform translate-y-6" />

        {/* The Hardcover Binding */}
        <div
          className={`relative rounded-r-2xl rounded-l-md border-[3px] p-8 sm:p-14 min-h-[500px] sm:min-h-[560px] flex flex-col justify-between transition-all duration-300 cursor-pointer ${getMaterialClasses()}`}
          onClick={onOpenAlbum}
        >
          {/* Subtle Leather/Cloth Spine Hinge & Ribs */}
          <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-10 bg-gradient-to-r from-black/60 via-black/25 to-transparent border-r border-white/10 flex flex-col justify-around py-8 pointer-events-none">
            <div className="h-1 bg-black/60 shadow-sm border-t border-white/10" />
            <div className="h-1 bg-black/60 shadow-sm border-t border-white/10" />
            <div className="h-1 bg-black/60 shadow-sm border-t border-white/10" />
            <div className="h-1 bg-black/60 shadow-sm border-t border-white/10" />
            <div className="h-1 bg-black/60 shadow-sm border-t border-white/10" />
          </div>

          {/* Luxury Corner Accents */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-xl pointer-events-none opacity-80" style={{ borderColor: foil.accent }} />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-xl pointer-events-none opacity-80" style={{ borderColor: foil.accent }} />

          {/* Refined Geometric Debossed Gilding */}
          <div className={`absolute inset-5 sm:inset-7 border rounded-r-xl pointer-events-none ${foil.borderGild}`} />

          {/* Top Floating Helper Badge */}
          <div className="absolute top-2 right-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-amber-200/90 text-xs font-sans border border-white/10 shadow-sm">
              <Edit3 className="w-3.5 h-3.5 text-amber-300" />
              <span>Click any text to edit directly</span>
            </span>
          </div>

          {/* Top Section: Curator / Archive Name & Date */}
          <div className="relative pl-6 sm:pl-8 text-center pt-2 z-10">
            {editingField === 'curator' ? (
              <div onClick={(e) => e.stopPropagation()} className="inline-block max-w-md w-full">
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="w-full bg-black/60 border-2 border-amber-400 rounded-lg px-3 py-1.5 text-center text-sm sm:text-base font-mono text-amber-100 focus:outline-none shadow-lg"
                />
                <div className="flex justify-center gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={(e) => saveEditing(e)}
                    className="px-3 py-1 bg-amber-400 text-stone-950 font-bold rounded text-xs cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setEditingField(null); }}
                    className="px-2 py-1 bg-stone-800 text-stone-300 rounded text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={(e) => startEditing('curator', meta.curator, e)}
                className="group/curator inline-flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-text"
                title="Click to edit curator or family archive name"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: foil.accent }} />
                <span
                  className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em] font-medium"
                  style={{ color: foil.color }}
                >
                  {meta.curator || 'Private Family Archive'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: foil.accent }} />
                <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover/curator:opacity-100 transition-opacity ml-1" style={{ color: foil.color }} />
              </div>
            )}

            {/* Date Range */}
            <div className="mt-1">
              {editingField === 'dateRange' ? (
                <div onClick={(e) => e.stopPropagation()} className="inline-block max-w-xs w-full">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-full bg-black/60 border border-amber-400 rounded-lg px-3 py-1 text-center text-xs sm:text-sm font-mono text-amber-100 focus:outline-none"
                  />
                  <div className="flex justify-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={(e) => saveEditing(e)}
                      className="px-2.5 py-0.5 bg-amber-400 text-stone-950 font-bold rounded text-xs cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={(e) => startEditing('dateRange', meta.dateRange, e)}
                  className="group/date inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded hover:bg-white/10 transition-colors cursor-text text-xs sm:text-sm font-serif italic tracking-wide"
                  style={{ color: foil.color, opacity: 0.85 }}
                  title="Click to edit date range"
                >
                  <span>{meta.dateRange || '1998'}</span>
                  <Edit3 className="w-3 h-3 opacity-0 group-hover/date:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          </div>

          {/* Center Debossed Foil Typography (Title & Subtitle) */}
          <div className="relative pl-6 sm:pl-8 text-center my-auto py-8 z-10">
            {/* Title */}
            {editingField === 'title' ? (
              <div onClick={(e) => e.stopPropagation()} className="max-w-xl mx-auto w-full px-4">
                <textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  autoFocus
                  className="w-full bg-black/70 border-2 border-amber-400 rounded-xl p-3 text-center text-2xl sm:text-4xl font-serif font-bold text-amber-100 focus:outline-none shadow-2xl resize-none"
                />
                <div className="flex justify-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={(e) => saveEditing(e)}
                    className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-sm cursor-pointer shadow"
                  >
                    Save Title
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setEditingField(null); }}
                    className="px-3 py-1.5 bg-stone-800 text-stone-300 rounded-lg text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={(e) => startEditing('title', meta.title, e)}
                className="group/title inline-block p-2 rounded-xl hover:bg-white/10 transition-all cursor-text max-w-xl mx-auto"
                title="Click to edit title directly"
              >
                <div className="flex items-center justify-center gap-2">
                  <h1
                    className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight uppercase px-2 select-none"
                    style={{
                      color: foil.color,
                      textShadow: foil.textShadow,
                    }}
                  >
                    {meta.title}
                  </h1>
                  <Edit3 className="w-5 h-5 opacity-0 group-hover/title:opacity-80 transition-opacity shrink-0" style={{ color: foil.color }} />
                </div>
              </div>
            )}

            {/* Subtitle / Dedication */}
            {editingField === 'subtitle' ? (
              <div onClick={(e) => e.stopPropagation()} className="max-w-lg mx-auto w-full px-4 mt-3">
                <textarea
                  value={tempValue}
                  onChange={(e) => setTempValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  autoFocus
                  className="w-full bg-black/70 border border-amber-400 rounded-lg p-2.5 text-center text-sm sm:text-base font-serif italic text-amber-100 focus:outline-none shadow-lg resize-none"
                />
                <div className="flex justify-center gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={(e) => saveEditing(e)}
                    className="px-3 py-1 bg-amber-400 text-stone-950 font-bold rounded text-xs cursor-pointer"
                  >
                    Save Subtitle
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={(e) => startEditing('subtitle', meta.subtitle, e)}
                className="group/sub inline-block mt-3 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all cursor-text max-w-lg mx-auto"
                title="Click to edit subtitle directly"
              >
                <div className="flex items-center justify-center gap-2">
                  <p
                    className="font-serif italic text-base sm:text-lg lg:text-xl leading-relaxed opacity-90 select-none"
                    style={{ color: foil.color }}
                  >
                    {meta.subtitle || 'Click to write a dedication or subtitle'}
                  </p>
                  <Edit3 className="w-4 h-4 opacity-0 group-hover/sub:opacity-80 transition-opacity shrink-0" style={{ color: foil.color }} />
                </div>
              </div>
            )}

            {/* Subtle Divider Motif */}
            <div className="flex items-center justify-center gap-3 mt-6 opacity-60">
              <span className="w-16 h-px bg-current" style={{ color: foil.color }} />
              <span className="text-sm" style={{ color: foil.color }}>❖</span>
              <span className="w-16 h-px bg-current" style={{ color: foil.color }} />
            </div>
          </div>

          {/* Bottom Callout & Big Prominent Open Action */}
          <div className="relative pl-6 sm:pl-8 text-center pb-2 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAlbum();
              }}
              className="group/btn inline-flex items-center gap-3 px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-serif font-bold text-base sm:text-lg tracking-wide shadow-2xl transition-all transform hover:scale-105 cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-stone-950 group-hover/btn:rotate-6 transition-transform" />
              <span>Open Photo Album ({photoCount} Photographs) →</span>
            </button>
            <p className="text-xs sm:text-sm text-stone-300 font-sans mt-3 font-medium">
              Click anywhere on cover or press <kbd className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-amber-300 border border-white/20">Enter</kbd> to open
            </p>
          </div>
        </div>
      </div>

      {/* Modern Luxury Customization Tray below the book */}
      <div className="mt-8 bg-stone-900/90 text-stone-100 border border-stone-800 rounded-2xl p-5 max-w-2xl w-full shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          {/* Material Swatches */}
          <div className="flex items-center gap-3">
            <span className="font-medium text-stone-300 text-sm">Cover Material:</span>
            <div className="flex items-center gap-2">
              {[
                { id: 'burgundy-leather', bg: '#3b121e', label: 'Burgundy Leather' },
                { id: 'forest-linen', bg: '#15271d', label: 'Forest Linen' },
                { id: 'navy-buckram', bg: '#0f1b2e', label: 'Navy Buckram' },
                { id: 'sandstone-cloth', bg: '#524536', label: 'Sandstone Cloth' },
                { id: 'espresso-calfskin', bg: '#221610', label: 'Espresso Calfskin' },
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onQuickMaterialChange(m.id as CoverMaterial)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-115 cursor-pointer shadow ${
                    meta.coverMaterial === m.id ? 'border-amber-400 ring-2 ring-amber-400/50 scale-110' : 'border-stone-700'
                  }`}
                  style={{ backgroundColor: m.bg }}
                  title={m.label}
                />
              ))}
            </div>
          </div>

          {/* Foil Picker */}
          <div className="flex items-center gap-2 border-l border-stone-800 pl-4">
            <span className="text-stone-300 text-sm">Foil:</span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'gold', label: 'Gold', activeClass: 'bg-amber-400 text-stone-950 font-bold' },
                { id: 'silver', label: 'Silver', activeClass: 'bg-stone-200 text-stone-950 font-bold' },
                { id: 'rose-copper', label: 'Copper', activeClass: 'bg-orange-300 text-stone-950 font-bold' },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onQuickFoilChange(f.id as FoilStyle)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    meta.foilStyle === f.id
                      ? f.activeClass
                      : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onEditCoverSettings}
            className="text-amber-400 hover:text-amber-300 text-sm font-medium underline underline-offset-4 ml-auto cursor-pointer"
          >
            All Book Settings →
          </button>
        </div>

        {/* Clean Privacy Assurance Bar */}
        <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>100% On-Device Sovereign Privacy Guarantee</span>
          </div>
          <span className="font-mono text-stone-400">Zero network transmissions • Isolated in browser memory</span>
        </div>
      </div>
    </div>
  );
};
