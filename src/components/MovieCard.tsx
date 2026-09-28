import React from 'react';
import { Heart, Star, ArrowRight, Play } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  onViewDetails: (movie: Movie) => void;
  onQuickTrailer?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  onQuickTrailer,
}) => {
  const typeLabel =
    movie.type === 'movie'
      ? 'MOVIE'
      : movie.type === 'tv'
      ? 'TV SHOW'
      : 'SERIES';

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#121826]/70 hover:bg-[#151D30] border border-white/10 hover:border-purple-500/40 shadow-lg hover:shadow-2xl hover:shadow-purple-900/20 transition-all duration-300 overflow-hidden">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121826] via-transparent to-black/40 opacity-70 group-hover:opacity-60 transition-opacity" />

        {/* Type Badge - Top Left */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-black/60 backdrop-blur-md text-purple-300 border border-purple-500/30 shadow-md">
            {typeLabel}
          </span>
        </div>

        {/* Favorite Heart Button - Top Right */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(movie);
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all duration-200 cursor-pointer ${
              isFavorite
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-500 shadow-md shadow-rose-500/20 scale-105'
                : 'bg-black/50 border-white/15 text-white/70 hover:text-white hover:bg-black/80'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : ''
              }`}
            />
          </button>
        </div>

        {/* Rating Badge - Bottom Left of Poster */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-amber-300">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating.toFixed(1)}</span>
        </div>

        {/* Quick Trailer Button on Hover */}
        {movie.trailerYoutubeId && onQuickTrailer && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickTrailer(movie);
            }}
            className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2.5 py-1 rounded-lg bg-purple-600/80 hover:bg-purple-600 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1 shadow-lg"
            title="Watch Trailer"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Trailer</span>
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div>
          {/* Release Year & Genres */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span className="font-semibold text-purple-400">{movie.year}</span>
            <span>•</span>
            <span className="truncate">{movie.genres.slice(0, 2).join(', ')}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onViewDetails(movie)}
            className="font-bold text-base sm:text-lg text-white group-hover:text-purple-300 transition-colors line-clamp-1 cursor-pointer"
            title={movie.title}
          >
            {movie.title}
          </h3>

          {/* Short Plot / Synopsis Preview */}
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {movie.plot}
          </p>
        </div>

        {/* View Details Button */}
        <button
          type="button"
          onClick={() => onViewDetails(movie)}
          className="w-full mt-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-purple-600 text-slate-200 hover:text-white text-xs font-semibold border border-white/10 hover:border-purple-500 flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer group/btn"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
