import { cn } from '@/utils/cn';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function GlowCard({ children, className, onClick }: GlowCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-card transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        'hover:shadow-glow hover:border-border-glow',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  );
}
