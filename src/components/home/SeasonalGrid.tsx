import { AnimeCard } from '@/components/ui/AnimeCard';
import { AnimeCardSkeleton } from '@/components/ui/Skeleton';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { Anime } from '@/types/anime';

interface SeasonalGridProps {
  title: string;
  anime: Anime[];
  isLoading: boolean;
}

export function SeasonalGrid({ title, anime, isLoading }: SeasonalGridProps) {
  const { toggleWatchlist } = useWatchlist();

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <h2 className="font-display font-bold text-xl md:text-2xl text-text-primary mb-4">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <AnimeCardSkeleton key={i} />)
          : anime.map((item) => (
              <AnimeCard
                key={item.mal_id}
                anime={item}
                onAddToWatchlist={(_malId) => {
                  toggleWatchlist({
                    malId: item.mal_id,
                    title: item.title_english || item.title,
                    image: item.images.jpg?.image_url || '',
                  });
                }}
              />
            ))}
      </div>
    </section>
  );
}
