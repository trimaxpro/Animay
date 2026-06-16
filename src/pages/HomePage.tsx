import { PageWrapper } from '@/components/layout/PageWrapper';
import { HeroSection } from '@/components/home/HeroSection';
import { ContinueWatching } from '@/components/home/ContinueWatching';
import { TrendingRow } from '@/components/home/TrendingRow';
import { SeasonalGrid } from '@/components/home/SeasonalGrid';
import { GenreQuickNav } from '@/components/home/GenreQuickNav';
import { useTrending, useSeasonal, useUpcoming, useTop } from '@/hooks/useAnime';

export default function HomePage() {
  const trending = useTrending();
  const seasonal = useSeasonal();
  const top = useTop();
  const upcoming = useUpcoming();

  return (
    <PageWrapper>
      <HeroSection anime={trending.data || []} isLoading={trending.isLoading} />
      <ContinueWatching />
      <TrendingRow title="Trending Now" anime={trending.data?.slice(0, 12) || []} isLoading={trending.isLoading} showRank />
      <SeasonalGrid title="This Season" anime={seasonal.data?.slice(0, 12) || []} isLoading={seasonal.isLoading} />
      <TrendingRow title="Top Rated" anime={top.data?.slice(0, 12) || []} isLoading={top.isLoading} showRank />
      <TrendingRow title="Upcoming Anime" anime={upcoming.data?.slice(0, 12) || []} isLoading={upcoming.isLoading} />
      <GenreQuickNav />
    </PageWrapper>
  );
}
