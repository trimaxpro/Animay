import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { DotPattern } from '@/components/ui/DotPattern';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookmarkPlus, CalendarDays, Clock, Tv, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { apiClient } from '@/api/client';
import type { Anime } from '@/types/anime';
import { DAYS } from '@/utils/constants';

function getToday(): string {
  return DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
}

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState(getToday());

  const { data, isLoading } = useQuery({
    queryKey: ['schedule', activeDay],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Anime[] }>(`/schedule/${activeDay}`);
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <PageWrapper className="pt-24 pb-12">
      <div className="relative mb-8 px-4">
        <DotPattern opacity={0.3} />
        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-text-primary flex items-center gap-3"><CalendarDays className="w-8 h-8 text-accent-glow stroke-[1.5]" /> Airing Schedule</h1>
          <p className="text-text-secondary text-sm mt-1 flex items-center gap-1.5"><Radio className="w-4 h-4 text-accent-glow stroke-[1.5]" /> Stay up to date with your favorite shows</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={cn(
                'px-4 py-2 rounded-card text-sm font-body font-medium transition-all flex-shrink-0',
                activeDay === day
                  ? 'bg-accent-primary text-white shadow-glow-sm'
                  : 'bg-elevated text-text-secondary border border-border-subtle hover:border-border-glow',
              )}
            >
              {day}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="shimmer h-20 rounded-card" />
              ))
            : data?.map((anime) => (
                <div key={anime.mal_id} className="glass-card rounded-card p-4 flex items-center gap-4">
                  <Link to={`/anime/${anime.mal_id}`} className="flex-shrink-0">
                    <img
                      src={anime.images.jpg?.image_url}
                      alt={anime.title}
                      className="w-12 h-16 rounded-card object-cover hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/anime/${anime.mal_id}`} className="text-sm font-medium text-text-primary hover:text-accent-glow transition-colors line-clamp-1">
                      {anime.title_english || anime.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                      {anime.broadcast?.time && <span className="text-xs text-text-muted flex items-center gap-1"><Clock className="w-3 h-3 stroke-[1.5]" /> {anime.broadcast.time} JST</span>}
                      {anime.type && <span className="text-xs text-text-muted flex items-center gap-1"><Tv className="w-3 h-3 stroke-[1.5]" /> {anime.type}</span>}
                      {anime.genres[0] && <Badge variant="violet" className="text-[10px]">{anime.genres[0].name}</Badge>}
                    </div>
                  </div>
                  <Link to={`/anime/${anime.mal_id}`}>
                    <Button variant="ghost" size="sm">
                      <BookmarkPlus className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
        </div>
      </div>
    </PageWrapper>
  );
}
