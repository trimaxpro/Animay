import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { cn } from '@/utils/cn';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  initialQuery?: string;
  compact?: boolean;
}

export function SearchBar({ initialQuery = '', compact = false }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data } = useSearch(query, 1);
  const showDropdown = focused && query.trim().length > 0 && (data?.data?.length || 0) > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className={cn(compact ? 'flex items-center gap-2' : 'flex items-center gap-2')}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted stroke-[1.5]" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search anime..."
            className={cn(
              'w-full bg-elevated border border-border-subtle rounded-card pl-10 pr-3 py-2.5',
              'text-text-primary placeholder:text-text-muted text-sm font-body',
              'focus:outline-none focus:border-accent-primary focus:shadow-glow-sm',
              'transition-all duration-300',
              compact && 'py-1.5 text-xs',
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-card p-2 z-50 max-h-[300px] overflow-y-auto">
          {data?.data?.slice(0, 5).map((anime) => (
            <Link
              key={anime.mal_id}
              to={`/anime/${anime.mal_id}`}
              className="flex items-center gap-3 p-2 rounded-input hover:bg-elevated transition-colors"
            >
              <img src={anime.images.jpg?.image_url} alt="" className="w-10 h-14 rounded-input object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary line-clamp-1">{anime.title_english || anime.title}</p>
                <p className="text-xs text-text-muted">{anime.type} {anime.year && `| ${anime.year}`}</p>
              </div>
              {anime.score && <span className="text-xs font-mono text-accent-amber">{anime.score.toFixed(1)}</span>}
            </Link>
          ))}
          <Link
            to={`/search?q=${encodeURIComponent(query)}`}
            className="block text-center text-sm text-accent-glow hover:underline py-2 mt-1 border-t border-border-subtle"
          >
            See all results
          </Link>
        </div>
      )}
    </div>
  );
}
