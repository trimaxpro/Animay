import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { VideoPlayer } from '@/components/watch/VideoPlayer';
import { EpisodeList } from '@/components/watch/EpisodeList';
import { WatchInfo } from '@/components/watch/WatchInfo';
import { MiniAnimeCard } from '@/components/ui/MiniAnimeCard';
import { ScrollableRow } from '@/components/ui/ScrollableRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeroSkeleton, EpisodeSkeleton } from '@/components/ui/Skeleton';
import { useAnimeDetail, useAnimeEpisodes, useSkipTimes, useRecommendations } from '@/hooks/useAnime';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { AlertCircle, Server, Monitor, Globe, ThumbsUp, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

const SERVERS = [
  { id: 'mal', label: 'MegaPlay', icon: Monitor },
  { id: 'filmu', label: 'FilmU', icon: Server },
  { id: 'embed', label: 'TryEmbed', icon: Globe },
  { id: 'anikoto', label: 'Anikoto', icon: Server },
] as const;

export default function WatchPage() {
  const { id, episode: episodeParam } = useParams<{ id: string; episode: string }>();
  const animeId = Number(id);
  const episodeNum = Number(episodeParam) || 1;
  const [server, setServer] = useState<string>('mal');

  const detail = useAnimeDetail(animeId);
  const episodes = useAnimeEpisodes(animeId);
  const skipTimes = useSkipTimes(animeId, episodeNum);
  const recommendations = useRecommendations(animeId);
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
    return <PageWrapper className="pt-16"><HeroSkeleton /></PageWrapper>;
  }

  return (
    <PageWrapper className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content: player + info + description + recommendations */}
          <div className="flex-1 min-w-0">
            {/* Player */}
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

            {/* Server selector */}
            <div className="flex items-center gap-1.5 mt-3 mb-4">
              <span className="text-xs text-text-muted mr-1">Server:</span>
              {SERVERS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServer(s.id)}
                  className={cn(
                    'flex items-center gap-1 px-2.5 py-1 rounded-input text-xs transition-all',
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

            {/* Episode title, metadata, Add to List, Description */}
            {currentEpisode && anime && (
              <WatchInfo
                animeId={anime.mal_id}
                animeTitle={anime.title_english || anime.title}
                animeImage={anime.images.jpg?.image_url || ''}
                episode={currentEpisode}
                totalEpisodes={anime.episodes || episodes.data?.length || 0}
                currentEpisode={episodeNum}
                description={anime.synopsis}
              />
            )}

          </div>

          {/* Sidebar: episodes */}
          <div className="lg:w-[380px] flex-shrink-0">
            <div className="space-y-6">
              {/* Anime info card */}
              {anime && (
                <div className="glass-card rounded-card p-3 flex items-center gap-3">
                  <img
                    src={anime.images.jpg?.image_url}
                    alt={anime.title}
                    className="w-12 h-16 rounded-card object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-semibold text-sm text-text-primary line-clamp-2 leading-snug">
                      {anime.title_english || anime.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                      <span className="font-mono">EP {episodeNum}/{anime.episodes || episodes.data?.length || '?'}</span>
                      <span>•</span>
                      <Link to={`/anime/${animeId}`} className="text-accent-glow hover:underline">Details</Link>
                    </div>
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
                    <span className="text-xs text-text-muted font-mono">{episodes.data.length}</span>
                  )}
                </div>
                <div className="glass-card rounded-card p-2">
                  {episodes.isLoading ? (
                    <div className="space-y-1">
                      {Array.from({ length: 6 }).map((_, i) => <EpisodeSkeleton key={i} />)}
                    </div>
                  ) : episodes.data ? (
                    <EpisodeList animeId={animeId} episodes={episodes.data} currentEpisode={episodeNum} />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations - full width below both columns */}
        {recommendations.data && recommendations.data.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border-subtle">
            <h2 className="font-display font-semibold text-lg text-text-primary mb-4 flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-accent-glow stroke-[1.5]" />
              Recommended
            </h2>
            <ScrollableRow>
              {recommendations.data.map((item) => (
                <MiniAnimeCard key={item.mal_id} anime={item} />
              ))}
            </ScrollableRow>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
