'use client';

import { forwardRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface CodeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Extra handler called with the raw event (e.g. for live processing) */
  onChangeRaw?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CodeTextarea = forwardRef<HTMLTextAreaElement, CodeTextareaProps>(
  ({ value, onChange, placeholder, disabled, className, onChangeRaw }, ref) => {
    return (
      <Textarea
        ref={ref}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.value);
          onChangeRaw?.(e);
        }}
        className={cn(
          'flex-1 font-mono text-xs resize-none border-none focus-visible:ring-0 p-3 bg-transparent leading-relaxed',
          className,
        )}
      />
    );
  },
);

CodeTextarea.displayName = 'CodeTextarea';
