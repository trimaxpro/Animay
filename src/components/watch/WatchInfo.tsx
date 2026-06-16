import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookmarkPlus, Check, Calendar, Film, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useWatchlist } from '@/hooks/useWatchlist';
import type { Episode } from '@/types/anime';

interface WatchInfoProps {
  animeId: number;
  animeTitle: string;
  animeImage: string;
  episode: Episode;
  totalEpisodes: number;
  currentEpisode: number;
  description: string | null;
}

export function WatchInfo({ animeId, animeTitle, animeImage, episode, totalEpisodes, currentEpisode, description }: WatchInfoProps) {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [descExpanded, setDescExpanded] = useState(false);
  const hasPrev = currentEpisode > 1;
  const hasNext = currentEpisode < totalEpisodes;
  const inList = isInWatchlist(animeId);
  const descTruncated = description && description.length > 280;

  return (
    <div className="mt-4 space-y-6">
      {/* Episode title + metadata */}
      <div>
        <div className="flex items-center gap-3 text-sm text-text-muted mb-2">
          <span className="flex items-center gap-1.5">
            <Film className="w-4 h-4 stroke-[1.5]" />
            EP {currentEpisode}/{totalEpisodes}
          </span>
          {episode.aired && (
            <>
              <span className="text-border-subtle">•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 stroke-[1.5]" />
                {new Date(episode.aired).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </>
          )}
        </div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-text-primary leading-tight mb-1.5">
          {episode.title || `Episode ${episode.episode}`}
        </h1>
        <Link to={`/anime/${animeId}`} className="text-sm text-text-muted hover:text-accent-glow transition-colors inline-flex items-center gap-1.5">
          {animeTitle}
        </Link>
        <Button
          variant={inList ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => toggleWatchlist({ malId: animeId, title: animeTitle, image: animeImage })}
          className="ml-3"
        >
          {inList ? <Check className="w-4 h-4 stroke-[1.5]" /> : <BookmarkPlus className="w-4 h-4 stroke-[1.5]" />}
          {inList ? 'In List' : 'Add to List'}
        </Button>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center gap-3">
        {hasPrev ? (
          <Link to={`/watch/${animeId}/${currentEpisode - 1}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-elevated border border-border-subtle text-sm text-text-secondary hover:border-border-glow hover:text-text-primary transition-all"
          >
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            Previous
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-elevated/50 text-sm text-text-muted cursor-not-allowed">
            <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
            Previous
          </span>
        )}
        <div className="flex-1 h-px bg-border-subtle" />
        {hasNext ? (
          <Link to={`/watch/${animeId}/${currentEpisode + 1}`}
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

      {/* Description */}
      {description && (
        <div className="border-t border-border-subtle pt-4">
          <h2 className="font-display font-semibold text-base text-text-primary mb-2">Description</h2>
          <div className="relative">
            <p className={`text-sm text-text-secondary leading-relaxed ${!descExpanded && descTruncated ? 'line-clamp-4' : ''}`}>
              {description}
            </p>
            {descTruncated && (
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                className="flex items-center gap-1 text-sm text-accent-glow hover:underline mt-1"
              >
                {descExpanded ? <ChevronUp className="w-3.5 h-3.5 stroke-[1.5]" /> : <ChevronDown className="w-3.5 h-3.5 stroke-[1.5]" />}
                {descExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
