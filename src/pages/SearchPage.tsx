import { useSearchParams } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { SearchBar } from '@/components/search/SearchBar';
import { AnimeGrid } from '@/components/browse/AnimeGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchX, Search } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { data, isLoading } = useSearch(query);

  return (
    <PageWrapper className="pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <SearchBar initialQuery={query} />

        <div className="mt-8">
          {query && (
            <h1 className="font-display font-bold text-2xl text-text-primary mb-6 flex items-center gap-2">
              <Search className="w-6 h-6 text-accent-glow stroke-[1.5]" /> Results for: <span className="text-accent-glow">{query}</span>
            </h1>
          )}

          {!isLoading && query && data?.data?.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No results found"
              message={`No anime found for '${query}'. Try broader terms like Naruto, Attack on Titan, or One Piece.`}
            />
          ) : (
            <AnimeGrid anime={data?.data || []} isLoading={isLoading} />
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
