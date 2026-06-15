import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useWatchHistory } from '@/hooks/useWatchHistory';

export function ContinueWatching() {
  const { watchHistory } = useWatchHistory();

  const uniqueAnime = watchHistory.reduce(
    (acc, h) => {
      if (!acc[h.malId] || new Date(h.lastWatched) > new Date(acc[h.malId].lastWatched)) {
        acc[h.malId] = h;
      }
      return acc;
    },
    {} as Record<number, (typeof watchHistory)[0]>,
  );

  const entries = Object.values(uniqueAnime).slice(0, 10);

  if (entries.length === 0) return null;

  return (
    <section className="py-6">
      <h2 className="font-display font-bold text-xl md:text-2xl text-text-primary mb-4 px-4 max-w-7xl mx-auto">
        Continue Watching
      </h2>
      <div className="flex gap-4 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: 'none' }}>
        {entries.map((entry) => (
          <Link
            key={`${entry.malId}-${entry.episode}`}
            to={`/watch/${entry.malId}/${entry.episode}`}
            className="flex-shrink-0 w-[220px] group"
          >
            <div className="relative aspect-video rounded-card overflow-hidden bg-elevated mb-2">
              <img
                src={entry.image}
                alt={entry.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-void/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-8 h-8 text-white fill-white stroke-[1.5]" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-elevated">
                <div
                  className="h-full bg-accent-primary rounded-full"
                  style={{ width: `${Math.min(entry.progress * 100, 100)}%` }}
                />
              </div>
            </div>
            <p className="text-sm font-body text-text-primary line-clamp-2">{entry.title}</p>
            <p className="text-xs text-text-muted mt-0.5">Episode {entry.episode}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
