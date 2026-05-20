"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Pause, Play, RefreshCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { ToolCard } from '@/components/layout/tool-card';
import { CopyButton, DownloadButton, ToolActions, InfoBox, StatsDisplay, CodeTextarea } from '@/components/common';

export function UnixTimeNowClient() {
  const t = useTranslations('tools.unix-time-now');
  const tCommon = useTranslations('common');
  const [now, setNow] = useState<Date>(new Date());
  const [isPaused, setIsPaused] = useState(false);
  const { copiedType, copyToClipboard } = useCopyToClipboard();

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const unixSeconds = Math.floor(now.getTime() / 1000).toString();
  const unixMillis = now.getTime().toString();
  const isoString = now.toISOString();
  const localString = now.toLocaleString();
  const utcString = now.toUTCString();

  return (
    <div className="space-y-6">
      {/* Large Counter Card */}
      <ToolCard 
        title={t('current_unix_time')}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPaused(!isPaused)}
              className="h-8 text-xs gap-1.5 border-border hover:bg-muted"
            >
              {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {isPaused ? t('resume') : t('pause')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNow(new Date())}
              disabled={!isPaused}
              className="h-8 text-xs gap-1.5 border-border hover:bg-muted"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {tCommon('ui.preview' as any) === 'Preview' ? 'Refresh' : 'تازہ کریں'}
            </Button>
          </div>
        }
        contentClassName="p-8 flex flex-col items-center justify-center gap-4"
      >
        <div className="text-5xl font-mono font-bold tracking-tighter text-foreground tabular-nums">
          {unixSeconds}
        </div>
        <div className="text-sm text-muted-foreground font-mono">
          {unixMillis} ms
        </div>
        <Button
          variant="default"
          size="lg"
          onClick={() => copyToClipboard(unixSeconds, 'seconds')}
          className="mt-2 text-sm gap-2"
        >
          {copiedType === 'seconds' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copiedType === 'seconds' ? tCommon('copied') : tCommon('copy')}
        </Button>
      </ToolCard>

      {/* Formats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* ISO 8601 */}
        <ToolCard 
          title={t('iso_format')}
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(isoString, 'iso')}
              className="h-7 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground self-end"
            >
              {copiedType === 'iso' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {tCommon('copy')}
            </Button>
          }
          contentClassName="p-4 flex flex-col gap-2 bg-muted/20"
        >
          <div className="text-xs font-mono break-all text-foreground min-h-[2.5rem] flex items-center">
            {isoString}
          </div>
        </ToolCard>

        {/* Local Time */}
        <ToolCard 
          title={t('local_format')}
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(localString, 'local')}
              className="h-7 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground self-end"
            >
              {copiedType === 'local' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {tCommon('copy')}
            </Button>
          }
          contentClassName="p-4 flex flex-col gap-2 bg-muted/20"
        >
          <div className="text-xs font-mono break-all text-foreground min-h-[2.5rem] flex items-center">
            {localString}
          </div>
        </ToolCard>

        {/* UTC Time */}
        <ToolCard 
          title={t('utc_format')}
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(utcString, 'utc')}
              className="h-7 text-[10px] gap-1.5 text-muted-foreground hover:text-foreground self-end"
            >
              {copiedType === 'utc' ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {tCommon('copy')}
            </Button>
          }
          contentClassName="p-4 flex flex-col gap-2 bg-muted/20"
        >
          <div className="text-xs font-mono break-all text-foreground min-h-[2.5rem] flex items-center">
            {utcString}
          </div>
        </ToolCard>
      </div>
    </div>
  );
}
