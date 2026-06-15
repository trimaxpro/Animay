import { useQuery } from '@tanstack/react-query';
import { searchAnime } from '@/api/search';

export function useSearch(query: string, page = 1) {
  return useQuery({
    queryKey: ['search', query, page],
    queryFn: () => searchAnime(query, page),
    staleTime: 2 * 60 * 1000,
    enabled: !!query.trim(),
    retry: 2,
  });
}
