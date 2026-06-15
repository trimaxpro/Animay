import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { Search } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon = false, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted stroke-[1.5]" />
        )}
        <input
          ref={ref}
          className={cn(
            'w-full bg-elevated text-text-primary border border-border-subtle rounded-input px-3 py-2',
            'placeholder:text-text-muted text-sm font-body',
            'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
            'hover:border-border-glow focus:border-accent-primary focus:shadow-glow-sm focus:outline-none',
            icon && 'pl-10',
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = 'Input';
export { Input, type InputProps };
