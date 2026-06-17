import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { VideoPlayer } from '@/components/watch/VideoPlayer';
import { EpisodeList } from '@/components/watch/EpisodeList';
import { WatchInfo } from '@/components/watch/WatchInfo';
import { MiniAnimeCard } from '@/components/ui/MiniAnimeCard';
import { ScrollableRow } from '@/components/ui/ScrollableRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { EpisodeSkeleton } from '@/components/ui/Skeleton';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { useAnimeDetail, useAnimeEpisodes, useSkipTimes } from '@/hooks/useAnime';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { apiClient } from '@/api/client';
import { AlertCircle, Server, Monitor, Globe, Sparkles, Play, ListVideo, ChevronDown, Radio } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Anime } from '@/types/anime';

const SERVERS = [
  { id: 'mal', label: 'MegaPlay', icon: Monitor },
  { id: 'animeplay', label: 'AnimePlay', icon: Globe },
  { id: 'videasy', label: 'Videasy', icon: Play },
  { id: 'filmu', label: 'FilmU', icon: Server },
  { id: 'embed', label: 'TryEmbed', icon: Globe },
  { id: 'anikoto', label: 'Anikoto', icon: Server },
] as const;

export default function WatchPage() {
  const { id, episode: episodeParam } = useParams<{ id: string; episode: string }>();
  const animeId = Number(id);
  const episodeNum = Number(episodeParam) || 1;
  const [server, setServer] = useState<string>('mal');
  const [serverOpen, setServerOpen] = useState(false);

  const detail = useAnimeDetail(animeId);
  const episodes = useAnimeEpisodes(animeId);
  const skipTimes = useSkipTimes(animeId, episodeNum);
  const { addToHistory } = useWatchHistory();
  const navigate = useNavigate();

  const anime = detail.data;
  const genreIds = anime?.genres?.map((g) => g.mal_id).join(',') || '';
  const similar = useQuery({
    queryKey: ['similar', animeId, genreIds],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Anime[] }>(`/browse?genres=${genreIds}&sort=score&perPage=15`);
      return (data.data || []).filter((a) => a.mal_id !== animeId).slice(0, 12);
    },
    enabled: !!genreIds,
    staleTime: 10 * 60 * 1000,
  });
  const currentEpisode = episodes.data?.find((ep) => ep.episode === episodeNum);

  const anilistId = anime?.anilist_id || animeId;
  const embedUrl = server === 'mal'
    ? `https://megaplay.buzz/stream/mal/${animeId}/${episodeNum}/sub`
    : server === 'animeplay'
    ? `https://animeplay.cfd/stream/mal/${animeId}/${episodeNum}/sub`
    : server === 'videasy'
    ? (anime?.type === 'Movie'
      ? `https://player.videasy.net/anime/${anilistId}`
      : `https://player.videasy.net/anime/${anilistId}/${episodeNum}`)
    : server === 'filmu'
    ? `https://embed.filmu.in/embed/anime/${anilistId}/${episodeNum}/sub`
    : server === 'anikoto'
    ? `https://megaplay.buzz/stream/ani/${anilistId}/${episodeNum}/sub`
    : `https://tryembed.us.cc/embed/anime/${anilistId}/${episodeNum}/sub`;

  useEffect(() => {
    if (anime) {
      addToHistory({
        malId: anime.mal_id,
        title: anime.title_english || anime.title,
        image: anime.images.jpg?.image_url || '',
        episode: episodeNum,
        progress: 0.01,
      });
    }
  }, [anime?.mal_id, episodeNum]);

  const isAiring = anime?.status === 'Currently Airing' || anime?.status === 'Airing';
  const visibleEpisodes = useMemo(() => {
    if (!episodes.data) return [];
    if (!isAiring) return episodes.data;
    return episodes.data.filter((ep) => ep.aired !== null && ep.aired !== '');
  }, [episodes.data, isAiring]);
  const maxAvailableEpisode = visibleEpisodes.reduce((max, ep) => Math.max(max, ep.episode), 0);
  useEffect(() => {
    if (!isAiring) return;
    const interval = setInterval(() => { episodes.refetch(); }, 120000);
    return () => clearInterval(interval);
  }, [isAiring]);

  if (detail.isError) {
    return (
      <PageWrapper className="pt-20 pb-12 px-4">
        <EmptyState
          icon={AlertCircle}
          title="Failed to load"
          message="Something went wrong loading this content."
          actionLabel="Try Again"
          onAction={() => detail.refetch()}
        />
      </PageWrapper>
    );
  }

  if (detail.isLoading) {
    return (
      <PageWrapper className="pt-20 pb-12 px-4">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <img src="/loader.gif" alt="Loading..." className="w-24 h-24 object-contain" />
          <p className="text-text-muted text-sm mt-4">Loading anime...</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content: player + info + description + recommendations */}
          <div className="flex-1 min-w-0">
            {/* Player with floating server dropdown */}
            <div className="relative">
              <VideoPlayer
                src=""
                embedUrl={embedUrl}
                skipTimes={skipTimes.data}
                onEnded={() => {
                  const nextEp = episodeNum + 1;
                  if (nextEp <= maxAvailableEpisode) {
                    navigate(`/watch/${animeId}/${nextEp}`);
                  }
                }}
              />

              <div className="absolute top-3 right-3 z-20">
                <button
                  onClick={() => setServerOpen(!serverOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-void/80 backdrop-blur-sm border border-border-subtle text-xs text-text-secondary hover:text-text-primary hover:border-border-glow transition-all"
                >
                  {(() => {
                    const active = SERVERS.find((s) => s.id === server);
                    if (!active) return null;
                    const Icon = active.icon;
                    return <Icon className="w-3.5 h-3.5 stroke-[1.5]" />;
                  })()}
                  {SERVERS.find((s) => s.id === server)?.label || 'Server'}
                  <ChevronDown className="w-3 h-3 stroke-[1.5] ml-1 transition-transform" style={{ transform: serverOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {serverOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setServerOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-40 rounded-card bg-elevated border border-border-subtle shadow-xl z-20 overflow-hidden">
                      {SERVERS.filter((s) => s.id !== 'videasy' || anime?.anilist_id).map((s) => {
                        const Icon = s.icon;
                        return (
                          <button
                            key={s.id}
                            onClick={() => { setServer(s.id); setServerOpen(false); }}
                            className={cn(
                              'w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors',
                              server === s.id
                                ? 'bg-accent-primary/15 text-accent-glow'
                                : 'text-text-secondary hover:bg-surface hover:text-text-primary',
                            )}
                          >
                            <Icon className="w-3.5 h-3.5 stroke-[1.5]" />
                            {s.label}
                            {server === s.id && <span className="ml-auto text-[10px] text-accent-glow">Active</span>}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Episode title, metadata, Add to List, Description */}
            {currentEpisode && anime && (
              <WatchInfo
                animeId={anime.mal_id}
                animeTitle={anime.title_english || anime.title}
                animeImage={anime.images.jpg?.image_url || ''}
                episode={currentEpisode}
                totalEpisodes={episodes.data?.length || anime.episodes || 0}
                currentEpisode={episodeNum}
                maxEpisode={isAiring ? maxAvailableEpisode : undefined}
                description={anime.synopsis}
              />
            )}

          </div>

          {/* Sidebar: episodes */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="space-y-6">
              {/* Anime Quick Info Panel */}
              {anime && (
                <div className="flex items-center gap-3 p-3 glass-card rounded-card border border-border-subtle bg-elevated/20">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border-glow shadow-glow-sm flex-shrink-0 bg-void">
                    <img 
                      src={anime.images.webp?.image_url || anime.images.jpg?.image_url} 
                      alt={anime.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/anime/${anime.mal_id}`} className="font-display font-semibold text-text-primary text-sm hover:text-accent-glow transition-colors line-clamp-1">
                      {anime.title_english || anime.title}
                    </Link>
                    <p className="text-xs text-text-muted mt-0.5 truncate flex items-center gap-1">
                      <span>Studio:</span>
                      <span className="text-text-secondary font-medium">
                        {anime.studios?.[0]?.name || 'Unknown Studio'}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Episodes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display font-semibold text-sm text-text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent-glow stroke-[1.5]" />
                    Episodes
                  </h2>
                  {episodes.data && (
                    <span className="text-xs text-text-muted font-mono">
                      {isAiring
                        ? `${episodes.data.filter((e) => e.aired !== null && e.aired !== '').length}/${episodes.data.length}`
                        : episodes.data.length}
                    </span>
                  )}
                </div>
                <div className="glass-card rounded-card p-2">
                  {episodes.isLoading ? (
                    <div className="space-y-1">
                      {Array.from({ length: 6 }).map((_, i) => <EpisodeSkeleton key={i} />)}
                    </div>
                  ) : episodes.data ? (
                    <EpisodeList animeId={animeId} episodes={episodes.data} currentEpisode={episodeNum} isAiring={isAiring} />
                  ) : null}
                </div>
              </div>

              {/* Next episode countdown for airing anime */}
              {isAiring && episodes.data && (() => {
                const nextEp = episodes.data.find((ep) => ep.aired === null && ep.airing_at);
                if (!nextEp || !nextEp.airing_at) return null;
                const airDate = new Date(nextEp.airing_at * 1000).toISOString();
                return (
                  <div className="glass-card rounded-card p-3 flex items-center gap-3 border border-border-subtle">
                    <div className="w-8 h-8 rounded-full bg-accent-primary/15 flex items-center justify-center flex-shrink-0">
                      <Radio className="w-4 h-4 text-accent-glow stroke-[1.5]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-text-secondary">Next: Ep {nextEp.episode} airs in</p>
                      <CountdownTimer targetDate={airDate} className="text-sm" />
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Similar Anime - genre-based suggestions */}
        {similar.data && similar.data.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border-subtle">
            <h2 className="font-display font-semibold text-lg text-text-primary mb-4 flex items-center gap-1.5">
              <ListVideo className="w-4 h-4 text-accent-glow stroke-[1.5]" />
              More Like This
            </h2>
            <ScrollableRow>
              {similar.data.map((item) => (
                <MiniAnimeCard key={item.mal_id} anime={item} />
              ))}
            </ScrollableRow>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
