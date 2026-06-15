import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { type FilterState } from '@/components/browse/FilterPanel';
import { FilterBar } from '@/components/browse/FilterBar';
import { SortBar } from '@/components/browse/SortBar';
import { AnimeGrid } from '@/components/browse/AnimeGrid';
import { DotPattern } from '@/components/ui/DotPattern';
import { apiClient } from '@/api/client';
import type { Anime } from '@/types/anime';

export default function BrowsePage() {
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    status: '',
    season: '',
    year: '',
    score: '',
    genres: [],
    sort: 'popularity',
  });
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    if (filters.type) params.set('type', filters.type);
    if (filters.status) params.set('status', filters.status);
    if (filters.season) params.set('season', filters.season);
    if (filters.year) params.set('year', filters.year);
    if (filters.score) params.set('score', filters.score);
    if (filters.genres.length > 0) params.set('genres', filters.genres.join(','));
    if (filters.sort) {
      const sortMap: Record<string, string> = { popularity: 'popularity', score: 'score', start_date: 'start_date', title: 'title' };
      params.set('sort', sortMap[filters.sort] || 'popularity');
    }
    params.set('page', String(page));
    return params.toString();
  }, [filters, page]);

  const { data, isLoading } = useQuery({
    queryKey: ['browse', filters, page],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Anime[]; pagination: { last_visible_page: number; has_next_page: boolean; items: { total: number } } }>(`/browse?${buildQuery()}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <PageWrapper className="pt-24 pb-12">
      <div className="relative mb-6 px-4">
        <DotPattern opacity={0.3} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary">Browse Anime</h1>
          <p className="text-text-secondary text-sm mt-1 mb-4">Discover your next favorite series</p>
          <FilterBar filters={filters} onChange={handleFilterChange} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <SortBar
          resultCount={data?.pagination?.items?.total || 0}
          sort={filters.sort}
          onSortChange={(sort) => setFilters((f) => ({ ...f, sort }))}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <AnimeGrid anime={data?.data || []} isLoading={isLoading} viewMode={viewMode} />

        {data?.pagination?.has_next_page && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="px-6 py-2 rounded-card bg-elevated border border-border-subtle text-sm text-text-secondary hover:border-border-glow hover:text-text-primary transition-all"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
