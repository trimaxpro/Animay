import { Link } from 'react-router-dom';
import { Check, Play } from 'lucide-react';
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
              <div className={cn(
                'w-8 h-8 rounded-card flex items-center justify-center flex-shrink-0',
                isCurrent ? 'bg-accent-primary text-white' : 'bg-elevated',
              )}>
                {watched && !isCurrent ? (
                  <Check className="w-4 h-4 text-green-400 stroke-[1.5]" />
                ) : (
                  <span className={cn('font-mono text-xs font-medium', isCurrent ? 'text-white' : 'text-text-muted')}>
                    {ep.episode}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm line-clamp-1', isCurrent ? 'text-text-primary' : 'text-text-secondary')}>
                  {ep.title || `Episode ${ep.episode}`}
                </p>
                {ep.filler && <Badge variant="amber" className="ml-1">Filler</Badge>}
              </div>
              <Play className={cn('w-3.5 h-3.5 flex-shrink-0 stroke-[1.5]', isCurrent ? 'text-accent-glow' : 'text-text-muted')} />
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
}
