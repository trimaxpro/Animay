import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ScrollRowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ScrollRow({ title, children, className }: ScrollRowProps) {
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
      <h2 className="font-heading font-bold text-xl md:text-2xl text-text-primary mb-4">{title}</h2>
      <div className="relative group/row">
        <button
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          className={cn(
            'absolute left-0 inset-y-0 z-10 w-12 flex items-center justify-center transition-all duration-200',
            canScrollLeft && hovered
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          )}
          aria-label="Previous"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-elevated/90 border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-glow hover:bg-elevated transition-all shadow-lg backdrop-blur-sm">
            <ChevronLeft className="w-5 h-5 stroke-[1.5]" />
          </div>
        </button>
        <button
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          className={cn(
            'absolute right-0 inset-y-0 z-10 w-12 flex items-center justify-center transition-all duration-200',
            canScrollRight && hovered
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
          )}
          aria-label="Next"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-elevated/90 border border-border-subtle text-text-secondary hover:text-text-primary hover:border-border-glow hover:bg-elevated transition-all shadow-lg backdrop-blur-sm">
            <ChevronRight className="w-5 h-5 stroke-[1.5]" />
          </div>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
