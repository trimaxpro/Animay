import { apiClient } from './client';
import type { Anime } from '@/types/anime';

export async function getSchedule(day: string): Promise<Anime[]> {
  const { data } = await apiClient.get<{ data: Anime[] }>(`/schedule/${day}`);
  return data.data;
}

export async function getGenres() {
  const { data } = await apiClient.get<{ data: { mal_id: number; name: string; url: string; count: number }[] }>('/genres');
  return data.data;
}
