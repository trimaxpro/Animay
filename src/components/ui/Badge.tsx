import { cn } from '@/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'rose' | 'amber' | 'violet' | 'success';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-input text-xs font-mono font-medium',
        {
          'bg-elevated text-text-secondary border border-border-subtle': variant === 'default',
          'bg-accent-rose/10 text-accent-rose border border-accent-rose/20': variant === 'rose',
          'bg-accent-amber/10 text-accent-amber border border-accent-amber/20': variant === 'amber',
          'bg-accent-primary/10 text-accent-glow border border-accent-primary/20': variant === 'violet',
          'bg-green-500/10 text-green-400 border border-green-500/20': variant === 'success',
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
