import { Grid3X3, List, SlidersHorizontal, Eye } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SORT_OPTIONS } from '@/utils/constants';

interface SortBarProps {
  resultCount: number;
  sort: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onToggleFilters?: () => void;
}

export function SortBar({ resultCount, sort, onSortChange, viewMode, onViewModeChange, onToggleFilters }: SortBarProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-3">
        {onToggleFilters && (
          <button
            onClick={onToggleFilters}
            className="md:hidden w-9 h-9 rounded-card flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-elevated transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />
          </button>
        )}
        <span className="text-sm text-text-muted font-body flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 stroke-[1.5]" /> Showing <span className="text-text-primary font-medium">{resultCount}</span> anime</span>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-elevated border border-border-subtle rounded-input px-2 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-primary"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <div className="flex items-center border border-border-subtle rounded-input overflow-hidden">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn('p-1.5 transition-colors', viewMode === 'grid' ? 'bg-accent-primary/20 text-accent-glow' : 'text-text-muted hover:text-text-primary')}
            aria-label="Grid view"
          >
            <Grid3X3 className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={cn('p-1.5 transition-colors', viewMode === 'list' ? 'bg-accent-primary/20 text-accent-glow' : 'text-text-muted hover:text-text-primary')}
            aria-label="List view"
          >
            <List className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
