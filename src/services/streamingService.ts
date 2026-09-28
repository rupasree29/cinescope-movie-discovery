import { Movie, RegionalStreamingInfo, OTTPlatformOption, AvailabilityType } from '../types';
import { PLATFORM_BRANDS, getPlatformBrand } from '../data/platforms';

const REGION_STORAGE_KEY = 'cinescope_selected_region';

export function getSavedRegion(): string {
  if (typeof window === 'undefined') return 'US';
  return localStorage.getItem(REGION_STORAGE_KEY) || 'US';
}

export function saveRegion(region: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REGION_STORAGE_KEY, region);
  }
}

/**
 * Fetch dynamic streaming availability for a movie in a specific region.
 * Uses backend API with Gemini AI grounding, with seamless fallbacks.
 */
export async function fetchDynamicStreamingAvailability(
  movie: Movie,
  region: string = 'US'
): Promise<RegionalStreamingInfo> {
  // 1. Check if movie already has curated availability for this region
  if (movie.ottAvailability && movie.ottAvailability[region]) {
    const existing = movie.ottAvailability[region];
    if (existing.stream.length > 0 || existing.rent.length > 0 || existing.buy.length > 0) {
      return existing;
    }
  }

  // 2. Try querying backend AI / streaming service
  try {
    const response = await fetch('/api/streaming-availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: movie.title,
        year: movie.year,
        type: movie.type,
        region,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        const result: RegionalStreamingInfo = {
          stream: enrichPlatformOptions(data.data.stream || [], 'stream', movie.title),
          rent: enrichPlatformOptions(data.data.rent || [], 'rent', movie.title),
          buy: enrichPlatformOptions(data.data.buy || [], 'buy', movie.title),
        };

        // Cache into movie object for this session
        if (!movie.ottAvailability) movie.ottAvailability = {};
        movie.ottAvailability[region] = result;
        return result;
      }
    }
  } catch (err) {
    console.warn('Backend streaming availability fetch failed, using fallback:', err);
  }

  // 3. Fallback to US data or generate realistic defaults if available
  if (movie.ottAvailability && movie.ottAvailability['US']) {
    return movie.ottAvailability['US'];
  }

  // 4. Default dynamic fallback
  return generateGenericAvailability(movie, region);
}

function enrichPlatformOptions(
  items: any[],
  type: AvailabilityType,
  title: string
): OTTPlatformOption[] {
  return items.map((item) => {
    const brand = getPlatformBrand(item.platformId, item.name);
    return {
      platformId: brand.id,
      name: item.name || brand.name,
      type,
      price: item.price || (type === 'stream' ? 'Subscription' : type === 'rent' ? '$3.99' : '$14.99'),
      quality: item.quality || '4K UHD',
      url: item.url || brand.buildSearchUrl(title),
      color: brand.color,
    };
  });
}

function generateGenericAvailability(movie: Movie, region: string): RegionalStreamingInfo {
  // Reasonable intelligent baseline based on content type and studio/genres
  const stream: OTTPlatformOption[] = [];
  const rent: OTTPlatformOption[] = [];
  const buy: OTTPlatformOption[] = [];

  const title = movie.title;

  if (movie.type === 'movie') {
    rent.push({
      platformId: 'prime_video',
      name: 'Prime Video',
      type: 'rent',
      price: '$3.99',
      quality: '4K UHD',
      url: PLATFORM_BRANDS.prime_video.buildSearchUrl(title),
    });
    rent.push({
      platformId: 'apple_tv',
      name: 'Apple TV',
      type: 'rent',
      price: '$3.99',
      quality: '4K UHD',
      url: PLATFORM_BRANDS.apple_tv.buildSearchUrl(title),
    });
    rent.push({
      platformId: 'youtube',
      name: 'YouTube Movies',
      type: 'rent',
      price: '$3.99',
      quality: 'HD',
      url: PLATFORM_BRANDS.youtube.buildSearchUrl(title),
    });

    buy.push({
      platformId: 'apple_tv',
      name: 'Apple TV',
      type: 'buy',
      price: '$14.99',
      quality: '4K UHD',
      url: PLATFORM_BRANDS.apple_tv.buildSearchUrl(title),
    });
    buy.push({
      platformId: 'prime_video',
      name: 'Prime Video',
      type: 'buy',
      price: '$14.99',
      quality: '4K UHD',
      url: PLATFORM_BRANDS.prime_video.buildSearchUrl(title),
    });
  }

  return { stream, rent, buy };
}
