import { useUserStore } from '@/stores/userStore';
import type { WatchHistoryEntry } from '@/types/user';

export function useWatchHistory() {
  const watchHistory = useUserStore((s) => s.watchHistory);
  const addToHistory = useUserStore((s) => s.addToHistory);
  const updateProgress = useUserStore((s) => s.updateProgress);
  const clearWatchHistory = useUserStore((s) => s.clearWatchHistory);

  const getProgress = (malId: number, episode: number): number => {
    const entry = watchHistory.find((h) => h.malId === malId && h.episode === episode);
    return entry?.progress || 0;
  };

  const getLastWatched = (malId: number): WatchHistoryEntry | undefined => {
    return watchHistory.find((h) => h.malId === malId);
  };

  return { watchHistory, addToHistory, updateProgress, clearWatchHistory, getProgress, getLastWatched };
}
