import { useCountdown } from '@/hooks/useCountdown';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string | null | undefined;
  className?: string;
}

export function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const remaining = useCountdown(targetDate);

  if (!remaining || remaining.days >= 7) return null;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-mono text-accent-glow ${className}`}>
      <Clock className="w-3 h-3 stroke-[1.5]" />
      {remaining.days > 0 && <span>{remaining.days}d </span>}
      <span>{pad(remaining.hours)}:{pad(remaining.minutes)}:{pad(remaining.seconds)}</span>
    </span>
  );
}