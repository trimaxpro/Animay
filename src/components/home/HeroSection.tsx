import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, ChevronDown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DotPattern } from '@/components/ui/DotPattern';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { HeroSkeleton } from '@/components/ui/Skeleton';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { Anime } from '@/types/anime';

interface HeroSectionProps {
  anime: Anime[];
  isLoading: boolean;
}

export function HeroSection({ anime, isLoading }: HeroSectionProps) {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  
  // Filter to ensure all featured anime have trailers
  const animeWithTrailers = anime.filter((item) => item.trailer?.youtube_id);
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % Math.max(animeWithTrailers.length, 1));
  }, [animeWithTrailers.length]);

  useEffect(() => {
    if (animeWithTrailers.length <= 1) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [animeWithTrailers.length, nextSlide]);

  if (isLoading) return <HeroSkeleton />;

  const featured = animeWithTrailers[current];
  if (!featured) return null;

  return (
    <div className="relative h-[65vh] min-h-[500px] overflow-hidden grain-overlay bg-void">
      <AnimatePresence mode="wait">
        <motion.div
          key={featured.mal_id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
            <iframe
              className="absolute inset-0 w-full h-full scale-[1.35]"
              src={`https://www.youtube.com/embed/${featured.trailer.youtube_id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${featured.trailer.youtube_id}&playsinline=1&enablejsapi=1&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&start=30`}
              allow="autoplay; encrypted-media"
              title="Trailer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-void via-void/80 to-void/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/30" />
        </motion.div>
      </AnimatePresence>

      <DotPattern opacity={0.4} />

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.mal_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl"
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {featured.genres.slice(0, 3).map((g) => (
                  <Badge key={g.mal_id} variant="violet">{g.name}</Badge>
                ))}
                {featured.score && (
                  <Badge variant="amber">
                    <Star className="w-3 h-3 fill-accent-amber stroke-accent-amber mr-1" />
                    {featured.score.toFixed(1)}
                  </Badge>
                )}
                {featured.episodes && (
                  <Badge>{featured.episodes} Episodes</Badge>
                )}
              </div>

              <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-text-primary leading-[1.1] mb-3">
                {featured.title_english || featured.title}
              </h1>

              {featured.title_japanese && (
                <p className="text-text-muted text-lg mb-4 font-body">{featured.title_japanese}</p>
              )}

              {featured.synopsis && (
                <p className="text-text-secondary text-sm md:text-base line-clamp-4 mb-6 max-w-xl">
                  {featured.synopsis}
                </p>
              )}

              <div className="flex items-center gap-3">
                <Link to={featured.episodes ? `/watch/${featured.mal_id}/1` : `/anime/${featured.mal_id}`}>
                  <Button variant="primary" size="lg">
                    <Play className="w-5 h-5 fill-white" />
                    Watch Now
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => toggleWatchlist({
                    malId: featured.mal_id,
                    title: featured.title_english || featured.title,
                    image: featured.images.jpg?.image_url || '',
                  })}
                >
                  <Plus className="w-5 h-5" />
                  {isInWatchlist(featured.mal_id) ? 'In List' : 'Add to List'}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {animeWithTrailers.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current ? 'bg-accent-primary w-6' : 'bg-text-muted/40 hover:bg-text-muted'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 right-8 z-10"
      >
        <ChevronDown className="w-6 h-6 text-text-muted stroke-[1.5]" />
      </motion.div>
    </div>
  );
}
