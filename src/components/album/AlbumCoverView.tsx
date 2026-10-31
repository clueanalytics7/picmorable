/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlbumMetadata, CoverMaterial, FoilStyle } from '../../types/album';
import { BookOpen, Sparkles, SlidersHorizontal, ShieldCheck } from 'lucide-react';

interface AlbumCoverViewProps {
  meta: AlbumMetadata;
  photoCount: number;
  onOpenAlbum: () => void;
  onEditCoverSettings: () => void;
  onQuickMaterialChange: (material: CoverMaterial) => void;
  onQuickFoilChange: (foil: FoilStyle) => void;
}

export const AlbumCoverView: React.FC<AlbumCoverViewProps> = ({
  meta,
  photoCount,
  onOpenAlbum,
  onEditCoverSettings,
  onQuickMaterialChange,
  onQuickFoilChange,
}) => {
  // Material background textures and classes
  const getMaterialClasses = () => {
    switch (meta.coverMaterial) {
      case 'forest-linen':
        return 'bg-[#1b3425] text-amber-100 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] border-[#14261b]';
      case 'navy-buckram':
        return 'bg-[#14233c] text-blue-100 shadow-[inset_0_0_80px_rgba(0,0,0,0.6)] border-[#0d1829]';
      case 'sandstone-cloth':
        return 'bg-[#6c5e4d] text-amber-50 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)] border-[#524638]';
      case 'espresso-calfskin':
        return 'bg-[#2b1c14] text-amber-100 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)] border-[#1c120c]';
      case 'burgundy-leather':
      default:
        return 'bg-[#431422] text-amber-100 shadow-[inset_0_0_80px_rgba(0,0,0,0.65)] border-[#2e0e17]';
    }
  };

  // Foil stamping typography gradients
  const getFoilStyles = () => {
    switch (meta.foilStyle) {
      case 'silver':
        return {
          color: '#e5e7eb',
          textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 10px rgba(229,231,235,0.4)',
          borderGild: 'border-[#d1d5db]/40',
        };
      case 'rose-copper':
        return {
          color: '#e0987c',
          textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 10px rgba(224,152,124,0.4)',
          borderGild: 'border-[#e0987c]/40',
        };
      case 'blind-embossed':
        return {
          color: 'rgba(255,255,255,0.3)',
          textShadow: '0 1px 1px rgba(255,255,255,0.1), inset 0 1px 2px rgba(0,0,0,0.9)',
          borderGild: 'border-white/20',
        };
      case 'gold':
      default:
        return {
          color: '#e6c875',
          textShadow: '0 1px 2px rgba(0,0,0,0.8), 0 0 12px rgba(230,200,117,0.45)',
          borderGild: 'border-[#e6c875]/45',
        };
    }
  };

  const foil = getFoilStyles();

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-10 px-4">
      {/* 3D Realistic Hardcover Presentation */}
      <div className="relative group max-w-xl w-full">
        {/* Book Spine shadow on the desk */}
        <div className="absolute -inset-4 bg-black/40 blur-2xl rounded-2xl -z-10 transform translate-y-4" />

        {/* The Hardcover Binding */}
        <div
          className={`relative rounded-r-2xl rounded-l-md border-4 p-8 sm:p-14 min-h-[460px] sm:min-h-[520px] flex flex-col justify-between transition-all duration-500 shadow-2xl cursor-pointer ${getMaterialClasses()}`}
          onClick={onOpenAlbum}
        >
          {/* Simulated Leather / Linen Spine Ridge (Left Hinge) */}
          <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-10 bg-gradient-to-r from-black/50 via-black/20 to-transparent border-r border-white/10 flex flex-col justify-around py-8 pointer-events-none">
            {/* Raised Spine Ribs */}
            <div className="h-1 bg-black/60 shadow-sm border-t border-white/10" />
            <div className="h-1 bg-black/60 shadow-sm border-t border-white/10" />
            <div className="h-1 bg-black/60 shadow-sm border-t border-white/10" />
            <div className="h-1 bg-black/60 shadow-sm border-t border-white/10" />
            <div className="h-1 bg-black/60 shadow-sm border-t border-white/10" />
          </div>

          {/* Brass / Gold Corner Protectors */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-400/80 rounded-tr-xl pointer-events-none shadow-md" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-400/80 rounded-br-xl pointer-events-none shadow-md" />

          {/* Bookmark Ribbon Hanging from Top */}
          <div className="absolute -top-3 left-16 sm:left-24 w-4 h-16 bg-red-800 shadow-md border border-red-950 rounded-b-sm pointer-events-none transform rotate-1" />

          {/* Embossed Inner Border Filigree */}
          <div className={`absolute inset-4 sm:inset-6 border-2 rounded-r-xl pointer-events-none ${foil.borderGild}`} />
          <div className={`absolute inset-5 sm:inset-8 border rounded-r-lg pointer-events-none opacity-60 ${foil.borderGild}`} />

          {/* Top Stamp / Archive Header */}
          <div className="relative pl-6 sm:pl-8 text-center pt-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.25em] opacity-80" style={{ color: foil.color }}>
              <Sparkles className="w-3 h-3" />
              <span>{meta.curator || 'Private Family Archive'}</span>
              <Sparkles className="w-3 h-3" />
            </div>
            {meta.dateRange && (
              <p className="text-[11px] font-serif italic mt-1 opacity-70 tracking-wider" style={{ color: foil.color }}>
                {meta.dateRange}
              </p>
            )}
          </div>

          {/* Center Debossed Foil Typography */}
          <div className="relative pl-6 sm:pl-8 text-center my-auto py-6">
            <h1
              className="font-serif text-3xl sm:text-5xl font-bold tracking-tight leading-tight uppercase px-4 select-none"
              style={{
                color: foil.color,
                textShadow: foil.textShadow,
              }}
            >
              {meta.title}
            </h1>

            {meta.subtitle && (
              <p
                className="font-serif italic text-sm sm:text-base mt-4 max-w-md mx-auto leading-relaxed px-4 opacity-90 select-none"
                style={{ color: foil.color }}
              >
                {meta.subtitle}
              </p>
            )}

            {/* Subtle Divider Motif */}
            <div className="flex items-center justify-center gap-2 mt-6 opacity-60">
              <span className="w-12 h-px bg-current" style={{ color: foil.color }} />
              <span className="text-xs" style={{ color: foil.color }}>❖</span>
              <span className="w-12 h-px bg-current" style={{ color: foil.color }} />
            </div>
          </div>

          {/* Bottom Stamp & Open Callout */}
          <div className="relative pl-6 sm:pl-8 text-center pb-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenAlbum();
              }}
              className="group/btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-amber-100 hover:text-white border border-amber-300/30 hover:border-amber-300 shadow-lg text-sm font-serif tracking-wider transition-all transform hover:scale-105 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400 group-hover/btn:rotate-6 transition-transform" />
              <span>Open Photo Album ({photoCount} Photos)</span>
            </button>
            <p className="text-[11px] text-stone-400/80 font-mono tracking-widest uppercase mt-3">
              Click anywhere or press Enter to turn page
            </p>
          </div>
        </div>
      </div>

      {/* Quick Customization Tray below the book */}
      <div className="mt-8 bg-stone-900/90 text-stone-200 border border-stone-800 rounded-xl p-4 max-w-xl w-full shadow-lg backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span className="font-medium text-stone-200">Cover Binding:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => onQuickMaterialChange('burgundy-leather')}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                meta.coverMaterial === 'burgundy-leather' ? 'border-amber-400 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: '#431422' }}
              title="Burgundy Leather"
            />
            <button
              type="button"
              onClick={() => onQuickMaterialChange('forest-linen')}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                meta.coverMaterial === 'forest-linen' ? 'border-amber-400 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: '#1b3425' }}
              title="Forest Linen"
            />
            <button
              type="button"
              onClick={() => onQuickMaterialChange('navy-buckram')}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                meta.coverMaterial === 'navy-buckram' ? 'border-amber-400 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: '#14233c' }}
              title="Navy Buckram"
            />
            <button
              type="button"
              onClick={() => onQuickMaterialChange('sandstone-cloth')}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                meta.coverMaterial === 'sandstone-cloth' ? 'border-amber-400 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: '#6c5e4d' }}
              title="Sandstone Cloth"
            />
            <button
              type="button"
              onClick={() => onQuickMaterialChange('espresso-calfskin')}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                meta.coverMaterial === 'espresso-calfskin' ? 'border-amber-400 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: '#2b1c14' }}
              title="Espresso Calfskin"
            />
          </div>

          {/* Foil Picker */}
          <div className="flex items-center gap-2 border-l border-stone-700 pl-3">
            <span className="text-[11px] text-stone-400">Foil:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onQuickFoilChange('gold')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  meta.foilStyle === 'gold' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-amber-200/80 hover:bg-stone-800'
                }`}
              >
                Gold
              </button>
              <button
                type="button"
                onClick={() => onQuickFoilChange('silver')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  meta.foilStyle === 'silver' ? 'bg-stone-200 text-stone-950 font-bold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                Silver
              </button>
              <button
                type="button"
                onClick={() => onQuickFoilChange('rose-copper')}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  meta.foilStyle === 'rose-copper' ? 'bg-orange-300 text-stone-950 font-bold' : 'text-orange-200 hover:bg-stone-800'
                }`}
              >
                Copper
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditCoverSettings}
            className="text-amber-400 hover:text-amber-300 text-[11px] underline underline-offset-2 ml-auto cursor-pointer"
          >
            Edit Titles & Details
          </button>
        </div>

        {/* Privacy Note */}
        <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-sans font-medium">100% On-Device & Private</span>
          </div>
          <span className="text-stone-500 font-mono text-[10px]">Zero network transmissions · Local browser memory</span>
        </div>
      </div>
    </div>
  );
};
