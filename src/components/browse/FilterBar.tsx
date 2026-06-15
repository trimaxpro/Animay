import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown } from 'lucide-react';
import { ANIME_TYPES, ANIME_STATUS, SEASONS, SCORE_FILTERS, GENRES } from '@/utils/constants';
import type { FilterState } from './FilterPanel';

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

interface DropdownProps {
  label: string;
  activeLabel: string;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function FilterDropdown({ label, activeLabel, isActive, isOpen, onToggle, children }: DropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-input text-xs font-body transition-all whitespace-nowrap',
          isActive
            ? 'bg-accent-primary/20 text-accent-glow border border-accent-primary/30'
            : 'bg-elevated text-text-secondary border border-border-subtle hover:border-border-glow hover:text-text-primary',
        )}
      >
        <span>{label}: <span className="font-medium">{activeLabel}</span></span>
        <ChevronDown className={cn('w-3 h-3 stroke-[1.5] transition-transform', isOpen && 'rotate-180')} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[160px] glass-card rounded-card p-2 border border-border-subtle animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const update = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  const toggle = (key: string) => setOpenDropdown(openDropdown === key ? null : key);

  const close = () => setOpenDropdown(null);

  const clearAll = () => {
    onChange({ type: '', status: '', season: '', year: '', score: '', genres: [], sort: 'popularity' });
    close();
  };

  const toggleGenre = (id: string) => {
    const genres = filters.genres.includes(id)
      ? filters.genres.filter((g) => g !== id)
      : [...filters.genres, id];
    update({ genres });
  };

  const hasActive = filters.type || filters.status || filters.season || filters.score || filters.genres.length > 0;

  const activeCount = [filters.type, filters.status, filters.season, filters.score].filter(Boolean).length + (filters.genres.length > 0 ? 1 : 0);

  return (
    <div ref={ref}>
      <div className="glass-card rounded-card p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterDropdown
            label="Type"
            activeLabel={filters.type || 'All'}
            isActive={!!filters.type}
            isOpen={openDropdown === 'type'}
            onToggle={() => toggle('type')}
          >
            <button
              onClick={() => { update({ type: '' }); close(); }}
              className={cn('w-full text-left px-3 py-1.5 rounded-input text-xs transition-colors', !filters.type ? 'text-accent-glow bg-accent-primary/10' : 'text-text-secondary hover:text-text-primary hover:bg-elevated')}
            >
              All
            </button>
            {ANIME_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => { update({ type: filters.type === t ? '' : t }); close(); }}
                className={cn('w-full text-left px-3 py-1.5 rounded-input text-xs transition-colors', filters.type === t ? 'text-accent-glow bg-accent-primary/10' : 'text-text-secondary hover:text-text-primary hover:bg-elevated')}
              >
                {t}
              </button>
            ))}
          </FilterDropdown>

          <FilterDropdown
            label="Status"
            activeLabel={filters.status || 'All'}
            isActive={!!filters.status}
            isOpen={openDropdown === 'status'}
            onToggle={() => toggle('status')}
          >
            <button
              onClick={() => { update({ status: '' }); close(); }}
              className={cn('w-full text-left px-3 py-1.5 rounded-input text-xs transition-colors', !filters.status ? 'text-accent-glow bg-accent-primary/10' : 'text-text-secondary hover:text-text-primary hover:bg-elevated')}
            >
              All
            </button>
            {ANIME_STATUS.map((s) => (
              <button
                key={s}
                onClick={() => { update({ status: filters.status === s ? '' : s }); close(); }}
                className={cn('w-full text-left px-3 py-1.5 rounded-input text-xs transition-colors', filters.status === s ? 'text-accent-glow bg-accent-primary/10' : 'text-text-secondary hover:text-text-primary hover:bg-elevated')}
              >
                {s}
              </button>
            ))}
          </FilterDropdown>

          <FilterDropdown
            label="Season"
            activeLabel={filters.season ? filters.season.charAt(0).toUpperCase() + filters.season.slice(1) : 'All'}
            isActive={!!filters.season}
            isOpen={openDropdown === 'season'}
            onToggle={() => toggle('season')}
          >
            <button
              onClick={() => { update({ season: '' }); close(); }}
              className={cn('w-full text-left px-3 py-1.5 rounded-input text-xs transition-colors', !filters.season ? 'text-accent-glow bg-accent-primary/10' : 'text-text-secondary hover:text-text-primary hover:bg-elevated')}
            >
              All
            </button>
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => { update({ season: filters.season === s.toLowerCase() ? '' : s.toLowerCase() }); close(); }}
                className={cn('w-full text-left px-3 py-1.5 rounded-input text-xs transition-colors', filters.season === s.toLowerCase() ? 'text-accent-glow bg-accent-primary/10' : 'text-text-secondary hover:text-text-primary hover:bg-elevated')}
              >
                {s}
              </button>
            ))}
          </FilterDropdown>

          <FilterDropdown
            label="Score"
            activeLabel={filters.score ? `${filters.score}+` : 'All'}
            isActive={!!filters.score}
            isOpen={openDropdown === 'score'}
            onToggle={() => toggle('score')}
          >
            <button
              onClick={() => { update({ score: '' }); close(); }}
              className={cn('w-full text-left px-3 py-1.5 rounded-input text-xs transition-colors', !filters.score ? 'text-accent-glow bg-accent-primary/10' : 'text-text-secondary hover:text-text-primary hover:bg-elevated')}
            >
              All
            </button>
            {SCORE_FILTERS.map((sf) => (
              <button
                key={sf.value}
                onClick={() => { update({ score: filters.score === String(sf.value) ? '' : String(sf.value) }); close(); }}
                className={cn('w-full text-left px-3 py-1.5 rounded-input text-xs transition-colors', filters.score === String(sf.value) ? 'text-accent-amber bg-accent-amber/10' : 'text-text-secondary hover:text-text-primary hover:bg-elevated')}
              >
                {sf.label}
              </button>
            ))}
          </FilterDropdown>

          <FilterDropdown
            label="Genre"
            activeLabel={filters.genres.length > 0 ? `${filters.genres.length}` : 'All'}
            isActive={filters.genres.length > 0}
            isOpen={openDropdown === 'genres'}
            onToggle={() => toggle('genres')}
          >
            <div className="max-h-48 overflow-y-auto">
              {GENRES.map((genre) => {
                const id = String(genre.id);
                return (
                  <label
                    key={id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-input text-xs cursor-pointer transition-colors hover:bg-elevated"
                  >
                    <input
                      type="checkbox"
                      checked={filters.genres.includes(id)}
                      onChange={() => toggleGenre(id)}
                      className="w-3 h-3 rounded-sm border-border-subtle accent-accent-primary"
                    />
                    <span className={cn(filters.genres.includes(id) ? 'text-accent-glow' : 'text-text-secondary')}>
                      {genre.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </FilterDropdown>

          {hasActive && (
            <button
              onClick={clearAll}
              className="text-xs text-text-muted hover:text-accent-rose transition-colors ml-2 whitespace-nowrap"
            >
              Clear All {activeCount > 0 && `(${activeCount})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
