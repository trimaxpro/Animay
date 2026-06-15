import { useQuery } from '@tanstack/react-query';
import * as animeApi from '@/api/anime';

export function useTrending() {
  return useQuery({
    queryKey: ['anime', 'trending'],
    queryFn: animeApi.getTrending,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
  });
}

export function useSeasonal() {
  return useQuery({
    queryKey: ['anime', 'seasonal'],
    queryFn: animeApi.getSeasonal,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
  });
}

export function useUpcoming() {
  return useQuery({
    queryKey: ['anime', 'upcoming'],
    queryFn: animeApi.getUpcoming,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useTop() {
  return useQuery({
    queryKey: ['anime', 'top'],
    queryFn: animeApi.getTop,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });
}

export function useAnimeDetail(id: number) {
  return useQuery({
    queryKey: ['anime', 'detail', id],
    queryFn: () => animeApi.getAnimeDetail(id),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!id,
    retry: 3,
  });
}

export function useAnimeEpisodes(id: number) {
  return useQuery({
    queryKey: ['anime', 'episodes', id],
    queryFn: () => animeApi.getAnimeEpisodes(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 3,
  });
}

export function useSkipTimes(malId: number, episode: number) {
  return useQuery({
    queryKey: ['skipTimes', malId, episode],
    queryFn: () => animeApi.getSkipTimes(malId, episode),
    staleTime: 60 * 60 * 1000,
    enabled: !!malId && !!episode,
    retry: 1,
  });
}

export function useRecommendations(id: number) {
  return useQuery({
    queryKey: ['anime', 'recommendations', id],
    queryFn: () => animeApi.getRecommendations(id),
    staleTime: 30 * 60 * 1000,
    enabled: !!id,
    retry: 2,
  });
}
