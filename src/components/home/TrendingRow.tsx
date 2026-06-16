import { motion } from 'framer-motion';
import { Flame, TrendingUp, Star } from 'lucide-react';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { ScrollableRow } from '@/components/ui/ScrollableRow';
import { AnimeCardSkeleton } from '@/components/ui/Skeleton';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { Anime } from '@/types/anime';

interface TrendingRowProps {
  title: string;
  anime: Anime[];
  isLoading: boolean;
  showRank?: boolean;
  fetchNext?: () => void;
}

const titleIcons: Record<string, typeof Flame> = {
  'Trending': Flame, 'Popular': TrendingUp, 'Upcoming': Star,
};

export function TrendingRow({ title, anime, isLoading, showRank = false, fetchNext }: TrendingRowProps) {
  const { toggleWatchlist } = useWatchlist();
  const TitleIcon = Object.entries(titleIcons).find(([k]) => title.includes(k))?.[1] || TrendingUp;

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <h2 className="font-display font-bold text-xl md:text-2xl text-text-primary mb-4 flex items-center gap-2"><TitleIcon className="w-5 h-5 text-accent-glow stroke-[1.5]" /> {title}</h2>
      {isLoading ? (
        <div className="flex gap-4">
          {Array.from({ length: 6 }).map((_, i) => <AnimeCardSkeleton key={i} />)}
        </div>
      ) : (
        <ScrollableRow onEndReached={fetchNext}>
          {anime.map((item, i) => (
            <motion.div
              key={item.mal_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="flex-shrink-0 w-[160px] md:w-[180px] relative"
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
        </ScrollableRow>
      )}
    </section>
  );
}
