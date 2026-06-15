export const GENRES = [
  { id: 1, name: 'Action', slug: 'action' },
  { id: 2, name: 'Adventure', slug: 'adventure' },
  { id: 4, name: 'Comedy', slug: 'comedy' },
  { id: 8, name: 'Drama', slug: 'drama' },
  { id: 10, name: 'Fantasy', slug: 'fantasy' },
  { id: 14, name: 'Horror', slug: 'horror' },
  { id: 7, name: 'Mystery', slug: 'mystery' },
  { id: 22, name: 'Romance', slug: 'romance' },
  { id: 24, name: 'Sci-Fi', slug: 'sci-fi' },
  { id: 36, name: 'Slice of Life', slug: 'slice-of-life' },
  { id: 30, name: 'Sports', slug: 'sports' },
  { id: 37, name: 'Supernatural', slug: 'supernatural' },
  { id: 41, name: 'Thriller', slug: 'thriller' },
  { id: 25, name: 'Shoujo', slug: 'shoujo' },
  { id: 27, name: 'Shounen', slug: 'shounen' },
  { id: 40, name: 'Psychological', slug: 'psychological' },
  { id: 46, name: 'Award Winning', slug: 'award-winning' },
  { id: 5, name: 'Avant Garde', slug: 'avant-garde' },
  { id: 43, name: 'Gourmet', slug: 'gourmet' },
  { id: 47, name: 'Isekai', slug: 'isekai' },
] as const;

export const ANIME_TYPES = ['TV', 'Movie', 'OVA', 'ONA', 'Special'] as const;
export const ANIME_STATUS = ['Airing', 'Completed', 'Upcoming'] as const;
export const SEASONS = ['Winter', 'Spring', 'Summer', 'Fall'] as const;
export const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'score', label: 'Score' },
  { value: 'start_date', label: 'Start Date' },
  { value: 'title', label: 'Title' },
] as const;

export const SCORE_FILTERS = [
  { value: 6, label: '6+' },
  { value: 7, label: '7+' },
  { value: 8, label: '8+' },
  { value: 9, label: '9+' },
] as const;

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const JIKAN_BASE = 'https://api.jikan.moe/v4';
