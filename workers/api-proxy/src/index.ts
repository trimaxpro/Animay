const MAL_BASE = "https://api.myanimelist.net/v2";
const JIKAN_BASE = "https://api.jikan.moe/v4";
const ANISKIP_BASE = "https://api.aniskip.com/v2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

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

function malHeaders(clientId: string) {
  return { "X-MAL-CLIENT-ID": clientId };
}

async function malFetch<T = unknown>(path: string, clientId: string): Promise<T> {
  const cacheKey = `mal:${path}`;
  const cached = getCached(cacheKey);
  if (cached) return cached as T;

  const res = await fetch(`${MAL_BASE}${path}`, { headers: malHeaders(clientId) });
  if (!res.ok) {
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 1000));
      const retryRes = await fetch(`${MAL_BASE}${path}`, { headers: malHeaders(clientId) });
      if (!retryRes.ok) throw new Error(`MAL API error: ${retryRes.status}`);
      const retryData = await retryRes.json() as T;
      setCache(cacheKey, retryData, 300000);
      return retryData;
    }
    throw new Error(`MAL API error: ${res.status}`);
  }
  const data = await res.json() as T;
  setCache(cacheKey, data, 300000);
  return data;
}

async function jikanFetch<T = unknown>(path: string): Promise<T> {
  const cacheKey = `jikan:${path}`;
  const cached = getCached(cacheKey);
  if (cached) return cached as T;

  await new Promise(r => setTimeout(r, 350));
  const res = await fetch(`${JIKAN_BASE}${path}`);
  if (!res.ok) {
    if (res.status === 429) {
      await new Promise(r => setTimeout(r, 1000));
      const retryRes = await fetch(`${JIKAN_BASE}${path}`);
      if (!retryRes.ok) throw new Error(`Jikan error: ${retryRes.status}`);
      const retryData = await retryRes.json() as T;
      setCache(cacheKey, retryData, 300000);
      return retryData;
    }
    throw new Error(`Jikan error: ${res.status}`);
  }
  const data = await res.json() as T;
  setCache(cacheKey, data, 300000);
  return data;
}

const LIST_FIELDS = "id,title,main_picture,alternative_titles,mean,rank,popularity,num_episodes,media_type,status,genres,start_season,average_episode_duration,rating";
const DETAIL_FIELDS = "id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,num_episodes,status,media_type,genres,studios,start_season,broadcast,source,average_episode_duration,rating,related_anime,recommendations,characters,statistics";

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
  const mp = item.main_picture as Record<string, string | null> || {};
  const alt = item.alternative_titles as Record<string, string | null> || {};
  const season = item.start_season as Record<string, unknown> || {};
  const airedFrom = item.start_date as string | null;
  const airedTo = item.end_date as string | null;
  const bc = item.broadcast as Record<string, string | null> || null;
  const dur = item.average_episode_duration as number | null;

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
    trailer: null,
    relations: (item.related_anime as Array<Record<string, unknown>> || []).map((r: Record<string, unknown>) => {
      const rn = r.node as Record<string, unknown> || {};
      return {
        relation: (r.relation_type as string) || "",
        entry: [{ mal_id: rn.id as number, name: (rn.title as string) || "Unknown", type: malMediaType((rn.media_type as string) || "") }],
      };
    }),
  };
}

function parseRecs(item: Record<string, unknown>): Record<string, unknown>[] {
  const rawRecs = item.recommendations as Array<Record<string, unknown>> || [];
  return rawRecs.slice(0, 10).map((r: Record<string, unknown>) => {
    const rn = r.node as Record<string, unknown> || {};
    const rmp = rn.main_picture as Record<string, string | null> || {};
    return {
      entry: {
        mal_id: rn.id as number,
        title: rn.title as string || "Unknown",
        title_english: null, title_japanese: null,
        images: { jpg: { image_url: rmp.medium || null, large_image_url: rmp.large || rmp.medium || null }, webp: { image_url: rmp.medium || null, large_image_url: rmp.large || rmp.medium || null } },
        type: rn.media_type ? malMediaType(rn.media_type as string) : null,
        episodes: null, status: null, score: rn.mean as number || null,
        scored_by: null, rank: null, popularity: null, members: null, favorites: null, synopsis: null,
        season: null, year: null, aired: { from: null, to: null, string: "?" }, broadcast: null,
        studios: [], genres: [], themes: [], source: null, rating: null, duration: null, trailer: null, relations: [],
      },
    };
  });
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

export default {
  async fetch(request: Request, env: Record<string, string>): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 200, headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const malClientId = env.MAL_CLIENT_ID || "";

    try {
      if (path === "/health") {
        return Response.json({ status: "ok", timestamp: new Date().toISOString() }, { headers: corsHeaders });
      }

      if (path === "/anime/trending") {
        const data = await malFetch<{ data: { node?: Record<string, unknown>; ranking?: Record<string, unknown> }[] }>(`/anime/ranking?ranking_type=bypopularity&limit=20&fields=${LIST_FIELDS}`, malClientId);
        const items = extractNodes(data);
        return Response.json({ data: items.map(normalizeMal) }, { headers: corsHeaders });
      }

      if (path === "/anime/seasonal") {
        const { current, year } = getSeason();
        const data = await malFetch<{ data: { node?: Record<string, unknown> }[] }>(`/anime/seasonal/${year}/${current}?limit=24&fields=${LIST_FIELDS}`, malClientId);
        const items = extractNodes(data);
        return Response.json({ data: items.map(normalizeMal) }, { headers: corsHeaders });
      }

      if (path === "/anime/upcoming") {
        const { next, nextYear } = getSeason();
        const data = await malFetch<{ data: { node?: Record<string, unknown> }[] }>(`/anime/seasonal/${nextYear}/${next}?limit=12&fields=${LIST_FIELDS}`, malClientId);
        const items = extractNodes(data);
        return Response.json({ data: items.map(normalizeMal) }, { headers: corsHeaders });
      }

      if (path === "/anime/top") {
        const data = await malFetch<{ data: { node?: Record<string, unknown>; ranking?: Record<string, unknown> }[] }>(`/anime/ranking?ranking_type=all&limit=10&fields=${LIST_FIELDS}`, malClientId);
        const items = extractNodes(data);
        return Response.json({ data: items.map(normalizeMal) }, { headers: corsHeaders });
      }

      const animeDetailMatch = path.match(/^\/anime\/(\d+)$/);
      if (animeDetailMatch) {
        const id = animeDetailMatch[1];
        const cacheKey = `detail:${id}`;
        const cached = getCached(cacheKey);
        if (cached) return Response.json(cached, { headers: corsHeaders });

        const data = await malFetch<Record<string, unknown>>(`/anime/${id}?fields=${DETAIL_FIELDS}`, malClientId);
        const normalized = normalizeMal(data);
        const chars = parseChars(data);
        normalized.characters = chars;
        setCache(cacheKey, normalized, 600000);
        return Response.json(normalized, { headers: corsHeaders });
      }

      const episodesMatch = path.match(/^\/anime\/(\d+)\/episodes$/);
      if (episodesMatch) {
        const id = episodesMatch[1];

        let episodes: Record<string, unknown>[] = [];
        let totalEpisodes: number | null = null;

        try {
          const epData = await jikanFetch<{ data: Record<string, unknown>[] }>(`/anime/${id}/episodes`);
          episodes = (epData.data || []).map((ep: Record<string, unknown>) => ({
            ...ep,
            episode: ep.mal_id ?? ep.episode,
          }));
        } catch {}

        try {
          const detailData = await malFetch<Record<string, unknown>>(`/anime/${id}?fields=num_episodes`, malClientId);
          totalEpisodes = detailData.num_episodes as number | null;
        } catch {}

        if (!totalEpisodes) {
          try {
            const jikanDetail = await jikanFetch<{ data: Record<string, unknown> }>(`/anime/${id}`);
            totalEpisodes = jikanDetail.data?.episodes as number | null;
          } catch {}
        }

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

        return Response.json({ data: episodes }, { headers: corsHeaders });
      }

      const skipTimesMatch = path.match(/^\/anime\/(\d+)\/episodes\/(\d+)\/skiptimes$/);
      if (skipTimesMatch) {
        const malId = skipTimesMatch[1];
        const epNum = skipTimesMatch[2];
        const cacheKey = `skiptimes:${malId}:${epNum}`;
        const cached = getCached(cacheKey);
        if (cached) return Response.json(cached, { headers: corsHeaders });

        const res = await fetch(`${ANISKIP_BASE}/skip-times/${malId}/${epNum}?types=op&types=ed`);
        const data = res.ok ? await res.json() : [];
        setCache(cacheKey, data, 3600000);
        return Response.json(data, { headers: corsHeaders });
      }

      const recommendationsMatch = path.match(/^\/anime\/(\d+)\/recommendations$/);
      if (recommendationsMatch) {
        const id = recommendationsMatch[1];
        const cacheKey = `recs:${id}`;
        const cached = getCached(cacheKey);
        if (cached) return Response.json(cached, { headers: corsHeaders });

        const data = await malFetch<Record<string, unknown>>(`/anime/${id}?fields=recommendations`, malClientId);
        const recs = parseRecs(data);
        const result = { data: recs };
        setCache(cacheKey, result, 600000);
        return Response.json(result, { headers: corsHeaders });
      }

      if (path === "/search") {
        const q = url.searchParams.get("q") || "";
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "25");
        const offset = (page - 1) * limit;
        const data = await malFetch<{ data: { node?: Record<string, unknown> }[]; paging?: { next?: string } }>(
          `/anime?q=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}&fields=${LIST_FIELDS}`, malClientId
        );
        const items = extractNodes(data);
        return Response.json({
          data: items.map(normalizeMal),
          pagination: malPagination(data, limit, offset),
        }, { headers: corsHeaders });
      }

      if (path === "/browse") {
        const params = url.searchParams;
        const page = parseInt(params.get("page") || "1");
        const limit = parseInt(params.get("limit") || "25");
        const qs = new URLSearchParams();
        qs.set("page", String(page));
        qs.set("limit", String(limit));

        const type = params.get("type");
        if (type) qs.set("type", type === "TV" ? "tv" : type === "Movie" ? "movie" : type === "OVA" ? "ova" : type === "ONA" ? "ona" : type === "Special" ? "special" : type.toLowerCase());

        const status = params.get("status");
        if (status) {
          const sMap: Record<string, string> = { airing: "airing", completed: "complete", upcoming: "upcoming" };
          qs.set("status", sMap[status.toLowerCase()] || status);
        }

        const genres = params.get("genres");
        if (genres) qs.set("genres", genres);

        const score = params.get("score");
        if (score) qs.set("min_score", String(parseInt(score)));

        const sort = params.get("sort");
        if (sort) {
          const sortMap: Record<string, string> = { popularity: "popularity", score: "score", start_date: "start_date", title: "title" };
          qs.set("order_by", sortMap[sort.toLowerCase()] || "popularity");
          qs.set("sort", "desc");
        } else {
          qs.set("order_by", "popularity");
          qs.set("sort", "desc");
        }

        const season = params.get("season");
        const year = params.get("year");
        if (season && year) {
          qs.set("season", season.toLowerCase());
          qs.set("year", year);
        }

        const data = await jikanFetch<{ data: Record<string, unknown>[]; pagination: Record<string, unknown> }>(`/anime?${qs.toString()}`);
        return Response.json({
          data: data.data.map(normalizeMal),
          pagination: {
            last_visible_page: (data.pagination?.last_visible_page as number) || 1,
            has_next_page: (data.pagination?.has_next_page as boolean) || false,
            current_page: page,
            items: { count: data.data.length, total: (data.pagination as Record<string, unknown>)?.items ? ((data.pagination as Record<string, unknown>).items as Record<string, unknown>).total as number : 0, per_page: limit },
          },
        }, { headers: corsHeaders });
      }

      if (path.startsWith("/schedule/")) {
        const day = path.replace("/schedule/", "");
        const data = await jikanFetch<Record<string, unknown>>(`/schedules?filter=${day}&limit=25`);
        return Response.json(data, { headers: corsHeaders });
      }

      if (path === "/genres") {
        const cached = getCached("genres:jikan");
        if (cached) return Response.json(cached, { headers: corsHeaders });

        const data = await jikanFetch<{ data: Record<string, unknown>[] }>("/genres/anime");
        const result = { data: (data.data || []).map((g: Record<string, unknown>) => ({ mal_id: g.mal_id as number, name: g.name as string, count: g.count as number || 0 })) };
        setCache("genres:jikan", result, 86400000);
        return Response.json(result, { headers: corsHeaders });
      }

      return Response.json({ error: true, code: "NOT_FOUND", message: "Route not found", retry: false }, { status: 404, headers: corsHeaders });
    } catch (err) {
      return Response.json(
        { error: true, code: "SERVER_ERROR", message: err instanceof Error ? err.message : "Internal error", retry: true },
        { status: 500, headers: corsHeaders }
      );
    }
  },
};
