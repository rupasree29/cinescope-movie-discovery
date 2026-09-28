export interface PlatformBrand {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  badgeColor: string;
  domain: string;
  buildSearchUrl: (title: string, year?: string | number) => string;
}

export const PLATFORM_BRANDS: Record<string, PlatformBrand> = {
  netflix: {
    id: 'netflix',
    name: 'Netflix',
    shortName: 'Netflix',
    color: '#E50914',
    bgColor: 'rgba(229, 9, 20, 0.12)',
    borderColor: 'rgba(229, 9, 20, 0.35)',
    badgeColor: '#E50914',
    domain: 'netflix.com',
    buildSearchUrl: (title) => `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
  },
  prime_video: {
    id: 'prime_video',
    name: 'Prime Video',
    shortName: 'Prime',
    color: '#00A8E1',
    bgColor: 'rgba(0, 168, 225, 0.12)',
    borderColor: 'rgba(0, 168, 225, 0.35)',
    badgeColor: '#00A8E1',
    domain: 'amazon.com',
    buildSearchUrl: (title) => `https://www.amazon.com/s?k=${encodeURIComponent(title)}&i=instant-video`,
  },
  disney_plus: {
    id: 'disney_plus',
    name: 'Disney+',
    shortName: 'Disney+',
    color: '#113CCF',
    bgColor: 'rgba(17, 60, 207, 0.15)',
    borderColor: 'rgba(80, 120, 255, 0.35)',
    badgeColor: '#2B6BF4',
    domain: 'disneyplus.com',
    buildSearchUrl: (title) => `https://www.disneyplus.com/search?q=${encodeURIComponent(title)}`,
  },
  apple_tv: {
    id: 'apple_tv',
    name: 'Apple TV',
    shortName: 'Apple TV',
    color: '#A2AAAD',
    bgColor: 'rgba(255, 255, 255, 0.08)',
    borderColor: 'rgba(255, 255, 255, 0.25)',
    badgeColor: '#E2E8F0',
    domain: 'tv.apple.com',
    buildSearchUrl: (title) => `https://tv.apple.com/search?term=${encodeURIComponent(title)}`,
  },
  max: {
    id: 'max',
    name: 'Max',
    shortName: 'Max',
    color: '#002BE7',
    bgColor: 'rgba(0, 43, 231, 0.15)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
    badgeColor: '#3B82F6',
    domain: 'max.com',
    buildSearchUrl: (title) => `https://www.max.com/search?q=${encodeURIComponent(title)}`,
  },
  hulu: {
    id: 'hulu',
    name: 'Hulu',
    shortName: 'Hulu',
    color: '#1CE783',
    bgColor: 'rgba(28, 231, 131, 0.12)',
    borderColor: 'rgba(28, 231, 131, 0.35)',
    badgeColor: '#1CE783',
    domain: 'hulu.com',
    buildSearchUrl: (title) => `https://www.hulu.com/search?q=${encodeURIComponent(title)}`,
  },
  paramount_plus: {
    id: 'paramount_plus',
    name: 'Paramount+',
    shortName: 'Paramount+',
    color: '#0064FF',
    bgColor: 'rgba(0, 100, 255, 0.12)',
    borderColor: 'rgba(0, 100, 255, 0.35)',
    badgeColor: '#0064FF',
    domain: 'paramountplus.com',
    buildSearchUrl: (title) => `https://www.paramountplus.com/search/?q=${encodeURIComponent(title)}`,
  },
  peacock: {
    id: 'peacock',
    name: 'Peacock',
    shortName: 'Peacock',
    color: '#000000',
    bgColor: 'rgba(245, 166, 35, 0.12)',
    borderColor: 'rgba(245, 166, 35, 0.35)',
    badgeColor: '#F5A623',
    domain: 'peacocktv.com',
    buildSearchUrl: (title) => `https://www.peacocktv.com/search?q=${encodeURIComponent(title)}`,
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube Movies',
    shortName: 'YouTube',
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.12)',
    borderColor: 'rgba(255, 0, 0, 0.35)',
    badgeColor: '#FF0000',
    domain: 'youtube.com',
    buildSearchUrl: (title) => `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}+full+movie`,
  },
  hotstar: {
    id: 'hotstar',
    name: 'JioCinema / Hotstar',
    shortName: 'JioCinema',
    color: '#E20074',
    bgColor: 'rgba(226, 0, 116, 0.12)',
    borderColor: 'rgba(226, 0, 116, 0.35)',
    badgeColor: '#E20074',
    domain: 'jiocinema.com',
    buildSearchUrl: (title) => `https://www.jiocinema.com/search/${encodeURIComponent(title)}`,
  },
  aha: {
    id: 'aha',
    name: 'Aha Video',
    shortName: 'Aha',
    color: '#FF4500',
    bgColor: 'rgba(255, 69, 0, 0.15)',
    borderColor: 'rgba(255, 69, 0, 0.4)',
    badgeColor: '#FF4500',
    domain: 'aha.video',
    buildSearchUrl: (title) => `https://www.aha.video/search?q=${encodeURIComponent(title)}`,
  },
  zee5: {
    id: 'zee5',
    name: 'ZEE5',
    shortName: 'ZEE5',
    color: '#8230C6',
    bgColor: 'rgba(130, 48, 198, 0.15)',
    borderColor: 'rgba(130, 48, 198, 0.4)',
    badgeColor: '#8230C6',
    domain: 'zee5.com',
    buildSearchUrl: (title) => `https://www.zee5.com/search?q=${encodeURIComponent(title)}`,
  },
  sun_nxt: {
    id: 'sun_nxt',
    name: 'Sun NXT',
    shortName: 'Sun NXT',
    color: '#FFB800',
    bgColor: 'rgba(255, 184, 0, 0.15)',
    borderColor: 'rgba(255, 184, 0, 0.4)',
    badgeColor: '#FFB800',
    domain: 'sunnxt.com',
    buildSearchUrl: (title) => `https://www.sunnxt.com/search/${encodeURIComponent(title)}`,
  },
};

export function getPlatformBrand(platformId: string, fallbackName?: string): PlatformBrand {
  const normalized = platformId.toLowerCase().replace(/[^a-z0-9]/g, '_');
  if (PLATFORM_BRANDS[normalized]) {
    return PLATFORM_BRANDS[normalized];
  }
  // Try matching by substring
  for (const [key, brand] of Object.entries(PLATFORM_BRANDS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return brand;
    }
  }

  const name = fallbackName || platformId;
  return {
    id: normalized,
    name,
    shortName: name,
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.35)',
    badgeColor: '#8B5CF6',
    domain: '',
    buildSearchUrl: (title) => `https://www.google.com/search?q=${encodeURIComponent(title + ' watch on ' + name)}`,
  };
}
