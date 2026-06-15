import { PageWrapper } from '@/components/layout/PageWrapper';
import { HeroSection } from '@/components/home/HeroSection';
import { ContinueWatching } from '@/components/home/ContinueWatching';
import { TrendingRow } from '@/components/home/TrendingRow';
import { SeasonalGrid } from '@/components/home/SeasonalGrid';
import { GenreQuickNav } from '@/components/home/GenreQuickNav';
import { useTrending, useSeasonal, useUpcoming } from '@/hooks/useAnime';

export default function HomePage() {
  const trending = useTrending();
  const seasonal = useSeasonal();
  const upcoming = useUpcoming();

  return (
    <PageWrapper>
      <HeroSection anime={trending.data || []} isLoading={trending.isLoading} />
      <ContinueWatching />
      <TrendingRow title="Trending This Season" anime={seasonal.data || []} isLoading={seasonal.isLoading} showRank />
      <SeasonalGrid title="Popular Airing" anime={trending.data?.slice(0, 12) || []} isLoading={trending.isLoading} />
      <GenreQuickNav />
      <TrendingRow title="Upcoming Anime" anime={upcoming.data || []} isLoading={upcoming.isLoading} />
    </PageWrapper>
  );
}
