import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';
import { ANIME_TYPES, ANIME_STATUS, SEASONS, SCORE_FILTERS, GENRES } from '@/utils/constants';
import * as Accordion from '@radix-ui/react-accordion';

interface FilterState {
  type: string;
  status: string;
  season: string;
  year: string;
  score: string;
  genres: string[];
  sort: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  className?: string;
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Accordion.Item value={title} className="border-b border-border-subtle">
      <Accordion.Trigger className="flex items-center justify-between w-full py-3 text-sm font-body font-medium text-text-primary hover:text-accent-glow transition-colors group">
        {title}
        <ChevronDown className="w-4 h-4 text-text-muted group-data-[state=open]:rotate-180 transition-transform stroke-[1.5]" />
      </Accordion.Trigger>
      <Accordion.Content className="pb-3 overflow-hidden data-[state=open]:animate-slide-down data-[state=closed]:animate-slide-up">
        {children}
      </Accordion.Content>
    </Accordion.Item>
  );
}

export type { FilterState };
export { FilterSection };

export function FilterPanel({ filters, onChange, className }: FilterPanelProps) {
  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  const toggleGenre = (genreName: string) => {
    const genres = filters.genres.includes(genreName)
      ? filters.genres.filter((g) => g !== genreName)
      : [...filters.genres, genreName];
    update({ genres });
  };

  const clearAll = () => {
    onChange({ type: '', status: '', season: '', year: '', score: '', genres: [], sort: 'popularity' });
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-text-primary">Filters</h3>
        <button onClick={clearAll} className="text-xs text-text-muted hover:text-accent-rose transition-colors">
          Clear All
        </button>
      </div>

      <Accordion.Root type="multiple" defaultValue={['Type', 'Status', 'Season', 'Genre']} className="space-y-0">
        <FilterSection title="Type">
          <div className="flex flex-wrap gap-2">
            {ANIME_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => update({ type: filters.type === type ? '' : type })}
                className={cn(
                  'px-3 py-1 rounded-input text-xs font-body transition-all',
                  filters.type === type
                    ? 'bg-accent-primary/20 text-accent-glow border border-accent-primary/30'
                    : 'bg-elevated text-text-secondary border border-border-subtle hover:border-border-glow',
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Status">
          <div className="flex flex-wrap gap-2">
            {ANIME_STATUS.map((status) => (
              <button
                key={status}
                onClick={() => update({ status: filters.status === status ? '' : status })}
                className={cn(
                  'px-3 py-1 rounded-input text-xs font-body transition-all',
                  filters.status === status.toLowerCase()
                    ? 'bg-accent-primary/20 text-accent-glow border border-accent-primary/30'
                    : 'bg-elevated text-text-secondary border border-border-subtle hover:border-border-glow',
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Season">
          <div className="flex flex-wrap gap-2">
            {SEASONS.map((season) => (
              <button
                key={season}
                onClick={() => update({ season: filters.season === season.toLowerCase() ? '' : season.toLowerCase() })}
                className={cn(
                  'px-3 py-1 rounded-input text-xs font-body transition-all',
                  filters.season === season.toLowerCase()
                    ? 'bg-accent-primary/20 text-accent-glow border border-accent-primary/30'
                    : 'bg-elevated text-text-secondary border border-border-subtle hover:border-border-glow',
                )}
              >
                {season}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Score">
          <div className="flex flex-wrap gap-2">
            {SCORE_FILTERS.map((sf) => (
              <button
                key={sf.value}
                onClick={() => update({ score: filters.score === String(sf.value) ? '' : String(sf.value) })}
                className={cn(
                  'px-3 py-1 rounded-input text-xs font-body transition-all',
                  filters.score === String(sf.value)
                    ? 'bg-accent-amber/20 text-accent-amber border border-accent-amber/30'
                    : 'bg-elevated text-text-secondary border border-border-subtle hover:border-border-glow',
                )}
              >
                {sf.label}
              </button>
            ))}
          </div>
        </FilterSection>

        <FilterSection title="Genre">
          <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            {GENRES.map((genre) => (
              <label key={genre.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.genres.includes(String(genre.id))}
                  onChange={() => toggleGenre(String(genre.id))}
                  className="w-3.5 h-3.5 rounded-sm border-border-subtle accent-accent-primary"
                />
                <span className="text-xs text-text-secondary group-hover:text-text-primary transition-colors">
                  {genre.name}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </Accordion.Root>
    </div>
  );
}
