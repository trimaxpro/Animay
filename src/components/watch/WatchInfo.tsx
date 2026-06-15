import { ChevronLeft, ChevronRight } from 'lucide-react';
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
      <div>
        <Link to={`/anime/${animeId}`} className="text-text-muted text-sm hover:text-accent-glow transition-colors">
          {animeTitle}
        </Link>
        <h2 className="font-display font-semibold text-xl text-text-primary mt-1">
          Episode {episode.episode}: {episode.title || 'Untitled'}
        </h2>
        {episode.aired && (
          <p className="text-text-muted text-xs mt-1">Aired {new Date(episode.aired).toLocaleDateString()}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {hasPrev ? (
          <Link
            to={`/watch/${animeId}/${currentEpisode - 1}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-card bg-elevated border border-border-subtle text-sm text-text-secondary hover:border-border-glow hover:text-text-primary transition-all"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            Previous
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-card bg-elevated text-sm text-text-muted cursor-not-allowed">
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            Previous
          </span>
        )}
        {hasNext ? (
          <Link
            to={`/watch/${animeId}/${currentEpisode + 1}`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-card bg-accent-primary text-sm text-white hover:bg-accent-glow transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-card bg-elevated text-sm text-text-muted cursor-not-allowed">
            Next
            <ChevronRight className="w-4 h-4 stroke-[1.5]" />
          </span>
        )}
      </div>
    </div>
  );
}
