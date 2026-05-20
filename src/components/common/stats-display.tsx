'use client';

import { ReactNode } from 'react';

interface Stats {
  chars?: number;
  lines?: number;
  words?: number;
  size?: string;
}

interface StatsDisplayProps {
  title: ReactNode;
  stats?: Stats;
}

export function StatsDisplay({ title, stats }: StatsDisplayProps) {
  if (!stats) return <>{title}</>;

  const parts: string[] = [];
  if (stats.chars !== undefined) parts.push(`${stats.chars} chars`);
  if (stats.lines !== undefined) parts.push(`${stats.lines} lines`);
  if (stats.words !== undefined) parts.push(`${stats.words} words`);
  if (stats.size !== undefined) parts.push(`${stats.size} KB`);

  if (parts.length === 0) return <>{title}</>;

  return (
    <div className="flex items-center gap-2">
      {title}
      <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
      <span className="text-[10px] text-muted-foreground/60 normal-case tracking-normal font-normal">
        {parts.join(' • ')}
      </span>
    </div>
  );
}
