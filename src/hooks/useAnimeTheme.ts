import { useQuery } from '@tanstack/react-query';

interface ThemeVideo {
  link: string;
  resolution: number;
  tags: string;
}

interface ThemeEntry {
  version: number;
  videos: { nodes: ThemeVideo[] };
}

interface Theme {
  type: string;
  sequence: number;
  slug: string;
  animethemeentries: ThemeEntry[];
}

interface AnimeThemeResult {
  name: string;
  slug: string;
  animethemes: Theme[];
}

interface AnimeThemesResponse {
  data?: {
    findAnimeByExternalSite: AnimeThemeResult[];
  };
}

const QUERY = `
  query ($id: [Int!]) {
    findAnimeByExternalSite(site: ANILIST, id: $id) {
      name
      slug
      animethemes {
        type
        sequence
        slug
        animethemeentries {
          version
          videos {
            nodes {
              link
              resolution
              tags
            }
          }
        }
      }
    }
  }
`;

async function fetchThemeUrl(anilistId: number): Promise<string | null> {
  const res = await fetch('https://graphql.animethemes.moe/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { id: [anilistId] } }),
  });
  if (!res.ok) return null;
  const json: AnimeThemesResponse = await res.json();
  const anime = json?.data?.findAnimeByExternalSite?.[0];
  if (!anime?.animethemes?.length) return null;

  for (const theme of anime.animethemes) {
    if (theme.type !== 'OP') continue;
    for (const entry of theme.animethemeentries) {
      const videos = entry.videos?.nodes || [];
      const preferred = videos.find((v) => v.resolution >= 1080 && !v.tags?.includes('BGM'));
      if (preferred?.link) return preferred.link;
      const anyVideo = videos.find((v) => v.link);
      if (anyVideo?.link) return anyVideo.link;
    }
  }
  return null;
}

export function useAnimeTheme(anilistId: number | undefined) {
  return useQuery({
    queryKey: ['animeTheme', anilistId],
    queryFn: () => fetchThemeUrl(anilistId!),
    enabled: !!anilistId,
    staleTime: 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: 1,
  });
}
