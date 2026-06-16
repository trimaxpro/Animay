import { Link } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { DotPattern } from '@/components/ui/DotPattern';
import { Button } from '@/components/ui/Button';
import { Home, Grid3X3, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <PageWrapper className="min-h-screen flex items-center justify-center">
      <div className="relative w-full max-w-lg mx-auto px-4 text-center">
        <DotPattern opacity={0.5} />

        <div className="relative z-10">
          <h1 className="font-display font-bold text-8xl md:text-9xl bg-gradient-to-r from-accent-primary to-accent-glow bg-clip-text text-transparent">
            404
          </h1>
          <p className="font-display font-semibold text-xl text-text-primary mt-4">
            This arc doesn't exist yet...
          </p>
          <p className="text-text-secondary text-sm mt-2 max-w-xs mx-auto">
            The page you're looking for has either been removed or never existed in this timeline.
          </p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <Link to="/">
              <Button variant="primary" size="md">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/browse">
              <Button variant="secondary" size="md">
                <Grid3X3 className="w-4 h-4" />
                Browse Anime
              </Button>
            </Link>
            <Link to="/search">
              <Button variant="ghost" size="md">
                <Search className="w-4 h-4" />
                Search
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex justify-center">
            <svg width="120" height="80" viewBox="0 0 120 80" fill="none" className="opacity-20">
              <rect x="30" y="50" width="60" height="30" rx="8" fill="#6B7280" />
              <circle cx="60" cy="35" r="20" fill="#6B7280" />
              <rect x="55" y="25" width="4" height="8" rx="2" fill="#191919" />
              <rect x="62" y="25" width="4" height="8" rx="2" fill="#191919" />
              <ellipse cx="60" cy="42" rx="6" ry="3" fill="#191919" />
              <line x1="40" y1="55" x2="40" y2="75" stroke="#6B7280" strokeWidth="3" />
              <line x1="80" y1="55" x2="80" y2="75" stroke="#6B7280" strokeWidth="3" />
            </svg>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
