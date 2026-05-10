'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TOOLS } from '@/constants/tools';
import { ROUTES } from '@/constants/routes';
import { Badge } from '@/components/ui/badge';

interface ToolNavigationProps {
  currentToolId: string;
}

export function ToolNavigation({ currentToolId }: ToolNavigationProps) {
  const t = useTranslations('common');
  const tTools = useTranslations('tools');
  
  const currentTool = TOOLS.find(t => t.id === currentToolId);
  const currentIndex = TOOLS.findIndex(t => t.id === currentToolId);
  
  const prevTool = currentIndex > 0 ? TOOLS[currentIndex - 1] : null;
  const nextTool = currentIndex < TOOLS.length - 1 ? TOOLS[currentIndex + 1] : null;

  if (!currentTool) return null;

  return (
    <div className="space-y-8 mt-16 pt-8 border-t border-border/50">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:w-auto flex-1">
          {prevTool ? (
            <Link href={`${ROUTES.TOOLS}/${prevTool.id}`} className="block group">
              <div className="flex flex-col gap-2 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/20 transition-all">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-bold">
                  <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                  {t('navigation.previous')}
                </span>
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md bg-background border border-border group-hover:border-primary/30 transition-colors">
                    <prevTool.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {tTools(`${prevTool.id}.title`)}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
                      {t(`categories.${prevTool.category}`)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="h-full border border-dashed border-border/50 rounded-xl p-4 flex items-center justify-center text-muted-foreground/30">
              <ChevronLeft className="h-6 w-6 opacity-20" />
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-col items-center gap-2 px-4 min-w-[120px]">
          <Link href="/">
            <Button variant="outline" size="sm" className="rounded-full h-10 w-10 p-0 border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 group">
              <LayoutGrid className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase tracking-tighter text-muted-foreground font-bold">{t('landing.allTools')}</span>
            <span className="text-[10px] font-mono text-muted-foreground/60">{currentIndex + 1} / {TOOLS.length}</span>
          </div>
        </div>

        <div className="w-full md:w-auto flex-1 text-right">
          {nextTool ? (
            <Link href={`${ROUTES.TOOLS}/${nextTool.id}`} className="block group">
              <div className="flex flex-col items-end gap-2 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/20 transition-all">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5 font-bold">
                  {t('navigation.next')}
                  <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="flex items-center gap-3 flex-row-reverse">
                  <div className="p-1.5 rounded-md bg-background border border-border group-hover:border-primary/30 transition-colors">
                    <nextTool.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {tTools(`${nextTool.id}.title`)}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-tight">
                      {t(`categories.${nextTool.category}`)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="h-full border border-dashed border-border/50 rounded-xl p-4 flex items-center justify-center text-muted-foreground/30">
              <ChevronRight className="h-6 w-6 opacity-20" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
