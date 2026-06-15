import { cn } from '@/utils/cn';

interface DotPatternProps {
  className?: string;
  opacity?: number;
}

export function DotPattern({ className, opacity = 0.6 }: DotPatternProps) {
  return (
    <div
      className={cn('dot-pattern absolute inset-0 pointer-events-none', className)}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
}
