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
  const latest = useBrowse({ sort: 'start_date' });

  function dedup(arr: Anime[], seen: Set<number>) {
    return arr.filter((a) => { if (seen.has(a.mal_id)) return false; seen.add(a.mal_id); return true; });
  }

  const seen = new Set<number>();

  return (
    <PageWrapper>
      <HeroSection anime={trending.data || []} isLoading={trending.isLoading} />
      <ContinueWatching />
      <TrendingRow title="Trending Now" anime={dedup(trendingNow.data || [], seen)} isLoading={trendingNow.isLoading} showRank />
      <SeasonalGrid title="This Season" anime={dedup(seasonal.data || [], seen)} isLoading={seasonal.isLoading} />
      <TrendingRow title="Top Rated" anime={dedup(top.data || [], seen)} isLoading={top.isLoading} showRank />
      <TrendingRow title="Upcoming" anime={dedup(upcoming.data || [], seen)} isLoading={upcoming.isLoading} />
      <TrendingRow title="Anime Movies" anime={dedup(movies.data?.pages.flatMap((p) => p.data) || [], seen)} isLoading={movies.isLoading} fetchNext={movies.hasNextPage ? () => movies.fetchNextPage() : undefined} />
      <TrendingRow title="Isekai Anime" anime={dedup(isekai.data?.pages.flatMap((p) => p.data) || [], seen)} isLoading={isekai.isLoading} fetchNext={isekai.hasNextPage ? () => isekai.fetchNextPage() : undefined} />
      <TrendingRow title="Ecchi Anime" anime={dedup(ecchi.data?.pages.flatMap((p) => p.data) || [], seen)} isLoading={ecchi.isLoading} fetchNext={ecchi.hasNextPage ? () => ecchi.fetchNextPage() : undefined} />
      <TrendingRow title="Latest Anime" anime={dedup(latest.data?.pages.flatMap((p) => p.data) || [], seen)} isLoading={latest.isLoading} fetchNext={latest.hasNextPage ? () => latest.fetchNextPage() : undefined} />
      <GenreQuickNav />
    </PageWrapper>
  );
}
