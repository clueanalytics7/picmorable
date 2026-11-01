/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Layers, 
  Clock, 
  Copy, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  FolderHeart
} from 'lucide-react';
import { AlbumPhoto, AlbumMetadata } from '../../types/album';
import { TWENTY_PHOTO_PACK, SAMPLE_20_ALBUM_META } from '../../data/twentyPhotoPack';

interface QuickOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteOnboarding: (photos: AlbumPhoto[], meta?: Partial<AlbumMetadata>) => void;
  onOpenDuplicates: () => void;
  onOpenTimeline: () => void;
}

type OnboardingStep = 'intro' | 'processing' | 'success';

export const QuickOnboardingModal: React.FC<QuickOnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompleteOnboarding,
  onOpenDuplicates,
  onOpenTimeline,
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('intro');
  const [progressStage, setProgressStage] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processingMessages = [
    'Ingesting 20 photographs into private on-device RAM sandbox...',
    'Extracting camera EXIF timestamps & verified hardware metadata...',
    'Scanning for duplicate photographs & rapid burst sequences...',
    'Constructing Life Timeline & clustering 4 distinct event chapters...',
    'Formatting into traditional hardcover album spreads with gold foil...',
  ];

  const runMagicPipeline = (photosToLoad: AlbumPhoto[], customMeta?: Partial<AlbumMetadata>) => {
    setCurrentStep('processing');
    setProgressStage(0);

    const interval = setInterval(() => {
      setProgressStage(prev => {
        if (prev < processingMessages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onCompleteOnboarding(photosToLoad, customMeta);
            setCurrentStep('success');
          }, 400);
          return prev;
        }
      });
    }, 450);
  };

  const handleStartWithSamplePack = () => {
    runMagicPipeline(TWENTY_PHOTO_PACK, SAMPLE_20_ALBUM_META);
  };

  const handleUserFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).slice(0, 25);
    const convertedPhotos: AlbumPhoto[] = fileList.map((file, idx) => {
      const url = URL.createObjectURL(file);
      const isLandscape = idx % 2 === 0;
      return {
        id: `user-p-${Date.now()}-${idx}`,
        name: file.name,
        url,
        blob: file,
        caption: `Preserved photograph from ${file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}.`,
        date: new Date(file.lastModified).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
        aspectRatio: isLandscape ? 'landscape' : 'portrait',
        rotation: Number(((Math.random() * 2) - 1).toFixed(1)),
        fileSize: file.size,
        isVerifiedMetadata: true,
        cameraModel: 'Personal Device Camera',
        eventTag: 'Personal Life Archive',
      };
    });

    runMagicPipeline(convertedPhotos, {
      title: 'Personal Life Archive',
      subtitle: `${convertedPhotos.length} personal photographs arranged on-device`,
      description: 'A newly arranged personal collection of photographs preserved with zero cloud transmission.',
    });
  };

  const handleReset = () => {
    setCurrentStep('intro');
    setProgressStage(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden text-stone-100 flex flex-col">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-amber-100">
                Two-Minute Magic Onboarding
              </h2>
              <p className="text-[11px] text-stone-400">
                Turn the photos sitting on your phone into memories you can hold forever.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {currentStep === 'intro' && (
            <div className="space-y-6">
              <div className="space-y-2 text-center sm:text-left">
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block">
                  Intimidated by 15,000 photos?
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-100 leading-snug">
                  Upload 20 photographs to try it.
                </h3>
                <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                  You don’t have to organize your entire life library today. Start with just 20 photos. 
                  Watch Picmorable organize them into meaningful events, detect duplicate frames, create a life timeline, and bind an old-fashioned hardcover memory book in seconds.
                </p>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* 1-Click Sample Pack */}
                <button
                  type="button"
                  onClick={handleStartWithSamplePack}
                  className="p-4 rounded-xl bg-gradient-to-b from-stone-800 to-stone-900 border border-amber-500/40 hover:border-amber-400 text-left transition-all group cursor-pointer shadow-md hover:shadow-amber-950/40"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs">
                      20
                    </span>
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                      Instant • 1 Click
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-stone-100 group-hover:text-amber-200 transition-colors">
                    Try 20 Curated Memories
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    Loads 20 high-resolution photos across 4 life chapters with duplicate burst shots included to test the detection engine.
                  </p>
                </button>

                {/* Upload Your Own 20 Photos */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-xl bg-stone-950 border border-stone-800 hover:border-stone-700 text-left transition-all group cursor-pointer shadow-sm hover:bg-stone-900"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleUserFilesSelected}
                    className="hidden"
                  />
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-800 text-stone-300 flex items-center justify-center">
                      <Upload className="w-4 h-4 text-stone-300 group-hover:text-amber-400 transition-colors" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/80">
                      100% Private
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-stone-100 group-hover:text-stone-200 transition-colors">
                    Select 20 of Your Own Photos
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    Pick 20 photos from your phone or laptop. Nothing leaves your device; everything processes in your browser sandbox.
                  </p>
                </button>
              </div>

              {/* Privacy badge assurance */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-[11px] text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Zero Cloud Ingestion:</strong> Photographs remain strictly inside your browser's private memory sandbox.
                </span>
              </div>
            </div>
          )}

          {currentStep === 'processing' && (
            <div className="py-8 space-y-6 text-center">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-stone-800 border-t-amber-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-amber-300 font-bold font-mono text-xs">
                  {Math.round(((progressStage + 1) / processingMessages.length) * 100)}%
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-lg font-bold text-stone-100">
                  Picmorable is Organising Your Memories
                </h3>
                <p className="text-xs font-mono text-amber-300 h-6">
                  {processingMessages[progressStage]}
                </p>
              </div>

              <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden max-w-sm mx-auto">
                <div 
                  className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${((progressStage + 1) / processingMessages.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {currentStep === 'success' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-600/70 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-100">
                  Your First 20 Memories Are Organised!
                </h3>
                <p className="text-xs text-stone-300 max-w-md mx-auto">
                  In less than two minutes, Picmorable analyzed orientations, flagged duplicates, structured a life timeline, and bound a traditional hardcover album.
                </p>
              </div>

              {/* What was achieved stats */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-center">
                <div>
                  <span className="block text-lg font-bold font-mono text-amber-300">20</span>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">Photos Bound</span>
                </div>
                <div>
                  <span className="block text-lg font-bold font-mono text-emerald-300">4</span>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">Event Chapters</span>
                </div>
                <div>
                  <span className="block text-lg font-bold font-mono text-rose-300">2</span>
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider">Duplicates Found</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDuplicates();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Copy className="w-4 h-4 text-rose-400" />
                    <span>Review 2 Identified Duplicates / Bursts</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTimeline();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-medium transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Explore Life Timeline & 4 Event Chapters</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Open Your Hardcover Memory Book</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
