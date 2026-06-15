import { motion } from 'framer-motion';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { AnimeCardSkeleton } from '@/components/ui/Skeleton';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { Anime } from '@/types/anime';

interface TrendingRowProps {
  title: string;
  anime: Anime[];
  isLoading: boolean;
  showRank?: boolean;
}

export function TrendingRow({ title, anime, isLoading, showRank = false }: TrendingRowProps) {
  const { toggleWatchlist } = useWatchlist();

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <h2 className="font-display font-bold text-xl md:text-2xl text-text-primary mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : anime.map((item, i) => (
              <motion.div
                key={item.mal_id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="relative"
              >
                {showRank && (
                  <span className="absolute top-2 left-2 z-10 font-mono font-bold text-2xl text-text-primary/30">
                    {i + 1}
                  </span>
                )}
                <AnimeCard
                  anime={item}
                  onAddToWatchlist={(malId) => {
                    const a = anime.find((x) => x.mal_id === malId);
                    if (a) toggleWatchlist({ malId: a.mal_id, title: a.title_english || a.title, image: a.images.jpg?.image_url || '' });
                  }}
                />
              </motion.div>
            ))}
      </div>
    </section>
  );
}
