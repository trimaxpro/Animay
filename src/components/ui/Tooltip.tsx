import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/utils/cn';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <TooltipPrimitive.Provider delayDuration={300}>{children}</TooltipPrimitive.Provider>;
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          sideOffset={6}
          className={cn(
            'glass-card rounded-input px-2.5 py-1.5 text-xs font-body text-text-primary',
            'animate-fade-in z-50',
          )}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
