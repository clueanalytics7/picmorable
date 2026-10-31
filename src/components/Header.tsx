import React from 'react';
import { 
  Sparkles, 
  Search, 
  UploadCloud, 
  ShieldCheck, 
  BookOpen, 
  SlidersHorizontal 
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenImport: () => void;
  onOpenSearch: () => void;
  onOpenPrivacy: () => void;
  onOpenDuplicates: () => void;
  unresolvedDuplicatesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenImport,
  onOpenSearch,
  onOpenPrivacy,
  onOpenDuplicates,
  unresolvedDuplicatesCount,
}) => {
  const navItems = [
    { id: 'home', label: 'Overview' },
    { id: 'photos', label: 'My Photos' },
    { id: 'albums', label: 'Suggested Albums' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'places', label: 'Places' },
    { id: 'memories', label: 'Memories' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 px-6 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('home')}
            className="text-left group flex items-baseline gap-2 cursor-pointer focus:outline-none"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors">
              Memoria
            </span>
            <span className="hidden sm:inline text-xs font-mono text-stone-500 tracking-tight">
              Personal Memory Preservation
            </span>
          </button>
        </div>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-stone-900 font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Search, Duplicates pill, Privacy & Primary CTA) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 rounded-md border border-stone-200 transition-all cursor-pointer"
            title="Search by concept, date, or natural language"
          >
            <Search className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden md:inline">Natural Search</span>
            <kbd className="hidden sm:inline text-[10px] bg-stone-200/80 px-1 py-0.5 rounded text-stone-600 font-mono">⌘K</kbd>
          </button>

          {unresolvedDuplicatesCount > 0 && (
            <button
              onClick={onOpenDuplicates}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors cursor-pointer"
              title="Review duplicate and burst photos"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" />
              <span>{unresolvedDuplicatesCount} Duplicates</span>
            </button>
          )}

          <button
            onClick={onOpenPrivacy}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
            title="Privacy, UK GDPR & Trust Center"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </button>

          <button
            onClick={onOpenImport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import Photos</span>
          </button>
        </div>

      </div>

      {/* Mobile navigation row */}
      <div className="lg:hidden flex items-center justify-between overflow-x-auto gap-4 pt-2.5 pb-1 border-t border-stone-200/60 mt-2 text-xs font-medium text-stone-600">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap px-1 py-0.5 transition-colors cursor-pointer ${
                isActive ? 'text-amber-900 font-bold border-b border-amber-800' : 'text-stone-600'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
