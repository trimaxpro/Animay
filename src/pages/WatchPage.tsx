import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { VideoPlayer } from '@/components/watch/VideoPlayer';
import { EpisodeList } from '@/components/watch/EpisodeList';
import { WatchInfo } from '@/components/watch/WatchInfo';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeroSkeleton, EpisodeSkeleton } from '@/components/ui/Skeleton';
import { useAnimeDetail, useAnimeEpisodes, useSkipTimes } from '@/hooks/useAnime';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { AlertCircle, Server, Monitor, Globe } from 'lucide-react';
import { cn } from '@/utils/cn';

const SERVERS = [
  { id: 'mal', label: 'MegaPlay', description: 'MAL', icon: Monitor },
  { id: 'filmu', label: 'FilmU', description: 'AniList', icon: Server },
  { id: 'embed', label: 'TryEmbed', description: 'AniList', icon: Globe },
  { id: 'anikoto', label: 'Anikoto', description: 'AniList', icon: Server },
] as const;

export default function WatchPage() {
  const { id, episode: episodeParam } = useParams<{ id: string; episode: string }>();
  const animeId = Number(id);
  const episodeNum = Number(episodeParam) || 1;
  const [server, setServer] = useState<string>('mal');

  const detail = useAnimeDetail(animeId);
  const episodes = useAnimeEpisodes(animeId);
  const skipTimes = useSkipTimes(animeId, episodeNum);
  const { addToHistory } = useWatchHistory();
  const navigate = useNavigate();

  const anime = detail.data;
  const currentEpisode = episodes.data?.find((ep) => ep.episode === episodeNum);

  const anilistId = anime?.anilist_id || animeId;
  const embedUrl = server === 'mal'
    ? `https://megaplay.buzz/stream/mal/${animeId}/${episodeNum}/sub`
    : server === 'filmu'
    ? `https://embed.filmu.in/embed/anime/${anilistId}/${episodeNum}/sub`
    : server === 'anikoto'
    ? `https://megaplay.buzz/stream/ani/${anilistId}/${episodeNum}/sub`
    : `https://tryembed.us.cc/embed/anime/${anilistId}/${episodeNum}/sub`;

  useEffect(() => {
    if (anime && currentEpisode) {
      addToHistory({
        malId: anime.mal_id,
        title: anime.title_english || anime.title,
        image: anime.images.jpg?.image_url || '',
        episode: episodeNum,
        progress: 0.01,
      });
    }
  }, [anime?.mal_id, episodeNum]);

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
    return <PageWrapper className="pt-20"><HeroSkeleton /></PageWrapper>;
  }

  return (
    <PageWrapper className="pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0">
            <VideoPlayer
              src=""
              embedUrl={embedUrl}
              skipTimes={skipTimes.data}
              onEnded={() => {
                const nextEp = episodeNum + 1;
                if (episodes.data && nextEp <= episodes.data.length) {
                  navigate(`/watch/${animeId}/${nextEp}`);
                }
              }}
            />

            <div className="flex items-center justify-end gap-1.5 mt-3 mb-6">
              <span className="text-xs text-text-muted font-body mr-1">Server:</span>
              {SERVERS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServer(s.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-input text-xs font-body transition-all',
                    server === s.id
                      ? 'bg-accent-primary/20 text-accent-glow border border-accent-primary/30'
                      : 'bg-elevated text-text-secondary border border-border-subtle hover:border-border-glow hover:text-text-primary',
                  )}
                >
                  <s.icon className="w-3 h-3 stroke-[1.5]" />
                  {s.label}
                </button>
              ))}
            </div>

            {currentEpisode && anime && (
              <div className="glass-card rounded-card p-5">
                <WatchInfo
                  animeId={animeId}
                  animeTitle={anime.title_english || anime.title}
                  episode={currentEpisode}
                  totalEpisodes={anime.episodes || episodes.data?.length || 0}
                  currentEpisode={episodeNum}
                />
              </div>
            )}
          </div>

          <div className="lg:w-[360px] flex-shrink-0">
            <div className="glass-card rounded-card p-4 sticky top-20">
              {anime && (
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border-subtle">
                  <img
                    src={anime.images.jpg?.image_url}
                    alt={anime.title}
                    className="w-14 h-20 rounded-card object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium line-clamp-2 leading-snug">{anime.title_english || anime.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-text-muted">{episodeNum}/{anime.episodes || episodes.data?.length || '?'}</span>
                      <span className="text-xs text-text-muted">•</span>
                      <Link to={`/anime/${animeId}`} className="text-xs text-accent-glow hover:underline">Details</Link>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-sm text-text-primary">Episodes</h3>
                {episodes.data && (
                  <span className="text-xs text-text-muted">{episodes.data.length} total</span>
                )}
              </div>
              {episodes.isLoading ? (
                <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <EpisodeSkeleton key={i} />)}</div>
              ) : episodes.data ? (
                <EpisodeList animeId={animeId} episodes={episodes.data} currentEpisode={episodeNum} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
