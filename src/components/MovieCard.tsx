import React, { useState } from 'react';
import { Play, Plus, Check, Star, Film } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  isInWatchlist: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPlay,
  onToggleWatchlist,
  isInWatchlist,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative flex flex-col rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-200">
      
      {/* Poster Media Box (3:4 aspect ratio) */}
      <div 
        onClick={() => onPlay(movie)}
        className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-900 cursor-pointer"
      >
        {!imageError ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Styled Fallback Container (Zero-Broken-Image Policy) */
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 text-center">
            <Film className="w-10 h-10 text-red-500/70 mb-2" />
            <span className="text-xs font-semibold text-zinc-300 line-clamp-2">{movie.title}</span>
            <span className="text-[10px] text-zinc-500 mt-1">{movie.year}</span>
          </div>
        )}

        {/* Hover overlay with Play Button */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Top Badges (Quality & Language) */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider bg-black/75 backdrop-blur-sm text-amber-400 rounded">
            {movie.quality}
          </span>
          {movie.isAlbanian && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider bg-red-600/90 text-white rounded">
              SHQIP
            </span>
          )}
          {movie.isSeries && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider bg-indigo-600/90 text-white rounded">
              SERIAL
            </span>
          )}
        </div>

        {/* Watchlist Quick Action (top right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist(movie);
          }}
          title={isInWatchlist ? "Hiq nga Lista" : "Shto në Listë"}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm transition-colors cursor-pointer"
        >
          {isInWatchlist ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Bottom subtle gradient on card */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
      </div>

      {/* Card Content & Metadata */}
      <div className="p-3 flex flex-col flex-grow justify-between gap-2">
        <div>
          {/* Unboxed Metadata Line (Anti-Slop Zero-Pill) */}
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
            <span className="tabular-nums font-mono">{movie.year}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-0.5 text-amber-400 font-medium">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="tabular-nums font-mono">{movie.rating.toFixed(1)}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-zinc-500 truncate">{movie.duration}</span>
          </div>

          <h3 
            onClick={() => onPlay(movie)}
            className="text-sm font-semibold text-zinc-100 group-hover:text-red-400 transition-colors line-clamp-1 cursor-pointer" 
            title={movie.title}
          >
            {movie.title}
          </h3>
        </div>

        {/* Genres & Subtitles note */}
        <div className="text-[11px] text-zinc-500 truncate">
          {movie.genres.slice(0, 2).join(' / ')}
          <span className="text-zinc-600"> · </span>
          <span className="text-zinc-400">{movie.audio}</span>
        </div>
      </div>

    </div>
  );
};
