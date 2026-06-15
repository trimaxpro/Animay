import { apiClient } from './client';
import type { Anime, Character, Episode } from '@/types/anime';

export async function getTrending(): Promise<Anime[]> {
  const { data } = await apiClient.get<{ data: Anime[] }>('/anime/trending');
  return data.data;
}

export async function getSeasonal(): Promise<Anime[]> {
  const { data } = await apiClient.get<{ data: Anime[] }>('/anime/seasonal');
  return data.data;
}

export async function getUpcoming(): Promise<Anime[]> {
  const { data } = await apiClient.get<{ data: Anime[] }>('/anime/upcoming');
  return data.data;
}

export async function getTop(): Promise<Anime[]> {
  const { data } = await apiClient.get<{ data: Anime[] }>('/anime/top');
  return data.data;
}

export async function getAnimeDetail(id: number): Promise<Anime & { characters: Character[] }> {
  const { data } = await apiClient.get<Anime & { characters: Character[] }>(`/anime/${id}`);
  return data;
}

export async function getAnimeEpisodes(id: number): Promise<Episode[]> {
  const { data } = await apiClient.get<{ data: Episode[] }>(`/anime/${id}/episodes`);
  return data.data;
}

export async function getSkipTimes(malId: number, episode: number) {
  try {
    const { data } = await apiClient.get(`/anime/${malId}/episodes/${episode}/skiptimes`);
    return data;
  } catch {
    return [];
  }
}

export async function getRecommendations(id: number): Promise<Anime[]> {
  const { data } = await apiClient.get<{ data: { entry: Anime }[] }>(`/anime/${id}/recommendations`);
  return data.data?.map((r: { entry: Anime }) => r.entry) || [];
}
