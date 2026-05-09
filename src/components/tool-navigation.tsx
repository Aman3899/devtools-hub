'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TOOLS } from '@/config/tools';

interface ToolNavigationProps {
  currentToolId: string;
}

export function ToolNavigation({ currentToolId }: ToolNavigationProps) {
  const t = useTranslations('common');
  const tTools = useTranslations('tools');
  
  const currentIndex = TOOLS.findIndex(t => t.id === currentToolId);
  const prevTool = currentIndex > 0 ? TOOLS[currentIndex - 1] : null;
  const nextTool = currentIndex < TOOLS.length - 1 ? TOOLS[currentIndex + 1] : null;

  return (
    <div className="flex items-center justify-between border-t border-border mt-12 pt-8">
      <div>
        {prevTool ? (
          <Link href={`/tools/${prevTool.id}`}>
            <Button variant="ghost" className="group h-auto py-2 px-4 flex flex-col items-start gap-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 group-hover:text-foreground transition-colors">
                <ChevronLeft className="h-3 w-3" />
                {t('navigation.previous' as any) || 'Previous'}
              </span>
              <span className="text-sm font-semibold">{tTools(`${prevTool.id}.title` as any)}</span>
            </Button>
          </Link>
        ) : <div />}
      </div>

      <div>
        {nextTool ? (
          <Link href={`/tools/${nextTool.id}`}>
            <Button variant="ghost" className="group h-auto py-2 px-4 flex flex-col items-end gap-1 text-right">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 group-hover:text-foreground transition-colors">
                {t('navigation.next' as any) || 'Next'}
                <ChevronRight className="h-3 w-3" />
              </span>
              <span className="text-sm font-semibold">{tTools(`${nextTool.id}.title` as any)}</span>
            </Button>
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
