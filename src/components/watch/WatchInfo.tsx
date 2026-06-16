import { ChevronLeft, ChevronRight, Calendar, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Episode } from '@/types/anime';

interface WatchInfoProps {
  animeId: number;
  animeTitle: string;
  episode: Episode;
  totalEpisodes: number;
  currentEpisode: number;
}

export function WatchInfo({ animeId, animeTitle, episode, totalEpisodes, currentEpisode }: WatchInfoProps) {
  const hasPrev = currentEpisode > 1;
  const hasNext = currentEpisode < totalEpisodes;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Link to={`/anime/${animeId}`} className="text-text-muted text-xs hover:text-accent-glow transition-colors uppercase tracking-wider font-body">
            {animeTitle}
          </Link>
          <h2 className="font-display font-semibold text-xl text-text-primary mt-1 leading-tight">
            Episode {episode.episode}{episode.title ? <span className="text-text-secondary font-normal"> — {episode.title}</span> : ''}
          </h2>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-text-muted font-mono flex items-center gap-1"><Film className="w-3 h-3 stroke-[1.5]" /> EP {currentEpisode}/{totalEpisodes}</span>
            {episode.aired && (
              <span className="flex items-center gap-1 text-xs text-text-muted">
                <Calendar className="w-3 h-3 stroke-[1.5]" />
                {new Date(episode.aired).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasPrev ? (
          <Link
            to={`/watch/${animeId}/${currentEpisode - 1}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-elevated border border-border-subtle text-sm text-text-secondary hover:border-border-glow hover:text-text-primary hover:bg-accent-primary/10 transition-all"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            Prev
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-elevated/50 text-sm text-text-muted cursor-not-allowed">
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            Prev
          </span>
        )}
        <div className="flex-1 h-px bg-border-subtle mx-2" />
        <span className="text-xs text-text-muted font-mono">
          {currentEpisode}/{totalEpisodes}
        </span>
        <div className="flex-1 h-px bg-border-subtle mx-2" />
        {hasNext ? (
          <Link
            to={`/watch/${animeId}/${currentEpisode + 1}`}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-card bg-accent-primary text-sm text-white hover:bg-accent-glow transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-elevated/50 text-sm text-text-muted cursor-not-allowed">
            Next
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </span>
        )}
      </div>
    </div>
  );
}
