import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ScrollableRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollableRow({ children, className }: ScrollableRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

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
    <div className={`relative group ${className || ''}`}>
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center bg-gradient-to-r from-void/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-elevated/90 border border-border-subtle flex items-center justify-center hover:bg-accent-primary/20 hover:border-border-glow transition-colors">
            <ChevronLeft className="w-4 h-4 text-text-primary stroke-[1.5]" />
          </div>
        </button>
      )}
      <div
        ref={containerRef}
        className="flex gap-3 overflow-x-auto scroll-smooth pb-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 flex items-center justify-center bg-gradient-to-l from-void/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div className="w-8 h-8 rounded-full bg-elevated/90 border border-border-subtle flex items-center justify-center hover:bg-accent-primary/20 hover:border-border-glow transition-colors">
            <ChevronRight className="w-4 h-4 text-text-primary stroke-[1.5]" />
          </div>
        </button>
      )}
    </div>
  );
}
