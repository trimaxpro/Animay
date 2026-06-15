import { apiClient } from './client';
import type { Episode } from '@/types/anime';

export async function getEpisodes(animeId: number): Promise<Episode[]> {
  const { data } = await apiClient.get<{ data: Episode[] }>(`/anime/${animeId}/episodes`);
  return data.data;
}
