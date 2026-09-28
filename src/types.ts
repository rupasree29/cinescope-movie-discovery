export type MovieType = 'movie' | 'tv' | 'series';

export type AvailabilityType = 'stream' | 'rent' | 'buy';

export interface OTTPlatformOption {
  platformId: string;
  name: string;
  type: AvailabilityType;
  price?: string;
  quality?: string; // '4K UHD', 'HD', 'Dolby Vision'
  url: string;
  logo?: string;
  color?: string;
}

export interface RegionalStreamingInfo {
  stream: OTTPlatformOption[];
  rent: OTTPlatformOption[];
  buy: OTTPlatformOption[];
}

export interface Movie {
  id: string;
  title: string;
  year: number | string;
  type: MovieType; // 'movie' | 'tv' | 'series'
  posterUrl: string;
  backdropUrl?: string;
  rating: number; // e.g. 8.8
  ratingCount?: string; // e.g. "2.4M"
  metascore?: number;
  duration: string; // e.g. "2h 28m" or "4 Seasons"
  genres: string[];
  director: string;
  cast: string[];
  plot: string;
  language: string;
  awards: string;
  released: string;
  rated: string; // "PG-13", "R", "TV-MA", "TV-14"
  trailerYoutubeId?: string;
  boxOffice?: string;
  featured?: boolean;
  ottAvailability: Record<string, RegionalStreamingInfo>; // key: 'US', 'GB', 'CA', 'AU', 'IN', 'DE'
}

export interface Region {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_REGIONS: Region[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
];

export type SortOption = 'popularity' | 'rating-desc' | 'year-desc' | 'year-asc' | 'title-asc';
