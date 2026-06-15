export interface Anime {
  mal_id: number;
  anilist_id?: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  images: {
    jpg: { image_url: string; large_image_url: string };
    webp: { image_url: string; large_image_url: string };
  };
  type: string | null;
  episodes: number | null;
  status: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  favorites: number | null;
  synopsis: string | null;
  season: string | null;
  year: number | null;
  aired: {
    from: string | null;
    to: string | null;
    string: string;
  };
  broadcast: {
    day: string | null;
    time: string | null;
  } | null;
  studios: { mal_id: number; name: string }[];
  genres: { mal_id: number; name: string }[];
  themes: { mal_id: number; name: string }[];
  source: string | null;
  rating: string | null;
  duration: string | null;
  trailer: {
    youtube_id: string | null;
    url: string | null;
  } | null;
  relations: AnimeRelation[];
}

export interface AnimeRelation {
  relation: string;
  entry: { mal_id: number; name: string; type: string }[];
}

export interface Character {
  mal_id: number;
  anilist_id?: number;
  url?: string;
  images: { jpg: { image_url: string } };
  name: string;
  role: 'Main' | 'Supporting';
  voice_actors: {
    person: { mal_id: number; name: string; images: { jpg: { image_url: string } } };
    language: string;
  }[];
}

export interface Episode {
  mal_id: number;
  title: string;
  episode: number;
  aired: string | null;
  filler: boolean;
  recap: boolean;
  forum_url: string | null;
}

export interface StreamingSource {
  url: string;
  quality: string;
}

export interface SkipTimestamp {
  type: 'op' | 'ed';
  startTime: number;
  endTime: number;
}
