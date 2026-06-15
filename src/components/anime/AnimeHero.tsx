import { Star, Play, Share2, BookmarkPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DotPattern } from '@/components/ui/DotPattern';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import type { Anime } from '@/types/anime';
import { useState } from 'react';

interface AnimeHeroProps {
  anime: Anime;
}

export function AnimeHero({ anime }: AnimeHeroProps) {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const { watchHistory } = useWatchHistory();
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const imageUrl = anime.banner_image || anime.images.webp?.large_image_url || anime.images.jpg?.large_image_url;
  const posterUrl = anime.images.webp?.image_url || anime.images.jpg?.image_url;

  return (
    <div className="relative overflow-hidden grain-overlay">
      <div
        className="absolute inset-0 bg-cover bg-center blur-lg scale-110"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/90 to-void/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/50" />
      <DotPattern opacity={0.3} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0">
            <div className="w-[200px] md:w-[240px] aspect-[3/4] rounded-card overflow-hidden border-2 border-border-glow shadow-glow">
              <img src={posterUrl} alt={anime.title} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold text-3xl md:text-5xl text-text-primary leading-tight mb-1">
              {anime.title_english || anime.title}
            </h1>
            {anime.title_japanese && (
              <p className="text-text-muted text-base mb-4">{anime.title_japanese}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {anime.score && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-accent-amber fill-accent-amber stroke-[1.5]" />
                  <span className="font-mono font-medium text-accent-amber">{anime.score.toFixed(1)}</span>
                </div>
              )}
              {anime.rank && <Badge variant="violet">Rank #{anime.rank}</Badge>}
              {anime.episodes && <Badge>{anime.episodes} Episodes</Badge>}
              {anime.status && <Badge variant={['Currently Airing', 'Airing'].includes(anime.status) ? 'rose' : 'default'}>{anime.status}</Badge>}
              {anime.season && anime.year && <Badge>{anime.season} {anime.year}</Badge>}
              {anime.studios?.[0] && <Badge>{anime.studios[0].name}</Badge>}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres.map((g) => (
                <Badge key={g.mal_id} variant="violet">{g.name}</Badge>
              ))}
            </div>

            {anime.synopsis && (
              <div className="mb-6 max-w-2xl">
                <p className={`text-text-secondary text-sm leading-relaxed ${!synopsisExpanded ? 'line-clamp-4' : ''}`}>
                  {anime.synopsis}
                </p>
                <button
                  onClick={() => setSynopsisExpanded(!synopsisExpanded)}
                  className="text-accent-glow text-sm mt-1 hover:underline"
                >
                  {synopsisExpanded ? 'Show Less' : 'Read More'}
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {(() => {
                const lastWatched = watchHistory.find((h) => h.malId === anime.mal_id);
                const nextEpisode = lastWatched ? lastWatched.episode : 1;
                return (
                  <Link to={`/watch/${anime.mal_id}/${nextEpisode}`}>
                    <Button variant="primary" size="md">
                      <Play className="w-4 h-4 fill-white" />
                      {lastWatched ? `Resume Ep. ${nextEpisode}` : 'Watch Now'}
                    </Button>
                  </Link>
                );
              })()}
              <Button
                variant="secondary"
                size="md"
                onClick={() => toggleWatchlist({
                  malId: anime.mal_id,
                  title: anime.title_english || anime.title,
                  image: anime.images.jpg?.image_url || '',
                })}
              >
                <BookmarkPlus className="w-4 h-4" />
                {isInWatchlist(anime.mal_id) ? 'In Watchlist' : 'Add to List'}
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: anime.title_english || anime.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
