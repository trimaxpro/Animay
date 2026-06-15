import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { VideoPlayer } from '@/components/watch/VideoPlayer';
import { EpisodeList } from '@/components/watch/EpisodeList';
import { WatchInfo } from '@/components/watch/WatchInfo';
import { EmptyState } from '@/components/ui/EmptyState';
import { HeroSkeleton, EpisodeSkeleton } from '@/components/ui/Skeleton';
import { DotPattern } from '@/components/ui/DotPattern';
import { useAnimeDetail, useAnimeEpisodes, useSkipTimes } from '@/hooks/useAnime';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

export default function WatchPage() {
  const { id, episode: episodeParam } = useParams<{ id: string; episode: string }>();
  const animeId = Number(id);
  const episodeNum = Number(episodeParam) || 1;

  const detail = useAnimeDetail(animeId);
  const episodes = useAnimeEpisodes(animeId);
  const skipTimes = useSkipTimes(animeId, episodeNum);
  const { addToHistory } = useWatchHistory();
  const navigate = useNavigate();

  const anime = detail.data;
  const currentEpisode = episodes.data?.find((ep) => ep.episode === episodeNum);

  useEffect(() => {
    if (anime && currentEpisode) {
      addToHistory({
        malId: anime.mal_id,
        title: anime.title_english || anime.title,
        image: anime.images.jpg?.image_url || '',
        episode: episodeNum,
        progress: 0,
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
    <PageWrapper className="pt-20 pb-12">
      <VideoPlayer
        src=""
        skipTimes={skipTimes.data}
        onEnded={() => {
          const nextEp = episodeNum + 1;
          if (episodes.data && nextEp <= episodes.data.length) {
            navigate(`/watch/${animeId}/${nextEp}`);
          }
        }}
      />

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 min-w-0 space-y-6">
            {currentEpisode && anime && (
              <WatchInfo
                animeId={animeId}
                animeTitle={anime.title_english || anime.title}
                episode={currentEpisode}
                totalEpisodes={anime.episodes || episodes.data?.length || 0}
                currentEpisode={episodeNum}
              />
            )}

            <div className="relative rounded-card glass-card p-6 min-h-[150px]">
              <DotPattern opacity={0.3} />
              <div className="relative z-10 flex flex-col items-center justify-center text-center gap-2">
                <MessageSquare className="w-8 h-8 text-text-muted stroke-[1.5]" />
                <p className="text-text-secondary text-sm">Comments coming soon</p>
              </div>
            </div>
          </div>

          <div className="lg:w-[320px] flex-shrink-0">
            <div className="glass-card rounded-card p-4 sticky top-20">
              {anime && (
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-border-subtle">
                  <img
                    src={anime.images.jpg?.image_url}
                    alt={anime.title}
                    className="w-12 h-16 rounded-card object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium line-clamp-2">{anime.title_english || anime.title}</p>
                    <Link to={`/anime/${animeId}`} className="text-xs text-accent-glow hover:underline">Back to Details</Link>
                  </div>
                </div>
              )}
              <h3 className="font-display font-semibold text-sm text-text-primary mb-2">Episodes</h3>
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
