import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Printer, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { AlbumItem, PhotoItem } from '../types';

interface MemoryBookModalProps {
  album: AlbumItem | null;
  photos: PhotoItem[];
  onClose: () => void;
}

export const MemoryBookModal: React.FC<MemoryBookModalProps> = ({
  album,
  photos,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [orderedToast, setOrderedToast] = useState(false);

  if (!album) return null;

  const albumPhotos = photos.filter(p => album.photoIds.includes(p.id));
  const coverPhoto = albumPhotos[0] || photos[0];
  const secondPhoto = albumPhotos[1] || photos[1] || coverPhoto;

  const totalPages = 3; // 0: Cover, 1: Spread 1, 2: Spread 2

  const handleSimulateOrder = () => {
    setOrderedToast(true);
    setTimeout(() => setOrderedToast(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
      
      <div className="bg-stone-900 w-full max-w-5xl rounded-3xl shadow-2xl border border-stone-800 overflow-hidden flex flex-col max-h-[95vh] text-stone-100">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                Physical Memory Preservation · Section 15
              </span>
              <h2 className="font-serif text-lg font-bold text-white">
                Layflat Hardcover Photo Book: {album.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Preview Stage (Faux Realistic Book Spreads) */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col items-center justify-center bg-stone-950 min-h-[460px] overflow-y-auto">
          
          {/* Toast Notification */}
          {orderedToast && (
            <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-900/90 border border-emerald-700 text-emerald-100 rounded-xl text-xs shadow-lg animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Print specification compiled: 300 DPI archival art matte paper order simulated!</span>
            </div>
          )}

          {/* PAGE 0: HARDCOVER LINEN WRAP */}
          {currentPage === 0 && (
            <div className="w-full max-w-lg aspect-[4/3] bg-gradient-to-br from-stone-800 to-stone-900 rounded-r-2xl rounded-l-md shadow-2xl p-8 sm:p-12 border-l-8 border-stone-950 border-r border-t border-b border-stone-700 flex flex-col justify-between relative overflow-hidden">
              <div className="text-right">
                <span className="text-[10px] font-mono text-amber-300/80 uppercase tracking-widest">
                  MEMORIA CHRONICLE EDITION
                </span>
              </div>

              <div className="space-y-4 text-center my-auto">
                <div className="w-12 h-0.5 bg-amber-400 mx-auto" />
                <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                  {album.title}
                </h1>
                <p className="text-xs font-mono text-stone-300 tracking-wider">
                  {album.dateRange.start} — {album.dateRange.end}
                </p>
                <p className="text-xs text-amber-200/90 font-serif italic pt-1">
                  {album.locations.join(' · ')}
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-4 border-t border-stone-700/60">
                <span>ARCHIVAL SMYTH-SEWN BINDING</span>
                <span>VOL. XII</span>
              </div>
            </div>
          )}

          {/* PAGE 1: OPENING SPREAD (2-PAGE SPREAD) */}
          {currentPage === 1 && (
            <div className="w-full max-w-4xl aspect-[16/10] bg-stone-50 rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden border border-stone-300 text-stone-900 divide-y md:divide-y-0 md:divide-x divide-stone-300">
              
              {/* Left Page: Narrative & Excerpt */}
              <div className="flex-1 p-8 sm:p-12 flex flex-col justify-between bg-[#FAF8F5]">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                    CHAPTER I · THE EXPERIENCE
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-stone-900">
                    {album.title}
                  </h2>
                  <p className="font-serif text-sm text-stone-700 leading-relaxed italic">
                    "{album.userStory || album.aiSummary}"
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed pt-2">
                    A curated archive of {album.photoIds.length} captured moments, reconstructing the sensory textures of {album.locations[0]}.
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-4 border-t border-stone-200">
                  <span>MEMORIA ARCHIVES</span>
                  <span>PAGE 01</span>
                </div>
              </div>

              {/* Right Page: Hero Photo */}
              <div className="flex-1 p-8 sm:p-12 flex flex-col justify-between bg-white">
                <div className="aspect-[4/3] rounded overflow-hidden shadow-sm bg-stone-200">
                  <img
                    src={coverPhoto.url}
                    alt={coverPhoto.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="pt-4 space-y-1">
                  <p className="text-xs font-serif font-bold text-stone-800">
                    {coverPhoto.title}
                  </p>
                  <p className="text-[11px] text-stone-500 font-serif italic">
                    "{coverPhoto.captions.memory}"
                  </p>
                  <span className="text-[10px] text-stone-400 font-mono block">
                    {coverPhoto.exif.locationName} · {coverPhoto.exif.cameraModel}
                  </span>
                </div>

                <div className="text-right text-[10px] text-stone-400 font-mono pt-2">
                  PAGE 02
                </div>
              </div>

            </div>
          )}

          {/* PAGE 2: SECOND PHOTO SPREAD */}
          {currentPage === 2 && (
            <div className="w-full max-w-4xl aspect-[16/10] bg-stone-50 rounded-lg shadow-2xl flex flex-col md:flex-row overflow-hidden border border-stone-300 text-stone-900 divide-y md:divide-y-0 md:divide-x divide-stone-300">
              
              {/* Left Page: Highlight Photo */}
              <div className="flex-1 p-8 sm:p-12 flex flex-col justify-between bg-white">
                <div className="aspect-[4/3] rounded overflow-hidden shadow-sm bg-stone-200">
                  <img
                    src={secondPhoto.url}
                    alt={secondPhoto.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="pt-4 space-y-1">
                  <p className="text-xs font-serif font-bold text-stone-800">
                    {secondPhoto.title}
                  </p>
                  <p className="text-[11px] text-stone-500 font-serif italic">
                    "{secondPhoto.captions.memory}"
                  </p>
                </div>
                <div className="text-[10px] text-stone-400 font-mono pt-2">
                  PAGE 03
                </div>
              </div>

              {/* Right Page: Epilogue & Location map */}
              <div className="flex-1 p-8 sm:p-12 flex flex-col justify-between bg-[#FAF8F5]">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                    CHAPTER I · RECOLLECTION
                  </span>
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    Preserved Footprints
                  </h3>
                  <p className="text-xs text-stone-700 leading-relaxed font-serif">
                    "Every photograph has a story. By arranging these moments chronologically and preserving the verified dates and coordinates, we safeguard the memory for future generations."
                  </p>
                  <div className="p-3 bg-stone-100 rounded-lg text-xs space-y-1 font-mono text-stone-600">
                    <div>Locations: {album.locations.join(', ')}</div>
                    <div>Timeline: {album.dateRange.start} – {album.dateRange.end}</div>
                    <div>Confidence: High (Verified EXIF & GPS)</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono pt-4 border-t border-stone-200">
                  <span>PRINTED ON ARCHIVAL MOHAWK SUPERFINE</span>
                  <span>PAGE 04</span>
                </div>
              </div>

            </div>
          )}

          {/* Book Pagination Controller */}
          <div className="flex items-center gap-4 mt-6 text-xs text-stone-400">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-1.5 rounded-full hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-mono">
              {currentPage === 0 ? 'Hardcover Exterior' : `Spread ${currentPage} of ${totalPages - 1}`}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-1.5 rounded-full hover:bg-stone-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Footer: Physical Book Purchase / PDF Export */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-stone-400">
            <span>Premium 12×12″ Layflat Hardcover · Matte Archival Paper · Foil Embossed Spine</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                alert(`Exporting digital PDF proof for "${album.title}" (300 DPI print-ready specifications).`);
              }}
              className="px-3.5 py-2 text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Proof</span>
            </button>

            <button
              onClick={handleSimulateOrder}
              className="px-5 py-2 font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Order Printed Layflat Album (£38.00)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
