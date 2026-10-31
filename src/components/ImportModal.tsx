import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  Folder, 
  HardDrive, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  Pause, 
  Play, 
  Layers, 
  Database, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { PhotoItem } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (newPhotos: PhotoItem[]) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
}) => {
  const [selectedSource, setSelectedSource] = useState<'sample' | 'folder' | 'harddrive' | 'cloud'>('sample');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressStage, setProgressStage] = useState<number>(0);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const totalSimulated = 3420;

  if (!isOpen) return null;

  const stages = [
    { name: 'File Validation', desc: 'Validating JPEG, PNG, HEIC & RAW image integrity' },
    { name: 'Duplicate & Hash Check', desc: 'Running MD5 byte hash and perceptual hash comparison' },
    { name: 'EXIF Extraction', desc: 'Extracting timestamps, GPS coordinates, and camera models' },
    { name: 'Thumbnail Creation', desc: 'Generating lightweight visual previews & embeddings' },
    { name: 'Event Clustering', desc: 'DBSCAN temporal proximity & geographical grouping' },
    { name: 'AI Captioning', desc: 'Generating context-enriched captions and album stories' },
  ];

  const handleStartImport = () => {
    setIsProcessing(true);
    setProgressStage(0);
    setProcessedCount(0);

    let stage = 0;
    let count = 0;

    const interval = setInterval(() => {
      if (isPaused) return;

      count += 570;
      setProcessedCount(Math.min(totalSimulated, count));

      if (count >= (stage + 1) * (totalSimulated / 6)) {
        stage++;
        setProgressStage(stage);
      }

      if (count >= totalSimulated) {
        clearInterval(interval);
        setTimeout(() => {
          setIsProcessing(false);
          onClose();
        }, 800);
      }
    }, 400);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleStartImport();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
      
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-amber-700 uppercase tracking-wider block mb-1">
              Module A · Intelligent Photo Importation
            </span>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Import Photographic Archives
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Consolidate photographs scattered across external drives, old laptops, and smartphone backups.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {!isProcessing ? (
            <>
              {/* Select Source Grid */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-stone-700 block">
                  Select Import Source:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  
                  <button
                    onClick={() => setSelectedSource('sample')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSource === 'sample'
                        ? 'bg-amber-50/80 border-amber-600 text-amber-950 ring-1 ring-amber-500'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-amber-800 font-semibold text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>Pre-Seeded 15-Year Archive</span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      3,420 authentic photos (2012–2026) across 5 devices with EXIF, duplicates, and clusters.
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedSource('folder')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSource === 'folder'
                        ? 'bg-amber-50/80 border-amber-600 text-amber-950 ring-1 ring-amber-500'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-stone-900 font-semibold text-xs">
                      <Folder className="w-4 h-4 text-stone-600" />
                      <span>Computer Local Folders</span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Bulk select directory or multiple folders on your PC or Mac.
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedSource('harddrive')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSource === 'harddrive'
                        ? 'bg-amber-50/80 border-amber-600 text-amber-950 ring-1 ring-amber-500'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-stone-900 font-semibold text-xs">
                      <HardDrive className="w-4 h-4 text-stone-600" />
                      <span>External Hard Drive / SD Card</span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Import memory cards, USB drives, or legacy external discs.
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedSource('cloud')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedSource === 'cloud'
                        ? 'bg-amber-50/80 border-amber-600 text-amber-950 ring-1 ring-amber-500'
                        : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-stone-900 font-semibold text-xs">
                      <Smartphone className="w-4 h-4 text-stone-600" />
                      <span>Mobile Roll & Cloud Archives</span>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Import Google Takeout, iCloud ZIP archives, or WhatsApp media.
                    </p>
                  </button>

                </div>
              </div>

              {/* Drag and Drop Box */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                className="border-2 border-dashed border-stone-300 hover:border-amber-600 rounded-2xl p-8 text-center bg-stone-50/50 hover:bg-amber-50/20 transition-all cursor-pointer"
                onClick={handleStartImport}
              >
                <UploadCloud className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-900">
                  Drag and drop photo files or folders here, or click to browse
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  Supports JPEG, PNG, HEIC, WebP, and RAW formats · Resumable bulk processing
                </p>
              </div>

              {/* Features Guarantee Box */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-stone-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Resumable Uploads & Duplicate Shield</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  If connection drops during bulk upload, progress is saved automatically. Duplicates are never deleted without your review.
                </p>
              </div>
            </>
          ) : (
            /* Live Progress State */
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Processing Photo Archive
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {processedCount} of {totalSimulated} files analyzed ({Math.round((processedCount / totalSimulated) * 100)}%)
                  </p>
                </div>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg cursor-pointer"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? 'Resume' : 'Pause (Resumable)'}</span>
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                <div 
                  className="h-full bg-amber-600 transition-all duration-300"
                  style={{ width: `${(processedCount / totalSimulated) * 100}%` }}
                />
              </div>

              {/* Step Pipeline List (§3.1) */}
              <div className="space-y-2">
                {stages.map((stage, idx) => {
                  const isDone = progressStage > idx;
                  const isCurrent = progressStage === idx;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs transition-all ${
                        isCurrent
                          ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-semibold'
                          : isDone
                          ? 'bg-stone-50 border-stone-200 text-stone-800'
                          : 'opacity-40 border-stone-100 text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : isCurrent ? (
                          <span className="w-4 h-4 border-2 border-amber-700 border-t-transparent rounded-full animate-spin shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-stone-300 flex items-center justify-center text-[10px] text-stone-400">
                            {idx + 1}
                          </span>
                        )}
                        <div>
                          <span>{stage.name}</span>
                          <span className="hidden sm:inline text-stone-500 font-normal text-[11px] ml-2">
                            · {stage.desc}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-stone-500">
                        {isDone ? 'Complete' : isCurrent ? 'Running...' : 'Queued'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="text-center text-xs text-stone-500 italic">
                You can begin browsing your library immediately; event clustering and captions continue in the background.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Encrypted in transit and at rest · No external AI training
          </span>
          {!isProcessing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleStartImport}
                className="px-5 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Start Intelligent Import
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setIsProcessing(false);
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-lg cursor-pointer"
            >
              Browse Library Now
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
