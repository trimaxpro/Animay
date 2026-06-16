import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Film } from 'lucide-react';
import { ScrollableRow } from '@/components/ui/ScrollableRow';
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

  const entries = Object.values(uniqueAnime).slice(0, 12);

  if (entries.length === 0) return null;

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <h2 className="font-display font-bold text-xl md:text-2xl text-text-primary mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-accent-glow stroke-[1.5]" />
        Continue Watching
      </h2>
      <ScrollableRow>
        {entries.map((entry, i) => (
          <motion.div
            key={`${entry.malId}-${entry.episode}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="flex-shrink-0 w-[160px] md:w-[180px] group relative flex flex-col gap-2"
          >
            <Link
              to={`/watch/${entry.malId}/${entry.episode}`}
              className="block relative aspect-[3/4] rounded-card overflow-hidden bg-elevated"
            >
              <img
                src={entry.image}
                alt={entry.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-accent-primary/90 flex items-center justify-center shadow-glow">
                  <Play className="w-5 h-5 text-white fill-white stroke-[1.5]" />
                </div>
              </div>
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-void/70 backdrop-blur-sm text-xs text-text-primary">
                <Film className="w-3 h-3 stroke-[1.5]" />
                EP {entry.episode}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-elevated/80">
                <div
                  className="h-full bg-accent-primary rounded-full transition-all"
                  style={{ width: `${Math.min(entry.progress * 100, 100)}%` }}
                />
              </div>
              {entry.progress > 0 && (
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-void/70 backdrop-blur-sm text-[10px] font-mono text-text-muted">
                  {Math.round(entry.progress * 100)}%
                </div>
              )}
            </Link>
            <div className="flex flex-col gap-1">
              <h3 className="font-display font-semibold text-sm text-text-primary line-clamp-2 leading-tight">
                <Link to={`/watch/${entry.malId}/${entry.episode}`} className="hover:text-accent-glow transition-colors">
                  {entry.title}
                </Link>
              </h3>
              <p className="text-xs text-text-muted">Episode {entry.episode}</p>
            </div>
          </motion.div>
        ))}
      </ScrollableRow>
    </section>
  );
}
