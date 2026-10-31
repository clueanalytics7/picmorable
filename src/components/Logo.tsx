import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
  subtitleClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 32,
  showWordmark = true,
  wordmarkClassName = '',
  subtitleClassName = '',
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        {/* Rounded frame container */}
        <rect width="64" height="64" rx="16" fill="#1C1917" />
        <rect x="2" y="2" width="60" height="60" rx="14" stroke="#44403C" strokeWidth="1.5" />

        {/* Viewfinder focus brackets */}
        <path
          d="M14 22V16C14 14.8954 14.8954 14 16 14H22"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 22V16C50 14.8954 49.1046 14 48 14H42"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 42V48C14 49.1046 14.8954 50 16 50H22"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 42V48C50 49.1046 49.1046 50 48 50H42"
          stroke="#F59E0B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lens aperture ring */}
        <circle cx="32" cy="32" r="13" stroke="#F59E0B" strokeWidth="2" strokeOpacity="0.5" />

        {/* Golden Memory Star of Recollection */}
        <path
          d="M32 19C32 26 32 26 39 32C32 37.5 32 37.5 32 45C32 37.5 32 37.5 25 32C32 26 32 26 32 19Z"
          fill="#FBBF24"
        />
        <circle cx="32" cy="32" r="2.5" fill="#FFFBEB" />
      </svg>

      {/* Typography Lockup */}
      {showWordmark && (
        <div className="flex flex-col text-left">
          <div className="flex items-baseline gap-1">
            <span
              className={`font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors ${wordmarkClassName}`}
            >
              Picmorable
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mb-1" />
          </div>
          <span
            className={`hidden sm:inline text-[10px] font-mono text-stone-500 tracking-tight leading-none ${subtitleClassName}`}
          >
            Personal Memory Preservation
          </span>
        </div>
      )}
    </div>
  );
};
