import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('shimmer rounded-card', className)} />;
}

export function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-[3/4] w-full rounded-card" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}

export function HeroSkeleton() {
  return <Skeleton className="h-[65vh] w-full rounded-hero" />;
}

export function EpisodeSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-video w-full rounded-card" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-2.5 w-1/2" />
    </div>
  );
}
