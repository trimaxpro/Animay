import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { type FilterState } from '@/components/browse/FilterPanel';
import { FilterBar } from '@/components/browse/FilterBar';
import { SortBar } from '@/components/browse/SortBar';
import { AnimeGrid } from '@/components/browse/AnimeGrid';
import { DotPattern } from '@/components/ui/DotPattern';
import { Compass, ChevronDown } from 'lucide-react';
import { useBrowse } from '@/hooks/useAnime';

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

  const { data, isLoading } = useBrowse({ ...filters, page });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <PageWrapper className="pt-24 pb-12">
      <div className="relative mb-6 px-4">
        <DotPattern opacity={0.3} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary flex items-center gap-3"><Compass className="w-8 h-8 text-accent-glow stroke-[1.5]" /> Browse Anime</h1>
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
                  className="flex items-center gap-1.5 px-6 py-2 rounded-card bg-elevated border border-border-subtle text-sm text-text-secondary hover:border-border-glow hover:text-text-primary transition-all"
                >
                  <ChevronDown className="w-4 h-4 stroke-[1.5]" /> Load More
                </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
