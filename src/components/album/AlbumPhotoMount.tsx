/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { AlbumPhoto, CornerStyle, ScriptStyle } from '../../types/album';
import { 
  Edit3, 
  Check, 
  Calendar, 
  MapPin, 
  Trash2, 
  ArrowLeftRight, 
  Maximize2,
  Mic,
  Square,
  Play,
  Pause,
  Volume2,
  Sparkles
} from 'lucide-react';

interface AlbumPhotoMountProps {
  photo: AlbumPhoto;
  cornerStyle?: CornerStyle;
  scriptStyle?: ScriptStyle;
  onUpdateCaption: (photoId: string, caption: string) => void;
  onRemovePhoto?: (photoId: string) => void;
  onSwapSlot?: () => void;
  onViewPhoto?: (photoId: string) => void;
  onSaveVoiceNote?: (photoId: string, audioUrl: string, duration: number) => void;
  className?: string;
  imageClassName?: string;
}

export const AlbumPhotoMount: React.FC<AlbumPhotoMountProps> = ({
  photo,
  cornerStyle = 'black-classic',
  scriptStyle = 'serif-editorial',
  onUpdateCaption,
  onRemovePhoto,
  onSwapSlot,
  onViewPhoto,
  onSaveVoiceNote,
  className = '',
  imageClassName = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draftCaption, setDraftCaption] = useState(photo.caption);

  // Audio recording state (100% on-device)
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    setDraftCaption(photo.caption);
  }, [photo.caption]);

  // Audio Playback cleanup
  useEffect(() => {
    return () => {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onSaveVoiceNote?.(photo.id, audioUrl, recordingSeconds || 5);
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      };

      recorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission not granted or unavailable:', err);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const togglePlayVoiceNote = () => {
    if (!photo.voiceNoteUrl) return;

    if (!audioElementRef.current) {
      audioElementRef.current = new Audio(photo.voiceNoteUrl);
      audioElementRef.current.onended = () => setIsPlayingVoice(false);
    }

    if (isPlayingVoice) {
      audioElementRef.current.pause();
      setIsPlayingVoice(false);
    } else {
      audioElementRef.current.play().then(() => setIsPlayingVoice(true)).catch(() => setIsPlayingVoice(false));
    }
  };

  // Typography penmanship styles with generous, legible sizing
  const getScriptClass = () => {
    switch (scriptStyle) {
      case 'fountain-pen':
        return 'font-serif italic text-stone-900 tracking-wide text-sm sm:text-base leading-relaxed drop-shadow-[0_0_1px_rgba(20,20,40,0.15)]';
      case 'vintage-typewriter':
        return 'font-mono text-stone-900 tracking-tight text-xs sm:text-sm leading-relaxed';
      case 'architect-hand':
        return 'font-sans uppercase text-stone-800 tracking-[0.16em] text-xs sm:text-sm font-semibold leading-relaxed';
      case 'serif-editorial':
      default:
        return 'font-serif italic text-stone-850 tracking-wide text-sm sm:text-base leading-relaxed';
    }
  };

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
        <div className={`absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 ${cornerColor} pointer-events-none z-10 shadow-sm`} />
        <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 ${cornerColor} pointer-events-none z-10 shadow-sm`} />
        <div className={`absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 ${cornerColor} pointer-events-none z-10 shadow-sm`} />
        <div className={`absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 ${cornerColor} pointer-events-none z-10 shadow-sm`} />
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
      {/* Photographic Print Mount with Crisp Margin */}
      <div className="relative p-2.5 sm:p-3 bg-white shadow-lg rounded-sm border border-stone-200/90 max-w-full">
        {renderCorners()}

        {/* The Image */}
        <div 
          onClick={() => onViewPhoto?.(photo.id)}
          className={`relative overflow-hidden bg-stone-100 rounded-[1px] shadow-inner ${onViewPhoto ? 'cursor-pointer' : ''}`}
          title={onViewPhoto ? 'Click to view in fullscreen presentation slideshow' : undefined}
        >
          <img
            src={photo.url}
            alt={photo.caption || photo.name}
            className={`object-cover block w-full transition-opacity duration-300 select-none ${imageClassName}`}
            loading="lazy"
          />

          {/* Action overlay on hover */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover/mount:opacity-100 transition-opacity flex items-center justify-center gap-2.5 p-2 pointer-events-auto backdrop-blur-[1px]"
          >
            {onViewPhoto && (
              <button
                type="button"
                onClick={() => onViewPhoto(photo.id)}
                title="Fullscreen presentation"
                className="p-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}

            {/* Record Voice Memory Clip */}
            <button
              type="button"
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              title={isRecording ? 'Stop recording voice memory' : 'Record voice recollection (100% on-device)'}
              className={`p-2 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer ${
                isRecording 
                  ? 'bg-rose-600 text-white animate-pulse' 
                  : photo.voiceNoteUrl
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-stone-800 hover:bg-stone-700 text-amber-300'
              }`}
            >
              {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {onSwapSlot && (
              <button
                type="button"
                onClick={onSwapSlot}
                title="Swap position with adjacent slot"
                className="p-2 bg-white/95 hover:bg-white text-stone-800 rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              title="Edit photo description"
              className="p-2 bg-amber-700 hover:bg-amber-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            {onRemovePhoto && (
              <button
                type="button"
                onClick={() => onRemovePhoto(photo.id)}
                title="Remove photo from album"
                className="p-2 bg-rose-700 hover:bg-rose-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Voice Note Player Pill if recorded */}
      {photo.voiceNoteUrl && (
        <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 border border-amber-300 shadow-sm text-stone-900 text-xs">
          <button
            type="button"
            onClick={togglePlayVoiceNote}
            className="flex items-center gap-1.5 font-sans font-semibold text-amber-900 hover:text-amber-700 cursor-pointer"
          >
            {isPlayingVoice ? (
              <Pause className="w-3.5 h-3.5 fill-current text-rose-700" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current text-emerald-700" />
            )}
            <span>Voice Recollection ({photo.voiceDuration || 5}s)</span>
          </button>
        </div>
      )}

      {/* Recording in progress indicator */}
      {isRecording && (
        <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950 border border-rose-700 text-rose-200 text-xs animate-pulse">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>Recording Voice Memory... ({recordingSeconds}s)</span>
          <button
            type="button"
            onClick={stopVoiceRecording}
            className="ml-1 text-[11px] font-bold text-white underline cursor-pointer"
          >
            Done
          </button>
        </div>
      )}

      {/* Caption Slip / Description Area with Comfortable Legible Typography */}
      <div className="w-full mt-2.5 px-2 max-w-md text-center">
        {isEditing ? (
          <div className="bg-amber-50/95 p-3 rounded-lg border border-amber-300 shadow-md text-left">
            <textarea
              value={draftCaption}
              onChange={(e) => setDraftCaption(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              autoFocus
              placeholder="Write a brief description or memory for this photograph..."
              className="w-full text-sm sm:text-base font-serif text-stone-900 bg-transparent resize-none focus:outline-none border-b border-amber-300 pb-1 leading-relaxed"
            />
            <div className="flex items-center justify-between mt-2 pt-1 text-xs text-stone-600">
              <span className="text-[11px] text-stone-500">Press Enter to save</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 text-stone-600 hover:text-stone-900 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCaption}
                  className="px-3 py-1 bg-stone-900 text-amber-100 hover:bg-stone-800 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer shadow"
                >
                  <Check className="w-3.5 h-3.5" /> Save Caption
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="group/caption cursor-pointer py-1.5 px-2 rounded-lg hover:bg-stone-200/50 transition-colors"
            title="Click to edit photograph description"
          >
            {photo.caption ? (
              <p className={`${getScriptClass()} line-clamp-3`}>
                "{photo.caption}"
              </p>
            ) : (
              <p className={`${getScriptClass()} opacity-60 flex items-center justify-center gap-1.5`}>
                <Edit3 className="w-3.5 h-3.5 opacity-60" /> Write description...
              </p>
            )}

            {(photo.date || photo.location || photo.cameraModel) && (
              <div className="flex flex-wrap items-center justify-center gap-2.5 mt-1.5 text-xs text-stone-600 font-sans tracking-normal font-medium">
                {photo.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-500" /> {photo.date}
                  </span>
                )}
                {photo.date && photo.location && <span>·</span>}
                {photo.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-500" /> {photo.location}
                  </span>
                )}
                {photo.cameraModel && (
                  <>
                    <span>·</span>
                    <span className="font-mono text-[11px] text-stone-700 bg-stone-200/80 px-1.5 py-0.2 rounded border border-stone-300">
                      {photo.cameraModel.split(' ')[0]}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
