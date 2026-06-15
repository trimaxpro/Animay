import { useState } from 'react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { AnimeCard } from '@/components/ui/AnimeCard';
import { useUserStore } from '@/stores/userStore';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useWatchHistory } from '@/hooks/useWatchHistory';
import { BookmarkPlus, Clock, Edit3, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import type { WatchlistStatus } from '@/types/user';

const AVATAR_COLORS = ['#7C3AED', '#F43F5E', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'];
const STATUS_TABS: { value: WatchlistStatus; label: string }[] = [
  { value: 'watching', label: 'Watching' },
  { value: 'plan_to_watch', label: 'Plan to Watch' },
  { value: 'completed', label: 'Completed' },
  { value: 'dropped', label: 'Dropped' },
  { value: 'on_hold', label: 'On Hold' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'history' | 'stats'>('watchlist');
  const [statusFilter, setStatusFilter] = useState<WatchlistStatus>('watching');
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const preferences = useUserStore((s) => s.preferences);
  const setDisplayName = useUserStore((s) => s.setDisplayName);
  const setAvatarColor = useUserStore((s) => s.setAvatarColor);
  const { watchlist, getWatchlistByStatus } = useWatchlist();
  const { watchHistory } = useWatchHistory();

  const filteredWatchlist = getWatchlistByStatus(statusFilter);
  const totalEpisodes = watchHistory.length;
  const totalHours = Math.round(watchHistory.reduce((acc, _h) => acc + 24, 0) / 60);

  const handleNameSave = () => {
    if (nameInput.trim()) {
      setDisplayName(nameInput.trim());
    }
    setEditingName(false);
  };

  return (
    <PageWrapper className="pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-16 h-16 rounded-card flex items-center justify-center text-2xl font-display font-bold text-white"
            style={{ backgroundColor: preferences.avatarColor }}
          >
            {preferences.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
                  className="bg-elevated border border-border-subtle rounded-input px-3 py-1.5 text-lg text-text-primary focus:outline-none focus:border-accent-primary"
                />
                <Button variant="ghost" size="sm" onClick={handleNameSave}>Save</Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl text-text-primary">{preferences.displayName}</h1>
                <button
                  onClick={() => { setNameInput(preferences.displayName); setEditingName(true); }}
                  className="text-text-muted hover:text-accent-glow transition-colors"
                >
                  <Edit3 className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setAvatarColor(color)}
                  className={cn('w-6 h-6 rounded-full transition-all', preferences.avatarColor === color && 'ring-2 ring-white ring-offset-2 ring-offset-void')}
                  style={{ backgroundColor: color }}
                  aria-label={`Set avatar color to ${color}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-6 border-b border-border-subtle">
          {[
            { key: 'watchlist' as const, label: 'Watchlist', icon: BookmarkPlus },
            { key: 'history' as const, label: 'History', icon: Clock },
            { key: 'stats' as const, label: 'Stats', icon: BarChart3 },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-body font-medium transition-all border-b-2 -mb-px',
                activeTab === tab.key
                  ? 'text-accent-glow border-accent-primary'
                  : 'text-text-secondary border-transparent hover:text-text-primary',
              )}
            >
              <tab.icon className="w-4 h-4 stroke-[1.5]" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'watchlist' && (
          <div>
            <div className="flex items-center gap-2 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setStatusFilter(tab.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-card text-xs font-body font-medium transition-all flex-shrink-0',
                    statusFilter === tab.value
                      ? 'bg-accent-primary/20 text-accent-glow border border-accent-primary/30'
                      : 'bg-elevated text-text-secondary border border-border-subtle',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {filteredWatchlist.length === 0 ? (
              <EmptyState
                icon={BookmarkPlus}
                title="No anime here"
                message={statusFilter === 'watching' ? 'Your watchlist is empty. Start browsing!' : `No anime in ${STATUS_TABS.find((t) => t.value === statusFilter)?.label}`}
                actionLabel="Browse Anime"
              />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredWatchlist.map((entry) => (
                  <AnimeCard
                    key={entry.malId}
                    anime={{
                      mal_id: entry.malId,
                      title: entry.title,
                      title_english: entry.title,
                      title_japanese: null,
                      images: { jpg: { image_url: entry.image, large_image_url: entry.image }, webp: { image_url: entry.image, large_image_url: entry.image } },
                      type: null, episodes: null, status: null, score: null, scored_by: null, rank: null, popularity: null,
                      members: null, favorites: null, synopsis: null, season: null, year: null,
                      aired: { from: null, to: null, string: '' }, broadcast: null,
                      studios: [], genres: [], themes: [], source: null, rating: null, duration: null,
                      trailer: null, relations: [],
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          watchHistory.length === 0 ? (
            <EmptyState icon={Clock} title="No watch history" message="No watch history yet. Pick something to watch!" actionLabel="Browse" />
          ) : (
            <div className="space-y-2">
              {watchHistory.slice(0, 50).map((entry, i) => (
                <Link
                  key={`${entry.malId}-${entry.episode}-${i}`}
                  to={`/watch/${entry.malId}/${entry.episode}`}
                  className="flex items-center gap-3 p-3 rounded-card glass-card hover:border-border-glow transition-all"
                >
                  <img src={entry.image} alt="" className="w-10 h-14 rounded-card object-cover" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary line-clamp-1">{entry.title}</p>
                    <p className="text-xs text-text-muted">Episode {entry.episode}</p>
                  </div>
                  <div className="w-16 h-1 bg-elevated rounded-full overflow-hidden">
                    <div className="h-full bg-accent-primary rounded-full" style={{ width: `${Math.min(entry.progress * 100, 100)}%` }} />
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-card p-6 text-center">
              <p className="font-mono font-bold text-3xl text-accent-glow">{totalEpisodes}</p>
              <p className="text-text-muted text-sm mt-1">Episodes Watched</p>
            </div>
            <div className="glass-card rounded-card p-6 text-center">
              <p className="font-mono font-bold text-3xl text-accent-amber">{totalHours}</p>
              <p className="text-text-muted text-sm mt-1">Hours Watched</p>
            </div>
            <div className="glass-card rounded-card p-6 text-center">
              <p className="font-mono font-bold text-3xl text-accent-rose">{watchlist.length}</p>
              <p className="text-text-muted text-sm mt-1">Anime in List</p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
