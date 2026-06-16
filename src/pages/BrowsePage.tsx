import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Globe2, Earth, Network, Compass, SlidersHorizontal, Loader2 } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AnimeGrid } from '@/components/browse/AnimeGrid';
import { FilterBar, type FilterState } from '@/components/browse/FilterBar';
import { useBrowse } from '@/hooks/useAnime';

const GLOBE_ICONS = [
  { Icon: Globe, size: 280, top: '-15%', right: '-8%', opacity: 0.04, rotation: -15, duration: 20 },
  { Icon: Globe2, size: 180, top: '10%', left: '-5%', opacity: 0.03, rotation: 25, duration: 25 },
  { Icon: Earth, size: 220, bottom: '-10%', right: '15%', opacity: 0.035, rotation: 10, duration: 22 },
  { Icon: Network, size: 120, top: '5%', right: '30%', opacity: 0.025, rotation: -30, duration: 18 },
  { Icon: Compass, size: 100, bottom: '20%', left: '10%', opacity: 0.03, rotation: 45, duration: 28 },
];

export default function BrowsePage() {
  const [filters, setFilters] = useState<FilterState>({
    type: 'TV', status: null, season: null, year: null, genres: [], sort: 'score',
  });

  const browseParams = {
    type: filters.type || undefined,
    status: filters.status || undefined,
    season: filters.season || undefined,
    year: filters.year || undefined,
    genres: filters.genres.length > 0 ? filters.genres : undefined,
    sort: filters.sort || undefined,
  };
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useBrowse(browseParams);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const allAnime = data?.pages.flatMap((p) => p.data) || [];
  const totalResults = data?.pages[0]?.pagination?.per_page
    ? data.pages.length * data.pages[0].pagination.per_page
    : undefined;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage(); },
      { rootMargin: '400px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <PageWrapper className="pt-20 pb-12">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-primary/[0.03] via-transparent to-transparent" />
          {GLOBE_ICONS.map(({ Icon, size, top, left, right, bottom, opacity, rotation, duration }) => (
            <motion.div
              key={Icon.displayName}
              className="absolute text-accent-primary"
              style={{ top, left, right, bottom, opacity }}
              animate={{ rotate: [rotation, rotation + 360] }}
              transition={{ duration, repeat: Infinity, ease: 'linear' }}
            >
              <Icon size={size} strokeWidth={0.5} />
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-card bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20">
                <Compass className="w-5 h-5 text-accent-glow stroke-[1.5]" />
              </div>
              <div>
                <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary">
                  Browse <span className="text-accent-glow">Anime</span>
                </h1>
                <p className="text-text-secondary text-sm font-body mt-0.5">
                  Discover your next favorite series
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-6 p-4 rounded-card bg-surface/60 border border-border-subtle backdrop-blur-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal className="w-4 h-4 text-accent-glow stroke-[1.5]" />
              <span className="text-xs font-body font-medium text-text-secondary uppercase tracking-wider">Filters</span>
            </div>
            <FilterBar filters={filters} onChange={handleFilterChange} totalResults={totalResults} />
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-2">
        {isError && (
          <div className="p-6 rounded-card bg-accent-rose/5 border border-accent-rose/20 text-center">
            <p className="text-accent-rose text-sm font-body">{(error as Error)?.message || 'Failed to load anime'}</p>
          </div>
        )}

        <AnimeGrid anime={allAnime} isLoading={isLoading} />

        <div ref={sentinelRef} className="h-4" />

        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-accent-glow animate-spin stroke-[1.5]" />
            <span className="ml-2 text-sm text-text-secondary font-body">Loading more...</span>
          </div>
        )}

        {!hasNextPage && !isLoading && allAnime.length > 0 && (
          <p className="text-center text-text-muted text-xs font-body py-6">You've reached the end</p>
        )}
      </div>
    </PageWrapper>
  );
}
