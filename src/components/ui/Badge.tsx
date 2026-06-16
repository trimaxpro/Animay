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
        'inline-flex items-center px-2 py-0.5 rounded-input text-xs font-label font-medium',
        {
          'bg-void/80 backdrop-blur-sm text-text-primary': variant === 'default',
          'bg-elevated text-accent-rose border border-accent-rose/30': variant === 'rose',
          'bg-elevated text-accent-amber border border-accent-amber/30': variant === 'amber',
          'bg-elevated text-accent-glow border border-accent-primary/30': variant === 'violet',
          'bg-elevated text-green-400 border border-green-500/30': variant === 'success',
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
