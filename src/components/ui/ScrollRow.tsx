import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Star, Sparkles, Film } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ScrollRowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const rowIcons: Record<string, typeof TrendingUp> = {
  'Trending': TrendingUp, 'Popular': Star, 'Upcoming': Clock, 'Top': Sparkles, 'New': Sparkles, 'Seasonal': Film,
};

export function ScrollRow({ title, children, className }: ScrollRowProps) {
  const RowIcon = Object.entries(rowIcons).find(([k]) => title.toLowerCase().includes(k.toLowerCase()))?.[1] || Film;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hovered, setHovered] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, children]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section
      className={cn('py-6 px-4 max-w-7xl mx-auto', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <h2 className="font-display font-bold text-xl md:text-2xl text-text-primary mb-4 flex items-center gap-2"><RowIcon className="w-5 h-5 text-accent-glow stroke-[1.5]" /> {title}</h2>
      <div className="flex items-center gap-2">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={cn(
            'shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-border-subtle bg-elevated/90 text-text-secondary hover:text-text-primary hover:border-border-glow hover:bg-elevated transition-all shadow-lg backdrop-blur-sm',
            canScrollLeft && hovered
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          )}
          aria-label="Previous"
        >
          <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
        </button>
        <div
          ref={scrollRef}
          className="flex-1 min-w-0 flex gap-4 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {children}
        </div>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={cn(
            'shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-border-subtle bg-elevated/90 text-text-secondary hover:text-text-primary hover:border-border-glow hover:bg-elevated transition-all shadow-lg backdrop-blur-sm',
            canScrollRight && hovered
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          )}
          aria-label="Next"
        >
          <ChevronRight className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>
    </section>
  );
}
