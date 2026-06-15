import { AnimeCard } from '@/components/ui/AnimeCard';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { Anime } from '@/types/anime';

interface RelatedAnimeProps {
  anime: Anime[];
}

export function RelatedAnime({ anime }: RelatedAnimeProps) {
  const { toggleWatchlist } = useWatchlist();

  if (anime.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {anime.map((item) => (
        <div key={item.mal_id} className="flex-shrink-0 w-[160px] md:w-[180px]">
          <AnimeCard
            anime={item}
            onAddToWatchlist={(_malId) => {
              toggleWatchlist({ malId: item.mal_id, title: item.title_english || item.title, image: item.images.jpg?.image_url || '' });
            }}
          />
        </div>
      ))}
    </div>
  );
}
