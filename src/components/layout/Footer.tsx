import { Link } from 'react-router-dom';
import { DotPattern } from '@/components/ui/DotPattern';
import { MessageCircle, Gamepad2, Compass, CalendarDays, User, Heart, Grid3X3 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-border-subtle overflow-hidden">
      <DotPattern opacity={0.3} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-card bg-accent-primary flex items-center justify-center">
                <span className="font-display font-bold text-white text-sm leading-none">A</span>
              </div>
              <span className="font-display font-bold text-lg text-text-primary">
                Ani<span className="text-accent-primary">Verse</span>
              </span>
            </div>
            <p className="text-text-muted text-sm max-w-xs">
              Your premium destination for discovering, streaming, and tracking anime.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-display font-semibold text-sm text-text-primary flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-accent-glow stroke-[1.5]" /> Explore</h4>
            <div className="flex flex-col gap-2">
              <Link to="/browse" className="flex items-center gap-1.5 text-text-secondary text-sm hover:text-accent-glow transition-colors"><Grid3X3 className="w-3.5 h-3.5 stroke-[1.5]" /> Browse</Link>
              <Link to="/schedule" className="flex items-center gap-1.5 text-text-secondary text-sm hover:text-accent-glow transition-colors"><CalendarDays className="w-3.5 h-3.5 stroke-[1.5]" /> Schedule</Link>
              <Link to="/profile" className="flex items-center gap-1.5 text-text-secondary text-sm hover:text-accent-glow transition-colors"><User className="w-3.5 h-3.5 stroke-[1.5]" /> My List</Link>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-display font-semibold text-sm text-text-primary flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-accent-rose stroke-[1.5]" /> Community</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 rounded-card flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-elevated transition-all" aria-label="Discord">
                <MessageCircle className="w-4.5 h-4.5 stroke-[1.5]" />
              </a>
              <a href="#" className="w-9 h-9 rounded-card flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-elevated transition-all" aria-label="Gaming">
                <Gamepad2 className="w-4.5 h-4.5 stroke-[1.5]" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            AniVerse is not affiliated with any anime studio. Data provided by MyAnimeList via Jikan API.
          </p>
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} AniVerse
          </p>
        </div>
      </div>
    </footer>
  );
}
