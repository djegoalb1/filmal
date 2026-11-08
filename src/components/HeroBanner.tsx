import React from 'react';
import { Play, Plus, Check, Star, Info, Sparkles } from 'lucide-react';
import { Movie } from '../types/movie';

interface HeroBannerProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onToggleWatchlist: (movie: Movie) => void;
  isInWatchlist: boolean;
  onOpenApiModal: () => void;
  apiConnected: boolean;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movie,
  onPlay,
  onToggleWatchlist,
  isInWatchlist,
  onOpenApiModal,
  apiConnected,
}) => {
  return (
    <div className="relative w-full h-[520px] md:h-[620px] lg:h-[680px] overflow-hidden bg-[#0A090D]">
      {/* Background Image with Scrim Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-90 transition-transform duration-1000 scale-105"
        />
        {/* Measured cinematic contrast scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A090D] via-[#0A090D]/65 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A090D] via-[#0A090D]/50 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12 sm:pb-16">
        
        {/* API notification ribbon if not yet connected, inviting user */}
        {!apiConnected && (
          <div className="mb-4 inline-flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-md px-3 py-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>Keni një API personale (TMDb / Stream / IPTV)?</span>
            <button
              onClick={onOpenApiModal}
              className="text-red-400 hover:text-red-300 font-medium underline underline-offset-2 ml-1 cursor-pointer"
            >
              Lidhe këtu me 1 klikim
            </button>
          </div>
        )}

        <div className="max-w-2xl space-y-4">
          
          {/* Unboxed Metadata Line (Anti-Slop Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-300">
            <span className="font-semibold text-red-500 flex items-center gap-1">
              <Star className="w-4 h-4 fill-red-500 text-red-500" />
              <span className="tabular-nums font-mono">{movie.rating.toFixed(1)}</span>
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="tabular-nums">{movie.year}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{movie.duration}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-emerald-400 font-medium">{movie.quality}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span className="text-zinc-300">{movie.audio}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight font-display leading-[1.08] text-balance">
            {movie.title}
          </h1>

          {/* Original Title / Tagline */}
          {movie.originalTitle && movie.originalTitle !== movie.title && (
            <p className="text-sm text-zinc-400 font-medium">
              Titulli origjinal: <span className="italic text-zinc-300">{movie.originalTitle}</span>
            </p>
          )}

          {/* Synopsis */}
          <p className="text-sm sm:text-base text-zinc-300 line-clamp-3 leading-relaxed max-w-xl">
            {movie.overview}
          </p>

          {/* Genres (clean unboxed text with dots) */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            {movie.genres.map((g, idx) => (
              <span key={`${movie.id}-${g}-${idx}`} className="inline-flex items-center gap-2">
                <span>{g}</span>
                {idx < movie.genres.length - 1 && <span aria-hidden="true" className="text-zinc-700">·</span>}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg shadow-lg shadow-red-600/30 transition-all cursor-pointer whitespace-nowrap shrink-0 group"
            >
              <Play className="w-4 h-4 fill-white transition-transform group-hover:scale-110" />
              <span>Shiko Tani</span>
            </button>

            <button
              onClick={() => onToggleWatchlist(movie)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
                isInWatchlist
                  ? 'bg-zinc-800 text-white border-zinc-700'
                  : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-zinc-800'
              }`}
            >
              {isInWatchlist ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Në Listë</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Shto në Listë</span>
                </>
              )}
            </button>

            <button
              onClick={() => onPlay(movie)}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Info className="w-4 h-4" />
              <span>Detaje & Serverat</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
