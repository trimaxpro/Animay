import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ open, onOpenChange, title, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
            'glass-card rounded-modal p-6 w-[90vw] max-w-lg max-h-[85vh] overflow-auto',
            'animate-slide-up',
            'focus:outline-none',
            className,
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="font-display font-semibold text-lg text-text-primary">
              {title}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-input hover:bg-elevated"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
