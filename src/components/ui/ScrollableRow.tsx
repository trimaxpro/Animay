import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ScrollableRowProps {
  children: React.ReactNode;
  className?: string;
  onEndReached?: () => void;
}

const END_THRESHOLD = 400;
const LOADING_LOCK_MS = 1500;

export function ScrollableRow({ children, className, onEndReached }: ScrollableRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hovered, setHovered] = useState(false);
  const loadingLockRef = useRef(false);

  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);

    if (onEndReached && !loadingLockRef.current) {
      const remaining = el.scrollWidth - el.scrollLeft - el.clientWidth;
      if (remaining < END_THRESHOLD) {
        loadingLockRef.current = true;
        setTimeout(() => { loadingLockRef.current = false; }, LOADING_LOCK_MS);
        onEndReached();
      }
    }
  }, [onEndReached]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    const el = containerRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('*')?.clientWidth || 180;
    const scrollAmount = cardWidth * 3;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        className={cn(
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-border-subtle bg-elevated/90 text-text-secondary hover:text-text-primary hover:border-border-glow hover:bg-elevated transition-all shadow-lg backdrop-blur-sm',
          canScrollLeft && hovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4 stroke-[1.5]" />
      </button>
      <div
        ref={containerRef}
        className="flex-1 min-w-0 flex gap-3 overflow-x-auto scroll-smooth pb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </div>
      <button
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        className={cn(
          'shrink-0 w-8 h-8 rounded-full flex items-center justify-center border border-border-subtle bg-elevated/90 text-text-secondary hover:text-text-primary hover:border-border-glow hover:bg-elevated transition-all shadow-lg backdrop-blur-sm',
          canScrollRight && hovered ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-label="Next"
      >
        <ChevronRight className="w-4 h-4 stroke-[1.5]" />
      </button>
    </div>
  );
}
