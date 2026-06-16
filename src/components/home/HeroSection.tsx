import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, ChevronDown, Star, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DotPattern } from '@/components/ui/DotPattern';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { HeroSkeleton } from '@/components/ui/Skeleton';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useAnimeTheme } from '@/hooks/useAnimeTheme';
import type { Anime } from '@/types/anime';

interface HeroSectionProps {
  anime: Anime[];
  isLoading: boolean;
}

function HeroBackground({ anime: featured }: { anime: Anime }) {
  const { data: themeUrl } = useAnimeTheme(featured?.anilist_id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const bannerUrl = featured?.banner_image || featured?.images?.jpg?.large_image_url || '';

  useEffect(() => {
    if (videoRef.current && themeUrl) {
      videoRef.current.src = themeUrl;
      videoRef.current.play().catch(() => {});
    }
  }, [themeUrl]);

  return (
    <div className="absolute inset-0">
      {themeUrl ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-[1.02]"
        >
          <source src={themeUrl} type="video/webm" />
        </video>
      ) : bannerUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center bg-void"
          style={{ backgroundImage: `url(${bannerUrl})` }}
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/80 to-void/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void/30" />
    </div>
  );
}

export function HeroSection({ anime, isLoading }: HeroSectionProps) {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % Math.max(anime.length, 1));
  }, [anime.length]);

  useEffect(() => {
    if (anime.length <= 1) return;
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [anime.length, nextSlide]);

  if (isLoading) return <HeroSkeleton />;

  const featured = anime[current];
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
          <HeroBackground anime={featured} />
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
                <Link to={`/anime/${featured.mal_id}`}>
                  <Button variant="secondary" size="lg">
                    <Info className="w-5 h-5 stroke-[1.5]" />
                    Details
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
        {anime.slice(0, 5).map((_, i) => (
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
