import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Home, Globe, Calendar, LogIn, BookmarkPlus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useSearch } from '@/hooks/useSearch';
import { useAuth } from '@/hooks/useAuth';
import type { Anime } from '@/types/anime';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/browse', label: 'Browse', icon: Globe },
  { to: '/schedule', label: 'Schedule', icon: Calendar },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: searchResults } = useSearch(searchQuery, 1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'bg-void/80 backdrop-blur-xl' : 'bg-transparent',
        )}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-card overflow-hidden border border-border-subtle shadow-glow-sm flex-shrink-0 bg-void">
              <img src="/logo.png" alt="MikuAnime Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-xl text-text-primary group-hover:text-accent-glow transition-colors">
              MikuAnime
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-card text-sm font-body font-medium transition-all duration-300',
                    location.pathname === link.to
                      ? 'text-accent-glow bg-accent-primary/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-elevated',
                  )}
                >
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <AnimatePresence>
                {searchOpen && (
                  <motion.form
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSearch}
                    className="absolute right-[calc(100%+8px)] top-1/2 -translate-y-1/2 overflow-hidden"
                  >
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search anime..."
                      className="w-full bg-elevated border border-border-subtle rounded-input pl-3 pr-12 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-primary"
                    />
                  </motion.form>
                )}
              </AnimatePresence>

              {searchOpen && searchQuery.trim().length > 0 && searchResults?.data && searchResults.data.length > 0 && (
                <div className="absolute right-[calc(100%+8px)] top-full mt-1 w-60 bg-surface rounded-card p-2 z-50 max-h-[400px] overflow-y-auto shadow-xl border border-border-subtle">
                  {searchResults.data.slice(0, 5).map((anime: Anime) => (
                    <Link
                      key={anime.mal_id}
                      to={`/anime/${anime.mal_id}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      className="flex items-center gap-3 p-2 rounded-input hover:bg-elevated transition-colors"
                    >
                      <img src={anime.images.jpg?.image_url} alt="" className="w-8 h-12 rounded-input object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary line-clamp-1">{anime.title_english || anime.title}</p>
                        <p className="text-xs text-text-muted">{anime.type} {anime.year && `| ${anime.year}`}</p>
                      </div>
                      {anime.score && <span className="text-xs font-mono text-accent-amber">{anime.score.toFixed(1)}</span>}
                    </Link>
                  ))}
                  <Link
                    to={`/search?q=${encodeURIComponent(searchQuery)}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="block text-center text-sm text-accent-glow hover:underline py-2 mt-1 border-t border-border-subtle"
                  >
                    See all results
                  </Link>
                </div>
              )}

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={cn('w-9 h-9 rounded-card flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-elevated transition-all', searchOpen && 'bg-elevated')}
                aria-label="Search"
              >
                <Search className="w-4.5 h-4.5 stroke-[1.5]" />
              </button>
            </div>

            <AuthNav />

            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden w-9 h-9 rounded-card flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-elevated transition-all relative z-20"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-surface border-l border-border-subtle z-50 p-6"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-9 h-9 rounded-card flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-elevated transition-all"
                aria-label="Close menu"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>

              <div className="flex flex-col gap-1 mt-8">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={cn(
                        'flex items-center gap-3 px-3 py-3 rounded-card text-sm font-body font-medium transition-all',
                        location.pathname === link.to
                          ? 'text-accent-glow bg-accent-primary/10'
                          : 'text-text-secondary hover:text-text-primary hover:bg-elevated',
                      )}
                    >
                      <Icon className="w-4.5 h-4.5 stroke-[1.5]" />
                      {link.label}
                    </Link>
                  );
                })}
                <Link
                  to="/watchlist"
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-card text-sm font-body font-medium transition-all',
                    location.pathname === '/watchlist'
                      ? 'text-accent-glow bg-accent-primary/10'
                      : 'text-text-secondary hover:text-text-primary hover:bg-elevated',
                  )}
                >
                  <BookmarkPlus className="w-4.5 h-4.5 stroke-[1.5]" />
                  Watchlist
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function AuthNav() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (loading) return <div className="w-9 h-9" />;

  if (!user) {
    return (
      <Link
        to="/signin"
        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-card text-sm font-body font-medium text-text-primary bg-accent-primary hover:bg-accent-glow transition-all"
      >
        <LogIn className="w-4 h-4 stroke-[1.5]" />
        Sign In
      </Link>
    );
  }

  return (
    <div className="hidden md:relative md:flex">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-elevated border border-border-subtle flex items-center justify-center overflow-hidden text-text-secondary hover:text-text-primary hover:border-border-glow transition-all"
        aria-label="Profile"
      >
        {(() => {
          const name = user.displayName || user.email || 'U';
          const initial = name.charAt(0).toUpperCase();
          const colors = [
            'bg-blue-600 text-white',
            'bg-violet-600 text-white',
            'bg-indigo-600 text-white',
            'bg-fuchsia-600 text-white',
            'bg-rose-600 text-white',
            'bg-emerald-600 text-white',
            'bg-amber-600 text-black',
            'bg-cyan-600 text-white',
          ];
          let hash = 0;
          const key = user.uid || '';
          for (let i = 0; i < key.length; i++) {
            hash = key.charCodeAt(i) + ((hash << 5) - hash);
          }
          const colorClass = colors[Math.abs(hash) % colors.length];
          return (
            <div className={`w-full h-full flex items-center justify-center font-display font-bold text-sm select-none ${colorClass}`}>
              {initial}
            </div>
          );
        })()}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-52 bg-surface rounded-card p-2 z-50 shadow-xl border border-border-subtle">
            <div className="px-3 py-2 text-sm text-text-primary font-medium truncate border-b border-border-subtle mb-1">
              {user.displayName || user.email}
            </div>
            <Link to="/watchlist" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-input text-sm text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors">
              <BookmarkPlus className="w-4 h-4 stroke-[1.5]" /> My Lists
            </Link>
            <button onClick={() => { logout(); setOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-input text-sm text-accent-rose hover:bg-accent-rose/10 transition-colors mt-1">
              <LogIn className="w-4 h-4 stroke-[1.5] rotate-180" /> Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
