import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toggleWatchlist } = useWatchlist();

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4 px-4 max-w-7xl mx-auto">
        <h2 className="font-display font-bold text-xl md:text-2xl text-text-primary">{title}</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-card flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-elevated transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-card flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-elevated transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-none px-4 pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[160px] md:w-[180px]">
                <AnimeCardSkeleton />
              </div>
            ))
          : anime.map((item, i) => (
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
      </div>
    </section>
  );
}
