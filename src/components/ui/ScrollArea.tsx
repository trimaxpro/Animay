import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from '@/utils/cn';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollArea({ children, className }: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root className={cn('relative overflow-hidden', className)}>
      <ScrollAreaPrimitive.Viewport className="w-full h-full rounded-[inherit] [&>div]:!pr-2.5">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        orientation="vertical"
        className="flex select-none touch-none p-0.5 w-2.5 transition-colors duration-300 hover:bg-elevated"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border-subtle" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
}
