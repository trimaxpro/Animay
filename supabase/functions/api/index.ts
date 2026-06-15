import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const JIKAN_BASE = "https://api.jikan.moe/v4";
const ANISKIP_BASE = "https://api.aniskip.com/v2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
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

async function jikanFetch(path: string, ttlMs = 300000): Promise<Response> {
  const cacheKey = `jikan:${path}`;
  const cached = getCached(cacheKey);
  if (cached) return Response.json(cached);

  const res = await fetch(`${JIKAN_BASE}${path}`);
  if (!res.ok) {
    const errorBody = await res.text();
    return Response.json(
      { error: true, code: res.status === 429 ? "RATE_LIMITED" : "SERVER_ERROR", message: `Jikan API error: ${res.status}`, retry: res.status !== 404 },
      { status: res.status, headers: corsHeaders }
    );
  }
  const data = await res.json();
  setCache(cacheKey, data, ttlMs);
  return Response.json(data, { headers: corsHeaders });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/v1/, "");

  try {
    if (path === "/health") {
      return Response.json({ status: "ok", timestamp: new Date().toISOString() }, { headers: corsHeaders });
    }

    if (path === "/anime/trending") {
      return await jikanFetch("/top/anime?filter=airing&limit=20");
    }

    if (path === "/anime/seasonal") {
      return await jikanFetch("/seasons/now?limit=24");
    }

    if (path === "/anime/upcoming") {
      return await jikanFetch("/seasons/upcoming?limit=12");
    }

    if (path === "/anime/top") {
      return await jikanFetch("/top/anime?limit=10");
    }

    const animeDetailMatch = path.match(/^\/anime\/(\d+)$/);
    if (animeDetailMatch) {
      const id = animeDetailMatch[1];
      const cacheKey = `anime-detail:${id}`;
      const cached = getCached(cacheKey);
      if (cached) return Response.json(cached, { headers: corsHeaders });

      const [animeRes, charactersRes] = await Promise.allSettled([
        fetch(`${JIKAN_BASE}/anime/${id}/full`),
        fetch(`${JIKAN_BASE}/anime/${id}/characters`),
      ]);

      const animeData = animeRes.status === "fulfilled" && animeRes.value.ok ? await animeRes.value.json() : null;
      const charactersData = charactersRes.status === "fulfilled" && charactersRes.value.ok ? await charactersRes.value.json() : null;

      if (!animeData) {
        return Response.json({ error: true, code: "NOT_FOUND", message: "Anime not found", retry: false }, { status: 404, headers: corsHeaders });
      }

      const result = { ...animeData, characters: charactersData?.data || [] };
      setCache(cacheKey, result, 300000);
      return Response.json(result, { headers: corsHeaders });
    }

    const episodesMatch = path.match(/^\/anime\/(\d+)\/episodes$/);
    if (episodesMatch) {
      const id = episodesMatch[1];
      return await jikanFetch(`/anime/${id}/episodes`);
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
      return await jikanFetch(`/anime/${id}/recommendations`, 3600000);
    }

    if (path === "/search") {
      const q = url.searchParams.get("q") || "";
      const page = url.searchParams.get("page") || "1";
      const limit = url.searchParams.get("limit") || "25";
      return await jikanFetch(`/anime?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`);
    }

    if (path === "/browse") {
      const params = url.searchParams;
      const query = new URLSearchParams();
      if (params.get("type")) query.set("type", params.get("type")!);
      if (params.get("status")) query.set("status", params.get("status")!);
      if (params.get("genres")) query.set("genres", params.get("genres")!);
      if (params.get("score")) query.set("min_score", params.get("score")!);
      if (params.get("sort")) query.set("order_by", params.get("sort")!);
      if (params.get("page")) query.set("page", params.get("page")!);
      if (params.get("season")) query.set("season", params.get("season")!);
      if (params.get("year")) query.set("year", params.get("year")!);
      query.set("limit", params.get("limit") || "25");
      return await jikanFetch(`/anime?${query.toString()}`);
    }

    if (path.startsWith("/schedule/")) {
      const day = path.replace("/schedule/", "");
      return await jikanFetch(`/schedules?filter=${day}&limit=25`);
    }

    if (path === "/genres") {
      const cached = getCached("genres:all");
      if (cached) return Response.json(cached, { headers: corsHeaders });
      const res = await fetch(`${JIKAN_BASE}/genres/anime`);
      const data = res.ok ? await res.json() : { data: [] };
      setCache("genres:all", data, 86400000);
      return Response.json(data, { headers: corsHeaders });
    }

    return Response.json({ error: true, code: "NOT_FOUND", message: "Route not found", retry: false }, { status: 404, headers: corsHeaders });
  } catch (err) {
    return Response.json(
      { error: true, code: "SERVER_ERROR", message: err instanceof Error ? err.message : "Internal error", retry: true },
      { status: 500, headers: corsHeaders }
    );
  }
});
