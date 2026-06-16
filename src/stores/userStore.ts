import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WatchlistEntry, WatchHistoryEntry, UserPreferences, WatchlistStatus } from '@/types/user';

interface UserState {
  preferences: UserPreferences;
  watchlist: WatchlistEntry[];
  watchHistory: WatchHistoryEntry[];
  setDisplayName: (name: string) => void;
  setAvatarColor: (color: string) => void;
  addToWatchlist: (entry: Omit<WatchlistEntry, 'addedAt'>) => void;
  removeFromWatchlist: (malId: number) => void;
  updateWatchlistStatus: (malId: number, status: WatchlistStatus) => void;
  addToHistory: (entry: Omit<WatchHistoryEntry, 'lastWatched'>) => void;
  updateProgress: (malId: number, episode: number, progress: number) => void;
  isInWatchlist: (malId: number) => boolean;
  getWatchlistByStatus: (status: WatchlistStatus) => WatchlistEntry[];
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      preferences: { displayName: 'Anime Fan', avatarColor: '#3B82F6' },
      watchlist: [],
      watchHistory: [],

      setDisplayName: (name) => set((s) => ({ preferences: { ...s.preferences, displayName: name } })),
      setAvatarColor: (color) => set((s) => ({ preferences: { ...s.preferences, avatarColor: color } })),

      addToWatchlist: (entry) =>
        set((s) => ({
          watchlist: [...s.watchlist.filter((w) => w.malId !== entry.malId), { ...entry, addedAt: new Date().toISOString() }],
        })),

      removeFromWatchlist: (malId) =>
        set((s) => ({ watchlist: s.watchlist.filter((w) => w.malId !== malId) })),

      updateWatchlistStatus: (malId, status) =>
        set((s) => ({
          watchlist: s.watchlist.map((w) => (w.malId === malId ? { ...w, status } : w)),
        })),

      addToHistory: (entry) =>
        set((s) => ({
          watchHistory: [
            { ...entry, lastWatched: new Date().toISOString() },
            ...s.watchHistory.filter((h) => !(h.malId === entry.malId && h.episode === entry.episode)),
          ].slice(0, 100),
        })),

      updateProgress: (malId, episode, progress) =>
        set((s) => ({
          watchHistory: s.watchHistory.map((h) =>
            h.malId === malId && h.episode === episode ? { ...h, progress, lastWatched: new Date().toISOString() } : h,
          ),
        })),

      isInWatchlist: (malId) => get().watchlist.some((w) => w.malId === malId),

      getWatchlistByStatus: (status) => get().watchlist.filter((w) => w.status === status),
    }),
    { name: 'aniverse-user' },
  ),
);
