const MAL_BASE = "https://api.myanimelist.net/v2";
const JIKAN_BASE = "https://api.jikan.moe/v4";
const KITSU_BASE = "https://kitsu.io/api/edge";
const ANISKIP_BASE = "https://api.aniskip.com/v2";
const ANILIST_GRAPHQL = "https://graphql.anilist.co";
const ANIMESCHEDULE_BASE = "https://animeschedule.net/api/v3";

const CORS_ORIGIN = "*";

const cache = new Map<string, { data: unknown; expires: number }>();

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (entry && entry.expires > Date.now()) return entry.data;
  if (entry) cache.delete(key);
  return null;
}

function setCache(key: string, data: unknown, ttlMs: number) {
  cache.set(key, { data, expires: Date.now() + ttlMs });
  if (cache.size > 500) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
}

// === Smart resilient fetch system ===

type RateLimitState = {
  lastRequest: number;
  cooldownUntil: number;
  consecutive429s: number;
};

const rateLimits: Record<string, RateLimitState> = {
  mal:    { lastRequest: 0, cooldownUntil: 0, consecutive429s: 0 },
  jikan:  { lastRequest: 0, cooldownUntil: 0, consecutive429s: 0 },
  kitsu:  { lastRequest: 0, cooldownUntil: 0, consecutive429s: 0 },
  anilist:{ lastRequest: 0, cooldownUntil: 0, consecutive429s: 0 },
};

const MIN_INTERVALS: Record<string, number> = {
  mal:     500,
  jikan:   400,
  kitsu:   200,
  anilist: 300,
};

const MAX_BACKOFF = 16000;

async function rateLimitedFetch(
  source: string,
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const state = rateLimits[source];
  if (!state) return fetch(url, options);

  // If source is in cooldown, throw immediately
  if (state.cooldownUntil > Date.now()) {
    throw new Error(`${source} in cooldown for ${state.cooldownUntil - Date.now()}ms`);
  }

  // Enforce minimum interval between requests
  const elapsed = Date.now() - state.lastRequest;
  if (elapsed < MIN_INTERVALS[source]) {
    await new Promise(r => setTimeout(r, MIN_INTERVALS[source] - elapsed));
  }

  state.lastRequest = Date.now();
  let attempt = 0;

  while (attempt < 3) {
    attempt++;
    try {
      const res = await fetch(url, options);

      if (res.status === 429) {
        state.consecutive429s++;
        const backoff = Math.min(1000 * Math.pow(2, state.consecutive429s - 1), MAX_BACKOFF);
        state.cooldownUntil = Date.now() + backoff + Math.random() * 1000;
        throw new Error(`${source} rate limited (429), cooling down for ${backoff}ms`);
      }

      state.consecutive429s = 0;
      return res;
    } catch (err) {
      // Retry on transient network errors (not 429, which is already handled)
      if (attempt < 3 && err instanceof Error && !err.message.includes('rate limited')) {
        const delay = Math.min(500 * Math.pow(2, attempt - 1) + Math.random() * 500, 4000);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }

  throw new Error(`${source} failed after ${attempt} attempts`);
}

type ApiSource = {
  name: string;
  fetch: () => Promise<Response>;
  transform: (raw: any) => any;
  validate: (raw: any) => boolean;
};

async function fetchWithFallback<T>(
  sources: { name: string; fetch: () => Promise<Response>; transform: (raw: any) => T; validate?: (raw: any) => boolean }[],
  cacheKey: string,
  cacheTtl: number = 300000
): Promise<T> {
  const cached = getCached(cacheKey);
  if (cached) return cached as T;

  let lastError: Error | null = null;

  for (const source of sources) {
    try {
      const res = await source.fetch();
      if (!res.ok) {
        if (res.status === 429) continue;
        lastError = new Error(`${source.name} returned ${res.status}`);
        continue;
      }
      const raw = await res.json();
      if (source.validate && !source.validate(raw)) {
        lastError = new Error(`${source.name} returned invalid data`);
        continue;
      }
      const data = source.transform(raw);
      setCache(cacheKey, data, cacheTtl);
      return data;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      // continue to next source
    }
  }

  throw lastError || new Error("All sources exhausted");
}

function malHeaders(clientId: string) {
  return { "X-MAL-CLIENT-ID": clientId };
}

function makeMalFetch<T>(path: string, clientId: string): () => Promise<Response> {
  return () => rateLimitedFetch("mal", `${MAL_BASE}${path}`, { headers: malHeaders(clientId) });
}

function makeJikanFetch(path: string): () => Promise<Response> {
  return () => rateLimitedFetch("jikan", `${JIKAN_BASE}${path}`);
}

function makeKitsuFetch(path: string): () => Promise<Response> {
  return () => rateLimitedFetch("kitsu", `${KITSU_BASE}${path}`, {
    headers: { "Accept": "application/vnd.api+json", "Content-Type": "application/vnd.api+json" },
  });
}

function makeAniListFetch(query: string, variables: Record<string, any>): () => Promise<Response> {
  return () => rateLimitedFetch("anilist", ANILIST_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
}

async function fetchAniListInfo(malId: number): Promise<{ anilist_id?: number; banner_image?: string; description?: string; al_trailer?: { youtube_id: string | null; url: string | null } } | null> {
  const query = `
    query ($idMal: Int) {
      Media (idMal: $idMal, type: ANIME) {
        id
        bannerImage
        description
        trailer {
          id
          site
        }
      }
    }
  `;

  try {
    const res = await makeAniListFetch(query, { idMal: malId })();
    if (!res.ok) return null;
    const body = await res.json() as any;
    const media = body?.data?.Media;
    if (!media) return null;

    const cleanDescription = media.description ? media.description.replace(/<[^>]*>/g, "") : undefined;

    return {
      anilist_id: media.id || undefined,
      banner_image: media.bannerImage || undefined,
      description: cleanDescription,
      al_trailer: media.trailer?.site === "youtube" ? { youtube_id: media.trailer.id, url: `https://www.youtube.com/watch?v=${media.trailer.id}` } : undefined,
    };
  } catch (e) {
    return null;
  }
}

function setCors(res: any) {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

async function malFetch<T = unknown>(path: string, clientId: string): Promise<T> {
  const cacheKey = `mal:${path}`;
  const cached = getCached(cacheKey);
  if (cached) return cached as T;

  const fetcher = makeMalFetch(path, clientId);
  const res = await fetcher();
  if (!res.ok) throw new Error(`MAL API error: ${res.status}`);
  const data = await res.json() as T;
  setCache(cacheKey, data, 300000);
  return data;
}

async function jikanFetch<T = unknown>(path: string): Promise<T> {
  const cacheKey = `jikan:${path}`;
  const cached = getCached(cacheKey);
  if (cached) return cached as T;

  const fetcher = makeJikanFetch(path);
  const res = await fetcher();
  if (!res.ok) throw new Error(`Jikan error: ${res.status}`);
  const data = await res.json() as T;
  setCache(cacheKey, data, 300000);
  return data;
}

async function kitsuFetch<T = unknown>(path: string): Promise<T> {
  const cacheKey = `kitsu:${path}`;
  const cached = getCached(cacheKey);
  if (cached) return cached as T;

  const fetcher = makeKitsuFetch(path);
  const res = await fetcher();
  if (!res.ok) throw new Error(`Kitsu error: ${res.status}`);
  const data = await res.json() as T;
  setCache(cacheKey, data, 600000);
  return data;
}

const LIST_FIELDS = "id,title,main_picture,alternative_titles,mean,rank,popularity,num_episodes,media_type,status,genres,start_season,average_episode_duration,rating,trailer,synopsis";
const DETAIL_FIELDS = "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,num_episodes,status,media_type,genres,studios,start_season,broadcast,source,average_episode_duration,rating,related_anime,recommendations,characters,statistics,trailer";

function malStatus(s: string): string {
  return { currently_airing: "Airing", finished_airing: "Completed", not_yet_aired: "Upcoming" }[s] || s;
}

function malMediaType(t: string): string {
  return { tv: "TV", movie: "Movie", ova: "OVA", ona: "ONA", special: "Special", music: "Music" }[t] || t;
}

function extractNodes(data: { data?: { node?: Record<string, unknown> }[] }): Record<string, unknown>[] {
  return (data?.data || []).map((item: { node?: Record<string, unknown>; ranking?: Record<string, unknown> }) => {
    const node = item.node || {};
    if (item.ranking) node.rank = item.ranking.rank;
    return node;
  });
}

function normalizeMal(item: Record<string, unknown>): Record<string, unknown> {
  const isJikan = 'mal_id' in item && !('id' in item);

  if (isJikan) {
    const images = item.images as any || {};
    const rawTrailer = item.trailer as Record<string, unknown> | null;
    const trailerData = rawTrailer ? {
      youtube_id: (rawTrailer.youtube_id || null) as string | null,
      url: (rawTrailer.url || null) as string | null,
    } : null;

    return {
      mal_id: item.mal_id as number,
      title: item.title as string || "Unknown",
      title_english: (item.title_english || null) as string | null,
      title_japanese: (item.title_japanese || null) as string | null,
      images: {
        jpg: { 
          image_url: images.jpg?.image_url || null, 
          large_image_url: images.jpg?.large_image_url || images.jpg?.image_url || null 
        },
        webp: { 
          image_url: images.webp?.image_url || null, 
          large_image_url: images.webp?.large_image_url || images.webp?.image_url || null 
        },
      },
      type: (item.type || null) as string | null,
      episodes: (item.episodes || null) as number | null,
      status: (item.status || null) as string | null,
      score: (item.score || null) as number | null,
      scored_by: (item.scored_by || null) as number | null,
      rank: (item.rank || null) as number | null,
      popularity: (item.popularity || null) as number | null,
      members: (item.members || null) as number | null,
      favorites: (item.favorites || null) as number | null,
      synopsis: (item.synopsis || null) as string | null,
      season: (item.season || null) as string | null,
      year: (item.year || null) as number | null,
      aired: item.aired || { from: null, to: null, string: "?" },
      broadcast: item.broadcast || null,
      studios: (item.studios || []) as any[],
      genres: (item.genres || []) as any[],
      themes: (item.themes || []) as any[],
      source: (item.source || null) as string | null,
      rating: (item.rating || null) as string | null,
      duration: (item.duration || null) as string | null,
      trailer: trailerData,
      relations: (item.relations || []) as any[],
    };
  }

  const mp = item.main_picture as Record<string, string | null> || {};
  const alt = item.alternative_titles as Record<string, string | null> || {};
  const season = item.start_season as Record<string, unknown> || {};
  const airedFrom = item.start_date as string | null;
  const airedTo = item.end_date as string | null;
  const bc = item.broadcast as Record<string, string | null> || null;
  const dur = item.average_episode_duration as number | null;
  
  const rawTrailer = item.trailer as Record<string, unknown> | null;
  const trailerData = rawTrailer ? {
    youtube_id: (rawTrailer.youtube_id || null) as string | null,
    url: (rawTrailer.url || null) as string | null,
  } : null;

  return {
    mal_id: item.id as number,
    title: alt.en || item.title as string || "Unknown",
    title_english: alt.en || null,
    title_japanese: alt.ja || null,
    images: {
      jpg: { image_url: mp.medium || null, large_image_url: mp.large || mp.medium || null },
      webp: { image_url: mp.medium || null, large_image_url: mp.large || mp.medium || null },
    },
    type: item.media_type ? malMediaType(item.media_type as string) : null,
    episodes: item.num_episodes as number | null,
    status: item.status ? malStatus(item.status as string) : null,
    score: item.mean as number || null,
    scored_by: item.num_scoring_users as number || null,
    rank: item.rank as number || null,
    popularity: item.popularity as number || null,
    members: item.num_list_users as number || null,
    favorites: null,
    synopsis: item.synopsis as string || null,
    season: season.season ? String(season.season).charAt(0).toUpperCase() + String(season.season).slice(1) : null,
    year: season.year as number || null,
    aired: {
      from: airedFrom || null,
      to: airedTo || null,
      string: `${airedFrom || "?"} to ${airedTo || "?"}`,
    },
    broadcast: bc ? { day: bc.day_of_the_week || null, time: bc.start_time || null } : null,
    studios: (item.studios as Array<Record<string, unknown>> || []).map((s: Record<string, unknown>) => ({ mal_id: s.id as number, name: s.name as string })),
    genres: (item.genres as Array<Record<string, unknown>> || []).map((g: Record<string, unknown>) => ({ mal_id: g.id as number, name: g.name as string })),
    themes: [],
    source: item.source as string || null,
    rating: item.rating as string || null,
    duration: dur ? `${Math.round(dur / 60)} min per ep` : null,
    trailer: trailerData,
    relations: (item.related_anime as Array<Record<string, unknown>> || []).map((r: Record<string, unknown>) => {
      const rn = r.node as Record<string, unknown> || {};
      return {
        relation: (r.relation_type as string) || "",
        entry: [{ mal_id: rn.id as number, name: (rn.title as string) || "Unknown", type: malMediaType((rn.media_type as string) || "") }],
      };
    }),
  };
}

function parseChars(item: Record<string, unknown>): Record<string, unknown>[] {
  const chars = item.characters as Array<Record<string, unknown>> || [];
  return chars.map((c: Record<string, unknown>) => {
    const ch = c.character as Record<string, unknown> || {};
    const chmp = ch.main_picture as Record<string, string | null> || {};
    const vas = c.voice_actors as Array<Record<string, unknown>> || [];
    return {
      mal_id: ch.id as number,
      name: ch.name as string || "Unknown",
      images: { jpg: { image_url: chmp.medium || null } },
      role: c.role === "main" ? "Main" : "Supporting",
      voice_actors: vas.map((va: Record<string, unknown>) => {
        const vp = va.person as Record<string, unknown> || {};
        const vpmp = vp.main_picture as Record<string, string | null> || {};
        return {
          person: { mal_id: vp.id as number, name: (vp.name as string) || "Unknown", images: { jpg: { image_url: vpmp.medium || null } } },
          language: (va.language as string) || "Japanese",
        };
      }),
    };
  });
}

function malPagination(data: { paging?: { next?: string } }, limit: number, offset: number) {
  const hasNext = !!data?.paging?.next;
  const currentPage = Math.floor(offset / limit) + 1;
  return {
    last_visible_page: hasNext ? currentPage + 10 : currentPage,
    has_next_page: hasNext,
    current_page: currentPage,
    items: { count: 0, total: 0, per_page: limit },
  };
}

function getSeason() {
  const now = new Date();
  const m = now.getMonth() + 1;
  const y = now.getFullYear();
  const seasons = ["winter", "spring", "summer", "fall"];
  const idx = Math.floor((m % 12) / 3);
  return { current: seasons[idx], year: y, next: seasons[(idx + 1) % 4], nextYear: (idx + 1) % 4 === 0 ? y + 1 : y };
}

export default async function handler(req: any, res: any) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: true, code: "METHOD_NOT_ALLOWED", message: "Only GET is allowed" });
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  let apiPath = url.pathname.replace(/^\/api/, "") || "/";
  const rawPath = url.searchParams.get("path");
  if (rawPath) {
    apiPath = rawPath.startsWith("/") ? rawPath : "/" + rawPath;
  }
  apiPath = apiPath.replace(/\/index\.ts$/, "") || "/";
  const malClientId = process.env.MAL_CLIENT_ID || "";

  try {
    if (apiPath === "/health") {
      return res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
    }

    if (apiPath === "/avatar/waifu" || apiPath === "/random-avatar") {
      try {
        const response = await fetch("https://nekos.best/api/v2/neko", {
          headers: {
            "User-Agent": "MikuAnime/1.0.0 (https://github.com/trimaxpro/MikuAnime)",
            "Accept": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Nekos API returned status ${response.status}`);
        }
        const data = await response.json() as any;
        const imageUrl = data.results?.[0]?.url;
        if (!imageUrl) {
          throw new Error("No image URL returned from Nekos API");
        }
        return res.status(200).json({ url: imageUrl });
      } catch (err) {
        console.error("Failed to fetch random avatar from API, using fallback:", err);
        return res.status(200).json({
          url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&h=150&fit=crop"
        });
      }
    }

    if (apiPath === "/clearcache") {
      cache.clear();
      return res.status(200).json({ status: "ok", message: "Cache cleared" });
    }

    if (apiPath === "/anime/trending") {
      let items: any[];
      try {
        const data = await malFetch<{ data: { node?: Record<string, unknown>; ranking?: Record<string, unknown> }[] }>(`/anime/ranking?ranking_type=bypopularity&limit=100&fields=${LIST_FIELDS}`, malClientId);
        items = extractNodes(data).map(normalizeMal);
      } catch (err) {
        const data = await jikanFetch<{ data: Record<string, unknown>[] }>("/top/anime?filter=bypopularity&limit=25");
        items = data.data.map(normalizeMal);
      }

      const topItems = items.slice(0, 10);
      await Promise.all(topItems.map(async (item) => {
        const alInfo = await fetchAniListInfo(item.mal_id);
        if (alInfo) {
          item.anilist_id = alInfo.anilist_id;
          item.banner_image = alInfo.banner_image;
          if (alInfo.description) {
            item.synopsis = alInfo.description;
          }
          if (alInfo.al_trailer?.youtube_id) {
            item.trailer = alInfo.al_trailer;
          }
        }
      }));

      return res.status(200).json({ data: items });
    }

    if (apiPath === "/anime/seasonal") {
      const { current, year } = getSeason();
      try {
        const data = await malFetch<{ data: { node?: Record<string, unknown> }[] }>(`/anime/seasonal/${year}/${current}?limit=100&fields=${LIST_FIELDS}`, malClientId);
        const items = extractNodes(data);
        return res.status(200).json({ data: items.map(normalizeMal) });
      } catch (err) {
        const data = await jikanFetch<{ data: Record<string, unknown>[] }>(`/seasons/${year}/${current}?limit=25`);
        return res.status(200).json({ data: data.data.map(normalizeMal) });
      }
    }

    if (apiPath === "/anime/upcoming") {
      const { next, nextYear } = getSeason();
      try {
        const data = await malFetch<{ data: { node?: Record<string, unknown> }[] }>(`/anime/seasonal/${nextYear}/${next}?limit=100&fields=${LIST_FIELDS}`, malClientId);
        const items = extractNodes(data);
        return res.status(200).json({ data: items.map(normalizeMal) });
      } catch (err) {
        const data = await jikanFetch<{ data: Record<string, unknown>[] }>(`/seasons/${nextYear}/${next}?limit=25`);
        return res.status(200).json({ data: data.data.map(normalizeMal) });
      }
    }

    if (apiPath === "/anime/top") {
      try {
        const data = await malFetch<{ data: { node?: Record<string, unknown>; ranking?: Record<string, unknown> }[] }>(`/anime/ranking?ranking_type=all&limit=100&fields=${LIST_FIELDS}`, malClientId);
        const items = extractNodes(data);
        return res.status(200).json({ data: items.map(normalizeMal) });
      } catch (err) {
        const data = await jikanFetch<{ data: Record<string, unknown>[] }>("/top/anime?limit=25");
        return res.status(200).json({ data: data.data.map(normalizeMal) });
      }
    }

    const animeDetailMatch = apiPath.match(/^\/anime\/(\d+)$/);
    if (animeDetailMatch) {
      const id = animeDetailMatch[1];
      const cacheKey = `detail:${id}`;
      const cached = getCached(cacheKey);
      if (cached) return res.status(200).json(cached);

      let normalized: Record<string, any>;
      let chars: any[] = [];
      try {
        const data = await malFetch<Record<string, unknown>>(`/anime/${id}?fields=${DETAIL_FIELDS}`, malClientId);
        normalized = normalizeMal(data);
        chars = parseChars(data);
      } catch (err) {
        const jikanData = await jikanFetch<{ data: Record<string, unknown> }>(`/anime/${id}`);
        normalized = normalizeMal(jikanData.data);
        try {
          const charData = await jikanFetch<{ data: any[] }>(`/anime/${id}/characters`);
          chars = (charData.data || []).slice(0, 15).map((c: any) => {
            const va = c.voice_actors?.find((v: any) => v.language === 'Japanese');
            return {
              mal_id: c.character.mal_id,
              name: c.character.name,
              images: { jpg: { image_url: c.character.images?.jpg?.image_url || null } },
              role: c.role,
              voice_actors: va ? [{
                person: {
                  mal_id: va.person.mal_id,
                  name: va.person.name,
                  images: { jpg: { image_url: va.person.images?.jpg?.image_url || null } }
                },
                language: 'Japanese'
              }] : []
            };
          });
        } catch {
          chars = [];
        }
      }

      normalized.characters = chars;

      const alInfo = await fetchAniListInfo(normalized.mal_id);
      if (alInfo) {
        normalized.anilist_id = alInfo.anilist_id;
        normalized.banner_image = alInfo.banner_image;
        if (alInfo.description) {
          normalized.synopsis = alInfo.description;
        }
        if (alInfo.al_trailer?.youtube_id) {
          normalized.trailer = alInfo.al_trailer;
        }
      }

      setCache(cacheKey, normalized, 600000);
      return res.status(200).json(normalized);
    }

    const episodesMatch = apiPath.match(/^\/anime\/(\d+)\/episodes$/);
    if (episodesMatch) {
      const id = episodesMatch[1];
      const malId = parseInt(id);

      let episodes: Record<string, unknown>[] = [];
      let totalEpisodes: number | null = null;

      // 1. AniList: best air dates via airingSchedule
      try {
        const alQuery = `
          query ($idMal: Int) {
            Media(idMal: $idMal, type: ANIME) {
              id
              episodes
              airingSchedule(perPage: 50) {
                nodes {
                  episode
                  airingAt
                }
              }
            }
          }
        `;
        const alRes = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ query: alQuery, variables: { idMal: malId } }),
        });

        if (alRes.ok) {
          const alBody = await alRes.json() as any;
          const media = alBody?.data?.Media;
          if (media) {
            const schedule = media.airingSchedule?.nodes || [];
            const now = Math.floor(Date.now() / 1000);

            episodes = schedule.map((s: any) => ({
              mal_id: s.episode,
              title: `Episode ${s.episode}`,
              episode: s.episode,
              aired: s.airingAt <= now ? new Date(s.airingAt * 1000).toISOString() : null,
              filler: false,
              recap: false,
              forum_url: null,
            }));

            totalEpisodes = (media.episodes as number) || null;
          }
        }
      } catch {}

      // 2. Always try MAL for totalEpisodes (most reliable count)
      if (!totalEpisodes) {
        try {
          const detailData = await malFetch<Record<string, unknown>>(`/anime/${id}?fields=num_episodes`, malClientId);
          totalEpisodes = detailData.num_episodes as number | null;
        } catch {}
      }

      // 3. If AniList returned nothing, try Kitsu (10k req/day, no auth)
      if (episodes.length === 0) {
        try {
          const kitsuMap = await kitsuFetch<{ data: { id: string }[] }>(`/anime?filter[malId]=${malId}&page[limit]=1`);
          const kitsuId = kitsuMap.data?.[0]?.id;
          if (kitsuId) {
            const epData = await kitsuFetch<{ data: any[] }>(`/anime/${kitsuId}/episodes?page[limit]=200&sort=number`);
            const now = new Date();
            episodes = (epData.data || []).map((ep: any) => ({
              mal_id: ep.attributes.number,
              title: ep.attributes.titles?.en_us || ep.attributes.titles?.en_jp || ep.attributes.canonicalTitle || `Episode ${ep.attributes.number}`,
              episode: ep.attributes.number,
              aired: ep.attributes.airdate && new Date(ep.attributes.airdate) <= now ? new Date(ep.attributes.airdate).toISOString() : null,
              filler: ep.attributes.filler || false,
              recap: ep.attributes.recap || false,
              forum_url: null,
            }));
          }
        } catch {}
      }

      // 4. If still no episodes, try Jikan
      if (episodes.length === 0) {
        try {
          const epData = await jikanFetch<{ data: Record<string, unknown>[] }>(`/anime/${id}/episodes`);
          episodes = (epData.data || []).map((ep: Record<string, unknown>) => ({
            ...ep,
            episode: ep.mal_id ?? ep.episode,
          }));
        } catch {}
      }

      // 5. Try Jikan for totalEpisodes if still unknown
      if (!totalEpisodes) {
        try {
          const jikanDetail = await jikanFetch<{ data: Record<string, unknown> }>(`/anime/${id}`);
          totalEpisodes = jikanDetail.data?.episodes as number | null;
        } catch {}
      }

      // 6. Derive total from max episode as last resort
      if (!totalEpisodes && episodes.length > 0) {
        totalEpisodes = Math.max(...episodes.map((ep: Record<string, unknown>) => ep.episode as number));
      }

      // 7. Fill in missing episodes so front-end knows the full range
      if (totalEpisodes) {
        const existingNums = new Set(episodes.map((ep: Record<string, unknown>) => ep.episode as number));
        for (let i = 1; i <= totalEpisodes; i++) {
          if (!existingNums.has(i)) {
            episodes.push({
              mal_id: i,
              title: `Episode ${i}`,
              episode: i,
              aired: null,
              filler: false,
              recap: false,
              forum_url: null,
            });
          }
        }
        episodes.sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.episode as number) - (b.episode as number));
      }

      return res.status(200).json({ data: episodes });
    }

    const skipTimesMatch = apiPath.match(/^\/anime\/(\d+)\/episodes\/(\d+)\/skiptimes$/);
    if (skipTimesMatch) {
      const malId = skipTimesMatch[1];
      const epNum = skipTimesMatch[2];
      const cacheKey = `skiptimes:${malId}:${epNum}`;
      const cached = getCached(cacheKey);
      if (cached) return res.status(200).json(cached);

      const response = await fetch(`${ANISKIP_BASE}/skip-times/${malId}/${epNum}?types=op&types=ed`);
      const data = response.ok ? await response.json() : [];
      setCache(cacheKey, data, 3600000);
      return res.status(200).json(data);
    }

    const recommendationsMatch = apiPath.match(/^\/anime\/(\d+)\/recommendations$/);
    if (recommendationsMatch) {
      const id = recommendationsMatch[1];
      const cacheKey = `recs:${id}`;
      const cached = getCached(cacheKey);
      if (cached) return res.status(200).json(cached);

      const data = await jikanFetch<{ data: any[] }>(`/anime/${id}/recommendations`);
      const recs = (data.data || []).map((r: any) => {
        const entry = r.entry || {};
        return {
          entry: {
            mal_id: entry.mal_id,
            title: entry.title || "Unknown",
            title_english: null, title_japanese: null,
            images: {
              jpg: { image_url: entry.images?.jpg?.image_url || null, large_image_url: entry.images?.jpg?.large_image_url || null },
              webp: { image_url: entry.images?.webp?.image_url || null, large_image_url: entry.images?.webp?.large_image_url || null }
            },
            type: null, episodes: null, status: null, score: null,
            scored_by: null, rank: null, popularity: null, members: null, favorites: null, synopsis: null,
            season: null, year: null, aired: { from: null, to: null, string: "?" }, broadcast: null,
            studios: [], genres: [], themes: [], source: null, rating: null, duration: null, trailer: null, relations: []
          }
        };
      });
      const result = { data: recs };
      setCache(cacheKey, result, 600000);
      return res.status(200).json(result);
    }

    if (apiPath === "/search") {
      const q = url.searchParams.get("q") || "";
      const page = parseInt(url.searchParams.get("page") || "1");
      const limit = parseInt(url.searchParams.get("limit") || "25");
      const offset = (page - 1) * limit;
      try {
        const data = await malFetch<{ data: { node?: Record<string, unknown> }[]; paging?: { next?: string } }>(
          `/anime?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}&fields=${LIST_FIELDS}`, malClientId
        );
        const items = extractNodes(data);
        return res.status(200).json({
          data: items.map(normalizeMal),
          pagination: malPagination(data, limit, offset),
        });
      } catch (err) {
        const data = await jikanFetch<{ data: Record<string, unknown>[]; pagination: Record<string, unknown> }>(
          `/anime?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`
        );
        return res.status(200).json({
          data: data.data.map(normalizeMal),
          pagination: {
            last_visible_page: (data.pagination?.last_visible_page as number) || 1,
            has_next_page: (data.pagination?.has_next_page as boolean) || false,
            current_page: page,
            items: { count: data.data.length, total: 0, per_page: limit },
          },
        });
      }
    }

    if (apiPath === "/browse") {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      const bParams = url.searchParams;
      const bPage = parseInt(bParams.get("page") || "1");
      const bLimit = parseInt(bParams.get("perPage") || "25");

      let alSort: string[] = ["POPULARITY_DESC"];
      const sortVal = bParams.get("sort");
      if (sortVal) {
        const alSortMap: Record<string, string[]> = {
          popularity: ["POPULARITY_DESC"],
          score: ["SCORE_DESC"],
          start_date: ["START_DATE_DESC"],
          title: ["TITLE_ROMAJI"],
          trending: ["TRENDING_DESC"],
          favourites: ["FAVOURITES_DESC"],
        };
        alSort = alSortMap[sortVal.toLowerCase()] || ["POPULARITY_DESC"];
      }

      const formatMap: Record<string, string> = { TV: "TV", Movie: "MOVIE", OVA: "OVA", ONA: "ONA", Special: "SPECIAL", Music: "MUSIC" };
      const alFormat = bParams.get("type") ? formatMap[bParams.get("type")!] || null : null;

      const statusMap: Record<string, string> = { airing: "RELEASING", completed: "FINISHED", upcoming: "NOT_YET_RELEASED", cancelled: "CANCELLED", hiatus: "HIATUS" };
      const alStatus = bParams.get("status") ? statusMap[bParams.get("status")!.toLowerCase()] || null : null;

      const alSeason = bParams.get("season") ? bParams.get("season")!.toUpperCase() : null;
      const alYear = bParams.get("year") ? parseInt(bParams.get("year")!) : null;
      const MAL_GENRE_NAMES: Record<string, string> = {
        '1': 'Action', '2': 'Adventure', '4': 'Comedy', '8': 'Drama', '9': 'Ecchi',
        '10': 'Fantasy', '14': 'Horror', '22': 'Romance', '24': 'Sci-Fi', '27': 'Shounen',
        '30': 'Sports', '36': 'Slice of Life', '37': 'Supernatural', '41': 'Thriller',
        '62': 'Isekai',
      };
      const ANILIST_TAGS = new Set(['Isekai']);
      const rawGenres = bParams.get("genres") ? bParams.get("genres")!.split(",").map((id) => MAL_GENRE_NAMES[id] || id).filter(Boolean) : null;
      const alGenreIn = rawGenres?.filter((g) => !ANILIST_TAGS.has(g)) || null;
      const alTagIn = rawGenres?.filter((g) => ANILIST_TAGS.has(g)) || null;
      const alScore = bParams.get("score") ? parseInt(bParams.get("score")!) * 10 : null;

      const alBrowseQuery = `
        query ($page: Int, $perPage: Int, $sort: [MediaSort], $format: [MediaFormat], $status: MediaStatus, $season: MediaSeason, $seasonYear: Int, $genreIn: [String], $tagIn: [String], $scoreGte: Int) {
          Page(page: $page, perPage: $perPage) {
            pageInfo { currentPage hasNextPage perPage }
            media(type: ANIME, sort: $sort, format_in: $format, status: $status, season: $season, seasonYear: $seasonYear, genre_in: $genreIn, tag_in: $tagIn, averageScore_greater: $scoreGte) {
              id idMal
              title { romaji english native }
              coverImage { large extraLarge }
              bannerImage
              format episodes status averageScore popularity favourites description
              season seasonYear
              startDate { year month day } endDate { year month day }
              source duration genres
              studios(isMain: true) { nodes { id name } }
              trailer { id site }
              rankings { rank type }
              nextAiringEpisode { airingAt episode }
              relations { edges { relationType node { id idMal title { romaji english } format } } }
            }
          }
        }`;

      try {
        const alRes = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            query: alBrowseQuery,
            variables: {
              page: bPage, perPage: bLimit, sort: alSort,
              format: alFormat ? [alFormat] : undefined,
              status: alStatus || undefined,
              season: alSeason || undefined,
              seasonYear: alYear || undefined,
              genreIn: alGenreIn?.length ? alGenreIn : undefined,
              tagIn: alTagIn?.length ? alTagIn : undefined,
              scoreGte: alScore || undefined,
            },
          }),
        });

        if (alRes.ok) {
          const alBody = await alRes.json() as any;
          const pageData = alBody?.data?.Page;
          const media = pageData?.media || [];

          const mapFormat = (f: string): string =>
            ({ TV: "TV", MOVIE: "Movie", OVA: "OVA", ONA: "ONA", SPECIAL: "Special", TV_SHORT: "TV", MUSIC: "Music" } as Record<string, string>)[f] || f;
          const mapStatus = (s: string): string =>
            ({ RELEASING: "Currently Airing", FINISHED: "Completed", NOT_YET_RELEASED: "Not yet aired", CANCELLED: "Cancelled", HIATUS: "Hiatus" } as Record<string, string>)[s] || s;

          const items = media.map((m: any) => {
            const rankings = m.rankings || [];
            const rankEntry = rankings.find((r: any) => r.type === "RATED") || rankings[0];
            return {
              mal_id: m.idMal || m.id,
              title: m.title?.english || m.title?.romaji || "Unknown",
              title_english: m.title?.english || null,
              title_japanese: m.title?.native || null,
              images: {
                jpg: { image_url: m.coverImage?.large || null, large_image_url: m.coverImage?.extraLarge || m.coverImage?.large || null },
                webp: { image_url: m.coverImage?.large || null, large_image_url: m.coverImage?.extraLarge || m.coverImage?.large || null },
              },
              type: m.format ? mapFormat(m.format) : null,
              episodes: m.episodes || null,
              status: m.status ? mapStatus(m.status) : null,
              score: m.averageScore ? m.averageScore / 10 : null,
              scored_by: null,
              rank: rankEntry?.rank || null,
              popularity: m.popularity || null,
              members: null,
              favorites: m.favourites || null,
              synopsis: m.description ? m.description.replace(/<[^>]*>/g, "") : null,
              season: m.season ? m.season.charAt(0) + m.season.slice(1).toLowerCase() : null,
              year: m.seasonYear || null,
              aired: {
                from: m.startDate?.year ? `${m.startDate.year}-${String(m.startDate.month || 1).padStart(2, "0")}-${String(m.startDate.day || 1).padStart(2, "0")}` : null,
                to: m.endDate?.year ? `${m.endDate.year}-${String(m.endDate.month || 1).padStart(2, "0")}-${String(m.endDate.day || 1).padStart(2, "0")}` : null,
                string: m.startDate?.year ? `${m.season || ""} ${m.seasonYear || ""}`.trim() || `${m.startDate.year}` : "?",
              },
              broadcast: null,
              studios: (m.studios?.nodes || []).map((s: any) => ({ mal_id: s.id, name: s.name })),
              genres: (m.genres || []).map((g: string) => ({ mal_id: -1, name: g })),
              themes: [],
              source: m.source || null,
              rating: null,
              duration: m.duration ? `${m.duration} min per ep` : null,
              trailer: m.trailer?.site === "youtube" ? { youtube_id: m.trailer.id, url: `https://www.youtube.com/watch?v=${m.trailer.id}` } : null,
              relations: (m.relations?.edges || []).map((r: any) => ({
                relation: r.relationType || "",
                entry: [{ mal_id: r.node?.idMal || r.node?.id, name: r.node?.title?.english || r.node?.title?.romaji || "Unknown", type: r.node?.format ? mapFormat(r.node.format) : null }],
              })),
              anilist_id: m.id,
            };
          });

          return res.status(200).json({
            data: items,
            pagination: {
              has_next_page: pageData.pageInfo?.hasNextPage || false,
              current_page: bPage,
              per_page: bLimit,
            },
          });
        }
      } catch {}

      // Fallback to Jikan if AniList fails
      try {
        let jikanPath = "/anime";
        const jikanParams = new URLSearchParams();
        jikanParams.set("page", String(bPage));
        jikanParams.set("limit", String(bLimit));

        if (bParams.get("type")) {
          const typeMap: Record<string, string> = { TV: "tv", Movie: "movie", OVA: "ova", ONA: "ona", Special: "special", Music: "music" };
          jikanParams.set("type", typeMap[bParams.get("type")!] || bParams.get("type")!.toLowerCase());
        }
        if (bParams.get("status")) {
          const statusMap: Record<string, string> = { airing: "airing", completed: "complete", upcoming: "upcoming" };
          jikanParams.set("status", statusMap[bParams.get("status")!.toLowerCase()] || bParams.get("status")!.toLowerCase());
        }
        if (bParams.get("genres")) {
          jikanParams.set("genres", bParams.get("genres")!);
        }
        if (bParams.get("sort") === "score") {
          jikanParams.set("order_by", "score");
          jikanParams.set("sort", "desc");
        } else if (bParams.get("sort") === "popularity") {
          jikanParams.set("order_by", "members");
          jikanParams.set("sort", "desc");
        } else if (bParams.get("sort") === "start_date") {
          jikanParams.set("order_by", "start_date");
          jikanParams.set("sort", "desc");
        }

        const searchQ = bParams.get("q");
        if (searchQ) {
          jikanPath = "/anime";
          jikanParams.set("q", searchQ);
        } else if (bParams.get("sort") === "trending") {
          jikanPath = "/top/anime";
          jikanParams.delete("page");
          jikanParams.delete("limit");
          jikanParams.set("page", String(bPage));
          jikanParams.set("limit", String(bLimit));
          const filterMap: Record<string, string> = { tv: "tv", movie: "movie", ova: "ova", ona: "ona", special: "special" };
          const jType = bParams.get("type");
          if (jType && filterMap[jType.toLowerCase()]) {
            jikanParams.set("type", filterMap[jType.toLowerCase()]);
          } else {
            jikanParams.set("filter", "bypopularity");
          }
        }

        const qs = jikanParams.toString();
        const jikanData = await jikanFetch<{ data: Record<string, unknown>[]; pagination: Record<string, unknown> }>(`${jikanPath}${qs ? "?" + qs : ""}`);

        const formatMap = (f: string): string =>
          ({ TV: "TV", MOVIE: "Movie", OVA: "OVA", ONA: "ONA", SPECIAL: "Special", TV_SHORT: "TV", MUSIC: "Music" } as Record<string, string>)[f] || f;

        const items = jikanData.data.map((m: any) => ({
          mal_id: m.mal_id,
          title: m.title || "Unknown",
          title_english: m.title_english || null,
          title_japanese: m.title_japanese || null,
          images: {
            jpg: { image_url: m.images?.jpg?.image_url || null, large_image_url: m.images?.jpg?.large_image_url || null },
            webp: { image_url: m.images?.webp?.image_url || null, large_image_url: m.images?.webp?.large_image_url || null },
          },
          type: m.type || null,
          episodes: m.episodes || null,
          status: m.status || null,
          score: m.score || null,
          scored_by: m.scored_by || null,
          rank: m.rank || null,
          popularity: m.popularity || null,
          members: m.members || null,
          favorites: m.favorites || null,
          synopsis: m.synopsis || null,
          season: m.season || null,
          year: m.year || null,
          aired: m.aired || { from: null, to: null, string: "?" },
          broadcast: null,
          studios: (m.studios || []).map((s: any) => ({ mal_id: s.mal_id, name: s.name })),
          genres: (m.genres || []).map((g: any) => ({ mal_id: g.mal_id, name: g.name })),
          themes: [],
          source: m.source || null,
          rating: m.rating || null,
          duration: m.duration || null,
          trailer: m.trailer?.youtube_id ? { youtube_id: m.trailer.youtube_id, url: m.trailer.url } : null,
          relations: [],
        }));

        return res.status(200).json({
          data: items,
          pagination: {
            has_next_page: jikanData.pagination?.has_next_page || false,
            current_page: bPage,
            per_page: bLimit,
          },
        });
      } catch {}

      return res.status(502).json({ error: true, code: "UPSTREAM_ERROR", message: "Browse failed", retry: true });
    }

    if (apiPath.startsWith("/schedule/")) {
      const day = apiPath.replace("/schedule/", "");
      const dayCacheKey = `schedule:${day}`;
      const cached = getCached(dayCacheKey);
      if (cached) return res.status(200).json(cached);

      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const targetDayIndex = dayNames.indexOf(day.toLowerCase());
      if (targetDayIndex < 0) return res.status(200).json({ data: [] });

      try {
        // Fetch all ongoing anime from AnimeSchedule
        const allCacheKey = "animeschedule:ongoing";
        let allAnime: any[] = getCached(allCacheKey) as any[] || [];
        if (!allAnime.length) {
          const firstRes = await fetch(`${ANIMESCHEDULE_BASE}/anime?page=1&airing-statuses=ongoing&st=popularity`, {
            headers: { "Accept": "application/json", "User-Agent": "MikuAnime/1.0" },
          });
          if (!firstRes.ok) throw new Error(`AnimeSchedule returned ${firstRes.status}`);
          const firstPage = await firstRes.json() as any;
          allAnime = firstPage.anime || [];
          const total = firstPage.totalAmount || 0;
          const totalPages = Math.ceil(total / 18);

          // Fetch remaining pages in parallel
          if (totalPages > 1) {
            const pages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
            const pageResults = await Promise.allSettled(
              pages.map(p => 
                fetch(`${ANIMESCHEDULE_BASE}/anime?page=${p}&airing-statuses=ongoing&st=popularity`, {
                  headers: { "Accept": "application/json", "User-Agent": "MikuAnime/1.0" },
                }).then(r => r.json()).then(d => d.anime || [])
              )
            );
            for (const r of pageResults) {
              if (r.status === 'fulfilled') allAnime.push(...r.value);
            }
          }
          setCache(allCacheKey, allAnime, 600000); // cache all for 10 min
        }

        // Filter by day of week
        const items = allAnime
          .filter((a: any) => {
            if (!a.jpnTime) return false;
            const d = new Date(a.jpnTime);
            return d.getDay() === targetDayIndex;
          })
          .map((a: any) => {
            const airDate = new Date(a.jpnTime);
            const malUrl = a.websites?.mal || '';
            const malMatch = malUrl.match(/\/(\d+)(?:\/|$)/);
            const malId = malMatch ? parseInt(malMatch[1]) : null;
            const imgPath = a.imageVersionRoute || `anime/jpg/default/${a.route}.jpg`;
            const imgUrl = `https://img.animeschedule.net/production/assets/public/img/${imgPath}`;

            // Calculate current episode from premiere date for weekly shows
            let airingEpisode: number | null = null;
            if (a.premier && a.status === 'Ongoing') {
              const premierDate = new Date(a.premier);
              const now = new Date();
              const msPerWeek = 7 * 24 * 60 * 60 * 1000;
              const weeksSince = Math.floor((now.getTime() - premierDate.getTime()) / msPerWeek);
              airingEpisode = Math.max(1, weeksSince + 1);
              if (a.episodes) airingEpisode = Math.min(airingEpisode, a.episodes);
            }

            return {
              mal_id: malId || a.route,
              airing_episode: airingEpisode,
              title: a.names?.english || a.title || a.names?.romaji || "Unknown",
              title_english: a.names?.english || null,
              title_japanese: a.names?.native || null,
              images: {
                jpg: { image_url: imgUrl, large_image_url: imgUrl },
                webp: { image_url: imgUrl, large_image_url: imgUrl },
              },
              type: a.mediaTypes?.[0]?.name || null,
              episodes: a.episodes || null,
              status: a.status || null,
              score: a.stats?.averageScore ? a.stats.averageScore / 10 : null,
              scored_by: a.stats?.ratingCount || null,
              rank: null, popularity: a.stats?.trackedRating || null,
              members: a.stats?.trackedCount || null,
              favorites: null,
              synopsis: a.description ? a.description.replace(/<[^>]*>/g, "").slice(0, 500) : null,
              season: a.season?.season || null,
              year: a.season?.year ? parseInt(a.season.year) : null,
              aired: { from: a.premier || null, to: null, string: a.premier ? new Date(a.premier).toLocaleDateString() : "?" },
              broadcast: { day: airDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(), time: airDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Tokyo' }) },
              studios: (a.studios || []).map((s: any) => ({ mal_id: -1, name: s.name })),
              genres: (a.genres || []).map((g: any) => ({ mal_id: -1, name: g.name })),
              themes: [], source: a.sources?.[0]?.name || null,
              rating: null,
              duration: a.lengthMin ? `${a.lengthMin} min per ep` : null,
              trailer: null, relations: [],
            };
          })
          .sort((a: any, b: any) => (a.broadcast?.time || '').localeCompare(b.broadcast?.time || ''));

        const result = { data: items };
        setCache(dayCacheKey, result, 300000);
        return res.status(200).json(result);
      } catch (err) {
        const lastError = err instanceof Error ? err.message : "Schedule fetch failed";
        return res.status(200).json({ data: [], error: lastError });
      }
    }

    if (apiPath === "/genres") {
      const cached = getCached("genres:jikan");
      if (cached) return res.status(200).json(cached);

      const data = await jikanFetch<{ data: Record<string, unknown>[] }>("/genres/anime");
      const result = { data: (data.data || []).map((g: Record<string, unknown>) => ({ mal_id: g.mal_id as number, name: g.name as string, count: g.count as number || 0 })) };
      setCache("genres:jikan", result, 86400000);
      return res.status(200).json(result);
    }

    return res.status(404).json({ error: true, code: "NOT_FOUND", message: "Route not found", retry: false });
  } catch (err) {
    return res.status(500).json({
      error: true, code: "SERVER_ERROR", message: err instanceof Error ? err.message : "Internal error", retry: true,
    });
  }
}
