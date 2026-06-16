import { formatNumber } from '@/utils/format';
import { Film, Clock, Star, BarChart3, Heart, Users, Award, Bookmark, Calendar, Tv, Hash, Globe } from 'lucide-react';
import type { Anime } from '@/types/anime';

interface InfoPanelProps {
  anime: Anime;
}

const infoIcons: Record<string, typeof Film> = {
  Type: Tv, Episodes: Hash, Duration: Clock, Status: Heart,
  Aired: Calendar, Premiered: Calendar, Summary: Bookmark, Source: Globe, Rating: Award,
};

const statIcons: Record<string, typeof Star> = {
  Score: Star, Ranked: Award, Popularity: BarChart3, Members: Users, Favorites: Heart,
};

export function InfoPanel({ anime }: InfoPanelProps) {
  const infoItems = [
    { label: 'Type', value: anime.type },
    { label: 'Episodes', value: anime.episodes?.toString() },
    { label: 'Duration', value: anime.duration },
    { label: 'Status', value: anime.status },
    { label: 'Aired', value: anime.aired?.string },
    { label: 'Premiered', value: anime.season && anime.year ? `${anime.season} ${anime.year}` : null },
    { label: 'Summary', value: anime.synopsis },
    { label: 'Source', value: anime.source },
    { label: 'Rating', value: anime.rating },
  ].filter((item) => item.value);

  const statItems = [
    { label: 'Score', value: anime.score?.toFixed(1) },
    { label: 'Ranked', value: anime.rank ? `#${anime.rank}` : null },
    { label: 'Popularity', value: anime.popularity ? `#${anime.popularity}` : null },
    { label: 'Members', value: anime.members ? formatNumber(anime.members) : null },
    { label: 'Favorites', value: anime.favorites ? formatNumber(anime.favorites) : null },
  ].filter((item) => item.value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-3">Information</h3>
        <div className="space-y-2">
          {infoItems.map((item) => {
            const Icon = infoIcons[item.label] || Film;
            return (
              <div key={item.label} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0 stroke-[1.5]" />
                <span className="text-text-muted text-sm w-20 flex-shrink-0">{item.label}</span>
                <span className="text-text-secondary text-sm">{item.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="font-display font-semibold text-lg text-text-primary mb-3">Statistics</h3>
        <div className="space-y-2">
          {statItems.map((item) => {
            const Icon = statIcons[item.label] || Star;
            return (
              <div key={item.label} className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0 stroke-[1.5]" />
                <span className="text-text-muted text-sm w-24 flex-shrink-0">{item.label}</span>
                <span className="text-text-primary text-sm font-mono font-medium">{item.value}</span>
              </div>
            );
          })}
        </div>

        {anime.relations && anime.relations.length > 0 && (
          <div className="mt-6">
            <h3 className="font-display font-semibold text-lg text-text-primary mb-3">Related</h3>
            <div className="space-y-2">
              {anime.relations.slice(0, 5).map((rel, i) => (
                <div key={i} className="text-sm">
                  <span className="text-text-muted">{rel.relation}: </span>
                  <span className="text-text-secondary">{rel.entry.map((e) => e.name).join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
