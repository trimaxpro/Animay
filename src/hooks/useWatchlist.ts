import { useUserStore } from '@/stores/userStore';
import type { WatchlistStatus } from '@/types/user';

export function useWatchlist() {
  const watchlist = useUserStore((s) => s.watchlist);
  const addToWatchlist = useUserStore((s) => s.addToWatchlist);
  const removeFromWatchlist = useUserStore((s) => s.removeFromWatchlist);
  const updateWatchlistStatus = useUserStore((s) => s.updateWatchlistStatus);
  const isInWatchlist = useUserStore((s) => s.isInWatchlist);
  const getWatchlistByStatus = useUserStore((s) => s.getWatchlistByStatus);

  const toggleWatchlist = (entry: { malId: number; title: string; image: string }, status: WatchlistStatus = 'plan_to_watch') => {
    if (isInWatchlist(entry.malId)) {
      removeFromWatchlist(entry.malId);
    } else {
      addToWatchlist({ ...entry, status });
    }
  };

  return { watchlist, addToWatchlist, removeFromWatchlist, updateWatchlistStatus, isInWatchlist, getWatchlistByStatus, toggleWatchlist };
}
