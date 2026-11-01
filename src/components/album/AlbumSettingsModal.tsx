/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, Feather, Sparkles } from 'lucide-react';
import { AlbumMetadata, CoverMaterial, FoilStyle, CornerStyle, ScriptStyle, EmbellishmentStyle } from '../../types/album';

interface AlbumSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: AlbumMetadata;
  onSaveMeta: (updatedMeta: Partial<AlbumMetadata>) => void;
}

export const AlbumSettingsModal: React.FC<AlbumSettingsModalProps> = ({
  isOpen,
  onClose,
  meta,
  onSaveMeta,
}) => {
  const [title, setTitle] = useState(meta.title);
  const [subtitle, setSubtitle] = useState(meta.subtitle);
  const [description, setDescription] = useState(meta.description);
  const [curator, setCurator] = useState(meta.curator);
  const [dateRange, setDateRange] = useState(meta.dateRange);
  const [coverMaterial, setCoverMaterial] = useState<CoverMaterial>(meta.coverMaterial);
  const [foilStyle, setFoilStyle] = useState<FoilStyle>(meta.foilStyle);
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>(meta.cornerStyle);
  const [scriptStyle, setScriptStyle] = useState<ScriptStyle>(meta.scriptStyle || 'serif-editorial');
  const [embellishment, setEmbellishment] = useState<EmbellishmentStyle>(meta.embellishment || 'wax-seal');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveMeta({
      title,
      subtitle,
      description,
      curator,
      dateRange,
      coverMaterial,
      foilStyle,
      cornerStyle,
      scriptStyle,
      embellishment,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-stone-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-base font-bold text-amber-100">
              Album Details & Hardcover Binding
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

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title & Subtitle */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1 font-mono">
                Album Title (Foil Stamped on Cover)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer by the Atlantic Coast"
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2.5 text-sm font-serif text-amber-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1 font-mono">
                Album Subtitle / Dedication
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Two weeks along the Cornish coastal footpaths"
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs font-serif text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Dedicated Field: Entire Album Narrative Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1 font-mono flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-amber-400" />
              Description of the Entire Album
            </label>
            <p className="text-[11px] text-stone-400 mb-1.5">
              Write a brief or rich overview of this album. This narrative is printed on the frontispiece and included in exports.
            </p>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write the story of this album, the people in it, and why this time in your life is worth remembering..."
              className="w-full bg-stone-950 border border-stone-700 rounded-lg p-3 text-xs font-serif text-stone-200 focus:outline-none focus:border-amber-400 leading-relaxed"
            />
          </div>

          {/* Archive & Date Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                Curator / Family Name
              </label>
              <input
                type="text"
                value={curator}
                onChange={(e) => setCurator(e.target.value)}
                placeholder="e.g. The Harrison Family Archive"
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1">
                Date / Time Period
              </label>
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="e.g. August 1998"
                className="w-full bg-stone-950 border border-stone-700 rounded-lg p-2 text-xs text-stone-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Hardcover Material */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 font-mono">
              Hardcover Binding Material
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'burgundy-leather', label: 'Burgundy Leather', color: '#431422' },
                { id: 'forest-linen', label: 'Forest Linen', color: '#1b3425' },
                { id: 'navy-buckram', label: 'Navy Buckram', color: '#14233c' },
                { id: 'sandstone-cloth', label: 'Sandstone Cloth', color: '#6c5e4d' },
                { id: 'espresso-calfskin', label: 'Espresso Calfskin', color: '#2b1c14' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCoverMaterial(m.id as CoverMaterial)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                    coverMaterial === m.id
                      ? 'border-amber-400 bg-stone-800 text-amber-200 font-medium'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/40 shrink-0"
                    style={{ backgroundColor: m.color }}
                  />
                  <span className="truncate">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Foil Stamping */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 font-mono">
              Cover Foil Stamping
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'gold', label: 'Antique Gold Foil' },
                { id: 'silver', label: 'Polished Silver' },
                { id: 'rose-copper', label: 'Rose Copper' },
                { id: 'blind-embossed', label: 'Blind Embossed' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFoilStyle(f.id as FoilStyle)}
                  className={`p-2 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                    foilStyle === f.id
                      ? 'border-amber-400 bg-stone-800 text-amber-200 font-medium'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Corners */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 font-mono">
              Vintage Photo Mount Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'black-classic', label: 'Black Photo Corners' },
                { id: 'gold-brass', label: 'Brass Photo Corners' },
                { id: 'ivory-cloth', label: 'Ivory Corners' },
                { id: 'white-border', label: 'White Border Only' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCornerStyle(c.id as CornerStyle)}
                  className={`p-2 rounded-lg border text-center text-xs transition-all cursor-pointer ${
                    cornerStyle === c.id
                      ? 'border-amber-400 bg-stone-800 text-amber-200 font-medium'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Penmanship & Marginalia Typography Style */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 font-mono">
              Penmanship & Inscription Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'serif-editorial', label: 'Classic Editorial Serif', font: 'font-serif italic', preview: '"The morning tide at St Ives"' },
                { id: 'fountain-pen', label: 'Fountain Pen Cursive', font: 'font-serif italic tracking-wider text-amber-200', preview: '"Salt spray & afternoon tea"' },
                { id: 'vintage-typewriter', label: 'Mechanical Typewriter', font: 'font-mono text-stone-200', preview: '"PLATE NO. 04 / ARCHIVE"' },
                { id: 'architect-hand', label: "Architect's Hand Lettering", font: 'font-sans uppercase tracking-widest text-stone-300', preview: '"COASTAL FOOTPATH WALK"' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScriptStyle(s.id as ScriptStyle)}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    scriptStyle === s.id
                      ? 'border-amber-400 bg-stone-800 ring-1 ring-amber-400/50 shadow'
                      : 'border-stone-800 bg-stone-950 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-medium text-stone-200 mb-1">{s.label}</div>
                  <div className={`text-[11px] truncate ${s.font}`}>{s.preview}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Archival Folio Embellishment */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2 font-mono">
              Archival Page Embellishment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'wax-seal', label: 'Burgundy Wax Seal', symbol: '❖' },
                { id: 'botanical-branch', label: 'Botanical Branch', symbol: '🌿' },
                { id: 'postal-date-stamp', label: 'Postal Date Stamp', symbol: '1998' },
                { id: 'antique-compass', label: 'Antique Compass', symbol: '🧭' },
                { id: 'none', label: 'Minimalist (None)', symbol: '—' },
              ].map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => setEmbellishment(e.id as EmbellishmentStyle)}
                  className={`p-2 rounded-lg border text-center text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    embellishment === e.id
                      ? 'border-amber-400 bg-stone-800 text-amber-200 font-medium'
                      : 'border-stone-800 bg-stone-950 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <span className="text-sm">{e.symbol}</span>
                  <span>{e.label}</span>
                </button>
              ))}
            </div>
          </div>
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
            onClick={handleSave}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Save Details
          </button>
        </div>
      </div>
    </div>
  );
};
