export type WatchlistStatus = 'watching' | 'plan_to_watch' | 'completed' | 'dropped' | 'on_hold';

export interface WatchlistEntry {
  malId: number;
  title: string;
  image: string;
  status: WatchlistStatus;
  addedAt: string;
}

export interface WatchHistoryEntry {
  malId: number;
  title: string;
  image: string;
  episode: number;
  progress: number;
  lastWatched: string;
}

export interface UserPreferences {
  displayName: string;
  avatarColor: string;
}
