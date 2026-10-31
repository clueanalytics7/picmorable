/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlbumPhoto, CornerStyle } from '../../types/album';
import { Edit3, Check, Calendar, MapPin, Trash2, ArrowLeftRight } from 'lucide-react';

interface AlbumPhotoMountProps {
  photo: AlbumPhoto;
  cornerStyle?: CornerStyle;
  onUpdateCaption: (photoId: string, caption: string) => void;
  onRemovePhoto?: (photoId: string) => void;
  onSwapSlot?: () => void;
  className?: string;
  imageClassName?: string;
}

export const AlbumPhotoMount: React.FC<AlbumPhotoMountProps> = ({
  photo,
  cornerStyle = 'black-classic',
  onUpdateCaption,
  onRemovePhoto,
  onSwapSlot,
  className = '',
  imageClassName = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftCaption, setDraftCaption] = useState(photo.caption);

  const handleSaveCaption = () => {
    onUpdateCaption(photo.id, draftCaption);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveCaption();
    }
  };

  // Corner styles
  const renderCorners = () => {
    if (cornerStyle === 'white-border') return null;

    const cornerColor = 
      cornerStyle === 'gold-brass' 
        ? 'border-amber-500/80' 
        : cornerStyle === 'ivory-cloth' 
          ? 'border-stone-300' 
          : 'border-stone-800'; // black-classic

    return (
      <>
        {/* Top-Left Corner */}
        <div 
          className={`absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 ${cornerColor} pointer-events-none z-10 shadow-sm`}
          style={{ transform: 'rotate(0deg)' }}
        />
        {/* Top-Right Corner */}
        <div 
          className={`absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 ${cornerColor} pointer-events-none z-10 shadow-sm`}
          style={{ transform: 'rotate(0deg)' }}
        />
        {/* Bottom-Left Corner */}
        <div 
          className={`absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 ${cornerColor} pointer-events-none z-10 shadow-sm`}
          style={{ transform: 'rotate(0deg)' }}
        />
        {/* Bottom-Right Corner */}
        <div 
          className={`absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 ${cornerColor} pointer-events-none z-10 shadow-sm`}
          style={{ transform: 'rotate(0deg)' }}
        />
      </>
    );
  };

  return (
    <div 
      className={`group/mount relative flex flex-col items-center transition-transform duration-300 ${className}`}
      style={{
        transform: photo.rotation ? `rotate(${photo.rotation}deg)` : undefined,
      }}
    >
      {/* Photographic Print Mount with White Margin */}
      <div className="relative p-2 sm:p-2.5 bg-white shadow-md rounded-sm border border-stone-200/80 max-w-full">
        {renderCorners()}

        {/* The Image */}
        <div className="relative overflow-hidden bg-stone-100 rounded-[1px] shadow-inner">
          <img
            src={photo.url}
            alt={photo.caption || photo.name}
            className={`object-cover block w-full transition-opacity duration-300 select-none ${imageClassName}`}
            loading="lazy"
          />

          {/* Action overlay on hover */}
          <div className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover/mount:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 pointer-events-auto">
            {onSwapSlot && (
              <button
                type="button"
                onClick={onSwapSlot}
                title="Swap position"
                className="p-1.5 bg-white/90 hover:bg-white text-stone-800 rounded-full shadow text-xs transition-transform hover:scale-110 cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              title="Edit photo description"
              className="p-1.5 bg-amber-700/90 hover:bg-amber-700 text-white rounded-full shadow text-xs transition-transform hover:scale-110 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            {onRemovePhoto && (
              <button
                type="button"
                onClick={() => onRemovePhoto(photo.id)}
                title="Remove photo from album"
                className="p-1.5 bg-rose-700/90 hover:bg-rose-700 text-white rounded-full shadow text-xs transition-transform hover:scale-110 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Caption Slip / Description Area */}
      <div className="w-full mt-2 px-1 max-w-sm text-center">
        {isEditing ? (
          <div className="bg-amber-50/95 p-2 rounded border border-amber-300 shadow-sm text-left">
            <textarea
              value={draftCaption}
              onChange={(e) => setDraftCaption(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              autoFocus
              placeholder="Write a brief description or memory for this photograph..."
              className="w-full text-xs font-serif text-stone-900 bg-transparent resize-none focus:outline-none border-b border-amber-300 pb-1"
            />
            <div className="flex items-center justify-between mt-1.5 pt-1 text-[11px] text-stone-600">
              <span className="text-[10px] text-stone-500">Press Enter to save</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-0.5 text-stone-600 hover:text-stone-900 text-[11px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCaption}
                  className="px-2.5 py-0.5 bg-stone-900 text-amber-50 hover:bg-stone-800 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" /> Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="group/caption cursor-pointer py-1 px-1.5 rounded hover:bg-stone-200/40 transition-colors"
            title="Click to edit photograph description"
          >
            {photo.caption ? (
              <p className="font-serif italic text-xs sm:text-[13px] text-stone-800 leading-snug tracking-wide line-clamp-3">
                "{photo.caption}"
              </p>
            ) : (
              <p className="font-serif italic text-xs text-stone-400 group-hover/caption:text-stone-600 flex items-center justify-center gap-1">
                <Edit3 className="w-3 h-3 opacity-60" /> Write description...
              </p>
            )}

            {(photo.date || photo.location) && (
              <div className="flex items-center justify-center gap-2 mt-1 text-[10px] text-stone-500 font-sans tracking-tight">
                {photo.date && (
                  <span className="flex items-center gap-0.5">
                    <Calendar className="w-2.5 h-2.5 opacity-60" /> {photo.date}
                  </span>
                )}
                {photo.date && photo.location && <span>·</span>}
                {photo.location && (
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5 opacity-60" /> {photo.location}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
