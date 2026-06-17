import { PageWrapper } from '@/components/layout/PageWrapper';
import { HeroSection } from '@/components/home/HeroSection';
import { ContinueWatching } from '@/components/home/ContinueWatching';
import { TrendingRow } from '@/components/home/TrendingRow';
import { SeasonalGrid } from '@/components/home/SeasonalGrid';
import { GenreQuickNav } from '@/components/home/GenreQuickNav';
import { useTrending, useSeasonal, useUpcoming, useTop, useTrendingNow, useBrowse } from '@/hooks/useAnime';
import type { Anime } from '@/types/anime';

export default function HomePage() {
  const trending = useTrending();
  const trendingNow = useTrendingNow();
  const seasonal = useSeasonal();
  const top = useTop();
  const upcoming = useUpcoming();

  const movies = useBrowse({ type: 'movie', sort: 'trending' });
  const isekai = useBrowse({ genres: ['62'], sort: 'trending' });
  const ecchi = useBrowse({ genres: ['9'], sort: 'trending' });

  const loading = trending.isLoading || trendingNow.isLoading || seasonal.isLoading || top.isLoading || upcoming.isLoading;

  function dedup(arr: Anime[], seen: Set<number>) {
    return arr.filter((a) => { if (seen.has(a.mal_id)) return false; seen.add(a.mal_id); return true; });
  }

  const seen = new Set<number>();

  if (loading) {
    return (
      <PageWrapper>
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
          <img src="/loader.gif" alt="Loading..." className="w-24 h-24 object-contain" />
          <p className="font-display text-base text-text-muted animate-pulse">Loading...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <HeroSection anime={trending.data || []} isLoading={false} />
      <ContinueWatching />
      <TrendingRow title="Trending Now" anime={dedup(trendingNow.data || [], seen)} isLoading={false} />
      <SeasonalGrid title="This Season" anime={dedup(seasonal.data || [], seen)} isLoading={false} />
      <TrendingRow title="Top Rated" anime={dedup(top.data || [], seen)} isLoading={false} showRank />
      <TrendingRow title="Upcoming" anime={dedup(upcoming.data || [], seen)} isLoading={false} />
      <TrendingRow title="Anime Movies" anime={dedup(movies.data?.pages.flatMap((p) => p.data) || [], seen)} isLoading={false} fetchNext={movies.hasNextPage ? () => movies.fetchNextPage() : undefined} />
      <TrendingRow title="Isekai Anime" anime={dedup(isekai.data?.pages.flatMap((p) => p.data) || [], seen)} isLoading={false} fetchNext={isekai.hasNextPage ? () => isekai.fetchNextPage() : undefined} />
      <TrendingRow title="Ecchi Anime" anime={dedup(ecchi.data?.pages.flatMap((p) => p.data) || [], seen)} isLoading={false} fetchNext={ecchi.hasNextPage ? () => ecchi.fetchNextPage() : undefined} />
      <GenreQuickNav />
    </PageWrapper>
  );
}
