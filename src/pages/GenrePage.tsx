import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AnimeGrid } from '@/components/browse/AnimeGrid';
import { DotPattern } from '@/components/ui/DotPattern';
import { GENRES } from '@/utils/constants';
import { apiClient } from '@/api/client';
import type { Anime } from '@/types/anime';

export default function GenrePage() {
  const { slug } = useParams<{ slug: string }>();
  const genre = GENRES.find((g) => g.slug === slug);

  const { data, isLoading } = useQuery({
    queryKey: ['genre', slug],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Anime[] }>(`/browse?genres=${genre?.id || ''}&limit=25`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!genre,
  });

  return (
    <PageWrapper className="pt-24 pb-12">
      <div className="relative mb-8 px-4">
        <DotPattern opacity={0.3} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary capitalize">{genre?.name || slug} Anime</h1>
          <p className="text-text-secondary text-sm mt-1">{data?.data?.length || 0} anime in {genre?.name || slug}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <AnimeGrid anime={data?.data || []} isLoading={isLoading} />
      </div>
    </PageWrapper>
  );
}
