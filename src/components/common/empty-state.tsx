'use client';

import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  icon?: LucideIcon;
  /** 'centered' = full-height centered block; 'inline' = plain text span */
  variant?: 'centered' | 'inline';
  className?: string;
}

export function EmptyState({
  message,
  icon: Icon,
  variant = 'inline',
  className = '',
}: EmptyStateProps) {
  if (variant === 'inline') {
    return (
      <span className={`text-muted-foreground ${className}`}>{message}</span>
    );
  }

  return (
    <div
      className={`flex-1 flex items-center justify-center text-muted-foreground ${className}`}
    >
      <div className="text-center space-y-2">
        {Icon && <Icon className="h-8 w-8 mx-auto opacity-40" />}
        <p className="text-xs">{message}</p>
      </div>
    </div>
  );
}
