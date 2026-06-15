import { cn } from '@/utils/cn';
import { DotPattern } from './DotPattern';
import { Button } from './Button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon: Icon, title, message, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-card glass-card p-8 flex flex-col items-center justify-center text-center min-h-[200px]', className)}>
      <DotPattern opacity={0.4} />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <Icon className="w-10 h-10 text-text-muted stroke-[1.5]" />
        <h3 className="font-display font-semibold text-lg text-text-primary">{title}</h3>
        <p className="text-text-secondary text-sm max-w-xs">{message}</p>
        {actionLabel && onAction && (
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
