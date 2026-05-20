'use client';

import { Info } from 'lucide-react';
import { ReactNode } from 'react';

interface InfoBoxProps {
  children: ReactNode;
  title?: string;
  /** 'compact' = single row with icon; 'default' = stacked with optional title */
  variant?: 'default' | 'compact';
  className?: string;
}

export function InfoBox({
  children,
  title,
  variant = 'compact',
  className = '',
}: InfoBoxProps) {
  if (variant === 'compact') {
    return (
      <div
        className={`p-3 rounded-md bg-muted/30 border border-border flex gap-2.5 items-start ${className}`}
      >
        <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-[10px] text-muted-foreground leading-normal">{children}</p>
      </div>
    );
  }

  return (
    <div className={`p-3 rounded-md bg-muted/50 border border-border space-y-1.5 ${className}`}>
      {title && (
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-tight text-foreground">
          <Info className="h-3 w-3" />
          {title}
        </div>
      )}
      <p className="text-[10px] text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
