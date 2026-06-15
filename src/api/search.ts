import { apiClient } from './client';
import type { Anime } from '@/types/anime';
import type { PaginatedResponse } from '@/types/api';

export async function searchAnime(query: string, page = 1): Promise<PaginatedResponse<Anime>> {
  const { data } = await apiClient.get<PaginatedResponse<Anime>>('/search', {
    params: { q: query, page },
  });
  return data;
}
