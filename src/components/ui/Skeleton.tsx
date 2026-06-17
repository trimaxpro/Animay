import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('flex items-center justify-center bg-surface/50 rounded-card', className)}>
      <img src="/loader.gif" alt="Loading..." className="w-16 h-16 object-contain opacity-80" />
    </div>
  );
}

export function AnimeCardSkeleton() {
  return <Skeleton className="aspect-[3/4] w-full" />;
}

export function HeroSkeleton() {
  return <Skeleton className="h-[65vh] w-full rounded-hero" />;
}

export function EpisodeSkeleton() {
  return <Skeleton className="aspect-video w-full" />;
}
