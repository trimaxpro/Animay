import { Link } from 'react-router-dom';
import { Check, Play, Hash } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { EpisodeSkeleton } from '@/components/ui/Skeleton';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import type { Episode } from '@/types/anime';

interface EpisodeGridProps {
  animeId: number;
  episodes: Episode[];
  isLoading: boolean;
}

export function EpisodeGrid({ animeId, episodes, isLoading }: EpisodeGridProps) {
  const { getProgress } = useWatchHistory();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => <EpisodeSkeleton key={i} />)}
      </div>
    );
  }

  if (episodes.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {episodes.map((ep) => {
        const progress = getProgress(animeId, ep.episode);
        const watched = progress > 0.9;

        return (
          <Link
            key={ep.mal_id}
            to={`/watch/${animeId}/${ep.episode}`}
            className={`flex items-center gap-3 p-3 rounded-card border transition-all duration-200 hover:border-border-glow hover:shadow-glow-sm group ${
              watched ? 'bg-elevated/50 border-border-subtle opacity-70' : 'glass-card border-border-subtle'
            }`}
          >
            <div className="w-10 h-10 rounded-card bg-elevated flex items-center justify-center flex-shrink-0 group-hover:bg-accent-primary/20 transition-colors">
              {watched ? (
                <Check className="w-4 h-4 text-green-400 stroke-[1.5]" />
              ) : (
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-text-muted stroke-[1.5]" />
                  <span className="font-mono font-medium text-sm text-text-muted">{ep.episode}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary line-clamp-2">{ep.title || `Episode ${ep.episode}`}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {ep.aired && <span className="text-xs text-text-muted">{new Date(ep.aired).toLocaleDateString()}</span>}
                {ep.filler && <Badge variant="amber">Filler</Badge>}
                {ep.recap && <Badge variant="default">Recap</Badge>}
              </div>
            </div>
            <Play className="w-4 h-4 text-text-muted group-hover:text-accent-glow transition-colors flex-shrink-0 stroke-[1.5]" />
          </Link>
        );
      })}
    </div>
  );
}
