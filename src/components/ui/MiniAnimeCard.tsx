import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Star } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Anime } from '@/types/anime';

interface MiniAnimeCardProps {
  anime: Anime;
}

export function MiniAnimeCard({ anime }: MiniAnimeCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = anime.images.webp?.image_url || anime.images.jpg?.image_url;
  const scoreColor = anime.score && anime.score >= 8 ? 'amber' : anime.score && anime.score >= 6 ? 'default' : 'rose';

  return (
    <div className="flex-shrink-0 w-[160px] md:w-[180px] group">
      <Link to={`/anime/${anime.mal_id}`} className="block relative aspect-[3/4] rounded-card overflow-hidden bg-elevated mb-1.5">
        {!imgError ? (
          <img src={imageUrl} alt={anime.title} loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-elevated dot-pattern">
            <Play className="w-8 h-8 text-text-muted stroke-[1.5]" />
          </div>
        )}
      </Link>
      <div className="flex flex-col gap-0.5">
        <h3 className="font-display font-semibold text-sm text-text-primary line-clamp-2 leading-tight">
          <Link to={`/anime/${anime.mal_id}`} className="hover:text-accent-glow transition-colors">
            {anime.title_english || anime.title}
          </Link>
        </h3>
        {anime.score && (
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-accent-amber fill-accent-amber stroke-[1.5]" />
            <span className={cn('text-xs font-mono font-medium', {
              'text-accent-amber': scoreColor === 'amber',
              'text-text-secondary': scoreColor === 'default',
              'text-accent-rose': scoreColor === 'rose',
            })}>{anime.score.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
