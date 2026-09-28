import React, { useState, useEffect } from 'react';
import { ExternalLink, Tv, RefreshCw, AlertCircle, ShoppingCart, Film, PlayCircle, Globe } from 'lucide-react';
import { Movie, RegionalStreamingInfo, OTTPlatformOption, SUPPORTED_REGIONS } from '../types';
import { fetchDynamicStreamingAvailability } from '../services/streamingService';
import { getPlatformBrand } from '../data/platforms';

interface OTTSectionProps {
  movie: Movie;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

export const OTTSection: React.FC<OTTSectionProps> = ({
  movie,
  selectedRegion,
  onRegionChange,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'stream' | 'rent' | 'buy'>('all');
  const [availability, setAvailability] = useState<RegionalStreamingInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function loadAvailability() {
      setLoading(true);
      try {
        const info = await fetchDynamicStreamingAvailability(movie, selectedRegion);
        if (!isCancelled) {
          setAvailability(info);
        }
      } catch (err) {
        console.error('Failed to load streaming availability:', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadAvailability();

    return () => {
      isCancelled = true;
    };
  }, [movie, selectedRegion]);

  const streamList = availability?.stream || [];
  const rentList = availability?.rent || [];
  const buyList = availability?.buy || [];

  const totalCount = streamList.length + rentList.length + buyList.length;

  const currentRegionObj =
    SUPPORTED_REGIONS.find((r) => r.code === selectedRegion) || SUPPORTED_REGIONS[0];

  return (
    <div className="w-full mt-8 rounded-2xl bg-gradient-to-b from-[#131B2E] to-[#0E1524] border border-purple-500/20 shadow-2xl p-6 md:p-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-extrabold text-white">
                Watch On OTT
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Verified Links
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live streaming, rental, and purchase platforms for{' '}
              <span className="text-purple-300 font-semibold">{movie.title}</span>
            </p>
          </div>
        </div>

        {/* Region Switcher Inside OTT Section */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            Region:
          </span>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-medium text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            {SUPPORTED_REGIONS.map((reg) => (
              <option key={reg.code} value={reg.code} className="bg-[#121826] text-white">
                {reg.flag} {reg.name} ({reg.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Tabs: All, Stream, Rent, Buy */}
      {totalCount > 0 && (
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Options ({totalCount})
          </button>
          {streamList.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('stream')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'stream'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Stream ({streamList.length})</span>
            </button>
          )}
          {rentList.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('rent')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'rent'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-sky-400" />
              <span>Rent ({rentList.length})</span>
            </button>
          )}
          {buyList.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('buy')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'buy'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
              <span>Buy ({buyList.length})</span>
            </button>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400">
            Checking real-time OTT availability for {currentRegionObj.name}...
          </p>
        </div>
      )}

      {/* Empty State / Unavailable Message */}
      {!loading && totalCount === 0 && (
        <div className="py-10 text-center flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            OTT availability not currently available.
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            No active streaming, rental, or purchase licenses found in{' '}
            <span className="text-slate-200">{currentRegionObj.name}</span>. You can try switching regions or search via Google.
          </p>
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent('where to stream ' + movie.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <span>Search on Google</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Platform Content Groups */}
      {!loading && totalCount > 0 && (
        <div className="mt-6 space-y-6">
          {/* 1. Stream (Subscription / Free) */}
          {(activeTab === 'all' || activeTab === 'stream') && streamList.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Stream (Subscription)
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {streamList.map((platform, idx) => (
                  <PlatformCard key={`stream-${idx}`} platform={platform} movieTitle={movie.title} />
                ))}
              </div>
            </div>
          )}

          {/* 2. Rent */}
          {(activeTab === 'all' || activeTab === 'rent') && rentList.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Rent
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {rentList.map((platform, idx) => (
                  <PlatformCard key={`rent-${idx}`} platform={platform} movieTitle={movie.title} />
                ))}
              </div>
            </div>
          )}

          {/* 3. Buy */}
          {(activeTab === 'all' || activeTab === 'buy') && buyList.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Buy
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {buyList.map((platform, idx) => (
                  <PlatformCard key={`buy-${idx}`} platform={platform} movieTitle={movie.title} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface PlatformCardProps {
  platform: OTTPlatformOption;
  movieTitle: string;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ platform, movieTitle }) => {
  const brand = getPlatformBrand(platform.platformId, platform.name);

  // Render stylized platform icon / logo
  const renderLogo = () => {
    switch (brand.id) {
      case 'netflix':
        return (
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-[#E50914] font-black text-xl tracking-tighter shadow-sm border border-red-500/20">
            N
          </div>
        );
      case 'prime_video':
        return (
          <div className="w-9 h-9 rounded-xl bg-[#00A8E1]/20 border border-[#00A8E1]/40 flex items-center justify-center text-[#00A8E1] font-bold text-sm">
            prime
          </div>
        );
      case 'disney_plus':
        return (
          <div className="w-9 h-9 rounded-xl bg-[#113CCF]/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-xs">
            Disney+
          </div>
        );
      case 'apple_tv':
        return (
          <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white font-semibold text-xs">
            tv
          </div>
        );
      case 'max':
        return (
          <div className="w-9 h-9 rounded-xl bg-blue-700/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-extrabold text-xs tracking-wider">
            MAX
          </div>
        );
      case 'hulu':
        return (
          <div className="w-9 h-9 rounded-xl bg-[#1CE783]/20 border border-[#1CE783]/40 flex items-center justify-center text-[#1CE783] font-black text-xs">
            hulu
          </div>
        );
      case 'paramount_plus':
        return (
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold text-xs">
            P+
          </div>
        );
      case 'peacock':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-xs">
            🦚
          </div>
        );
      case 'youtube':
        return (
          <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 font-bold text-sm">
            ▶
          </div>
        );
      case 'aha':
        return (
          <div className="w-9 h-9 rounded-xl bg-[#FF4500]/20 border border-[#FF4500]/40 flex items-center justify-center text-[#FF4500] font-black text-xs">
            aha
          </div>
        );
      case 'zee5':
        return (
          <div className="w-9 h-9 rounded-xl bg-[#8230C6]/20 border border-[#8230C6]/40 flex items-center justify-center text-[#C084FC] font-extrabold text-xs">
            ZEE5
          </div>
        );
      case 'sun_nxt':
        return (
          <div className="w-9 h-9 rounded-xl bg-[#FFB800]/20 border border-[#FFB800]/40 flex items-center justify-center text-[#FFB800] font-bold text-xs">
            SUN
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm">
            {platform.name.charAt(0)}
          </div>
        );
    }
  };

  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between p-3.5 rounded-xl bg-[#151D30]/90 hover:bg-[#1C2742] border border-white/10 hover:border-purple-500/50 shadow-md hover:shadow-xl hover:shadow-purple-900/20 transition-all duration-200 cursor-pointer"
      title={`Open ${movieTitle} on ${platform.name}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {renderLogo()}
        <div className="min-w-0">
          <h5 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
            {platform.name}
          </h5>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            {platform.price && (
              <span className="text-slate-300 font-medium">{platform.price}</span>
            )}
            {platform.price && platform.quality && <span>•</span>}
            {platform.quality && (
              <span className="text-purple-400/90">{platform.quality}</span>
            )}
          </div>
        </div>
      </div>

      <div className="shrink-0 ml-3 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 group-hover:bg-purple-600 text-slate-300 group-hover:text-white text-xs font-semibold transition-all duration-200">
        <span>{platform.type === 'stream' ? 'Watch' : platform.type === 'rent' ? 'Rent' : 'Buy'}</span>
        <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </a>
  );
};
