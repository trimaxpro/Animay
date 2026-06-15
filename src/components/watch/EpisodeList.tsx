import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Badge } from '@/components/ui/Badge';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { cn } from '@/utils/cn';
import type { Episode } from '@/types/anime';

interface EpisodeListProps {
  animeId: number;
  episodes: Episode[];
  currentEpisode: number;
}

export function EpisodeList({ animeId, episodes, currentEpisode }: EpisodeListProps) {
  const { getProgress } = useWatchHistory();

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-1">
        {episodes.map((ep) => {
          const progress = getProgress(animeId, ep.episode);
          const watched = progress > 0.9;
          const isCurrent = ep.episode === currentEpisode;

          return (
            <Link
              key={ep.mal_id}
              to={`/watch/${animeId}/${ep.episode}`}
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-card transition-all duration-200',
                isCurrent
                  ? 'bg-accent-primary/15 border border-accent-primary/30'
                  : 'hover:bg-elevated border border-transparent',
              )}
            >
              <span className={cn('font-mono text-xs w-6 text-right flex-shrink-0 tabular-nums', isCurrent ? 'text-accent-glow font-semibold' : watched ? 'text-green-400' : 'text-text-muted')}>
                {watched && !isCurrent ? '✓' : `${ep.episode}.`}
              </span>
              <div className="flex-1 min-w-0 flex items-center gap-2">
                <span className={cn('text-sm line-clamp-1', isCurrent ? 'text-text-primary font-medium' : 'text-text-secondary')}>
                  {ep.title || `Episode ${ep.episode}`}
                </span>
                {ep.filler && <Badge variant="amber">Filler</Badge>}
              </div>
              <Play className={cn('w-3.5 h-3.5 flex-shrink-0 stroke-[1.5]', isCurrent ? 'text-accent-glow' : 'text-text-muted')} />
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}
