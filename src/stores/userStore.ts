import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import type { WatchlistEntry, WatchHistoryEntry, UserPreferences, WatchlistStatus } from '@/types/user';

interface UserState {
  preferences: UserPreferences;
  watchlist: WatchlistEntry[];
  watchHistory: WatchHistoryEntry[];
  setDisplayName: (name: string) => void;
  setAvatarColor: (color: string) => void;
  setWatchlist: (list: WatchlistEntry[]) => void;
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
      
      setWatchlist: (list) => set({ watchlist: list }),

      addToWatchlist: (entry) => {
        const newEntry = { ...entry, addedAt: new Date().toISOString() };
        set((s) => ({
          watchlist: [...s.watchlist.filter((w) => w.malId !== entry.malId), newEntry],
        }));
        
        const user = auth.currentUser;
        if (user) {
          setDoc(doc(db, 'users', user.uid, 'watchlist', String(entry.malId)), newEntry).catch((err) => {
            console.error('Failed to add to Firestore watchlist:', err);
          });
        }
      },

      removeFromWatchlist: (malId) => {
        set((s) => ({ watchlist: s.watchlist.filter((w) => w.malId !== malId) }));
        
        const user = auth.currentUser;
        if (user) {
          deleteDoc(doc(db, 'users', user.uid, 'watchlist', String(malId))).catch((err) => {
            console.error('Failed to delete from Firestore watchlist:', err);
          });
        }
      },

      updateWatchlistStatus: (malId, status) => {
        set((s) => ({
          watchlist: s.watchlist.map((w) => (w.malId === malId ? { ...w, status } : w)),
        }));
        
        const user = auth.currentUser;
        if (user) {
          const entry = get().watchlist.find((w) => w.malId === malId);
          if (entry) {
            setDoc(doc(db, 'users', user.uid, 'watchlist', String(malId)), entry).catch((err) => {
              console.error('Failed to update Firestore watchlist status:', err);
            });
          }
        }
      },

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
