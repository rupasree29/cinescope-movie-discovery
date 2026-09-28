import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Star,
  Play,
  Share2,
  Award,
  Clapperboard,
  Users,
  Globe,
  Calendar,
  Clock,
  ShieldAlert,
  Sparkles,
  Check,
} from 'lucide-react';
import { Movie } from '../types';
import { OTTSection } from './OTTSection';
import { TrailerModal } from './TrailerModal';

interface MovieDetailsProps {
  movie: Movie;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: Movie) => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  allMovies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  movie,
  onBack,
  isFavorite,
  onToggleFavorite,
  selectedRegion,
  onRegionChange,
  allMovies,
  onSelectMovie,
}) => {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const typeLabel =
    movie.type === 'movie'
      ? 'MOVIE'
      : movie.type === 'tv'
      ? 'TV SHOW'
      : 'SERIES';

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Find similar movies by shared genres
  const similarMovies = allMovies
    .filter(
      (m) =>
        m.id !== movie.id &&
        m.genres.some((g) => movie.genres.includes(g))
    )
    .slice(0, 4);

  return (
    <div className="w-full pb-20 animate-in fade-in duration-300">
      {/* Top Back & Share Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-sm font-semibold transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Explore</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all duration-200"
            title="Share this movie"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Movie Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Movie Poster & Actions */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl shadow-purple-950/40 border border-purple-500/20 group">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Type Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 rounded-lg text-xs font-extrabold tracking-wider uppercase bg-black/70 backdrop-blur-md text-purple-300 border border-purple-500/30 shadow-lg">
                  {typeLabel}
                </span>
              </div>
            </div>

            {/* Poster CTA Buttons */}
            <div className="w-full max-w-sm flex flex-col gap-3 mt-5">
              {movie.trailerYoutubeId && (
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-98"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleFavorite(movie)}
                className={`w-full py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-md shadow-rose-500/20'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                  }`}
                />
                <span>{isFavorite ? 'Saved in My Favorites' : 'Add to Favorites'}</span>
              </button>
            </div>

            {/* Quick Specs List */}
            <div className="w-full max-w-sm mt-6 p-4 rounded-2xl bg-[#121826]/70 border border-white/10 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-purple-400" />
                  Release Date:
                </span>
                <span className="text-slate-200 font-medium">{movie.released}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  Duration:
                </span>
                <span className="text-slate-200 font-medium">{movie.duration}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                  Age Rating:
                </span>
                <span className="px-2 py-0.5 rounded bg-white/10 text-slate-200 font-bold">
                  {movie.rated}
                </span>
              </div>
              {movie.boxOffice && (
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    Box Office:
                  </span>
                  <span className="text-emerald-400 font-semibold">{movie.boxOffice}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Title, Ratings, Plot, Cast & Crew */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Title & Metadata Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {movie.year}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-medium">{movie.rated}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-medium">{movie.duration}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {movie.title}
              </h1>

              {/* Genre Pills */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-purple-300 shadow-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Ratings Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 p-4 rounded-2xl bg-[#121826]/80 border border-white/10 shadow-lg">
              {/* IMDb Rating */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white">
                      {movie.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400">/ 10</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">
                    IMDb Score {movie.ratingCount && `(${movie.ratingCount})`}
                  </p>
                </div>
              </div>

              {/* Metascore */}
              {movie.metascore && (
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-black text-emerald-400 text-base">
                    {movie.metascore}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white">Metascore</span>
                    <p className="text-[11px] text-slate-400">Universal Acclaim</p>
                  </div>
                </div>
              )}
            </div>

            {/* Storyline / Plot */}
            <div className="space-y-2">
              <h2 className="text-base font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <span>Storyline</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {movie.plot}
              </p>
            </div>

            {/* Cast & Crew Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Director */}
              <div className="p-4 rounded-xl bg-[#121826]/60 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider">
                  <Clapperboard className="w-3.5 h-3.5" />
                  <span>Director</span>
                </div>
                <p className="text-sm font-semibold text-white">{movie.director}</p>
              </div>

              {/* Language */}
              <div className="p-4 rounded-xl bg-[#121826]/60 border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400 uppercase tracking-wider">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Languages</span>
                </div>
                <p className="text-sm font-semibold text-white">{movie.language}</p>
              </div>
            </div>

            {/* Main Cast */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Main Cast</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor) => (
                  <span
                    key={actor}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-200"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Awards Banner */}
            {movie.awards && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Awards & Recognition
                  </h4>
                  <p className="text-xs text-amber-200/90 mt-0.5">{movie.awards}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. NEW FEATURE — OTT Platforms Section */}
        <OTTSection
          movie={movie}
          selectedRegion={selectedRegion}
          onRegionChange={onRegionChange}
        />

        {/* Similar Titles Section */}
        {similarMovies.length > 0 && (
          <div className="mt-14 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span>You Might Also Like</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarMovies.map((similar) => (
                <div
                  key={similar.id}
                  onClick={() => {
                    onSelectMovie(similar);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer rounded-xl bg-[#121826]/70 border border-white/10 hover:border-purple-500/40 p-2.5 transition-all duration-200"
                >
                  <div className="aspect-[2/3] rounded-lg overflow-hidden mb-2 bg-slate-900">
                    <img
                      src={similar.posterUrl}
                      alt={similar.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                    {similar.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                    <span>{similar.year}</span>
                    <span className="flex items-center gap-1 text-amber-400 font-medium">
                      ★ {similar.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        youtubeId={movie.trailerYoutubeId}
        movieTitle={movie.title}
      />
    </div>
  );
};
