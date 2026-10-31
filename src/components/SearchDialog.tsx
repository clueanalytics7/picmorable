import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Camera, 
  Layers, 
  CornerDownLeft, 
  CheckCircle2,
  Code2
} from 'lucide-react';
import { PhotoItem, ParsedSearchQuery } from '../types';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
}

export const SearchDialog: React.FC<SearchDialogProps> = ({
  isOpen,
  onClose,
  photos,
  onSelectPhoto,
}) => {
  const [query, setQuery] = useState('');
  const [showInterpreter, setShowInterpreter] = useState(false);

  // Quick suggestions
  const suggestedQueries = [
    'Photos of beach and coastal cliffs in Spain in 2022',
    'Autumn stone cottages with trees and bridge',
    'University graduation celebrations with family in Oxford',
    'Cherry blossoms and wooden Japanese temples in Kyoto',
    'Photos captured with Leica camera',
  ];

  // Natural Language Interpreter parsing simulator (Section 3.6)
  const parsedQuery: ParsedSearchQuery = useMemo(() => {
    const q = query.toLowerCase();
    const concepts: string[] = [];
    let location: string | undefined;
    let year: number | undefined;
    let event: string | undefined;

    if (q.includes('beach') || q.includes('coast') || q.includes('cove') || q.includes('sea')) concepts.push('beach', 'sea', 'coast');
    if (q.includes('cottage') || q.includes('autumn') || q.includes('leaves') || q.includes('bridge')) concepts.push('stone cottage', 'autumn trees', 'bridge');
    if (q.includes('graduation') || q.includes('degree') || q.includes('family') || q.includes('mortarboard')) {
      concepts.push('academic gown', 'family portrait');
      event = 'graduation_ceremony';
    }
    if (q.includes('cherry') || q.includes('blossom') || q.includes('sakura') || q.includes('temple')) concepts.push('cherry blossoms', 'temple pavilion');

    if (q.includes('spain') || q.includes('nerja') || q.includes('ronda')) location = 'Spain';
    if (q.includes('oxford') || q.includes('cotswolds') || q.includes('uk') || q.includes('england')) location = 'United Kingdom';
    if (q.includes('japan') || q.includes('kyoto') || q.includes('tokyo')) location = 'Japan';

    if (q.includes('2022')) year = 2022;
    if (q.includes('2021')) year = 2021;
    if (q.includes('2023')) year = 2023;
    if (q.includes('2019')) year = 2019;

    return {
      rawQuery: query,
      visualConcepts: concepts,
      locationFilter: location,
      dateRange: year ? { year, from: `${year}-01-01`, to: `${year}-12-31` } : undefined,
      eventType: event,
    };
  }, [query]);

  // Hybrid search execution
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();

    return photos.filter(p => {
      if (p.isExactDuplicate) return false;

      // Layer 1: Metadata match (year, location, camera, filename)
      const yearMatch = parsedQuery.dateRange?.year ? p.exif.dateTaken.startsWith(String(parsedQuery.dateRange.year)) : true;
      const locationMatch = parsedQuery.locationFilter ? (p.exif.country.toLowerCase().includes(parsedQuery.locationFilter.toLowerCase()) || p.exif.locationName.toLowerCase().includes(parsedQuery.locationFilter.toLowerCase())) : true;
      const cameraMatch = q.includes('leica') ? p.exif.cameraMake.toLowerCase().includes('leica') :
                          q.includes('sony') ? p.exif.cameraMake.toLowerCase().includes('sony') :
                          q.includes('canon') ? p.exif.cameraMake.toLowerCase().includes('canon') :
                          q.includes('fuji') ? p.exif.cameraMake.toLowerCase().includes('fujifilm') : true;

      // Layer 2 & 3: Visual objects & Captions
      const textMatch = (
        p.title.toLowerCase().includes(q) ||
        p.captions.simple.toLowerCase().includes(q) ||
        p.captions.descriptive.toLowerCase().includes(q) ||
        p.captions.memory.toLowerCase().includes(q) ||
        p.provenance.visualObjects.some(vo => q.includes(vo.toLowerCase())) ||
        p.tags.some(t => q.includes(t.toLowerCase()))
      );

      // Concept overlap
      const conceptMatch = parsedQuery.visualConcepts.length > 0
        ? p.provenance.visualObjects.some(vo => parsedQuery.visualConcepts.some(c => vo.toLowerCase().includes(c)))
        : false;

      return (textMatch || conceptMatch) && yearMatch && locationMatch && cameraMatch;
    });
  }, [query, photos, parsedQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe what you want to find (e.g., 'sunset cliffs in Spain in 2022')..."
            className="w-full text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-800 bg-stone-100 rounded-md font-mono cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Query Decomposition Inspector Toggle (§3.6) */}
        {query && (
          <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-600">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Multi-layer Hybrid Search: Metadata + Semantic CV + Caption Embeddings</span>
            </div>
            <button
              onClick={() => setShowInterpreter(!showInterpreter)}
              className="text-amber-800 hover:text-amber-900 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
            >
              <Code2 className="w-3 h-3" />
              <span>{showInterpreter ? 'Hide JSON Interpretation' : 'View Query AST'}</span>
            </button>
          </div>
        )}

        {/* Structured Query Interpretation Drawer */}
        {query && showInterpreter && (
          <div className="p-4 bg-stone-900 text-amber-200 border-b border-stone-800 font-mono text-[11px] overflow-x-auto">
            <div className="text-stone-400 mb-1">// Layer 4 Contextual Interpretation (from Section 3.6)</div>
            <pre className="text-stone-200">
              {JSON.stringify({
                raw_user_query: parsedQuery.rawQuery,
                visual_concepts: parsedQuery.visualConcepts,
                date_filter: parsedQuery.dateRange || null,
                location_filter: parsedQuery.locationFilter || null,
                event_type: parsedQuery.eventType || null,
                facial_recognition_used: false,
                privacy_policy: "No biometric scanning without explicit opt-in"
              }, null, 2)}
            </pre>
          </div>
        )}

        {/* Suggested Queries if query is empty */}
        {!query && (
          <div className="p-5 space-y-3 overflow-y-auto">
            <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">
              Try natural language questions:
            </span>
            <div className="flex flex-col gap-1.5">
              {suggestedQueries.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(sq)}
                  className="flex items-center justify-between text-left p-2.5 rounded-lg hover:bg-stone-100 text-xs text-stone-700 transition-colors group cursor-pointer"
                >
                  <span className="group-hover:text-amber-900">{sq}</span>
                  <CornerDownLeft className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Area */}
        {query && (
          <div className="p-5 overflow-y-auto space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Found {searchResults.length} relevant photographs</span>
              {parsedQuery.locationFilter && (
                <span className="font-mono text-[11px] text-amber-800">
                  Filtered by: {parsedQuery.locationFilter}
                </span>
              )}
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => {
                      onClose();
                      onSelectPhoto(photo);
                    }}
                    className="group flex gap-3 p-2 rounded-xl border border-stone-200 hover:border-amber-700/50 hover:bg-amber-50/30 transition-all cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                      <img
                        src={photo.thumbnailUrl}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex flex-col justify-center space-y-1 min-w-0">
                      <h4 className="font-serif font-bold text-stone-900 text-xs truncate group-hover:text-amber-800">
                        {photo.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 truncate">
                        {photo.exif.locationName} · {photo.exif.dateTaken.split(' ')[0]}
                      </p>
                      <p className="text-[11px] text-stone-600 line-clamp-1 italic font-serif">
                        "{photo.captions.memory}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-stone-500 space-y-2">
                <p>No photographs matched "{query}".</p>
                <p className="text-stone-400">
                  Try searching for "Spain", "Oxford", "Cotswolds", "Kyoto", "beach", "cottage", or "2022".
                </p>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Search spans metadata, computer vision objects, and narrative captions.</span>
          <span className="font-mono text-[10px]">ESC to close</span>
        </div>

      </div>

    </div>
  );
};
