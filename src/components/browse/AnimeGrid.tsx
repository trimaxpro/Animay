import { motion } from 'framer-motion';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { AnimeCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchX } from 'lucide-react';
import type { Anime } from '@/types/anime';
import { useWatchlist } from '@/hooks/useWatchlist';

interface AnimeGridProps {
  anime: Anime[];
  isLoading: boolean;
  viewMode?: 'grid' | 'list';
}

export function AnimeGrid({ anime, isLoading, viewMode = 'grid' }: AnimeGridProps) {
  const { toggleWatchlist } = useWatchlist();

  if (!isLoading && anime.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No anime found"
        message="No anime matches these filters. Clear some to explore more."
        actionLabel="Clear Filters"
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : anime.map((item, i) => (
              <motion.div
                key={item.mal_id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <AnimeCard anime={item} onAddToWatchlist={(_malId) => {
                  toggleWatchlist({ malId: item.mal_id, title: item.title_english || item.title, image: item.images.jpg?.image_url || '' });
                }} />
              </motion.div>
            ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {isLoading
        ? Array.from({ length: 12 }).map((_, i) => <AnimeCardSkeleton key={i} />)
        : anime.map((item, i) => (
            <motion.div
              key={item.mal_id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <AnimeCard anime={item} onAddToWatchlist={(_malId) => {
                toggleWatchlist({ malId: item.mal_id, title: item.title_english || item.title, image: item.images.jpg?.image_url || '' });
              }} />
            </motion.div>
          ))}
    </div>
  );
}
