import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-surface/50 rounded-card', className)} />
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
